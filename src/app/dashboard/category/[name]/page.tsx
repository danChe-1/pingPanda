import { notFound } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/db"
import DashboardPage from "@/components/DashboardPage"
import CategoryPageContent from "@/app/dashboard/category/[name]/CategoryPageContent"

type PageProps = Promise<{
  name: string | string[] | undefined
}>
const CategoryPage = async (props: { params: PageProps }) => {
  const params = await props.params
  const name = params.name
  if (typeof name !== "string") notFound()

  const auth = await currentUser()
  if (!auth) return notFound()

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })
  if (!user) return notFound()

  const category = await db.eventCategory.findUnique({
    where: {
      name_userId: {
        name,
        userId: user.id,
      },
    },
    include: {
      _count: {
        select: {
          events: true,
        },
      },
    },
  })

  if (!category) return notFound()

  const hasEvents = category._count.events > 0

  return (
    <DashboardPage title={`${category.emoji} ${category.name} events`}>
      <CategoryPageContent category={category} hasEvents={hasEvents} />
    </DashboardPage>
  )
}

export default CategoryPage
