import type { Event, Participant } from "@prisma/client"

type EventWithParticipants = Event & { participants: Participant[] }

type CreateParticipantBody = Omit<
  Participant,
  "id" | "createdAt" | "updatedAt" | "hasCanceled"
>
type UpdateParticipantBody = Omit<
  Participant,
  "createdAt" | "updatedAt" | "hasCanceled"
>

export type {
  EventWithParticipants,
  CreateParticipantBody,
  UpdateParticipantBody,
}
