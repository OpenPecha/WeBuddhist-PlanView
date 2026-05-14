import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import type { PlanDay } from "@/types/plan"
import { PlanViewerSkeleton } from "./micro-components/loader"
import { TaskSection } from "./micro-components/TaskContent"
import { ErrorState } from "./micro-components/Error"
import Footer from "@/components/ui/molecules/footer"
import { Accordion } from "@/components/ui/atom/accordion"
import { PlanHeader } from "./micro-components/PlanHeader"
import { PlanFooterNav } from "./micro-components/PlanFooterNav"
import InfoModal from "@/components/ui/molecules/modal/InfoModal"
import {  getPlanDay } from "@/client_details/get_details"
import { useImageURLWithFallback } from "@/client_details/hooks"
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';


export function PlanViewer() {
  const [params, setParams] = useSearchParams()
  const { planId } = useParams<{ planId: string; date?: string }>()
  const date = params.get('date') ?? undefined
  const navigate = useNavigate()
  const { data, isLoading, error } = useQuery<PlanDay>({
    queryKey: ["planDay", planId, date],
    queryFn: () => getPlanDay(planId!, date),
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
console.log(date)
  function navigateToPlan(newPlanId: string) {
    window.scrollTo({
      top:0,
      behavior:'smooth'
    })
    navigate(`/${newPlanId}`)
  }
  const sortedTasks = data
    ? [...data.tasks].sort((a, b) => a.display_order - b.display_order)
    : []
  return (
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
                src={imageURL}
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
        {isLoading ? (
          <PlanViewerSkeleton />
        ) : error ? (
          <ErrorState error={error} />
        ) : data ? (
          <Accordion
            key={data.date}
            type={!isMobile ? "single" : "multiple"}
            defaultValue={!isMobile ? sortedTasks[0]?.id : sortedTasks[0] ? [sortedTasks[0].id] : []}
            className="space-y-4"
          >
            {sortedTasks.map((task, idx) => (
              <TaskSection
                key={task.id}
                task={task}
                index={idx + 1}
              />
            ))}
          </Accordion>
        ) : null}

        {data && (
          <PlanFooterNav
            previousDate={data.previous_date}
            nextDate={data.next_date}
            previousPlanId={data.previous_plan_id}
            nextPlanId={data.next_plan_id}
            onNavigateToDate={navigateToDate}
            onNavigateToPlan={navigateToPlan}
          />
        )}
      </div>

      <Footer />
      {planId && (
        <div className="fixed bottom-4 right-4 z-40 sm:bottom-2 sm:right-2">
          <InfoModal />
        </div>
      )}
    </main>
  )
}
