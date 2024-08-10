import { NextResponse } from "next/server"
import { prisma } from "../../../utils/db"
import dayjs from "dayjs"

import { getFutureEvents } from "../../../utils/server-api"

export const dynamic = "force-dynamic" // static by default, unless reading the request

export const GET = async () => {
  try {
    const events = await getFutureEvents()

    const lastEvent = events[events.length - 1]

    // the next event date depends on the participant size of the last event -
    // for a small event, the next event is on a monday, for a large event, the next event is on a friday
    const isSmallEvent = lastEvent.maxParticipants <= 4

    let nextDate = null
    let nextMaxParticipants = null

    if (isSmallEvent) {
      // next date is on a friday 2 weeks after the last event
      nextDate = dayjs(lastEvent.date).add(14, "day").day(5).toDate()
      nextMaxParticipants = 8
    } else {
      // next date is on a monday 2 weeks after the last event
      nextDate = dayjs(lastEvent.date).add(14, "day").day(1).toDate()
      nextMaxParticipants = 4
    }

    await prisma.event.create({
      data: {
        date: nextDate,
        participants: {
          connect: [],
        },
        maxParticipants: nextMaxParticipants,
      },
    })

    return NextResponse.json({ data: { message: `Success` } })
  } catch (error) {
    return NextResponse.error()
  }
}
