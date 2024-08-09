"use client"

import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react"
import { EventWithParticipants } from "../../../../types/types"
import { AddToCalendarButton } from "add-to-calendar-button-react"
import dayjs from "dayjs"

type JoinEventFormProps = {
  event: EventWithParticipants
  isSuccessModalOpen: boolean
  backToEventPage: () => void
  isOnWaitingList: boolean
  isEdit?: boolean
}

const getSuccessMessage = ({
  isOnWaitingList,
  isEdit,
}: {
  isOnWaitingList: boolean
  isEdit?: boolean
}) => {
  if (isEdit) {
    return "You updated your info"
  }
  return isOnWaitingList
    ? "You are now on the waiting list. We will send an email in case a spot becomes available."
    : "You joined the event"
}

export default function JoinEventForm({
  event,
  isSuccessModalOpen,
  backToEventPage,
  isOnWaitingList,
  isEdit,
}: JoinEventFormProps) {
  return (
    <Dialog
      open={isSuccessModalOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={backToEventPage}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="flex flex-col gap-[16px] w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className=" font-medium text-black text-xl">
              Success! 🥳
            </DialogTitle>
            <p className="text-sm/6 text-black/50">
              {getSuccessMessage({ isOnWaitingList, isEdit })}
            </p>
            <div className="my-[8px]">
              <AddToCalendarButton
                name="Boardgame night!"
                description="The boardgame night you never forget! The location will be announced some days prior the event."
                startDate={dayjs(event.date).format("YYYY-MM-DD")}
                startTime={dayjs(event.date).format("HH:mm")}
                endTime={dayjs(event.date).add(4, "hour").format("HH:mm")}
                timeZone="Europe/Berlin"
                location="Berlin"
                options="'Apple','Google','iCal','Outlook.com','Yahoo','Microsoft365','MicrosoftTeams'"
                trigger="click"
                hideBackground
                lightMode="light"
                hideCheckmark
              />
            </div>
            <Button
              className="rounded w-full my-[16px] bg-custom-green  py-2 px-4 text-md text-white data-[hover]:bg-custom-green-hover data-[active]:bg-custom-green-hover"
              onClick={backToEventPage}
            >
              Back to event page
            </Button>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
