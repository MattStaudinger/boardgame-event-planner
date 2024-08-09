import { FormValidationErrors } from "../../../types/types"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateForm = ({
  name,
  email,
  note,
}: {
  name: string
  email: string
  note: string
}) => {
  const errors: FormValidationErrors = {}
  if (!name) {
    errors.name = "Your Name is required"
  }
  if (!email) {
    errors.email = "Your Email is required"
  } else if (!emailRegex.test(email)) {
    errors.email = "Invalid email address"
  }
  if (note.length > 500) {
    errors.note = "Notes must be less than 500 characters"
  }

  return errors
}

export { validateForm }
