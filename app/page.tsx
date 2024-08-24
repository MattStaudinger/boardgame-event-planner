import Link from "next/link"
import dayjs from "dayjs"
import "dayjs/locale/de"
import Image from "next/image"

import { getFutureEvents } from "../utils/server-api"
import TextBox from "../components/TextBox"

export default async function Home() {
  dayjs.locale("en")

  const events = await getFutureEvents()
  return (
    <>
      <Image
        src="/boardgamenight_grey.webp"
        alt="120 - 240 min, 2 - 8 players, 4 out of 5 strategy"
        width="624"
        height="223"
      />
      <h1 className="text-custom-green text-2xl font-bold">
        Boardgame night 🥳
      </h1>

      <h2 className="text-[#555555] my-[16px] font-bold text-lg">
        Select the date you want to join
      </h2>
      <div className="flex flex-col gap-8 w-full ">
        {events.map((event) => (
          <Link key={event.id} href={`/${event.id}`}>
            <TextBox label={dayjs(event.date).format("ddd, DD.MM.YYYY")} />
          </Link>
        ))}
      </div>
    </>
  )
}
