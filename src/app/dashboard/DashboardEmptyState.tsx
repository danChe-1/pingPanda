import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/client"
import Card from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CreateEventCategoryModal from "@/components/CreateEventCategoryModal"

const DashboardEmptyState = () => {
  const queryClient = useQueryClient()

  const { mutate: insertQuickStartCategories, isPending } = useMutation({
    mutationFn: async () => {
      await client.category.insertQuickStartCategories.$post()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-event-categories"] })
    },
  })

  return (
    <Card className="flex flex-1 flex-col items-center justify-center rounded-2xl p-6 text-center">
      <div className="flex w-full justify-center">
        <img
          src="/brand-asset-wave.png"
          alt="no categories"
          className="-mt-24 size-48"
        />
      </div>
      <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
        No Event Categories yet
      </h1>
      <p className="mb-8 mt-2 max-w-prose text-sm/6 text-gray-600">
        Start tracking events by creating your first category
      </p>

      <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Button
          variant="outline"
          className="flex w-full items-center space-x-2 sm:w-auto"
          onClick={() => insertQuickStartCategories()}
          disabled={isPending}
        >
          <span>🚀</span>
          <span>{isPending ? "Creating..." : "Quickstart"}</span>
        </Button>
        <CreateEventCategoryModal containerClassName="w-full sm:w-auto">
          <Button className="flex w-full items-center space-x-2 sm:w-auto">
            <span>Add Category</span>
          </Button>
        </CreateEventCategoryModal>
      </div>
    </Card>
  )
}

export default DashboardEmptyState
