import type { Event, User } from "@prisma/client"

type EventWithParticipants = Event & { participants: User[] }

export type { EventWithParticipants }
