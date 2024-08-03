import dayjs from "dayjs"
import { getEvent } from "../api/server-api"
import ParticipantItem from "./components/ParticipantItem"
import Link from "next/link"
import NavBackButton from "../../components/NavBackButton"

type EventProps = {
  params: {
    eventId: string
  }
}

export default async function Event({ params }: EventProps) {
  const event = await getEvent(params.eventId)

  if (!event) {
    return <div>Event not found</div>
  }

  return (
    <>
      <NavBackButton route="/" />
      <h1 className="text-custom-green text-2xl font-bold">
        {dayjs(event.date).format("ddd, DD.MM.YYYY")}
      </h1>
      <h2 className="text-black text-lg font-bold">Participants</h2>

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
        {event.participants.length < event.maxParticipants
          ? "Join"
          : "Join the waiting list"}
      </Link>

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
  )
}
