import Link from "next/link"
import { MdOutlineArrowBackIosNew } from "react-icons/md"
import classnames from "classnames"

type NavBackButtonProps = {
  route: string
  label: string
  hasSecondButtonInRow?: boolean
}

export default async function NavBackButton({
  route,
  label,
  hasSecondButtonInRow,
}: NavBackButtonProps) {
  return (
    <Link
      href={route}
      className={classnames(
        "flex items-center text-black/50  hover:text-black/40",
        {
          "self-start mt-[16px] px-2": !hasSecondButtonInRow,
        }
      )}
      data-umami-event="back click"
    >
      <MdOutlineArrowBackIosNew className="" />
      <span className="ml-[4px] underline">{label}</span>
    </Link>
  )
}
