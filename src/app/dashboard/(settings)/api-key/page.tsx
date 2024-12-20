import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/db"
import DashboardPage from "@/components/DashboardPage"
import { ApiKeySettings } from "@/app/dashboard/(settings)/api-key/ApiKeySettings"

const APISettingsPage = async () => {
  const auth = await currentUser()
  if (!auth) redirect("/sign-in")

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })
  if (!user) redirect("/sign-in")
  return (
    <DashboardPage title="API Key">
      <ApiKeySettings apiKey={user.apiKey ?? ""} />
    </DashboardPage>
  )
}

export default APISettingsPage
