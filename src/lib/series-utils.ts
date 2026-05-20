import {
  addDays,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
} from 'date-fns'
import type { SeriesListItem, SeriesPlanSummary } from '@/types/series'

/**
 * Localized series header from `metadata[]` (language codes compared case-insensitively),
 * or legacy `name` map with "title -> description" strings.
 */
export function getSeriesTitleAndDescription(
  series: Pick<SeriesListItem, 'metadata' | 'name'>,
  language: string,
): { title: string; description: string } {
  const lang = language.toLowerCase()

  if (series.metadata?.length) {
    const match =
      series.metadata.find((m) => m.language.toLowerCase() === lang) ??
      series.metadata.find((m) => m.language.toLowerCase() === 'en') ??
      series.metadata[0]
    return {
      title: match.title ?? '',
      description: match.description ?? '',
    }
  }

  const name = series.name
  if (name && Object.keys(name).length > 0) {
    const raw =
      name[language] ?? name.en ?? Object.values(name)[0]
    if (!raw) return { title: '', description: '' }
    const [title, description] = raw.split('->').map((part) => part.trim())
    return { title: title || raw, description: description ?? '' }
  }

  return { title: '', description: '' }
}

export function sortSeriesPlans(plans: SeriesPlanSummary[]) {
  return [...plans].sort((a, b) => a.display_order - b.display_order)
}

/**
 * Earliest start and latest inclusive end across every plan in a series
 * (for calendars that should span the whole series, not a single plan).
 */
export function getSeriesInclusiveCalendarRange(
  plans: Pick<SeriesPlanSummary, 'start_date' | 'total_days'>[] | undefined,
): { start: Date; end: Date } | null {
  if (!plans?.length) return null
  let minStart: Date | null = null
  let maxEnd: Date | null = null
  for (const plan of plans) {
    const start = startOfDay(parseISO(plan.start_date))
    const end = startOfDay(addDays(start, plan.total_days - 1))
    if (!minStart || start < minStart) minStart = start
    if (!maxEnd || end > maxEnd) maxEnd = end
  }
  if (!minStart || !maxEnd) return null
  return { start: minStart, end: maxEnd }
}

/**
 * Previous/next calendar day for footer navigation, using the same bounds as
 * {@link getSeriesInclusiveCalendarRange} when `plans` is set; otherwise
 * `fallbackStartIso` / `fallbackEndIso` (single-plan daily payload).
 */
export function getSeriesStepNavDates(
  currentDateIso: string,
  options: {
    plans?: Pick<SeriesPlanSummary, 'start_date' | 'total_days'>[] | undefined
    fallbackStartIso?: string
    fallbackEndIso?: string
  },
): { previousDate: string | null; nextDate: string | null } {
  const fromPlans = getSeriesInclusiveCalendarRange(options.plans)
  const range =
    fromPlans ??
    (options.fallbackStartIso && options.fallbackEndIso
      ? {
          start: startOfDay(parseISO(options.fallbackStartIso)),
          end: startOfDay(parseISO(options.fallbackEndIso)),
        }
      : null)

  if (!range) {
    return { previousDate: null, nextDate: null }
  }

  const current = startOfDay(parseISO(currentDateIso))
  const prevDay = startOfDay(addDays(current, -1))
  const nextDay = startOfDay(addDays(current, 1))

  const previousDate = !isBefore(prevDay, range.start)
    ? format(prevDay, 'yyyy-MM-dd')
    : null
  const nextDate = !isAfter(nextDay, range.end)
    ? format(nextDay, 'yyyy-MM-dd')
    : null

  return { previousDate, nextDate }
}

/** Plan whose [start_date, start_date + total_days) contains the given calendar day. */
export function getActivePlanForDate(
  plans: SeriesPlanSummary[],
  date: Date,
): SeriesPlanSummary | undefined {
  const sorted = sortSeriesPlans(plans)
  if (!sorted.length) return undefined

  const day = startOfDay(date)
  for (const plan of sorted) {
    const start = startOfDay(parseISO(plan.start_date))
    const end = startOfDay(addDays(start, plan.total_days - 1))
    if (day >= start && day <= end) return plan
  }

  const firstStart = startOfDay(parseISO(sorted[0].start_date))
  if (isBefore(day, firstStart)) return sorted[0]

  return sorted.at(-1)
}

export function getSeriesAnchorPlan(plans: SeriesPlanSummary[]) {
  return sortSeriesPlans(plans)[0]
}
