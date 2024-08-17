import dayjs from "dayjs"
import Link from "next/link"

import { getEventOrRedirect } from "../../../utils/server-api"
import Form from "./components/form"
import NavBackButton from "../../../components/NavBackButton"
import { hasEventReachedMaxParticipants } from "../../../utils/utils"
import { createNewParticipant } from "../../actions"

type EventProps = {
  params: {
    eventId: string
  }
}

export default async function JoinEvent({ params }: EventProps) {
  const event = await getEventOrRedirect(params.eventId)

  if (!event) {
    return <div>Event not found</div>
  }
  const isOnWaitingList = hasEventReachedMaxParticipants(event)

  return (
    <>
      <NavBackButton route={`/${event.id}`} label="Back" />

      <h1 className="text-custom-green text-2xl font-bold">
        Join on {dayjs(event.date).format("dddd, DD.MM.YYYY")}
      </h1>
      <div className="sm:px-2 px-6 w-full">
        {isOnWaitingList && (
          <p className="text-sm/6 text-black/50 mb-[16px]">
            The event is already full... You are joining the waiting list and
            will be notified via email if a spot becomes available.
          </p>
        )}
        <Form
          event={event}
          isOnWaitingList={isOnWaitingList}
          onSubmit={createNewParticipant}
        />

        <Link
          href={`/${event.id}`}
          className="rounded flex mt-[16px] justify-center font-semibold w-full bg-black/30 py-2 px-8 text-md text-white data-[hover]:bg-custom-green-hover data-[active]:bg-custom-green-hover"
        >
          Cancel
        </Link>
      </div>
    </>
  )
}
