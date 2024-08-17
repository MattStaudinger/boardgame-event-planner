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
import type { User, Event } from "@prisma/client"

const getFutureEvents = async () => {
  const today = dayjs().format()
  try {
    const res = await prisma.event.findMany({
      where: {
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
          hasCanceled: false, // Only include participants who have not canceled
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
  return prisma.user.create({
    data: body,
  })
}
const updateParticipant = (body: UpdateParticipantBody) => {
  return prisma.user.update({
    where: {
      id: body.id,
    },
    data: body,
  })
}
const deleteParticipant = (participant: User) => {
  return prisma.user.update({
    where: {
      id: participant.id,
    },
    data: { ...participant, hasCanceled: true },
  })
}

const deleteParticipantAndSendEmailToNextInWaitingList = async ({
  event,
  participant: participantToDelete,
}: {
  event: EventWithParticipants
  participant: User
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
      sendEmail(participantMoveFromWaitingListToEvent, event)
    }
  }
}

// Function to send email
const sendEmail = async (participant: User, event: Event) => {
  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    host: "mail.gmx.net",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_ACCOUNT_PASSWORD,
    },
  })

  const eventUrl = `${process.env.BASE_URL}/${event.id}`
  const eventDate = getEventDate(event.date, "dddd, DD.MM.YYYY [at] HH:mm")

  const mailOptions = {
    from: "boardgamenight@gmx.de",
    to: participant.email,
    subject: `You are now part of the boardgame night on ${getEventDate(
      event.date
    )}`,
    text: `Hey ${participant.name},\n\nYou just moved from the waiting list and you are now part of the boardgame night on ${eventDate}. If you can't make it, please go to ${eventUrl} and cancel your spot.\n\nSee you soon! 🙌`,
    html: `
    <p>Hey ${participant.name}</p>
    You just moved from the waiting list and you are now part of the boardgame night on ${eventDate}. If you can't make it, please go to <a href="${eventUrl}">the event page</a> and cancel your spot.</p>
    <p>See you soon! 🙌</p>
  `,
  }

  await transporter.sendMail(mailOptions)
}

export {
  getFutureEvents,
  getEventOrRedirect,
  createParticipant,
  updateParticipant,
  deleteParticipantAndSendEmailToNextInWaitingList,
}
