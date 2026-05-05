import { format, parseISO } from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface PlanPaginationProps {
  nextDate: string | null
  previousDate: string | null
  onNavigateToDate: (date: string) => void
}

export function PlanPagination({
  nextDate,
  previousDate,
  onNavigateToDate,
}: PlanPaginationProps) {
  if (!previousDate && !nextDate) return null

  return (
    <>
      <div className="mt-16 h-px w-full bg-[#ECECEC]" />
      <nav className="mt-6 flex items-center justify-between gap-3">
        {previousDate ? (
          <button
            onClick={() => onNavigateToDate(previousDate)}
            className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-[#707070] transition-colors hover:bg-white hover:text-[#1a1a1a]"
          >
            <ChevronLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[11px] uppercase tracking-wider text-[#9a9a9a]">
                Previous
              </span>
              <span className="tabular-nums">
                {format(parseISO(previousDate), "MMM d")}
              </span>
            </span>
          </button>
        ) : (
          <div />
        )}
        {nextDate ? (
          <button
            onClick={() => onNavigateToDate(nextDate)}
            className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-[#707070] transition-colors hover:bg-white hover:text-[#1a1a1a]"
          >
            <span className="flex flex-col items-end leading-tight">
              <span className="text-[11px] uppercase tracking-wider text-[#9a9a9a]">
                Next
              </span>
              <span className="tabular-nums">
                {format(parseISO(nextDate), "MMM d")}
              </span>
            </span>
            <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        ) : (
          <div />
        )}
      </nav>
    </>
  )
}
