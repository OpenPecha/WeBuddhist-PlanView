import { useParams, useNavigate } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import type { PlanDay } from "@/types/plan"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"
import { useState } from "react"
import { PlanViewerSkeleton } from "./micro-components/loader"
import { TaskSection } from "./micro-components/TaskContent"
import { ErrorState } from "./micro-components/Error"

export const fetchPlanDay = async (
  planId: string,
  date: string
): Promise<PlanDay> => {
  const { data } = await api.get<PlanDay>(`/api/v1/plans/${planId}/${date}`)
  return data
}

export function PlanViewer() {
  const { planId, date } = useParams<{ planId: string; date: string }>()
  const navigate = useNavigate()
  const {
    data,
    isLoading,
    error,
  } = useQuery<PlanDay>({
    queryKey: ["planDay", planId, date],
    queryFn: () => fetchPlanDay(planId!, date!),
    enabled: !!planId && !!date,
    refetchOnWindowFocus: false,
  })
  const [calendarOpen, setCalendarOpen] = useState(false)

  const currentDate = date ? parseISO(date) : new Date()
  const formattedDate = format(currentDate, "MMMM d")

  function navigateToDate(newDate: string) {
    navigate(`/${planId}/${newDate}`)
  }

  const sortedTasks = data
    ? [...data.tasks].sort((a, b) => a.display_order - b.display_order)
    : []

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-32" />
            </>
          ) : data ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {data.plan_title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Day {data.day_number} of {data.total_days}
              </p>
            </>
          ) : null}
        </div>

        {/* Calendar Popover */}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              {formattedDate}
              <ChevronDownIcon className="size-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={currentDate}
              defaultMonth={currentDate}
              disabled={(d) => {
                if (!data) return false
                const start = parseISO(data.start_date)
                const end = parseISO(data.end_date)
                return d < start || d > end
              }}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  navigateToDate(format(selectedDate, "yyyy-MM-dd"))
                  setCalendarOpen(false)
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </header>

      {/* Divider */}
      <div className="mb-8 h-px bg-border/50" />

      {/* Content */}
      {isLoading ? (
        <PlanViewerSkeleton />
      ) : error ? (
        <ErrorState error={error} />
      ) : data ? (
        <div className="space-y-10">
          {sortedTasks.map((task) => (
            <TaskSection key={task.id} task={task} />
          ))}
        </div>
      ) : null}

      {/* Divider */}
      <div className="mt-10 h-px bg-border/50" />

      {/* Bottom Navigation */}
      <nav className="mt-6 flex items-center justify-between">
        {data?.previous_date ? (
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => navigateToDate(data.previous_date!)}
          >
            <ChevronLeftIcon className="size-4" />
            {format(parseISO(data.previous_date), "MMM d")}
          </Button>
        ) : (
          <div />
        )}
        {data?.next_date ? (
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => navigateToDate(data.next_date!)}
          >
            {format(parseISO(data.next_date), "MMM d")}
            <ChevronRightIcon className="size-4" />
          </Button>
        ) : (
          <div />
        )}
      </nav>
    </div>
  )
}
