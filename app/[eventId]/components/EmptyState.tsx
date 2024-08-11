import dayjs from "dayjs"
import Link from "next/link"
import type { EventWithParticipants } from "../../../types/types"

import NavBackButton from "../../../components/NavBackButton"

type EventProps = {
  event: EventWithParticipants
}

export default async function EventEmptyState({ event }: EventProps) {
  return (
    <>
      <NavBackButton route="/" label="All events" />

      <h1 className="text-custom-green text-2xl font-bold">
        {dayjs(event.date).format("ddd, DD.MM.YYYY [at] HH:mm")}
      </h1>

      <div className="flex items-center justify-center flex-col gap-[8px] text-black/75 rounded  p-[16px]">
        <p>No participants yet. </p>
        <p>Be the first one to join! ❤️️</p>
      </div>

      <Link
        href={`/${event.id}/join`}
        className="rounded font-semibold my-[16px] bg-custom-green py-2 px-8 text-md text-white data-[hover]:bg-custom-green-hover data-[active]:bg-custom-green-hover"
        data-umami-event="join click"
      >
        Join
      </Link>
    </>
  )
}
