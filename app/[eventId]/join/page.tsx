import dayjs from "dayjs"
import Link from "next/link"

import { getEvent } from "../../api/server-api"
import Form from "./components/form"

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

  return (
    <>
      <h1 className="text-custom-green text-2xl mt-12 font-bold">
        {dayjs(event.date).format("ddd, DD.MM.YYYY")}
      </h1>

      <Form event={event} />

      <Link
        href={`/${event.id}`}
        className="rounded font-semibold my-[16px] bg-custom-red py-2 px-8 text-md text-white data-[hover]:bg-custom-green-hover data-[active]:bg-custom-green-hover"
      >
        Back
      </Link>
    </>
  )
}
