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
import type { Participant } from "@prisma/client"

import { EventWithParticipants } from "../../../../types/types"
import { State } from "../../../actions"
import SuccessModal from "./SuccessModal"
import SubmitButton from "./SubmitButton"

type JoinEventFormProps = {
  event: EventWithParticipants
  participant?: Participant
  isOnWaitingList: boolean
  isEdit?: boolean
  onSubmit: (prevState: State, formData: FormData) => Promise<State>
}

const initialState: State = {
  message: "",
  errors: {},
  success: false,
}

export default function JoinEventForm({
  event,
  participant,
  isOnWaitingList,
  isEdit,
  onSubmit,
}: JoinEventFormProps) {
  const router = useRouter()

  const [formState, formAction] = useFormState(onSubmit, initialState)

  const backToEventPage = () => {
    router.push(`/${event.id}`)
    // this will eventually be replaced with revalidatePath on the server, but currently this is not granular enough
    // because currently, revalidatePath invalidates all the routes in the client-side Router Cache and hence wouldn't
    // trigger the success modal
    router.refresh()
  }

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
              defaultValue={participant?.name}
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
              {isOnWaitingList
                ? "Sends you an email when a spot gets available"
                : "Sends out a reminder before the event"}
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
              defaultValue={participant?.email}
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
              You come later, have a boardgame suggestion or bring cake? Let the
              others know!
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
              defaultValue={participant?.note}
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
              defaultChecked={!!participant?.canHost}
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
              I could host at my place
            </Label>
          </Field>
        </Fieldset>
        <Input type="hidden" name="eventId" value={event.id} />
        <Input type="hidden" name="participantId" value={participant?.id} />

        <SubmitButton isOnWaitingList={isOnWaitingList} isEdit={isEdit} />
        <div id="customer-error" aria-live="polite" aria-atomic="true">
          {!formState.success && !formState.errors && (
            <div className="text-red-500 text-sm/6 mb-[16px] text-center">
              {formState.message}
            </div>
          )}
        </div>
      </form>

      <SuccessModal
        event={event}
        isSuccessModalOpen={formState.success}
        backToEventPage={backToEventPage}
        isOnWaitingList={isOnWaitingList}
        isEdit={isEdit}
      />
    </>
  )
}
