"use client"

import { useState } from "react"
import {
  Description,
  Field,
  Fieldset,
  Input,
  Label,
  Textarea,
  Button,
  Checkbox,
} from "@headlessui/react"
import classnames from "classnames"
import { hasEventReachedMaxParticipants } from "../../../../utils/utils"
import { EventWithParticipants } from "../../../../types/types"

type JoinEventFormProps = {
  event: EventWithParticipants
}

type ValidationErrors = {
  name?: string
  email?: string
  notes?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function JoinEventForm({ event }: JoinEventFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [canHost, setCanHost] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  console.log("validationErrors: ", validationErrors)

  const validateForm = () => {
    const errors: ValidationErrors = {}
    if (!name) {
      errors.name = "Your Name is required"
    }
    if (!email) {
      errors.email = "Your Email is required"
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email address"
    }
    if (notes.length > 500) {
      errors.notes = "Notes must be less than 500 characters"
    }

    return errors
  }

  const handleJoinEvent = () => {
    console.log("name: ", name)
    const errors = validateForm()
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }

    console.log("Joining event", name, email, notes, canHost)
  }
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setName(value)
  }
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setEmail(value)
  }
  const handleChangeNotes = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value
    setNotes(value)
  }
  const isJoiningWaitingList = hasEventReachedMaxParticipants(event)

  return (
    <>
      <Fieldset className="w-full space-y-6 rounded-xl bg-white/5 ">
        <Field>
          <Label className="text-sm/6 font-medium text-black/70">
            Name
            <span className="text-red-500 text-sm ml-[2px] align-top">*</span>
          </Label>
          <Input
            required
            onChange={handleChangeName}
            // className={`mt-3 block w-full rounded-lg ${
            //   validationErrors.name ? "border-red-500" : "border-none"
            // } bg-black/10 p-3 text-sm/6 text-black/70 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25`}
            className={classnames(
              "mt-3 block w-full rounded-lg bg-black/10 p-3 text-sm/6 text-black/70 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
              {
                "border-red-500 border-solid border-2": validationErrors.name,
              }
            )}
          />
          {validationErrors.name && (
            <span className="text-red-500 text-xs/6">
              {validationErrors.name}
            </span>
          )}
        </Field>
        <Field>
          <Label className="text-sm/6 font-medium text-black/70">
            Email
            <span className="text-red-500 text-sm ml-[2px] align-top">*</span>
          </Label>
          <Description className="text-xs/6 text-black/50">
            Used for sending out a reminder before the event
          </Description>
          <Input
            required
            onChange={handleChangeEmail}
            className={classnames(
              "mt-3 block w-full rounded-lg bg-black/10 p-3 text-sm/6 text-black/70 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
              {
                "border-red-500 border-solid border-2": validationErrors.email,
              }
            )}
          />
          {validationErrors.email && (
            <span className="text-red-500 text-xs/6">
              {validationErrors.email}
            </span>
          )}
        </Field>
        <Field>
          <Label className="text-sm/6 font-medium text-black/70">Notes</Label>
          <Description className="text-xs/6 text-black/50">
            You come later or bring cake? Let us know!
          </Description>
          <Textarea
            onChange={handleChangeNotes}
            className={classnames(
              "mt-3 block w-full resize-none rounded-lg bg-black/5 p-3 text-sm/6 text-black/70 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
              {
                "border-red-500 border-solid border-2": validationErrors.notes,
              }
            )}
            rows={3}
          />
          {validationErrors.notes && (
            <span className="text-red-500 text-xs/6">
              {validationErrors.notes}
            </span>
          )}
        </Field>
        <div className="flex items-center gap-[16px]">
          <Checkbox
            checked={canHost}
            onChange={setCanHost}
            className="group size-7 rounded-md bg-black/10 p-1 ring-1 ring-black/10 ring-inset data-[checked]:bg-custom-green"
          >
            <svg
              className="stroke-white opacity-0 group-data-[checked]:opacity-100"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M3 8L6 11L11 3.5"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Checkbox>
          <span className="text-sm/6 font-medium text-black/50">
            Are you up to host at your place?
          </span>
        </div>
      </Fieldset>

      <Button
        onClick={handleJoinEvent}
        className="rounded mt-[36px] w-full font-semibold mb-[16px] bg-custom-green py-2 px-8 text-md text-white data-[hover]:bg-custom-green-hover data-[active]:bg-custom-green-hover"
      >
        {isJoiningWaitingList ? "Join the waiting list" : "Join"}
      </Button>
    </>
  )
}
