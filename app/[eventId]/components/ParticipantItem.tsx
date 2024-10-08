import Image from "next/image"
import DropdownMenu from "./DropdownMenu"
import { getRandomAvatar } from "../../../utils/utils"
import type { Participant } from "@prisma/client"
import { EventWithParticipants } from "../../../types/types"

type EventProps = {
  participant: Participant
  event: EventWithParticipants
}

export default async function ParticipantItem({
  participant,
  event,
}: EventProps) {
  return (
    <li key={participant.id} className="flex justify-between gap-x-6 py-[16px]">
      <div className="flex min-w-0 gap-x-4 items-center">
        <Image
          className="h-12 w-12 flex-none rounded-full bg-gray-50"
          src={getRandomAvatar()}
          alt="Avatar"
          width="50"
          height="50"
        />
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {participant.name}
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            {participant.canHost && <span>Can host</span>}
            {participant.canHost && participant.note && <span> / </span>}
            {participant.note}
          </p>
        </div>
      </div>

      <DropdownMenu event={event} participant={participant} />
    </li>
  )
}
