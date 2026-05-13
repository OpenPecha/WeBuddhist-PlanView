import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import type { PlanDay } from "@/types/plan"
import { PlanViewerSkeleton } from "./micro-components/loader"
import { TaskSection } from "./micro-components/TaskContent"
import { ErrorState } from "./micro-components/Error"
import Footer from "@/components/ui/molecules/footer"
import { Accordion } from "@/components/ui/atom/accordion"
import { PlanHeader } from "./micro-components/PlanHeader"
import { PlanPagination } from "./micro-components/PlanPagination"
import { PlanNavigation } from "./micro-components/PlanNavigation"

export const fetchPlanDay = async (
  planId: string,
  date?: string
): Promise<PlanDay> => {
  const { data } = await api.get<PlanDay>(`/api/v1/plans/${planId}/daily`, {
    params: date ? { date } : undefined,
  })
  return data
}

export function PlanViewer() {
  const [params,setParams]=useSearchParams()
  const { planId} = useParams<{ planId: string; date?: string }>()
  const date=params.get('date')
  const navigate = useNavigate()
  const { data, isLoading, error } = useQuery<PlanDay>({
    queryKey: ["planDay", planId, date],
    queryFn: () => fetchPlanDay(planId!, date),
    enabled: !!planId,
    retry: false,
    refetchOnWindowFocus: false,
  })
  function navigateToDate(newDate: string) {
    setParams(prev=>
    {
      prev.set('date',newDate)
      return prev
    }
    )
  }

  function navigateToPlan(newPlanId: string) {
    navigate(`/${newPlanId}`)
  }

  const sortedTasks = data
    ? [...data.tasks].sort((a, b) => a.display_order - b.display_order)
    : []

  return (
    <main className="min-h-svh w-full bg-[#FAFAFA]">
      <div className="mx-auto max-w-[720px] px-5 py-10 sm:px-8 sm:py-16">
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
                src={data.image.original}
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
            type="single"
            collapsible
            defaultValue={sortedTasks[0]?.id}
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
          <>
            <PlanPagination
              previousDate={data.previous_date}
              nextDate={data.next_date}
              onNavigateToDate={navigateToDate}
            />
            <PlanNavigation
              previousPlanId={data.previous_plan_id}
              nextPlanId={data.next_plan_id}
              onNavigateToPlan={navigateToPlan}
            />
          </>
        )}
      </div>

      <Footer />
    </main>
  )
}
