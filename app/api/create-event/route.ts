import { NextResponse } from "next/server"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

import { getFutureEvents, createEvent } from "../../../utils/server-api"

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
      const nextDateDay = dayjs(lastEvent.date).add(14, "day").day(5)
      nextDate = nextDateDay
        .utc()
        .hour(16)
        .minute(30)
        .second(0)
        .millisecond(0)
        .toDate()
      nextMaxParticipants = 8
    } else {
      // next date is on a monday 2 weeks after the last event
      const nextDateDay = dayjs(lastEvent.date).add(14, "day").day(1)
      nextDate = nextDateDay
        .utc()
        .hour(16)
        .minute(30)
        .second(0)
        .millisecond(0)
        .toDate()
      nextMaxParticipants = 4
    }
    await createEvent(nextDate, nextMaxParticipants)

    return NextResponse.json({ message: `Success` })
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error ${error}` },
      { status: 500 }
    )
  }
}
