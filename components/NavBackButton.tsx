import Link from "next/link"
import { TiDelete } from "react-icons/ti"

type NavBackButtonProps = {
  route: string
}

export default async function NavBackButton({ route }: NavBackButtonProps) {
  return (
    <Link href={route}>
      <TiDelete className="text-black/50 w-[30px] h-[30px] absolute right-[16px] top-[16px]" />
    </Link>
  )
}
