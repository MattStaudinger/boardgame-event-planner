"use server"

import { z } from "zod"
import { prisma } from "../utils/db"
import { revalidatePath } from "next/cache"
import type { User } from "@prisma/client"

import { UserResponseBody } from "../types/types"
import { redirect } from "next/navigation"

export type State = {
  errors?: {
    name?: string[]
    email?: string[]
    note?: string[]
  }
  message?: string | null
  success?: boolean
}

const FormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  note: z.string().max(500),
  canHost: z.boolean(),
  eventId: z.string(),
  id: z.string(),
})

const FormSchemaCreate = FormSchema.omit({ id: true })
const FormSchemaEdit = FormSchema

export async function createNewParticipant(
  prevState: State,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries())

  // the value of canHost is a string, so we need to convert it to a boolean
  // If a checkbox is unchecked when its form is submitted, neither the name nor the value is submitted to the server
  const canHost = data.canHost === "true" ? true : false

  const validatedData = FormSchemaCreate.safeParse({
    name: data.name,
    email: data.email,
    note: data.note,
    canHost: canHost,
    eventId: data.eventId,
    id: data.participantId,
  })

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create participant.",
      success: false,
    }
  }

  const body: UserResponseBody = validatedData.data

  try {
    // create user
    await prisma.user.create({
      data: body,
    })

    // When nextJs gets updated, we will call in the future revalidatePath(`/${body.eventId}`) - currently,
    // revalidatePath invalidates all the routes in the client-side Router Cache and hence wouldn't
    // trigger the success modal. NextJS docs state, that this behavior is temporary and will be updated in the future to
    // apply only to the specific path. https://nextjs.org/docs/app/api-reference/functions/revalidatePath
    return { success: true, message: `Added participant to event` }
  } catch (error) {
    console.log("error: ", error)
    // Return a NextResponse object with an error message and status code
    return {
      message: "Database error. Failed to add participant",
      success: false,
    }
  }
}

export async function updateParticipant(prevState: State, formData: FormData) {
  const data = Object.fromEntries(formData.entries())

  // the value of canHost is a string, so we need to convert it to a boolean
  // If a checkbox is unchecked when its form is submitted, neither the name nor the value is submitted to the server
  const canHost = data.canHost === "true" ? true : false

  const validatedData = FormSchemaEdit.safeParse({
    name: data.name,
    email: data.email,
    note: data.note,
    canHost: canHost,
    eventId: data.eventId,
    id: data.participantId,
  })

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to update participant.",
      success: false,
    }
  }

  const body: UserResponseBody = validatedData.data

  try {
    await prisma.user.update({
      where: {
        id: body.id,
      },
      data: body,
    })

    revalidatePath(`/${body.eventId}`)
  } catch (error) {
    console.log("error: ", error)
    // Return a NextResponse object with an error message and status code
    return {
      message: "Database error. Failed to update participant",
      success: false,
    }
  }
}

export async function deleteParticipant({
  participant,
  eventId,
}: {
  participant: User
  eventId: string
}) {
  try {
    await prisma.user.update({
      where: {
        id: participant.id,
      },
      data: { ...participant, hasCanceled: true },
    })

    revalidatePath(`/${eventId}`)
  } catch (error) {
    console.log("error: ", error)
    // Return a NextResponse object with an error message and status code
    redirect("/error")
  }
}
