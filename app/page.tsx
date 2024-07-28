import Link from "next/link"

export default function Home() {
  return (
    <main className="w-full h-full flex flex-col justify-center items-center p-4 gap-[24px]">
      <h1 className="text-custom-green text-2xl mt-12 font-bold">
        Boardgame night
      </h1>

      <h2 className="text-[#8F8E8E] my-[32px]">Dates</h2>
      <div className="flex flex-col gap-8 w-full md:w-[400px]">
        <Link
          href="/date"
          className="bg-[#ECECEC] w-full h-[48px] rounded-lg flex justify-center items-center hover:bg-[#e0e0e0]"
        >
          <span>04.08.2024</span>
        </Link>
        <Link
          href="/date"
          className="bg-[#CECECE] w-full h-[48px] rounded-lg flex justify-center items-center hover:bg-[#d6d6d6]"
        >
          <span>16.08.2024</span>
        </Link>
      </div>
    </main>
  )
}
