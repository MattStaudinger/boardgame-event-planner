import Link from "next/link"
import { MdOutlineArrowBackIosNew } from "react-icons/md"

type NavBackButtonProps = {
  route: string
  label: string
}

export default async function NavBackButton({
  route,
  label,
}: NavBackButtonProps) {
  return (
    <Link
      href={route}
      className="self-start mt-[16px] px-2 flex items-center text-black/50  hover:text-black/40"
    >
      <MdOutlineArrowBackIosNew className="" />
      <span className="ml-[4px] underline">{label}</span>
    </Link>
  )
}
