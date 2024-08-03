import dayjs from "dayjs"
import { prisma } from "../../utils/db"

const getFutureEvents = () => {
  const today = dayjs().format()

  return prisma.event.findMany({
    where: {
      date: {
        gte: today,
      },
    },
  })
}

const getEvent = (id: string) => {
  return prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      participants: {
        where: {
          hasCanceled: false, // Only include participants who have not canceled
        },
        orderBy: {
          createdAt: "asc", // Use 'desc' for descending order
        },
      },
    },
  })
}

export { getFutureEvents, getEvent }
