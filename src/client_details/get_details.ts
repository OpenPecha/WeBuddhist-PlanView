import type { PlanDay } from "@/types/plan"
import type { Author } from "@/types/author"
import type { Group } from "@/types/group"
import config from "./config.json"
import api from "@/lib/api"
import abidhama_timestamps from "./abhidhama/parsed_segments.json"

export async function fetchAuthorById(authorId: string): Promise<Author> {
  const { data } = await api.get<Author>(`/api/v1/authors/${authorId}`)
  return data
}

export async function fetchGroupById(groupId: string): Promise<Group> {
  const { data } = await api.get<Group>(`/api/v1/author/groups/${groupId}`)
  return data
}

export function getClientDetails(client:string|undefined){
    const clientDetails = config.find(c => c.client === client)
    if (!clientDetails) return null;
    return clientDetails
}

export function getBannerImage(client:string|undefined){
    const clientDetails = getClientDetails(client)
    return clientDetails?.banner_image ||null
}


export async function getDefaultImage(client:string|undefined){
    const defaultImageURL = getBannerImage(client)
    return defaultImageURL || null
}

export async function getAboutPlan(client:string|undefined): Promise<PlanDay> {
    const clientDetails = getClientDetails(client)||config[0];
    const aboutPlanId = clientDetails.about_plan_id
    const { data } = await api.get<PlanDay>(`/api/v1/plans/${aboutPlanId}/daily`)
    return data
}

export const getPlanDay = async (
    planId: string | undefined,
    date?: string
  ): Promise<PlanDay> => {
    const { data } = await api.get<PlanDay>(`/api/v1/plans/${planId}/daily`, {
      params: date ? { date } : undefined,
    })
    return data
  }

  export function getTimestamps(client: string | undefined,day:number|undefined){
    const clientDetails = getClientDetails(client)  
    if (clientDetails?.timestamps === "abhidhama"){
      if (typeof day !== "number" || day < 1) return null;
      const index = String(day);
      if (!(index in abidhama_timestamps)) return null;
      const timestamps =
        abidhama_timestamps[index as keyof typeof abidhama_timestamps];
      return timestamps ?? null;
    }
    return null
  }

  export function getPrimaryColor(client: string | undefined){
    const clientDetails = getClientDetails(client)
    return clientDetails?.primary_color || null
  }