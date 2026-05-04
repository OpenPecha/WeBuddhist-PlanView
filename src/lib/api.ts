import axios from "axios"
import type { PlanDay } from "@/types/plan"

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
})

export async function fetchPlanDay(
  planId: string,
  date: string
): Promise<PlanDay> {
  const { data } = await api.get<PlanDay>(
    `/api/v1/plans/${planId}/${date}`
  )
  return data
}
