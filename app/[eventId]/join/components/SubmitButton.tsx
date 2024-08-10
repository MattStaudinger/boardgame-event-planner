"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@headlessui/react"

type SubmitButtonProps = {
  isOnWaitingList: boolean
  isEdit?: boolean
}

const getSubmitButtonMessage = ({
  isOnWaitingList,
  isEdit,
}: SubmitButtonProps) => {
  if (isEdit) {
    return "Update"
  }
  return isOnWaitingList ? "Join the waiting list" : "Join"
}

const SubmitButton = ({ isOnWaitingList, isEdit }: SubmitButtonProps) => {
  const { pending } = useFormStatus()

  const submitButtonMessage = getSubmitButtonMessage({
    isOnWaitingList,
    isEdit,
  })

  return (
    <Button
      type="submit"
      formNoValidate
      aria-disabled={pending}
      className="rounded mt-[36px] w-full flex justify-center font-md font-semibold mb-[4px] bg-custom-green py-2 px-8 text-md text-white data-[hover]:bg-custom-green-hover data-[active]:bg-custom-green-hover"
      data-umami-event={isEdit ? "Update-button" : "Create-button"}
    >
      {pending ? (
        <>
          <span className="animate-pulse">
            {isEdit ? "Updating..." : "Joining..."}
          </span>{" "}
        </>
      ) : (
        submitButtonMessage
      )}
    </Button>
  )
}

export default SubmitButton
