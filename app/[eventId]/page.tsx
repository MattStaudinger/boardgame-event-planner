import type { User } from "@prisma/client"
import Link from "next/link"

import { getEventOrRedirect } from "../../utils/server-api"
import ParticipantItem from "./components/ParticipantItem"
import NavBackButton from "../../components/NavBackButton"
import EventEmptyState from "./components/EmptyState"
import { hasEventReachedMaxParticipants, getEventDate } from "../../utils/utils"

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

const MAX_PARTICIPANTS_TO_SHOW_JOIN_BUTTON_TOP = 3

export default async function Event({ params }: EventProps) {
  const event = await getEventOrRedirect(params.eventId)

  if (!event) {
    return <div>Event not found</div>
  }

  if (event.participants.length === 0) {
    return <EventEmptyState event={event} />
  }

  const participantsThatCanHost = event.participants.filter(
    (participant) => participant.canHost
  )

  const noParticipantsCanHost = participantsThatCanHost.length === 0
  const addressMessage = getAddressMessage(participantsThatCanHost)
  const isOnWaitingList = hasEventReachedMaxParticipants(event)

  const eventDate = getEventDate(event.date)
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <NavBackButton route="/" label="All events" hasSecondButtonInRow />
        {/* On small screens we want to show the CTA button another time to make sure it is visible without scrolling */}
        {event.participants.length >
          MAX_PARTICIPANTS_TO_SHOW_JOIN_BUTTON_TOP && (
          <Link
            href={`/${event.id}/join`}
            className="rounded font-semibold bg-custom-green-pastel py-1 px-3 text-sm text-white data-[hover]:bg-custom-green-hover data-[active]:bg-custom-green-hover"
            data-umami-event="join click top"
          >
            {event.participants.length >= event.maxParticipants
              ? "Join the waiting list"
              : "Join"}
          </Link>
        )}
      </div>
      <h1 className="text-custom-green text-2xl font-bold">{eventDate}</h1>

      {isOnWaitingList && (
        <p className="text-sm/6 text-black/50 font-bold mb-[16px]">
          The event is already full... join the waiting list and get notified if
          a spot becomes available.
        </p>
      )}

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
              event={event}
            />
          ))}
      </ul>
      <Link
        href={`/${event.id}/join`}
        className="rounded font-semibold my-[16px] bg-custom-green py-2 px-8 text-md text-white data-[hover]:bg-custom-green-hover data-[active]:bg-custom-green-hover"
        data-umami-event="join click"
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
                  event={event}
                />
              ))}
          </ul>
        </>
      )}
    </>
  )
}
