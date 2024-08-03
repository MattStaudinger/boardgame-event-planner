import dayjs from "dayjs"
import Link from "next/link"

import { getEvent } from "../../api/server-api"
import Form from "./components/form"
import NavBackButton from "../../../components/NavBackButton"
import { hasEventReachedMaxParticipants } from "../../../utils/utils"

type EventProps = {
  params: {
    eventId: string
  }
}

export default async function JoinEvent({ params }: EventProps) {
  const event = await getEvent(params.eventId)

  if (!event) {
    return <div>Event not found</div>
  }
  const isJoiningWaitingList = hasEventReachedMaxParticipants(event)

  return (
    <>
      <NavBackButton route={`/${event.id}`} />

      <h1 className="text-custom-green text-2xl mt-12 font-bold">
        Join on {dayjs(event.date).format("dddd, DD.MM.YYYY")}
      </h1>
      {/* <div className="sm:px-2 px-6"> */}
      {isJoiningWaitingList && (
        <p className="text-sm/6 text-black/50 mb-[16px]">
          The event is already full... You are joining the waiting list and will
          be notified via email if a spot becomes available.
        </p>
      )}
      <Form event={event} />

      <Link
        href={`/${event.id}`}
        className="rounded flex  justify-center font-semibold w-full bg-black/30 py-2 px-8 text-md text-white data-[hover]:bg-custom-green-hover data-[active]:bg-custom-green-hover"
      >
        Back
      </Link>
      {/* </div> */}
    </>
  )
}
