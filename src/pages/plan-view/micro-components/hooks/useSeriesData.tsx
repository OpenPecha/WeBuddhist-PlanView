import { useSearchParams } from 'react-router-dom'
import { differenceInCalendarDays, parseISO } from "date-fns"
import api from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import type { SeriesDetail } from '@/types/series'
import { getSeriesAnchorPlan } from '@/lib/series-utils'

export const fetchSeriesById = async (seriesId: string): Promise<SeriesDetail> => {
    const { data } = await api.get<SeriesDetail>(`/api/v1/series/${seriesId}`)
    return data
  }
  

function useSeriesData(seriesId: string | undefined) {
  const [params] = useSearchParams();

  const { data: series } = useQuery({
    queryKey: ["series", seriesId],
    queryFn: () => fetchSeriesById(seriesId!),
    enabled: !!seriesId,    
    refetchOnWindowFocus: false,
  })

  const date = params.get('date') ?? new Date().toISOString().slice(0, 10)
  const currentDate = date ? parseISO(date) : new Date()

  if (!series?.plans?.length || !series.total_days) {
    return null
  }

  const firstPlan = getSeriesAnchorPlan(series.plans)
  if (!firstPlan) return null

  const start = parseISO(firstPlan.start_date)
  const totalDays = series.total_days
  const currentDay = Math.min(
    Math.max(differenceInCalendarDays(currentDate, start) + 1, 0),
    totalDays,
  )
  const percent = (currentDay / totalDays) * 100

  return { currentDay, totalDays, percent }
}

export default useSeriesData
