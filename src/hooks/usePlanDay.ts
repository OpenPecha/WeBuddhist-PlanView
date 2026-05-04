import { useQuery } from "@tanstack/react-query"
import { fetchPlanDay } from "@/lib/api"

export function usePlanDay(planId: string, date: string) {
  return useQuery({
    queryKey: ["planDay", planId, date],
    queryFn: () => fetchPlanDay(planId, date),
    enabled: !!planId && !!date,
    retry: false,
  })
}
