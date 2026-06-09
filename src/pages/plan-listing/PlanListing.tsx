import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import api from '@/lib/api'
import Header from "@/components/ui/molecules/header"
import PlanCard from "@/components/ui/molecules/cards/plan-card"
import { Button } from '@/components/ui/atom/button'
import { ArrowLeft } from 'lucide-react'
import { contentLanguageFontClass } from '@/components/ui/molecules/ContentLanguageSelect'

import type { PlanListItem } from '@/types/plan'

interface PlansListResponse {
  plans: PlanListItem[]
  total?: number
}

const fetchPlanListing = async (language: string, tag: string): Promise<PlansListResponse> => {
    const { data } = await api.get<PlansListResponse>('/api/v1/plans', {
        params: {
            language: language,
            tag: tag,
        }
    })
    return data
}

const PlanListing = () => {
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const language = searchParams.get('language') || 'en'
    const tag = searchParams.get('tag') || ''

    const { data, isLoading, error } = useQuery({
        queryKey: ['plans', language, tag],
        queryFn: () => fetchPlanListing(language, tag),
        enabled: !!tag,
    })

    if (!tag) {
        return (
            <main className="max-w-[720px] mx-auto p-4">
                <p className="text-center text-muted-foreground">{t('planListing.noTagSpecified')}</p>
            </main>
        )
    }

    return (
        <main className="max-w-[720px] mx-auto gap-4 flex flex-col">
            <Header />

            <div className="px-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="mb-4 pl-0"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('planListing.backToTags')}
                </Button>

                <h1 className={`text-xl mb-2 ${contentLanguageFontClass(language)}`}>
                    {tag}
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                {isLoading && <p>{t('planListing.loadingPlans')}</p>}
                {error && <p className="text-destructive">{t('planListing.errorLoadingPlans')}</p>}
                {data?.plans?.length === 0 && (
                    <p className="text-muted-foreground col-span-full text-center py-8">
                        {t('planListing.noPlansForTag')}
                    </p>
                )}
                {data?.plans?.map((plan: PlanListItem) => (
                    <PlanCard key={plan.id} plan={plan} language={language} />
                ))}
            </div>
        </main>
    )
}

export default PlanListing
