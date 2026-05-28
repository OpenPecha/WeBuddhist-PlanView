import { Button } from "@/components/ui/atom/button"
import { format, parseISO } from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useDateLocale } from "@/i18n/use-date-locale"

interface PlanFooterNavProps {
  previousDate: string | null
  nextDate: string | null
  onNavigateToDate: (date: string) => void
}

export function PlanFooterNav({
  previousDate,
  nextDate,
  onNavigateToDate,
}: PlanFooterNavProps) {
  const dateLocale = useDateLocale()
  if (!previousDate && !nextDate) return null

  return (
    <>
      <div className="mt-8 h-px w-full bg-[#ECECEC]" />
      <nav className="mt-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {previousDate && (
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => onNavigateToDate(previousDate)}
            >
              <ChevronLeftIcon className="size-4" />
              {format(parseISO(previousDate), "MMM d", { locale: dateLocale })}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {nextDate && (
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => onNavigateToDate(nextDate)}
            >
              {format(parseISO(nextDate), "MMM d", { locale: dateLocale })}
              <ChevronRightIcon className="size-4" />
            </Button>
          )}
        </div>
      </nav>
    </>
  )
}
