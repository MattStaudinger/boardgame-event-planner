import { MdOutlineDelete, MdModeEditOutline } from "react-icons/md"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import Image from "next/image"

import { getRandomAvatar } from "../../../utils/utils"

const menuItems = [
  {
    label: "Edit",
    icon: <MdModeEditOutline className="w-[16px] h-[16px]" />,
  },
  {
    label: "Delete",
    icon: <MdOutlineDelete className="w-[16px] h-[16px]" />,
  },
]

type EventProps = {
  participant: {
    id: string
    name: string
    canHost: boolean
    note: string
  }
}

export default async function ParticipantItem({ participant }: EventProps) {
  return (
    <li key={participant.id} className="flex justify-between gap-x-6 py-5">
      <div className="flex min-w-0 gap-x-4 items-center">
        <Image
          className="h-12 w-12 flex-none rounded-full bg-gray-50"
          src={getRandomAvatar()}
          alt="Avatar"
          width="50"
          height="50"
        />
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {participant.name}
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            {participant.canHost && <span>Can host</span>}
            {participant.canHost && participant.note && <span> / </span>}
            {participant.note}
          </p>
        </div>
      </div>

      <Menu>
        <MenuButton
          aria-label="action-menu"
          className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-100 data-[open]:bg-gray-100 data-[focus]:outline-1 data-[focus]:outline-white"
        >
          <BsThreeDotsVertical className="text-custom-green w-[18px] h-[18px]" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 origin-top-right rounded-md border border-white/5 bg-custom-green p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          {menuItems.map((item, index) => (
            <>
              <MenuItem key={item.label}>
                <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </MenuItem>
              {index !== menuItems.length - 1 && (
                <div className="my-1 h-px bg-white/25" />
              )}
            </>
          ))}
        </MenuItems>
      </Menu>
    </li>
  )
}
