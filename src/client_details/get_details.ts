import type { PlanDay } from "@/types/plan"
import config from "./config.json"
import api from "@/lib/api"


export function getClientDetails(client:string){
    const clientDetails = config.find(c => c.client === client)
    if (!clientDetails) return null;
    return clientDetails
}

export async function getDefaultImage(client:string){
    const clientDetails = getClientDetails(client)
    const aboutPlanId = clientDetails.about_plan_id
    if (!clientDetails) {
        throw new Error(`Client ${client} not found`)
    }
    if (clientDetails.default_image) {
        const { data } = await api.get<PlanDay>(`/api/v1/plans/${aboutPlanId}/daily`)
        return data.image.original
    }
}

export async function getAboutPlan(client:string): Promise<PlanDay> {
    const clientDetails = getClientDetails(client)||config[0];
    const aboutPlanId = clientDetails.about_plan_id
    const { data } = await api.get<PlanDay>(`/api/v1/plans/${aboutPlanId}/daily`)
    return data
}

export const getPlanDay = async (
    planId: string,
    date?: string
  ): Promise<PlanDay> => {
    const { data } = await api.get<PlanDay>(`/api/v1/plans/${planId}/daily`, {
      params: date ? { date } : undefined,
    })
    return data
  }