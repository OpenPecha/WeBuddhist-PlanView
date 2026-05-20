import { addDays, isBefore, parseISO, startOfDay } from 'date-fns'
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
