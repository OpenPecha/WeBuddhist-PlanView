import { useState } from "react"
import { format, parseISO } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import type { PlanDay } from "@/types/plan"
import { Calendar } from "@/components/ui/atom/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/atom/popover"
import { Progress } from "@/components/ui/atom/progress"
// import ShareButton from "./ShareButton"
import { Button } from "@/components/ui/atom/button"
import InfoModal from "@/components/ui/molecules/modal/InfoModal"
import useSeriesData from "./hooks/useSeriesData"

interface PlanHeaderProps {
  data?: PlanDay
  date?: string
  hasError: boolean
  isLoading: boolean
  onNavigateToDate: (date: string) => void
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
  const seriesProgress = useSeriesData(seriesId)
  const title=data?.series?.metadata.at(0).title
  const description=data?.series?.metadata.at(0).description
  const fakeTotalDays = 200
  return (
    <header className="sm:mb-12 mb-4 flex flex-col gap-8 p-2">
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          <div className="text-[43px] font-[Lato] font-bold text-[#3D3D3A] text-center pb-20">{title}</div>

          {isLoading && (
            <div className="space-y-2">
              <div className="h-8 w-56 animate-pulse rounded-md bg-[#ECECEC]" />
              <div className="h-4 w-24 animate-pulse rounded-md bg-[#ECECEC]" />
            </div>
          )}
          {data && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
              <div className="flex items-center min-w-0">
                <h1 className="font-serif text-xl leading-tight text-[#3D3D3A] sm:text-2xl lg:text-3xl">
                  <span className="flex flex-col gap-1 font-[lato]">
                    {description}
                  </span>
                </h1>
              </div>
              {!hasError && (
                <div className="flex justify-end sm:justify-start">
                  {/* <ShareButton /> */}

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
          )}
        </div>
        {seriesProgress && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 justify-between text-xs tabular-nums text-[#9a9a9a]">
              <div className='flex-1'>
                <div className="flex items-center justify-between">
                <span>
                  Day {seriesProgress.currentDay} of {fakeTotalDays}
                </span>
                <span>{Math.round(seriesProgress.percent)}%</span>
                 </div>
               <Progress value={seriesProgress.percent} />
              </div>
              <div className="w-max">
                <InfoModal />
              </div>
              </div>

          </div>
        )}

      </div>
    </header>
  )
}
