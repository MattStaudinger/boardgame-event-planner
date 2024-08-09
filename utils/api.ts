import { CreateParticipantBody } from "../types/types"

const createURL = (path: string) => `${window.location.origin}${path}`

const createNewParticipant = async (userData: CreateParticipantBody) => {
  const res = await fetch(new Request(createURL("/api/user")), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (res.ok) {
    const data = res.json()
    return data
  }
}

export { createNewParticipant }
