import dayjs from "dayjs"
import Link from "next/link"

import { getEventOrRedirect } from "../../../../utils/server-api"
import Form from "../components/form"
import NavBackButton from "../../../../components/NavBackButton"
import { isParticipantOnWaitingList } from "../../../../utils/utils"
import { updateParticipant } from "../../../actions"

type EventProps = {
  params: {
    eventId: string
    userId: string
  }
}

export default async function EditParticipant({ params }: EventProps) {
  const event = await getEventOrRedirect(params.eventId)

  const participant = event?.participants.find(
    (participant) => participant.id === params.userId
  )

  console.log("participant: ", participant)
  if (!event || !participant) {
    return <div>Event or user not found</div>
  }
  const isOnWaitingList = isParticipantOnWaitingList(event, participant)

  return (
    <>
      <NavBackButton route={`/${event.id}`} label="Back" />

      <h1 className="text-custom-green text-2xl font-bold">Update your info</h1>
      <h2 className="text-[#555555] font-bold text-lg">
        {dayjs(event.date).format("dddd, DD.MM.YYYY")}
      </h2>

      <div className="sm:px-2 px-6 w-full">
        {isOnWaitingList && (
          <p className="text-sm/6 text-black/50 mb-[16px]">
            The event is already full... You are updating your spot on the
            waiting list and will be notified via email if a spot becomes
            available.
          </p>
        )}
        <Form
          event={event}
          participant={participant}
          isOnWaitingList={isOnWaitingList}
          isEdit
          onSubmit={updateParticipant}
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
