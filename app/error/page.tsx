import Link from "next/link"

import NavBackButton from "../../components/NavBackButton"

export default async function Error() {
  return (
    <>
      <NavBackButton route="/" label="Back" />

      <h1 className="text-custom-green text-2xl mt-12 font-bold">Error</h1>

      <p className="text-[#555555] my-[32px] font-bold text-lg">
        An error happened. Please try again
        <Link
          href={`/`}
          className="mt-[32px] rounded flex justify-center font-semibold w-full bg-black/30 py-2 px-8 text-md text-white data-[hover]:bg-custom-green-hover data-[active]:bg-custom-green-hover"
        >
          Back
        </Link>
      </p>
    </>
  )
}
