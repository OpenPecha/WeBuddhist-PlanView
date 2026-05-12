import { Button } from "@/components/ui/atom/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface PlanNavigationProps {
  nextPlanId: string | null
  previousPlanId: string | null
  onNavigateToPlan: (planId: string) => void
}

export function PlanNavigation({
  nextPlanId,
  previousPlanId,
  onNavigateToPlan,
}: PlanNavigationProps) {
  if (!previousPlanId && !nextPlanId) return null

  return (
    <>
      <div className="mt-6 h-px w-full bg-[#ECECEC]" />
      <nav className="mt-6 flex items-center justify-between gap-3">
        {previousPlanId ? (
          <Button
            onClick={() => onNavigateToPlan(previousPlanId)}
            variant="outline"
            className="cursor-pointer"
          >
            <ChevronLeftIcon className="size-4" />
            <span className="flex flex-col items-start leading-tight">
              Previous Plan
            </span>
          </Button>
        ) : (
          <div />
        )}
        {nextPlanId ? (
          <Button
            onClick={() => onNavigateToPlan(nextPlanId)}
            variant="outline"
            className="cursor-pointer"
          >
            <span className="flex flex-col items-end leading-tight">
              Next Plan
            </span>
            <ChevronRightIcon className="size-4" />
          </Button>
        ) : (
          <div />
        )}
      </nav >
    </>
  )
}
