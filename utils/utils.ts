import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { createAvatar } from "@dicebear/core"
import { lorelei, croodles, notionists } from "@dicebear/collection"
import { EventWithParticipants } from "../types/types"
import type { Participant } from "@prisma/client"

dayjs.extend(utc)
dayjs.extend(timezone)

const getRandomAvatar = () => {
  const avatars = [lorelei, notionists, croodles]
  const avatar = avatars[Math.floor(Math.random() * avatars.length)]

  const avatarVariants = [
    "Muffin",
    "Milo",
    "Pumpkin",
    "Rascal",
    "Mimi",
    "Peanut",
    "Sam",
    "Midnight",
    "Simon",
    "Oliver",
    "Tigger",
    "Max",
    "Snickers",
    "Jasmine",
    "Simba",
    "Bella",
    "Miss kitty",
    "Whiskers",
    "Cuddles",
    "Bubba",
    "Felix",
    "Aneka",
  ]

  const styles = {
    seed: avatarVariants[Math.floor(Math.random() * avatarVariants.length)],
    backgroundColor: ["FFBF69"],
    earringsProbability: 50,
    glassesProbability: 50,
    mustacheProbability: 50,
    frecklesProbability: 50,
    beardProbability: 35,
    hairAccessoriesProbability: 50,
    gestureProbability: 30,
    scale: 125,
  }
  // @ts-ignore
  const generatedAvatar = createAvatar(avatar, styles)

  return generatedAvatar.toDataUri()
}

const getParticipantsThatHaveNotCanceled = (participants: Participant[]) => {
  return participants.filter((participant) => !participant.canceled)
}
const getParticipantsAboveTheWaitingList = (
  participants: Participant[],
  maxParticipants: number
) => {
  return getParticipantsThatHaveNotCanceled(participants).slice(
    0,
    maxParticipants
  )
}

const hasEventReachedMaxParticipants = (event: EventWithParticipants) => {
  const participantsThatHaveNotCanceled = getParticipantsThatHaveNotCanceled(
    event.participants
  )

  return participantsThatHaveNotCanceled.length >= event.maxParticipants
}

const isParticipantOnWaitingList = (
  event: EventWithParticipants,
  selectedParticipant: Participant
) => {
  const participantsThatHaveNotCanceled = getParticipantsThatHaveNotCanceled(
    event.participants
  )

  // in case a participant edits its data, we need to check if the participant is part of the waiting list or in the event
  const isParticipantAboveTheWaitingList =
    participantsThatHaveNotCanceled.findIndex(
      (participant) => participant.id === selectedParticipant?.id
    ) < event.maxParticipants

  return !isParticipantAboveTheWaitingList
}

const getEventDate = (
  eventDateUnformatted: Date,
  formatOption = "ddd, DD.MM.YYYY [at] HH:mm"
) => {
  return dayjs(eventDateUnformatted).tz("Europe/Berlin").format(formatOption)
}

export {
  getRandomAvatar,
  getParticipantsThatHaveNotCanceled,
  getParticipantsAboveTheWaitingList,
  hasEventReachedMaxParticipants,
  isParticipantOnWaitingList,
  getEventDate,
}
