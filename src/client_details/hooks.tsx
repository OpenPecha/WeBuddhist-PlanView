import { useQuery } from "@tanstack/react-query";
import { getAboutPlan, getClientDetails, getDefaultImage, getPlanDay, getPrimaryColor, getTimestamps } from "./get_details";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchSeriesById } from "@/pages/plan-view/micro-components/hooks/useSeriesData";

export function useImageURLWithFallback(){
    const { planId ,seriesId} = useParams<{ planId: string; date?: string; seriesId?: string }>()
    const [params] = useSearchParams()
    const source = params.get('source') ?? undefined

    const {data:imageURL}=useQuery({
        queryKey:["image",source],
        queryFn:()=>getDefaultImage(source),
        enabled:!!source
    })
    
    const {data:seriesData}=useQuery({
        queryKey:["series",seriesId],
        queryFn:()=>fetchSeriesById(seriesId),
        enabled:!!seriesId
    })

    const {data:imageData}=useQuery({
        queryKey:[planId],
        queryFn:()=>getPlanDay(planId),
        enabled:!!planId
    })
    return imageURL || imageData?.image.original || seriesData?.image

} 

export function useAboutPlanWithFallback(isOpen: boolean){
    const [params] = useSearchParams()
    const client = params.get('source') ?? undefined
    const {data,error,isLoading:isPending}=useQuery({
        queryKey:["about",client],
        queryFn:()=>getAboutPlan(client),
        enabled:isOpen && !!client
    })
    return {data,error,isLoading:isPending}

} 

export function useClientDetails(){
    const [params] = useSearchParams()
    const client = params.get('source') ?? undefined
    const {data,error,isLoading:isPending}=useQuery({
        queryKey:["client",client],
        queryFn:()=>getClientDetails(client),
        enabled:!!client
    })
    return {data,error,isLoading:isPending}
}

export function useTimeStamps(day:number|undefined){
    const [params] = useSearchParams()
    const client = params.get('source') ?? undefined
    const timestamps = getTimestamps(client,day||0)||null
    return timestamps
}

export function usePrimaryColor(){
    const [params] = useSearchParams()
    const client = params.get('source') ?? undefined
    const primaryColor = getPrimaryColor(client)
    return primaryColor
}