import type { Event, Participant } from "@prisma/client"

type EventWithParticipants = Event & { participants: Participant[] }

type CreateParticipantBody = Omit<
  Participant,
  "id" | "createdAt" | "updatedAt" | "canceled"
>
type UpdateParticipantBody = Omit<
  Participant,
  "createdAt" | "updatedAt" | "canceled"
>

export type {
  EventWithParticipants,
  CreateParticipantBody,
  UpdateParticipantBody,
}
