import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="w-full mdh-full flex flex-col justify-center items-center p-4">
          <div className="w-full md:w-[400px] mdh-full flex flex-col justify-center items-center gap-[24px]">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}