import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Boardgame night 🥳",
  description: "A boardgame night event planner for friends",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Script
        defer
        src="https://cloud.umami.is/script.js"
        strategy="lazyOnload"
        data-website-id="bccbde04-2405-429c-be9e-28b39d51cd5e"
      />
      <body className={inter.className}>
        <main className="w-full  flex h-dvh flex-col items-center p-4">
          <div className="w-full md:w-[400px] h-full flex flex-col items-center gap-[24px]">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
