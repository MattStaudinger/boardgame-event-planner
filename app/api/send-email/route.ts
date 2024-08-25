import { NextResponse } from "next/server"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import type { Event, Participant } from "@prisma/client"

import {
  sendEmailReminderBeforeEvent,
  getFutureEvents,
  getEvent,
} from "../../../utils/server-api"

dayjs.extend(utc)
dayjs.extend(timezone)

export const dynamic = "force-dynamic" // static by default, unless reading the request

const sendEmail = async (event: Event) => {
  const eventWithParticipants = await getEvent(event.id)

  if (!eventWithParticipants) {
    return NextResponse.json(
      { error: `Internal Server Error - event not found` },
      { status: 500 }
    )
  }

  if (eventWithParticipants.participants.length === 0) {
    return NextResponse.json(
      { message: "No participants for the next event" },
      { status: 422 }
    )
  }
  let participantsEmailPromises: Promise<SMTPTransport.SentMessageInfo>[] = []
  eventWithParticipants.participants.forEach((participant) => {
    // create promise to send email to each participant
    participantsEmailPromises.push(
      sendEmailReminderBeforeEvent({
        event: eventWithParticipants,
        participant,
      })
    )
  })

  return await Promise.allSettled(participantsEmailPromises)
}

export const GET = async () => {
  try {
    const events = await getFutureEvents()

    if (events.length === 0) {
      return NextResponse.json({ message: `No future events` })
    }

    const nextEvent = events[0]
    const currentDate = dayjs().tz("Europe/Berlin")
    const nextEventDate = dayjs(nextEvent.date).tz("Europe/Berlin")

    if (nextEventDate.diff(currentDate, "day") > 1) {
      return NextResponse.json(
        { message: "Next event too far in the future" },
        { status: 422 }
      )
    }
    if (nextEventDate.diff(currentDate, "day") < 1) {
      // if the next event is today, check the event date after that one and send an email
      // to the participants of the next event if that event is in a day from now
      const nextNextEvent = events[1]
      if (
        dayjs(nextNextEvent.date)
          .tz("Europe/Berlin")
          .diff(currentDate, "day") === 1
      ) {
        sendEmail(nextNextEvent)
        return NextResponse.json({ data: { message: `Success` } })
      }

      return NextResponse.json(
        { message: "Next event today, but no tomorrow" },
        { status: 422 }
      )
    }
    await sendEmail(nextEvent)

    return NextResponse.json({ data: { message: `Success` } })
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error ${error}` },
      { status: 500 }
    )
  }
}
