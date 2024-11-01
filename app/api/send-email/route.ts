import { NextResponse } from "next/server"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import type { Event } from "@prisma/client"
import { getParticipantsAboveTheWaitingList } from "../../../utils/utils"

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
  let participantsEmailPromises: Promise<{}>[] = []

  const participantsAboveTheWaitingList = getParticipantsAboveTheWaitingList(
    eventWithParticipants.participants,
    eventWithParticipants.maxParticipants
  )

  participantsAboveTheWaitingList.forEach((participant) => {
    // create promise to send email to each participant
    participantsEmailPromises.push(
      sendEmailReminderBeforeEvent({
        event: eventWithParticipants,
        participant,
      })
    )
  })

  try {
    await Promise.all(participantsEmailPromises)
  } catch (error) {
    return NextResponse.json(
      // @ts-ignore
      { error: `Internal Server Error - ${error?.body?.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: { message: `Success` } })
}

export const GET = async () => {
  try {
    const DAYS_DIFF_BEFORE_EVENT = 3 // 3 days before the event
    const events = await getFutureEvents()

    if (events.length === 0) {
      return NextResponse.json({ message: `No future events` })
    }

    const nextEvent = events[0]
    const currentDate = dayjs().tz("Europe/Berlin")
    const nextEventDate = dayjs(nextEvent.date).tz("Europe/Berlin")

    if (nextEventDate.diff(currentDate, "day") > DAYS_DIFF_BEFORE_EVENT) {
      return NextResponse.json(
        { message: "Next event too far in the future" },
        { status: 422 }
      )
    }
    if (nextEventDate.diff(currentDate, "day") < DAYS_DIFF_BEFORE_EVENT) {
      return NextResponse.json(
        {
          message: `Next event less than ${DAYS_DIFF_BEFORE_EVENT} days away, reminder was already sent`,
        },
        { status: 422 }
      )
    }

    const response = await sendEmail(nextEvent)
    return response
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error ${error}` },
      { status: 500 }
    )
  }
}
