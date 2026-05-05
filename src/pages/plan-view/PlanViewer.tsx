import { useParams, useNavigate } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import type { PlanDay } from "@/types/plan"
import { Calendar } from "@/components/ui/atom/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/atom/popover"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"
import { useState } from "react"
import { PlanViewerSkeleton } from "./micro-components/loader"
import { TaskSection } from "./micro-components/TaskContent"
import { ErrorState } from "./micro-components/Error"
import Footer from "@/components/ui/molecules/footer"

export const fetchPlanDay = async (
  planId: string,
  date?: string
): Promise<PlanDay> => {
  const { data } = await api.get<PlanDay>(`/api/v1/plans/${planId}/daily`, {
    params: date ? { date } : undefined,
  })
  return data
}

export function PlanViewer() {
  const { planId, date } = useParams<{ planId: string; date?: string }>()
  const navigate = useNavigate()
  const { data, isLoading, error } = useQuery<PlanDay>({
    queryKey: ["planDay", planId, date],
    queryFn: () => fetchPlanDay(planId!, date),
    enabled: !!planId,
    retry: false,
    refetchOnWindowFocus: false,
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [openTaskId, setOpenTaskId] = useState<string | null | undefined>()

  const resolvedDate = date ?? data?.date
  const currentDate = resolvedDate ? parseISO(resolvedDate) : new Date()
  const formattedDate = format(currentDate, "MMMM d, yyyy")

  function navigateToDate(newDate: string) {
    navigate(`/${planId}/${newDate}`)
  }

  const sortedTasks = data
    ? [...data.tasks].sort((a, b) => a.display_order - b.display_order)
    : []

  const activeTaskId = openTaskId === undefined ? sortedTasks[0]?.id ?? null : openTaskId
  return (
    <main className="min-h-svh w-full bg-[#FAFAFA]">
      <div className="mx-auto max-w-[720px] px-5 py-10 sm:px-8 sm:py-16">
        <header className="mb-12 p-2 sticky top-0 bg-[#FAFAFA] flex flex-col gap-8 after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-8 after:bg-linear-to-b after:from-[#FAFAFA] after:to-transparent">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              {isLoading ? (
                <>
                  <div className="h-8 w-56 animate-pulse rounded-md bg-[#ECECEC]" />
                  <div className="h-4 w-24 animate-pulse rounded-md bg-[#ECECEC]" />
                </>
              ) : data ? (
                <>
                  <h1 className="font-serif text-3xl text-[#3D3D3A]">
                    {/* {data.plan_title} */} Road to Tipitaka Chanting 2026
                  </h1>
                  <p className="text-sm tabular-nums text-[#9a9a9a]">
                    Day {data.day_number} - 200
                    {/* {data.total_days} */}
                  </p>
                </>
              ) : null}
            </div>
            {!error && data && (
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-[#ECECEC] bg-white px-4 py-2 text-sm text-[#1a1a1a] transition-colors hover:bg-[#F2F2F2]">
                    <span className="tabular-nums">{formattedDate}</span>
                    <ChevronDownIcon className="size-3.5 text-[#9a9a9a] transition-transform group-data-[state=open]:rotate-180" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto rounded-2xl border-[#ECECEC] p-0 shadow-sm"
                  align="end"
                >
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
            )}
          </div>
        </header>
        {data && (
          <section className="mb-10 text-center">
            <h1 className="font-serif text-2xl text-[#3D3D3A]">
              Days 1-6: The Matrix
            </h1>
            {/* <p className="text-sm text-[#3D3D3A]">
              Day {data.day_number} - {data.total_days}
            </p> */}
          </section>
        )}
        {isLoading ? (
          <PlanViewerSkeleton />
        ) : error ? (
          <ErrorState error={error} />
        ) : data ? (
          <div className="space-y-4">
            {sortedTasks.map((task, idx) => (
              <TaskSection
                key={task.id}
                task={task}
                index={idx + 1}
                isOpen={activeTaskId === task.id}
                onToggle={() =>
                  setOpenTaskId(activeTaskId === task.id ? null : task.id)
                }
              />
            ))}
          </div>
        ) : null}

        {data && (data.previous_date || data.next_date) && (
          <>
            <div className="mt-16 h-px w-full bg-[#ECECEC]" />
            <nav className="mt-6 flex items-center justify-between gap-3">
              {data.previous_date ? (
                <button
                  onClick={() => navigateToDate(data.previous_date!)}
                  className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-[#707070] transition-colors hover:bg-white hover:text-[#1a1a1a]"
                >
                  <ChevronLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-[11px] uppercase tracking-wider text-[#9a9a9a]">
                      Previous
                    </span>
                    <span className="tabular-nums">
                      {format(parseISO(data.previous_date), "MMM d")}
                    </span>
                  </span>
                </button>
              ) : (
                <div />
              )}
              {data.next_date ? (
                <button
                  onClick={() => navigateToDate(data.next_date!)}
                  className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-[#707070] transition-colors hover:bg-white hover:text-[#1a1a1a]"
                >
                  <span className="flex flex-col items-end leading-tight">
                    <span className="text-[11px] uppercase tracking-wider text-[#9a9a9a]">
                      Next
                    </span>
                    <span className="tabular-nums">
                      {format(parseISO(data.next_date), "MMM d")}
                    </span>
                  </span>
                  <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : (
                <div />
              )}
            </nav>
          </>
        )}
      </div>

      <Footer />
    </main>
  )
}
