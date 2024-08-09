"use client"

import { useState } from "react"
import { MdCancel, MdModeEditOutline } from "react-icons/md"
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import Link from "next/link"
import type { User } from "@prisma/client"

import { deleteParticipant } from "../../actions"

type DropdownMenuProps = {
  eventId: string
  participant: User
}

export default function DropdownMenu({
  eventId,
  participant,
}: DropdownMenuProps) {
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)

  const openWarningModal = () => {
    setIsWarningModalOpen(true)
  }

  const closeWarningModal = () => {
    setIsWarningModalOpen(false)
  }

  return (
    <>
      <Menu>
        <MenuButton
          aria-label="action-menu"
          className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-100 data-[open]:bg-gray-100 data-[focus]:outline-1 data-[focus]:outline-white/20"
        >
          <BsThreeDotsVertical className="text-custom-green w-[18px] h-[18px]" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 origin-top-right rounded-md border border-white/5 bg-custom-green p-1 text-sm/6  transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <>
            <MenuItem>
              <Link
                href={`${eventId}/join/${participant.id}`}
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/30"
              >
                <MdModeEditOutline className="w-[16px] h-[16px] text-white" />
                <span className="text-white">Edit</span>
              </Link>
            </MenuItem>
            <div className="my-1 h-px bg-white/25" />
            <MenuItem>
              <Button
                onClick={openWarningModal}
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/30"
              >
                <MdCancel className="w-[16px] h-[16px] text-white" />
                <span className="text-white">{"Can't make it"}</span>
              </Button>
            </MenuItem>
          </>
        </MenuItems>
      </Menu>

      <Dialog
        open={isWarningModalOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={closeWarningModal}
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className=" font-medium text-black text-xl">
                {"Can't make it anymore?"}
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-black/50">
                Remove yourself from the list.
              </p>
              <div className="mt-4 flex gap-[8px] ">
                <Button
                  className="rounded  my-[16px] bg-black/70 py-2 px-4 text-md text-white data-[hover]:bg-black/80 data-[active]:bg-black/80"
                  onClick={closeWarningModal}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded  my-[16px] bg-custom-red py-2 px-4 text-md text-white data-[hover]:bg-custom-red-hover data-[active]:bg-custom-green-hover"
                  onClick={() => deleteParticipant({ eventId, participant })}
                >
                  Remove me
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
