import Link from "next/link"

import { getEventOrRedirect } from "../../utils/server-api"
import ParticipantItem from "./components/ParticipantItem"
import NavBackButton from "../../components/NavBackButton"
import EventEmptyState from "./components/EmptyState"
import { hasEventReachedMaxParticipants, getEventDate } from "../../utils/utils"
import { EventWithParticipants } from "../../types/types"
import { getParticipantsAboveTheWaitingList } from "../../utils/utils"

type EventProps = {
  params: {
    eventId: string
  }
}

const getAddressMessage = (event: EventWithParticipants) => {
  if (event.address) {
    return `At: ${event.address}`
  }

  const participantsThatCanHost = event.participants.filter(
    (participant) => participant.canHost
  )

  if (participantsThatCanHost.length === 0) {
    return "Host candidates: /"
  } else if (participantsThatCanHost.length > 1) {
    const allParticipantsButLast = participantsThatCanHost
      .slice(0, -1)
      .map((participant) => participant.name)
      .join(", ")
    const lastParticipant =
      participantsThatCanHost[participantsThatCanHost.length - 1].name

    return `Host candidates: ${allParticipantsButLast} or ${lastParticipant}`
  } else {
    return `Host candidates: ${participantsThatCanHost[0].name}`
  }
}

export default async function Event({ params }: EventProps) {
  const event = await getEventOrRedirect(params.eventId)

  if (!event) {
    return <div>Event not found</div>
  }

  if (event.participants.length === 0) {
    return <EventEmptyState event={event} />
  }

  const addressMessage = getAddressMessage(event)
  const isOnWaitingList = hasEventReachedMaxParticipants(event)

  const eventDate = getEventDate(event.date)
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <NavBackButton route="/" label="All events" hasSecondButtonInRow />
      </div>
      <div className="overflow-auto flex flex-col items-center gap-[16px] w-full">
        <h1 className="text-custom-green text-2xl font-bold">{eventDate}</h1>

        {isOnWaitingList && (
          <p className="text-sm/6 text-black/50 font-bold">
            The event is already full... join the waiting list and get notified
            if a spot becomes available.
          </p>
        )}

        <p>{addressMessage}</p>

        <h2 className="text-black text-lg font-bold">
          Participants
          <span className="text-sm font-normal">
            {"  "}
            (max. {event.maxParticipants})
          </span>
        </h2>

        <ul className="divide-y divide-gray-100 w-full">
          {getParticipantsAboveTheWaitingList(
            event.participants,
            event.maxParticipants
          ).map((participant) => (
            <ParticipantItem
              key={participant.id}
              participant={participant}
              event={event}
            />
          ))}
        </ul>

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
      </div>
      <Link
        href={`/${event.id}/join`}
        className="rounded font-semibold bg-custom-green py-2 px-8  text-md text-white data-[hover]:bg-custom-green-hover data-[active]:bg-custom-green-hover"
        data-umami-event="join click"
      >
        {event.participants.length >= event.maxParticipants
          ? "Join the waiting list"
          : "Join"}
      </Link>
    </>
  )
}
