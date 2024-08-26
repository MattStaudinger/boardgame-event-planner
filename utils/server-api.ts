import dayjs from "dayjs"
import { prisma } from "./db"
import { redirect } from "next/navigation"
import nodemailer from "nodemailer"
import { getEventDate } from "./utils"
import {
  CreateParticipantBody,
  EventWithParticipants,
  UpdateParticipantBody,
} from "../types/types"
import type { Participant, Event } from "@prisma/client"

const getFutureEvents = async () => {
  const today = dayjs().format()
  try {
    const res = await prisma.event.findMany({
      where: {
        canceled: false, // Only include events that have not been canceled
        date: {
          gte: today,
        },
      },
      orderBy: {
        date: "asc",
      },
    })
    return res
  } catch (error) {
    console.error(error)
    redirect("/error")
  }
}

const getEvent = (id: string) => {
  return prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      participants: {
        where: {
          canceled: false, // Only include participants who have not canceled
        },
        orderBy: {
          createdAt: "asc", // Use 'desc' for descending order
        },
      },
    },
  })
}

const getEventOrRedirect = async (id: string) => {
  try {
    const res = await getEvent(id)
    return res
  } catch (error) {
    console.error(error)
    redirect("/error")
  }
}
const createParticipant = (body: CreateParticipantBody) => {
  return prisma.participant.create({
    data: body,
  })
}
const updateParticipant = (body: UpdateParticipantBody) => {
  return prisma.participant.update({
    where: {
      id: body.id,
    },
    data: body,
  })
}
const deleteParticipant = (participant: Participant) => {
  return prisma.participant.update({
    where: {
      id: participant.id,
    },
    data: { ...participant, canceled: true },
  })
}

const deleteParticipantAndSendEmailToNextInWaitingList = async ({
  event,
  participant: participantToDelete,
}: {
  event: EventWithParticipants
  participant: Participant
}) => {
  await deleteParticipant(participantToDelete)

  const hasParticipantsInWaitingList =
    event.participants.length > event.maxParticipants

  const isParticipantToDeleteOnWaitingList =
    event.participants.findIndex(
      (participant) => participant.id === participantToDelete.id
    ) >= event.maxParticipants

  // we only send an email, when there are participants in the waiting list
  // and the participant to delete is not on the waiting list and if the participant
  // who should get an email has saved an email address
  if (hasParticipantsInWaitingList && !isParticipantToDeleteOnWaitingList) {
    const participantMoveFromWaitingListToEvent =
      event.participants[event.maxParticipants]
    if (participantMoveFromWaitingListToEvent.email) {
      sendEmailMoveFromWaitingListToEvent(
        participantMoveFromWaitingListToEvent,
        event
      )
    }
  }
}

const createNewEmailEntry = async ({
  participant,
  event,
}: {
  participant: Participant
  event: Event
}) => {
  const eventDate = getEventDate(event.date, "DD.MM.YYYY [at] HH:mm")

  return prisma.sentEmails.create({
    data: {
      name: participant.name,
      email: participant.email,
      eventDate: eventDate,
    },
  })
}

const sendEmail = async ({
  to,
  subject,
  text,
  html,
  participant,
  event,
}: {
  to: string
  subject: string
  text: string
  html: string
  participant: Participant
  event: Event
}) => {
  const transporter = nodemailer.createTransport({
    host: "mail.gmx.net",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_ACCOUNT_PASSWORD,
    },
  })

  const mailOptions = {
    from: "boardgamenight@gmx.net",
    to,
    subject,
    text,
    html,
  }

  await createNewEmailEntry({ participant, event })
  return transporter.sendMail(mailOptions)
}

const sendEmailMoveFromWaitingListToEvent = async (
  participant: Participant,
  event: Event
) => {
  const eventUrl = `${process.env.BASE_URL}/${event.id}`
  const eventDate = getEventDate(event.date, "dddd, DD.MM.YYYY [at] HH:mm")

  const mailOptions = {
    to: participant.email,
    subject: `You are now part of the boardgame night on ${getEventDate(
      event.date
    )}`,
    text: `Hey ${participant.name},\n\nYou just moved from the waiting list and you are now part of the boardgame night on ${eventDate}. If you can't make it, please go to ${eventUrl} and cancel your spot.\n\nThe address will be decided on some days prior the event and posted on the event page. You'll also receive a reminder along with the address a day before the event.\n\nWe will eat dinner together - either ordering or preparing, so no need to eat up front.\n\nSee you soon! 🙌\n\nIf you didn't want this email or don't know where you got it from, please reach out to boardgamenight@gmx.net.`,
    html: `
    <p>Hey ${participant.name}</p>
    <p>You just moved from the waiting list and you are now part of the boardgame night on ${eventDate}.</p>
    <p>If you can't make it, please go to <a href="${eventUrl}">the event page</a> and cancel your spot.</p>
    <p>The address will be decided on some days prior the event and posted on the event page. You'll also receive a reminder along with the address a day before the event.</p>
    <p>We will eat dinner together - either ordering or preparing, so no need to eat up front.</p>
    <p>See you soon! 🙌</p>
    <div style="margin-top: 20px; font-size: 12px; color: #555;">
      If you didn't want this email or don't know where you got it from, please reach out to <a href="mailto:boardgamenight@gmx.net">boardgamenight@gmx.net</a>.
    </div>
  `,
  }

  return await sendEmail({ ...mailOptions, participant, event })
}
const sendEmailReminderBeforeEvent = async ({
  participant,
  event,
}: {
  participant: Participant
  event: Event
}) => {
  const eventUrl = `${process.env.BASE_URL}/${event.id}`
  const eventDate = getEventDate(event.date, "dddd, DD.MM.YYYY [at] HH:mm")

  const addressMessage = event.address
    ? `The event will take place at ${event.address}.`
    : "The event's location will be announced soon."

  const mailOptions = {
    to: participant.email,
    subject: `Reminder for upcoming boardgame night tomorrow on ${getEventDate(
      event.date
    )}`,
    text: `Hey ${participant.name},\n\nJust a quick reminder that tomorrow, ${eventDate} is the night of your dreams - boardgame night. ${addressMessage} If you can't make it, please go to the event page (${eventUrl}) and cancel your spot.\n\nWe will eat dinner together - either ordering or preparing, so no need to eat up front.\n\nSee you soon! 🙌 \n\nIf you didn't want this email or don't know where you got it from, please reach out to boardgamenight@gmx.net.`,
    html: `
    <p>Hey ${participant.name}</p>
    <p>Just a quick reminder that tomorrow, ${eventDate} is the night of your dreams - boardgame night.</p>
    <p>${addressMessage} If you can't make it, please go to <a href="${eventUrl}">the event page</a> and cancel your spot.</p>
    <p>We will eat dinner together - either ordering or preparing, so no need to eat up front.</p>
    <p>See you soon! 🙌</p>
    <div style="margin-top: 20px; font-size: 12px; color: #555;">
    If you didn't want this email or don't know where you got it from, please reach out to <a href="mailto:boardgamenight@gmx.net">boardgamenight@gmx.net</a>.
    </div>
    `,
  }

  return await sendEmail({ ...mailOptions, event, participant })
}

const createEvent = async (date: Date, maxParticipants: number) => {
  return prisma.event.create({
    data: {
      date,
      participants: {
        connect: [],
      },
      maxParticipants,
    },
  })
}

export {
  getFutureEvents,
  getEventOrRedirect,
  createParticipant,
  updateParticipant,
  deleteParticipantAndSendEmailToNextInWaitingList,
  createEvent,
  sendEmailReminderBeforeEvent,
  getEvent,
}
