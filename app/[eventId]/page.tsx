import dayjs from "dayjs"
import type { User } from "@prisma/client"
import Link from "next/link"

import { getEvent } from "../../utils/server-api"
import ParticipantItem from "./components/ParticipantItem"
import NavBackButton from "../../components/NavBackButton"

type EventProps = {
  params: {
    eventId: string
  }
}

const getAddressMessage = (participantsThatCanHost: User[]) => {
  if (participantsThatCanHost.length === 0) {
    return "No participants can host"
  } else if (participantsThatCanHost.length > 1) {
    const allParticipantsButLast = participantsThatCanHost
      .slice(0, -1)
      .map((participant) => participant.name)
      .join(", ")
    const lastParticipant =
      participantsThatCanHost[participantsThatCanHost.length - 1].name

    return `At the home of ${allParticipantsButLast} or ${lastParticipant}`
  } else {
    return `At the home of ${participantsThatCanHost[0].name}`
  }
}

export default async function Event({ params }: EventProps) {
  const event = await getEvent(params.eventId)

  if (!event) {
    return <div>Event not found</div>
  }

  const participantsThatCanHost = event.participants.filter(
    (participant) => participant.canHost
  )
  console.log("participantsThatCanHost: ", participantsThatCanHost)

  const noParticipantsCanHost = participantsThatCanHost.length === 0
  const addressMessage = getAddressMessage(participantsThatCanHost)

  return (
    <>
      <NavBackButton route="/" label="All events" />
      <h1 className="text-custom-green text-2xl font-bold">
        {dayjs(event.date).format("ddd, DD.MM.YYYY [at] HH:mm")}
      </h1>
      {!noParticipantsCanHost && <p>{addressMessage}</p>}
      <h2 className="text-black text-lg font-bold">
        Participants
        <span className="text-sm font-normal">
          {"  "}
          (max. {event.maxParticipants})
        </span>
      </h2>

      <ul className="divide-y divide-gray-100 w-full">
        {event.participants
          ?.slice(0, event.maxParticipants)
          .map((participant) => (
            <ParticipantItem
              key={participant.id}
              participant={participant}
              eventId={event.id}
            />
          ))}
      </ul>
      <Link
        href={`/${event.id}/join`}
        className="rounded font-semibold my-[16px] bg-custom-green py-2 px-8 text-md text-white data-[hover]:bg-custom-green-hover data-[active]:bg-custom-green-hover"
      >
        {event.participants.length >= event.maxParticipants
          ? "Join the waiting list"
          : "Join"}
      </Link>
      {event.participants.length > event.maxParticipants && (
        <>
          <hr className="h-0.5 w-full border-t-0 bg-black/10" />

          <h2 className="text-black text-lg font-bold">Waiting list</h2>

          <ul className="divide-y divide-gray-100 w-full">
            {event.participants
              ?.slice(event.maxParticipants, event.participants.length)
              .map((participant) => (
                <ParticipantItem
                  key={participant.id}
                  participant={participant}
                  eventId={event.id}
                />
              ))}
          </ul>
        </>
      )}
    </>
  )
}
