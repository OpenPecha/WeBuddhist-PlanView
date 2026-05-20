import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { isMobile } from 'react-device-detect'
import type { PlanDay } from '@/types/plan'
import { getPlanDay } from '@/client_details/get_details'
import { useImageURLWithFallback } from '@/client_details/hooks'
import { fetchSeriesById } from '@/pages/plan-view/micro-components/hooks/useSeriesData'
import { getActivePlanForDate } from '@/lib/series-utils'
import { PlanViewerSkeleton } from '@/pages/plan-view/micro-components/loader'
import { TaskSection } from '@/pages/plan-view/micro-components/TaskContent'
import { ErrorState } from '@/pages/plan-view/micro-components/Error'
import Footer from '@/components/ui/molecules/footer'
import { Accordion } from '@/components/ui/atom/accordion'
import { PlanHeader } from '@/pages/plan-view/micro-components/PlanHeader'
import { PlanFooterNav } from '@/pages/plan-view/micro-components/PlanFooterNav'
import AudioPlayer from '@/pages/plan-view/micro-components/AudioPlayer'
import { AudioPlayerProvider } from '@/pages/plan-view/micro-components/AudioPlayerContext'

function PlanDayView() {
  const { seriesId } = useParams<{ seriesId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const imageURL = useImageURLWithFallback()

  const date =
    searchParams.get('date') ?? format(new Date(), 'yyyy-MM-dd')

  const {
    data: series,
    isLoading: isSeriesLoading,
    error: seriesError,
  } = useQuery({
    queryKey: ['series', seriesId],
    queryFn: () => fetchSeriesById(seriesId!),
    enabled: !!seriesId,
    refetchOnWindowFocus: false,
  })
  const activePlan =
    series?.plans?.length
      ? getActivePlanForDate(series.plans, new Date(date))
      : undefined

  const {
    data,
    isLoading: isPlanLoading,
    error: planError,
  } = useQuery<PlanDay>({
    queryKey: ['planDay', activePlan?.id, date, seriesId],
    queryFn: () => getPlanDay(activePlan!.id, date),
    enabled: !!activePlan?.id,
    retry: false,
    refetchOnWindowFocus: false,
  })
  const isLoading = isSeriesLoading || isPlanLoading
  const error = seriesError ?? planError

  function navigateToDate(newDate: string) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSearchParams((prev) => {
      prev.set('date', newDate)
      return prev
    })
  }

  const sortedTasks = data
    ? [...data.tasks].sort((a, b) => a.display_order - b.display_order)
    : []
  const firstTaskId = sortedTasks[0]?.id
  const accordionProps = isMobile
    ? { type: 'multiple' as const, defaultValue: firstTaskId ? [firstTaskId] : [] }
    : { type: 'single' as const, defaultValue: firstTaskId, collapsible: true }

  if (!isLoading && series && !activePlan) {
    return (
      <main className="mx-auto max-w-[720px] px-5 py-16 text-center">
        <p className="text-muted-foreground">No plans found in this series.</p>
      </main>
    )
  }
  return (
    <AudioPlayerProvider seriesId={seriesId}>
      <main className="h-[calc(100dvh - 150px)] overflow-y-auto w-full">
        <div className="mx-auto max-w-[720px] px-5 pt-10 pb-2 sm:px-8 sm:py-16">
          <PlanHeader
            data={data}
            date={date}
            hasError={!!error}
            isLoading={isLoading}
            onNavigateToDate={navigateToDate}
          />

          {data && (
            <section className="mb-10 space-y-4 text-center">
              <div className="w-full md:h-80 h-48 overflow-hidden rounded-lg">
                <img
                  src={imageURL ?? undefined}
                  alt={data.plan_title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex flex-col items-center">
                <h1 className="font-serif text-2xl text-[#3D3D3A]">
                  {data.plan_description}
                </h1>
                <p className="text-sm text-[#9a9a9a]">{data.plan_title}</p>
              </div>
            </section>
          )}

          {isLoading && <PlanViewerSkeleton />}
          {error && <ErrorState error={error} />}

          {data && (
            <Accordion
              key={data.date}
              className="space-y-4"
              {...accordionProps}
            >
              {sortedTasks.map((task, idx) => (
                <TaskSection key={task.id} task={task} index={idx + 1} />
              ))}
            </Accordion>
          )}

          {data && (
            <PlanFooterNav
              previousDate={data.previous_date}
              nextDate={data.next_date}
              previousPlanId={data.previous_plan_id}
              nextPlanId={data.next_plan_id}
              onNavigateToDate={navigateToDate}
              onNavigateToPlan={(planId) => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                navigate(`/${planId}?date=${date}`)
              }}
            />
          )}
        </div>

        <Footer />
        <div className="fixed bottom-0 left-0 right-0">
          <AudioPlayer
            imageUrl={data?.image?.original}
            description={data?.plan_description}
          />
        </div>
      </main>
    </AudioPlayerProvider>
  )
}

export default PlanDayView
