import dayjs from "dayjs"
import { prisma } from "./db"
import { redirect } from "next/navigation"

import { CreateParticipantBody, UpdateParticipantBody } from "../types/types"
import type { User } from "@prisma/client"

const getFutureEvents = async () => {
  const today = dayjs().format()
  try {
    const res = await prisma.event.findMany({
      where: {
        date: {
          gte: today,
        },
      },
    })
    return res
  } catch (error) {
    console.error(error)
    redirect("/error")
  }
}

const getEvent = async (id: string) => {
  try {
    const res = await prisma.event.findUnique({
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

export {
  getFutureEvents,
  getEvent,
  createParticipant,
  updateParticipant,
  deleteParticipant,
}
