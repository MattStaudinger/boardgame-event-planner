import Link from "next/link"
import { TiDelete } from "react-icons/ti"

type NavBackButtonProps = {
  route: string
}

export default async function NavBackButton({ route }: NavBackButtonProps) {
  return (
    <Link href={route} className="self-end mt-[16px] px-2">
      <TiDelete className="text-black/50 w-[30px] h-[30px] " />
    </Link>
  )
}
