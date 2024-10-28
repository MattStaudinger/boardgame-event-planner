"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import type { Participant } from "@prisma/client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import {
  CreateParticipantBody,
  UpdateParticipantBody,
  EventWithParticipants,
} from "../types/types"
import {
  createParticipant,
  updateParticipant as updateParticipantInDB,
  deleteParticipantAndSendEmailToNextInWaitingList as deleteParticipantInDB,
  sendEmailToAdminWhenNewParticipant,
} from "../utils/server-api"
import { rateLimit } from "../utils/rateLimit"

export type State = {
  errors?: {
    name?: string[]
    email?: string[]
    note?: string[]
  }
  message: string
  success: boolean
}

const FormSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
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
  const ip = headers().get("x-forwarded-for") ?? "unknown"
  const isRateLimited: boolean = rateLimit(ip)

  if (isRateLimited) {
    return {
      message: "You created too many new participants. Please try again later.",
      success: false,
    }
  }
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
  })

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create participant.",
      success: false,
    }
  }

  const body: CreateParticipantBody = validatedData.data

  try {
    // create participant
    await createParticipant(body)
    await sendEmailToAdminWhenNewParticipant({
      participantName: validatedData.data.name,
      eventId: validatedData.data.eventId,
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
      message: "There was a problem. Please try again",
      success: false,
    }
  }
}

export async function updateParticipant(prevState: State, formData: FormData) {
  const ip = headers().get("x-forwarded-for") ?? "unknown"
  const isRateLimited: boolean = rateLimit(ip)

  if (isRateLimited) {
    return {
      message: "You updated too many participants. Please try again later.",
      success: false,
    }
  }

  const data = Object.fromEntries(formData.entries())

  // the value of canHost is a string, so we need to convert it to a boolean
  // If a checkbox is unchecked when its form is submitted, neither the name nor the value is submitted to the server
  const canHost = data.canHost === "true" ? true : false

  const validatedData = FormSchemaEdit.safeParse({
    name: data.name,
    email: data.email || "",
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

  const body: UpdateParticipantBody = validatedData.data

  try {
    await updateParticipantInDB(body)

    // When nextJs gets updated, we will call in the future revalidatePath(`/${body.eventId}`) - currently,
    // revalidatePath invalidates all the routes in the client-side Router Cache and hence wouldn't
    // trigger the success modal. NextJS docs state, that this behavior is temporary and will be updated in the future to
    // apply only to the specific path. https://nextjs.org/docs/app/api-reference/functions/revalidatePath
    return { success: true, message: `Updated participant of event` }
  } catch (error) {
    console.log("error: ", error)
    // Return a NextResponse object with an error message and status code
    return {
      message: "There was a problem. Please try again",
      success: false,
    }
  }
}

export async function deleteParticipant({
  participant,
  event,
}: {
  participant: Participant
  event: EventWithParticipants
}) {
  try {
    await deleteParticipantInDB({ participant, event })

    revalidatePath(`/${event.id}`)
  } catch (error) {
    console.log("error: ", error)
    // Return a NextResponse object with an error message and status code
    redirect("/error")
  }
}
