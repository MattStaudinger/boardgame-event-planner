import dayjs from "dayjs"
import { prisma } from "./db"

import { CreateParticipantBody, UpdateParticipantBody } from "../types/types"
import type { User } from "@prisma/client"

const getFutureEvents = () => {
  const today = dayjs().format()

  return prisma.event.findMany({
    where: {
      date: {
        gte: today,
      },
    },
  })
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

export {
  getFutureEvents,
  getEvent,
  createParticipant,
  updateParticipant,
  deleteParticipant,
}
