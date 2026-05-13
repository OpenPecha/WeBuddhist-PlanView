import { Button } from "@/components/ui/atom/button"
import { format, parseISO } from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface PlanFooterNavProps {
  previousDate: string | null
  nextDate: string | null
  previousPlanId: string | null
  nextPlanId: string | null
  onNavigateToDate: (date: string) => void
  onNavigateToPlan: (planId: string) => void
}

export function PlanFooterNav({
  previousDate,
  nextDate,
  previousPlanId,
  nextPlanId,
  onNavigateToDate,
  onNavigateToPlan,
}: PlanFooterNavProps) {
  if (!previousDate && !nextDate && !previousPlanId && !nextPlanId) return null

  const hasDates = previousDate || nextDate

  return (
    <>
      <div className="mt-8 h-px w-full bg-[#ECECEC]" />
      <nav className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {previousPlanId && (
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onNavigateToPlan(previousPlanId)}
          >
            <ChevronLeftIcon className="size-4" />
            <span className="flex flex-col items-start leading-tight">
              Previous Plan
            </span>
          </Button>
        )}

        {hasDates && (
          <div className="flex items-center gap-3">
            {previousDate && (
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => onNavigateToDate(previousDate)}
              >
                <ChevronLeftIcon className="size-4" />
                {format(parseISO(previousDate), "MMM d")}
              </Button>
            )}
            {nextDate && (
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => onNavigateToDate(nextDate)}
              >
                {format(parseISO(nextDate), "MMM d")}
                <ChevronRightIcon className="size-4" />
              </Button>
            )}
          </div>
        )}

        {nextPlanId && (
          <Button
            variant="outline"
            className="ml-auto cursor-pointer"
            onClick={() => onNavigateToPlan(nextPlanId)}
          >
            <span className="flex flex-col items-end leading-tight">
              Next Plan
            </span>
            <ChevronRightIcon className="size-4" />
          </Button>
        )}
      </nav>
    </>
  )
}
