import { useState } from "react"
import { differenceInCalendarDays, format, parseISO } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { ChevronDownIcon } from "lucide-react"
import type { PlanDay } from "@/types/plan"
import { Calendar } from "@/components/ui/atom/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/atom/popover"
import { Progress } from "@/components/ui/atom/progress"
import api from "@/lib/api"
import ShareButton from "./ShareButton"
import { Button } from "@/components/ui/atom/button"

interface PlanHeaderProps {
  data?: PlanDay
  date?: string
  hasError: boolean
  isLoading: boolean
  onNavigateToDate: (date: string) => void
}

interface SeriesPlanSummary {
  id: string
  display_order: number
  start_date: string
  total_days: number
}

interface Series {
  id: string
  total_days: number
  plans: SeriesPlanSummary[]
}

export const fetchSeriesById = async (seriesId: string): Promise<Series> => {
  const { data } = await api.get<Series>(`/api/v1/cms/series/${seriesId}`)
  return data
}

export function PlanHeader({
  data,
  date,
  hasError,
  isLoading,
  onNavigateToDate,
}: PlanHeaderProps) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const resolvedDate = date ?? data?.date
  const currentDate = resolvedDate ? parseISO(resolvedDate) : new Date()
  const formattedDate = format(currentDate, "MMMM d, yyyy")

  const seriesId = data?.series?.id
  const { data: series } = useQuery({
    queryKey: ["series", seriesId],
    queryFn: () => fetchSeriesById(seriesId!),
    enabled: !!seriesId,
    refetchOnWindowFocus: false,
  })

  const seriesProgress = (() => {
    if (!series?.plans?.length || !series.total_days) return null
    const firstPlan = [...series.plans].sort(
      (a, b) => a.display_order - b.display_order,
    )[0]
    const start = parseISO(firstPlan.start_date)
    const totalDays = series.total_days
    const currentDay = Math.min(
      Math.max(differenceInCalendarDays(currentDate, start) + 1, 0),
      totalDays,
    )
    const percent = (currentDay / totalDays) * 100
    return { currentDay, totalDays, percent }
  })()


  return (
    <header className="sm:mb-12 mb-4 flex flex-col gap-8 p-2">
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-8 w-56 animate-pulse rounded-md bg-[#ECECEC]" />
              <div className="h-4 w-24 animate-pulse rounded-md bg-[#ECECEC]" />
            </div>
          ) : data ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
              <div className="flex items-center min-w-0">
                <ShareButton />
                <h1 className="font-serif text-xl leading-tight text-[#3D3D3A] sm:text-2xl lg:text-3xl">
                  {data.series?.name.en}
                </h1>
              </div>
              {!hasError && (
                <div className="flex justify-end sm:justify-start">
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="group shrink-0">
                        <span className="tabular-nums text-sm">
                          <span className="hidden sm:inline">{formattedDate}</span>
                          <span className="sm:hidden">{format(currentDate, "MMM d, yyyy")}</span>
                        </span>
                        <ChevronDownIcon className="size-3.5 transition-transform group-data-[state=open]:rotate-180" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto rounded-2xl border-[#ECECEC] p-0 shadow-sm"
                      align="end"
                      side="bottom"
                      sideOffset={8}
                    >
                      <Calendar
                        mode="single"
                        selected={currentDate}
                        defaultMonth={currentDate}
                        disabled={(day) => {
                          const start = parseISO(data.start_date)
                          const end = parseISO(data.end_date)
                          return day < start || day > end
                        }}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            onNavigateToDate(format(selectedDate, "yyyy-MM-dd"))
                            setCalendarOpen(false)
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          ) : null}
        </div>
        {seriesProgress && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs tabular-nums text-[#9a9a9a]">
              <span>
                Day {seriesProgress.currentDay} of {seriesProgress.totalDays}
              </span>
              <span>{Math.round(seriesProgress.percent)}%</span>
            </div>
            <Progress value={seriesProgress.percent} />
          </div>
        )}
      </div>
    </header>
  )
}
