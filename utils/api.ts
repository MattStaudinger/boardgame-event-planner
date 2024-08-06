import { UserResponseBody } from "../types/types"

const createURL = (path: string) => `${window.location.origin}${path}`

const createNewParticipant = async (userData: UserResponseBody) => {
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
