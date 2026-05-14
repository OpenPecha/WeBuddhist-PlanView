import { useQuery } from "@tanstack/react-query";
import { getAboutPlan, getDefaultImage, getPlanDay } from "./get_details";
import { useParams, useSearchParams } from "react-router-dom";

export function useImageURLWithFallback(){
    const { planId } = useParams<{ planId: string; date?: string }>()
    const [params] = useSearchParams()
    const source = params.get('source') ?? undefined

    const {data:imageURL}=useQuery({
        queryKey:["image",source],
        queryFn:()=>getDefaultImage(source),
        enabled:!!source
    })
    const {data:imageData}=useQuery({
        queryKey:[planId],
        queryFn:()=>getPlanDay(planId),
        enabled:!!planId
    })
    return imageURL || imageData?.image.original

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