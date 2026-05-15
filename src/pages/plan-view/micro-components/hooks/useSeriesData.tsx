import { useSearchParams } from 'react-router-dom'
import { differenceInCalendarDays, parseISO } from "date-fns"
import api from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

interface SeriesPlanSummary {
    id: string
    display_order: number
    start_date: string
    total_days: number
  }
  

interface Series {
    id: string
    total_days: number
    plans: SeriesPlanSummary[]
  }

  
export const fetchSeriesById = async (seriesId: string): Promise<Series> => {
    const { data } = await api.get<Series>(`/api/v1/series/${seriesId}`)
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

  // previously [1], but should be [0] for the first plan
  const firstPlan = [...series.plans].sort(
    (a, b) => a.display_order - b.display_order,
  )[1]

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
