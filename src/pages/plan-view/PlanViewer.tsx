import { useParams, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import type { PlanDay } from "@/types/plan"
import { PlanViewerSkeleton } from "./micro-components/loader"
import { TaskSection } from "./micro-components/TaskContent"
import { ErrorState } from "./micro-components/Error"
import Footer from "@/components/ui/molecules/footer"
import { Accordion } from "@/components/ui/atom/accordion"
import { PlanHeader } from "./micro-components/PlanHeader"
import { PlanFooterNav } from "./micro-components/PlanFooterNav"
import {  getPlanDay } from "@/client_details/get_details"
import { LANG_QUERY_PARAM, parseAppLocale } from '@/i18n/locale-utils'
import { useImageURLWithFallback } from "@/client_details/hooks"
import {  isMobile } from 'react-device-detect';
import AudioPlayer from "./micro-components/AudioPlayer"
import { AudioPlayerProvider } from "./micro-components/AudioPlayerContext"
import { getSeriesStepNavDates } from "@/lib/series-utils"


export function PlanViewer() {
  const [params, setParams] = useSearchParams()
  const { planId } = useParams<{ planId: string; date?: string }>()
  const date = params.get('date') ?? undefined
  const language = parseAppLocale(params.get(LANG_QUERY_PARAM)) ?? 'en'
  const { data, isLoading, error } = useQuery<PlanDay>({
    queryKey: ["planDay", planId, date, language],
    queryFn: () => getPlanDay(planId!, date, language),
    enabled: !!planId,
    retry: false,
    refetchOnWindowFocus: false,
  })
  const imageURL=useImageURLWithFallback()
  function navigateToDate(newDate: string) {
    window.scrollTo({
      top:0,
      behavior:'smooth'
    })
    setParams(prev => {
      prev.set('date', newDate)
      return prev
    }
    )
  }
  const sortedTasks = data
    ? [...data.tasks].sort((a, b) => a.display_order - b.display_order)
    : []
  const firstTaskId = sortedTasks[0]?.id
  const accordionProps = isMobile
    ? { type: "multiple" as const, defaultValue: firstTaskId ? [firstTaskId] : [] }
    : { type: "single" as const, defaultValue: firstTaskId,collapsible: true }

  const footerNavDates =
    data &&
    getSeriesStepNavDates(date ?? data.date, {
      plans:
        data.series?.plans && data.series.plans.length > 0
          ? data.series.plans
          : undefined,
      fallbackStartIso: data.start_date,
      fallbackEndIso: data.end_date,
    })

  return (
    <AudioPlayerProvider seriesId={data?.series?.id}>
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
              <p className="text-sm text-[#9a9a9a]">
                {data.plan_title}
              </p>
            </div>

          </section>
        )}
        {isLoading && (
          <PlanViewerSkeleton />)}
          { error && <ErrorState error={error} />}
        { data && (
          <Accordion
            key={data.date}
            className="space-y-4"
            {...accordionProps}
          >
            {sortedTasks.map((task, idx) => (
              <TaskSection
                key={task.id}
                task={task}
                index={idx + 1}
                audioURL={data?.audio_url ?? null}
              />
            ))}
          </Accordion>
        )}

        {data && footerNavDates && (
          <PlanFooterNav
            previousDate={footerNavDates.previousDate}
            nextDate={footerNavDates.nextDate}
            onNavigateToDate={navigateToDate}
          />
        )}
      </div>

      <Footer />
       <div className="fixed bottom-0 left-0 right-0">
       <AudioPlayer imageUrl={data?.image?.original} description={data?.plan_description} />
       </div>
    </main>
    </AudioPlayerProvider>
  )
}
