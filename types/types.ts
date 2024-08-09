import type { Event, User } from "@prisma/client"

type EventWithParticipants = Event & { participants: User[] }

type CreateParticipantBody = Omit<
  User,
  "id" | "createdAt" | "updatedAt" | "hasCanceled"
>
type UpdateParticipantBody = Omit<
  User,
  "createdAt" | "updatedAt" | "hasCanceled"
>

export type {
  EventWithParticipants,
  CreateParticipantBody,
  UpdateParticipantBody,
}
