import { NextResponse } from "next/server"
import { CreateParticipantBody } from "../../../types/types"
import { prisma } from "../../../utils/db"
import { revalidatePath } from "next/cache"

export const POST = async (request: Request) => {
  try {
    const body: CreateParticipantBody = await request.json()

    await prisma.user.create({
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
