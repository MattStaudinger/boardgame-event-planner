"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@headlessui/react"

type SubmitButtonProps = {
  isJoiningWaitingList: boolean
}

const SubmitButton = ({ isJoiningWaitingList }: SubmitButtonProps) => {
  const { pending } = useFormStatus()

  const submitButtonLabel = isJoiningWaitingList
    ? "Join the waiting list"
    : "Join"

  return (
    <Button
      type="submit"
      formNoValidate
      aria-disabled={pending}
      className="rounded mt-[36px]  w-full flex justify-center font-md font-semibold mb-[16px] bg-custom-green py-2 px-8 text-md text-white data-[hover]:bg-custom-green-hover data-[active]:bg-custom-green-hover"
    >
      {pending ? (
        <>
          <span className="animate-pulse">Joining...</span>{" "}
        </>
      ) : (
        submitButtonLabel
      )}
    </Button>
  )
}

export default SubmitButton
