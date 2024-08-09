import type { Event, User } from "@prisma/client"

type EventWithParticipants = Event & { participants: User[] }

type UserResponseBody = Omit<
  User,
  "id" | "createdAt" | "updatedAt" | "hasCanceled"
> & { id?: string }

export type { EventWithParticipants, UserResponseBody }
