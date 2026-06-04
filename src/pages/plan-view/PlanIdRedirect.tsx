import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPlanDay } from '@/client_details/get_details'
import { LANG_QUERY_PARAM, parseAppLocale } from '@/i18n/locale-utils'
import { PlanViewer } from '@/pages/plan-view/PlanViewer'
import { PlanViewerSkeleton } from '@/pages/plan-view/micro-components/loader'
import { ErrorState } from '@/pages/plan-view/micro-components/Error'

export function PlanIdRedirect() {
  const { planId } = useParams<{ planId: string }>()
  const [searchParams] = useSearchParams()
  const date = searchParams.get('date') ?? undefined
  const language = parseAppLocale(searchParams.get(LANG_QUERY_PARAM)) ?? 'en'

  const { data, isLoading, error } = useQuery({
    queryKey: ['planDay', planId, date, language],
    queryFn: () => getPlanDay(planId, date, language),
    enabled: !!planId,
    retry: false,
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return (
      <main className="mx-auto max-w-[720px] px-5 pt-10 sm:px-8 sm:py-16">
        <PlanViewerSkeleton />
      </main>
    )
  }

  if (error) {
    return <ErrorState error={error} />
  }

  const seriesId = data?.series?.id
  if (seriesId) {
    const query = searchParams.toString()
    const to = query
      ? `/series/${seriesId}/plan-day?${query}`
      : `/series/${seriesId}/plan-day`
    return <Navigate to={to} replace />
  }

  return <PlanViewer />
}
