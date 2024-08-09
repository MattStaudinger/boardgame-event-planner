import type { Event, User } from "@prisma/client"

type EventWithParticipants = Event & { participants: User[] }

type UserResponseBody = Omit<
  User,
  "id" | "createdAt" | "updatedAt" | "hasCanceled"
>

type FormValidationErrors = {
  name?: string
  email?: string
  note?: string
}

export type { EventWithParticipants, UserResponseBody, FormValidationErrors }
