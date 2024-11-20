"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/client"
import LoadingSpinner from "@/components/LoadingSpinner"
import { format, formatDistanceToNow } from "date-fns"
import { ArrowRight, BarChart2, Clock, Database, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { useState } from "react"
import { Modal } from "@/components/Modal"
import DashboardEmptyState from "@/app/dashboard/DashboardEmptyState"

const DashboardPageContent = () => {
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const { data: categories, isPending: isEventCategoriesLoading } = useQuery({
    queryKey: ["user-event-categories"],
    queryFn: async () => {
      const res = await client.category.getEventCategories.$get()
      const { categories } = await res.json()
      return categories
    },
  })
  const { mutate: deleteCategory, isPending: isDeletingCategory } = useMutation(
    {
      mutationFn: async (name: string) => {
        await client.category.deleteCategory.$post({ name })
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user-event-categories"] })
        setDeletingCategory(null)
      },
    }
  )
  if (isEventCategoriesLoading) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }
  if (!categories || categories.length === 0) return <DashboardEmptyState />
  return (
    <>
      <ul className="grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <li
            className="group relative z-10 transition-all duration-200 hover:-translate-y-0.5"
            key={category.id}
          >
            <div className="absolute inset-px z-0 rounded-lg bg-white" />
            <div className="pointer-events-none absolute inset-px z-0 rounded-lg shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:shadow-md" />
            <div className="relative z-10 p-6">
              <div className="mb-6 flex items-center gap-4">
                <div
                  className="size-12 rounded-full"
                  style={{
                    backgroundColor: category.color
                      ? `#${category.color.toString(16).padStart(6, "0")}`
                      : "#f3f4f6",
                  }}
                />
                <div>
                  <h3 className="text-lg/7 font-medium tracking-tight text-gray-950">
                    {category.emoji || "📁"}
                    {category.name}
                  </h3>
                  <p className="text-sm/6 text-gray-600">
                    {format(category.createdAt, "d MMM, yyyy")}
                  </p>
                </div>
              </div>
              <div className="mb-6 space-y-3">
                <div className="flex items-center text-sm/5 text-gray-600">
                  <Clock className="mr-2 size-4 text-brand-500" />
                  <span className="font-medium">Last Ping: </span>
                  <span className="ml-1">
                    {category.lastPing
                      ? formatDistanceToNow(category.lastPing) + " ago"
                      : "Never"}
                  </span>
                </div>
                <div className="flex items-center text-sm/5 text-gray-600">
                  <Database className="mr-2 size-4 text-brand-500" />
                  <span className="font-medium">Unique fields: </span>
                  <span className="ml-1">{category.uniqueFieldCount || 0}</span>
                </div>
                <div className="flex items-center text-sm/5 text-gray-600">
                  <BarChart2 className="mr-2 size-4 text-brand-500" />
                  <span className="font-medium">Events this month: </span>
                  <span className="ml-1">{category.eventsCount || 0}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={`/dashboard/category/${category.name}`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "flex items-center gap-2 text-sm",
                  })}
                >
                  View all <ArrowRight className="size-4" />
                </Link>
                <Button
                  onClick={() => setDeletingCategory(category.name)}
                  variant="ghost"
                  size="sm"
                  className="text-gra-500 transition-colors hover:text-red-600"
                  aria-label={`Delete ${category.name} category`}
                >
                  <Trash2 className="size-5" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Modal
        showModal={!!deletingCategory}
        setShowModal={() => setDeletingCategory(null)}
        className="max-w-md p-8"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
              Delete Category
            </h2>
            <p className="text-sm/6 text-gray-600">
              Are you sure you want to delete the category{" "}
              <b> {deletingCategory}</b>? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-3 border-t pt-4">
            <Button variant="outline" onClick={() => setDeletingCategory(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                deletingCategory && deleteCategory(deletingCategory)
              }
              disabled={isDeletingCategory}
              variant="destructive"
            >
              {isDeletingCategory ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default DashboardPageContent
