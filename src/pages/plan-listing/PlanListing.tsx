import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import Header from "@/components/ui/molecules/header"
import PlanCard from "@/components/ui/molecules/cards/plan-card"
import { Button } from '@/components/ui/atom/button'
import { ArrowLeft } from 'lucide-react'

const fetchPlanListing = async (language: string, tag: string) => {
    const { data } = await api.get('/api/v1/plans', {
        params: {
            language: language,
            tag: tag,
        }
    })
    return data
}

const PlanListing = () => {
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
                <p className="text-center text-muted-foreground">No tag specified</p>
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
                    Back to Tags
                </Button>

                <h1 className={`text-2xl font-bold mb-2 ${language === 'bo' ? 'tibetan-font' : ''}`}>
                    {tag}
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                    {data?.total || 0} {data?.total === 1 ? 'plan' : 'plans'} available
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                {isLoading && <p>Loading plans...</p>}
                {error && <p className="text-destructive">Error loading plans</p>}
                {data?.plans?.length === 0 && (
                    <p className="text-muted-foreground col-span-full text-center py-8">
                        No plans found for this tag
                    </p>
                )}
                {data?.plans?.map((plan: any) => (
                    <PlanCard key={plan.id} plan={plan} language={language} />
                ))}
            </div>
        </main>
    )
}

export default PlanListing