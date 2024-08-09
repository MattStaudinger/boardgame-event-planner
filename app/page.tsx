import Link from "next/link"
import dayjs from "dayjs"
import "dayjs/locale/de"

import { getFutureEvents } from "../utils/server-api"
import TextBox from "../components/TextBox"

export default async function Home() {
  dayjs.locale("en")

  const events = await getFutureEvents()
  return (
    <>
      <h1 className="text-custom-green text-2xl mt-12 font-bold">
        Boardgame night
      </h1>

      <h2 className="text-[#555555] my-[32px] font-bold text-lg">Dates</h2>
      <div className="flex flex-col gap-8 w-full ">
        {events.map((event, index) => (
          <Link key={event.id} href={`/${event.id}`}>
            <TextBox
              index={index}
              label={dayjs(event.date).format("ddd, DD.MM.YYYY")}
            />
          </Link>
        ))}
      </div>
    </>
  )
}
