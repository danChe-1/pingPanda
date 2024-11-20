"use client"
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Heading } from "@/components/Heading"
import { useRouter } from "next/navigation"

interface DashboardPageProps {
  title: string
  children?: ReactNode
  hideBackButton?: boolean
  cta?: ReactNode
}
const DashboardPage = ({
  cta,
  hideBackButton,
  children,
  title,
}: DashboardPageProps) => {
  const router = useRouter()
  return (
    <section className="flex h-full w-full flex-1 flex-col">
      <div className="flex justify-between border-b border-gray-200 p-6 sm:p-8">
        <div className="flex w-full justify-between gap-x-8 gap-y-2 sm:flex-row sm:items-center sm:justify-start">
          {!hideBackButton && (
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-white"
              variant="outline"
            >
              <ArrowLeft className="size-4" />
            </Button>
          )}
          <Heading>{title}</Heading>
          {cta && <div>{cta}</div>}
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:p-8">
        {children}
      </div>
    </section>
  )
}

export default DashboardPage
