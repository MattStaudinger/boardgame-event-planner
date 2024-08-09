import type { Event, User } from "@prisma/client"

type EventWithParticipants = Event & { participants: User[] }

type UserResponseBody = Omit<
  User,
  "id" | "createdAt" | "updatedAt" | "hasCanceled"
>

export type { EventWithParticipants, UserResponseBody }
