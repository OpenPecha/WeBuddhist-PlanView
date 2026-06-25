import { useQuery } from "@tanstack/react-query";
import { getImageUrl } from "@/types/image";
import { fetchAuthorById, fetchGroupById, getAboutPlan, getAboutPlanById, getClientDetails, getDefaultImage, getPlanDay, getPrimaryColor, getTimestamps } from "./get_details";
import type { Author } from "@/types/author";
import type { Group } from "@/types/group";
import { useParams, useSearchParams } from "react-router-dom";
import { LANG_QUERY_PARAM, parseAppLocale } from "@/i18n/locale-utils";
import { fetchSeriesById } from "@/pages/plan-view/micro-components/hooks/useSeriesData";
import type { SeriesDetail } from "@/types/series";

export function useImageURLWithFallback(){
    const { planId ,seriesId} = useParams<{ planId: string; date?: string; seriesId?: string }>()
    const [params] = useSearchParams()
    const source = params.get('source') ?? undefined
    const language = parseAppLocale(params.get(LANG_QUERY_PARAM)) ?? 'en'

    const {data:imageURL}=useQuery({
        queryKey:["image",source],
        queryFn:()=>getDefaultImage(source),
        enabled:!!source
    })
    
    const {data:seriesData}=useQuery({
        queryKey:["series",seriesId, language],
        queryFn:()=>fetchSeriesById(seriesId!, language),
        enabled:!!seriesId
    })

    const {data:imageData}=useQuery({
        queryKey:[planId, language],
        queryFn:()=>getPlanDay(planId, undefined, language),
        enabled:!!planId
    })
    return imageURL || getImageUrl(imageData?.image) || getImageUrl(seriesData?.image)

} 

export function useAboutPlanWithFallback(isOpen: boolean){
    const { seriesId } = useParams<{ seriesId?: string }>()
    const [params] = useSearchParams()
    const client = params.get('source') ?? undefined
    const language = parseAppLocale(params.get(LANG_QUERY_PARAM)) ?? 'en'
    
    // Get series data to find the first plan
    const { data: seriesData } = useQuery({
        queryKey: ["series", seriesId, language],
        queryFn: () => fetchSeriesById(seriesId!, language),
        enabled: !!seriesId && isOpen,
    })
    
    // Get the first plan's about info if we have series data
    const firstPlan = seriesData?.plans ? 
        [...seriesData.plans].sort((a, b) => a.display_order - b.display_order)[0] : null
    
    const {data,error,isLoading:isPending}=useQuery({
        queryKey:["about", firstPlan?.id || client],
        queryFn: () => {
            if (firstPlan?.id) {
                return getAboutPlanById(firstPlan.id)
            }
            return getAboutPlan(client)
        },
        enabled: isOpen && (!!firstPlan?.id || !!client)
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

export function useSeriesDetails(seriesId: string | undefined) {
    const [params] = useSearchParams()
    const language = parseAppLocale(params.get(LANG_QUERY_PARAM)) ?? 'en'

    return useQuery<SeriesDetail>({
        queryKey: ["series", seriesId, language],
        queryFn: () => fetchSeriesById(seriesId!, language),
        enabled: !!seriesId,
        refetchOnWindowFocus: false,
    })
}

export function useAuthorDetails(authorId: string | undefined) {
    return useQuery<Author>({
        queryKey: ["author", authorId],
        queryFn: () => fetchAuthorById(authorId!),
        enabled: !!authorId,
        refetchOnWindowFocus: false,
    })
}

export function useGroupDetails(groupId: string | undefined) {
    return useQuery<Group>({
        queryKey: ["group", groupId],
        queryFn: () => fetchGroupById(groupId!),
        enabled: !!groupId,
        refetchOnWindowFocus: false,
    })
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