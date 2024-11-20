import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/db"
import DashboardPage from "@/components/DashboardPage"
import DashboardPageContent from "@/app/dashboard/DashboardPageContent"
import CreateEventCategoryModal from "@/components/CreateEventCategoryModal"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { createCheckoutSession } from "@/lib/stripe"
import { PaymentSuccessModal } from "@/components/PaymentSuccessModal"

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}
const page = async ({ searchParams }: PageProps) => {
  const auth = await currentUser()

  if (!auth) redirect("/sign-in")

  const user = await db.user.findUnique({
    where: {
      externalId: auth.id,
    },
  })
  if (!user) redirect("/sign-in")

  const resolvedParams = await searchParams
  const intent = resolvedParams.intent
  if (intent === "upgrade") {
    const session = await createCheckoutSession({
      userEmail: user.email,
      userId: user.id,
    })
    if (session.url) redirect(session.url)
  }
  const success = resolvedParams.success

  return (
    <>
      {success && <PaymentSuccessModal />}
      <DashboardPage
        cta={
          <CreateEventCategoryModal>
            <Button className="w-full sm:w-fit">
              {" "}
              <PlusIcon className="size-5 sm:mr-2" />
              <span className="hidden sm:block">Add Category </span>
            </Button>
          </CreateEventCategoryModal>
        }
        title="Dashboard"
      >
        <DashboardPageContent />
      </DashboardPage>
    </>
  )
}

export default page
