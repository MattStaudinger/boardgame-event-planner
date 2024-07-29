import Link from "next/link"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/de"

import classnames from "classnames"
import { prisma } from "../utils/db"

const getFutureEvents = () => {
  const today = dayjs().format()
  console.log("today: ", today)

  return prisma.event.findMany({
    where: {
      date: {
        gte: today,
      },
    },
  })
}

export default async function Home() {
  dayjs.extend(localizedFormat)
  dayjs.locale("de") // use locale globally

  const events = await getFutureEvents()
  console.log("events: ", events)
  return (
    <main className="w-full h-full flex flex-col justify-center items-center p-4 gap-[24px]">
      <h1 className="text-custom-green text-2xl mt-12 font-bold">
        Boardgame night
      </h1>

      <h2 className="text-[#8F8E8E] my-[32px]">Dates</h2>
      <div className="flex flex-col gap-8 w-full md:w-[400px]">
        {events.map((event, index) => (
          <Link
            key={event.id}
            href={`/${event.id}`}
            className={classnames(
              "bg-[#ECECEC]",
              "w-full",
              "h-[48px]",
              "rounded-lg",
              "flex",
              "justify-center",
              "items-center",
              {
                "hover:bg-[#e0e0e0]": index % 2 === 0,
                "bg-[#ECECEC]": index % 2 === 0,
                "hover:bg-[#d6d6d6]": index % 2 === 1,
                "bg-[#b9b9b9]": index % 2 === 1,
              }
            )}
          >
            <span>{dayjs(event.date).format("LL")}</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
