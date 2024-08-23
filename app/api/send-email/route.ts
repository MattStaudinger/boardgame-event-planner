import { NextResponse } from "next/server"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

import {
  sendEmailReminderBeforeEvent,
  getFutureEvents,
  getEvent,
} from "../../../utils/server-api"

dayjs.extend(utc)
dayjs.extend(timezone)

export const dynamic = "force-dynamic" // static by default, unless reading the request

export const GET = async () => {
  try {
    const events = await getFutureEvents()

    if (events.length === 0) {
      return NextResponse.json({ data: { message: `No future events` } })
    }

    const nextEvent = events[0]
    const currentDate = dayjs().tz("Europe/Berlin")
    console.log("currentDate: ", currentDate)
    const nextEventDate = dayjs(nextEvent.date).tz("Europe/Berlin")
    console.log("nextEventDate: ", nextEventDate)
    if (nextEventDate.diff(currentDate, "day") > 1) {
      return NextResponse.json({
        data: { message: `Next event too far in the future` },
      })
    }

    const eventWithParticipants = await getEvent(nextEvent.id)
    console.log("eventWithParticipants: ", eventWithParticipants)

    if (!eventWithParticipants) {
      return NextResponse.error()
    }

    if (eventWithParticipants.participants.length === 0) {
      return NextResponse.json({
        data: { message: `No participants for the next event` },
      })
    }
    let participantsEmailPromises: Promise<void>[] = []
    eventWithParticipants.participants.forEach((participant) => {
      // create promise to send email to each participant
      participantsEmailPromises.push(
        sendEmailReminderBeforeEvent({
          event: eventWithParticipants,
          participant,
        })
      )
    })

    await Promise.allSettled(participantsEmailPromises)

    return NextResponse.json({ data: { message: `Success` } })
  } catch (error) {
    console.log("error: ", error)
    return NextResponse.error()
  }
}
