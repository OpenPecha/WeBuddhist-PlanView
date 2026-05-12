import { Button } from "@/components/ui/atom/button"
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
      <div className="mt-8 h-px w-full  bg-[#ECECEC]" />
      <nav className="mt-6 flex items-center justify-between gap-3">
        {previousDate ? (
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onNavigateToDate(previousDate)}
          >
            <ChevronLeftIcon className="size-4" />
            {format(parseISO(previousDate), "MMM d")}
          </Button>
        ) : (
          <div />
        )}
        {nextDate ? (
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onNavigateToDate(nextDate)}
          >
            {format(parseISO(nextDate), "MMM d")}
            <ChevronRightIcon className="size-4" />
          </Button>
        ) : (
          <div />
        )}
      </nav>
    </>
  )
}
