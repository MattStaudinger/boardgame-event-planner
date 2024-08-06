"use server"

import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { UserResponseBody } from "../types/types"

export async function createNewParticipant() {
  try {
    const body: UserResponseBody = await request.json()
    console.log("body: ", body)

    const test = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        note: body.note,
        canHost: body.canHost,
        eventId: body.eventId,
      },
    })

    revalidatePath(`/${body.eventId}`)

    return NextResponse.json({ data: { message: `Success` } })
  } catch (error) {
    console.log("error: ", error)
    // Return a NextResponse object with an error message and status code
    return new NextResponse(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
    })
  }
}
