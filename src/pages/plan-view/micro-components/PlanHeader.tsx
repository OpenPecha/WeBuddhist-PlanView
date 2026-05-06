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

  return (
    <header className="sm:mb-12 mb-4 z-60 sm:sticky sm:top-0 flex flex-col gap-8 bg-[#FAFAFA] p-2 after:pointer-events-none sm:after:absolute sm:after:inset-x-0 sm:after:top-full sm:after:h-8 sm:after:bg-linear-to-b sm:after:from-[#FAFAFA] sm:after:to-transparent">
      <div>
        <div className="min-w-0">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-8 w-56 animate-pulse rounded-md bg-[#ECECEC]" />
              <div className="h-4 w-24 animate-pulse rounded-md bg-[#ECECEC]" />
            </div>
          ) : data ? (
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2 sm:gap-x-4">
              <h1 className="col-span-2 col-start-1 row-start-1 font-serif text-2xl leading-tight text-[#3D3D3A] sm:col-span-1 sm:text-3xl">
                {data.series?.name.en}
              </h1>
              <p className="col-start-1 row-start-2 text-sm tabular-nums text-[#9a9a9a]">
                Day {data.day_number}
              </p>
              {!hasError && (
                <div className="col-start-2 row-start-2 self-center sm:row-start-1">
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <button className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#ECECEC] bg-white px-3 py-1.5 text-xs text-[#1a1a1a] transition-colors hover:bg-[#F2F2F2] sm:px-4 sm:py-2 sm:text-sm">
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
      </div>
    </header>
  )
}
