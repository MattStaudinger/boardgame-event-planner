"use client"

import {
  Description,
  Field,
  Fieldset,
  Input,
  Label,
  Textarea,
  Button,
} from "@headlessui/react"

type EventProps = {
  event: {
    id: string
    date: Date
    participants: {
      id: string
      name: string
      canHost: boolean
      note: string
    }[]
    maxParticipants: number
  }
}

export default function JoinEventForm({ event }: EventProps) {
  // add state of form here
  const handleJoinEvent = () => {
    console.log("Join event")
  }

  return (
    <>
      <Fieldset className="w-full space-y-6 rounded-xl bg-white/5 sm:px-2 px-6">
        <Field>
          <Label className="text-sm/6 font-medium text-black/70">Name</Label>
          <Input className="mt-3 block w-full rounded-lg border-none bg-black/10 p-3 text-sm/6 text-black/70 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25" />
        </Field>
        <Field>
          <Label className="text-sm/6 font-medium text-black/70">Email</Label>
          <Input className="mt-3 block w-full rounded-lg border-none bg-black/10  p-3 text-sm/6 text-black/70 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25" />
        </Field>

        <Field>
          <Label className="text-sm/6 font-medium text-black/70">Notes</Label>
          <Description className="text-sm/6 text-black/50">
            You come later or bring cake? Let us know!
          </Description>
          <Textarea
            className="mt-3 block w-full resize-none rounded-lg border-none bg-black/5 p-3 text-sm/6 text-black/70 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
            rows={3}
          />
        </Field>
      </Fieldset>

      <Button
        onClick={handleJoinEvent}
        className="rounded font-semibold my-[16px] bg-custom-green py-2 px-8 text-md text-white data-[hover]:bg-custom-green-hover data-[active]:bg-custom-green-hover"
      >
        {event.participants.length < event.maxParticipants
          ? "Join"
          : "Join the waiting list"}
      </Button>
    </>
  )
}
