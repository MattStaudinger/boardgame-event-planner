"use client"

import {
  Description,
  Field,
  Fieldset,
  Input,
  Label,
  Textarea,
  Checkbox,
} from "@headlessui/react"
import classnames from "classnames"
import { useRouter } from "next/navigation"
import { useFormState } from "react-dom"

import { hasEventReachedMaxParticipants } from "../../../../utils/utils"
import { EventWithParticipants } from "../../../../types/types"
import { createNewParticipant } from "../../../actions"
import SuccessModal from "./SuccessModal"
import SubmitButton from "./SubmitButton"

type JoinEventFormProps = {
  event: EventWithParticipants
}

const initialState = {
  message: "",
  error: {},
  success: false,
}

export default function JoinEventForm({ event }: JoinEventFormProps) {
  const router = useRouter()

  const [formState, formAction] = useFormState(
    createNewParticipant,
    initialState
  )

  const backToEventPage = () => {
    router.push(`/${event.id}`)
    // this will eventually be replaced with revalidatePath on the server, but currently this is not granular enough
    // because currently, revalidatePath invalidates all the routes in the client-side Router Cache and hence wouldn't
    // trigger the success modal
    router.refresh()
  }

  const isJoiningWaitingList = hasEventReachedMaxParticipants(event)

  return (
    <>
      <form action={formAction}>
        <Fieldset className="w-full space-y-6 rounded-xl bg-white/5 ">
          <Field>
            <Label className="font-medium text-black/70">
              Name
              <span className="text-red-500 text-sm ml-[2px] align-top">*</span>
            </Label>
            <Input
              name="name"
              className={classnames(
                "mt-3 block w-full rounded-lg bg-black/10 p-3 text-black/60 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                {
                  "border-red-500 border-solid border-2":
                    formState.errors?.name,
                }
              )}
            />
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {formState.errors?.name && (
                <span className="text-red-500 text-xs/6">
                  {formState.errors.name}
                </span>
              )}
            </div>
          </Field>
          <Field>
            <Label className=" font-medium text-black/70">
              Email
              <span className="text-red-500 text-sm ml-[2px] align-top">*</span>
            </Label>
            <Description className="text-xs/6 text-black/50">
              Used for sending out a reminder before the event
            </Description>
            <Input
              name="email"
              type="email"
              className={classnames(
                "mt-3 block w-full rounded-lg bg-black/10 p-3 text-black/60 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                {
                  "border-red-500 border-solid border-2":
                    formState.errors?.email,
                }
              )}
            />
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {formState.errors?.email && (
                <span className="text-red-500 text-xs/6">
                  {formState.errors.email}
                </span>
              )}
            </div>
          </Field>
          <Field>
            <Label className="font-medium text-black/70">Notes</Label>
            <Description className="text-xs/6 text-black/50">
              You come later or bring cake? Let us know!
            </Description>
            <Textarea
              name="note"
              className={classnames(
                "mt-3 block w-full resize-none rounded-lg bg-black/5 p-3 text-black/60 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
                {
                  "border-red-500 border-solid border-2":
                    formState.errors?.note,
                }
              )}
              rows={3}
            />
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {formState.errors?.note && (
                <span className="text-red-500 text-xs/6">
                  {formState.errors.note}
                </span>
              )}
            </div>
          </Field>
          <Field className="flex items-center gap-[16px] cursor-pointer">
            <Checkbox
              name="canHost"
              value="true"
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
            <Label className="text-sm/6 font-medium text-black/50">
              Are you up to host at your place?
            </Label>
          </Field>
        </Fieldset>
        <Input type="hidden" name="eventId" value={event.id} />

        <SubmitButton isJoiningWaitingList={isJoiningWaitingList} />
        <p aria-live="polite" className="sr-only" role="status">
          {formState?.message}
        </p>
      </form>

      <SuccessModal
        event={event}
        isSuccessModalOpen={formState.success}
        backToEventPage={backToEventPage}
        isJoiningWaitingList={isJoiningWaitingList}
      />
    </>
  )
}
