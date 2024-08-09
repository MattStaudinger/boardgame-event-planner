"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "../utils/db"
import { UserResponseBody } from "../types/types"

export type State = {
  errors?: {
    name?: string[]
    email?: string[]
    note?: string[]
  }
  message?: string | null
  success?: boolean
}

export async function createNewParticipant(
  prevState: State,
  formData: FormData
) {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    note: z.string().max(500),
    canHost: z.boolean(),
    eventId: z.string(),
  })

  const data = Object.fromEntries(formData.entries())

  // the value of canHost is a string, so we need to convert it to a boolean
  // If a checkbox is unchecked when its form is submitted, neither the name nor the value is submitted to the server
  const canHost = data.canHost === "true" ? true : false

  const validatedData = schema.safeParse({
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

  const body: UserResponseBody = validatedData.data

  try {
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
