import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Header from '@/components/ui/molecules/header'
import { Button } from '@/components/ui/atom/button'
import { Card, CardContent, CardTitle } from '@/components/ui/atom/card'
import { contentLanguageFontClass } from '@/components/ui/molecules/ContentLanguageSelect'
import { ErrorState } from '@/pages/plan-view/micro-components/Error'
import { fetchSeriesById } from '@/pages/plan-view/micro-components/hooks/useSeriesData'
import { getSeriesTitleAndDescription } from '@/lib/series-utils'

const SeriesView = () => {
  const { t } = useTranslation()
  const { seriesId } = useParams<{ seriesId: string }>()
  const navigate = useNavigate()
  const [language] = useState('en')
  const { data, isLoading, error } = useQuery({
    queryKey: ['series', seriesId],
    queryFn: () => fetchSeriesById(seriesId!),
    enabled: !!seriesId,
    refetchOnWindowFocus: false,
  })

  const { title, description } = data
    ? getSeriesTitleAndDescription(data, language)
    : { title: '', description: '' }

  const sortedPlans = data?.plans
    ? [...data.plans].sort((a, b) => a.display_order - b.display_order)
    : []
  const fontClass = contentLanguageFontClass(language)

  return (
    <main className="max-w-[720px] mx-auto gap-4 flex flex-col">
      <Header />
    

      {isLoading && (
        <p className="px-4 text-muted-foreground">{t('seriesView.loadingSeries')}</p>
      )}

      {error && (
        <div className="px-4 py-8">
          <ErrorState error={error as Error} />
        </div>
      )}

      {data && (
        <>
          <section className="px-4 flex flex-col gap-4">
            {data.image && (
              <div className="w-full h-48 md:h-64 overflow-hidden rounded-lg">
                <img
                  src={data.image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {title && (
              <div className="flex flex-col gap-2">
                <Button
                  className="w-fit"
                  onClick={() => navigate(`/series/${seriesId}/plan-day`)}
                >
                  {t('seriesView.todaysPlan')}
                </Button>
                <h1
                  className={`text-xl font-semibold text-[#3D3D3A] ${fontClass}`}
                >
                  {title}
                </h1>
                {description && (
                  <p
                    className={`text-muted-foreground ${fontClass}`}
                  >
                    {description}
                  </p>
                )}
                {data.total_days > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {data.total_days} {data.total_days === 1 ? t('common.day') : t('common.days')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="px-4 pb-8 flex flex-col gap-3">
            <h2 className="text-lg font-medium text-[#3D3D3A]">{t('seriesView.plansInSeries')}</h2>

            {sortedPlans.length === 0 && (
              <p className="text-muted-foreground">{t('seriesView.noPlansInSeries')}</p>
            )}

            <div className="grid grid-cols-1 gap-3">
              {sortedPlans.map((plan, index) => (
                <Card
                  key={plan.id}
                  className="cursor-pointer rounded-sm border-none shadow-none outline-none ring-0 hover:ring-1"
                  onClick={() => navigate(`/plan/${plan.id}`)}
                >
                  
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    {plan.image_url ? (
                      <img
                        src={plan.image_url}
                        alt={plan.title ?? ''}
                        className="h-full max-h-24 w-full max-w-40 rounded object-cover"
                      />
                    ) : (
                      <div className="h-24 w-40 shrink-0 rounded bg-muted" aria-hidden />
                    )}
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base font-medium">
                        {plan.title ?? t('seriesView.planFallback', { index: index + 1 })}
                      </CardTitle>
                      {plan.description && (
                        <p
                          className={`text-sm text-muted-foreground mt-1 line-clamp-2 ${fontClass}`}
                        >
                          {plan.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {plan.total_days} {plan.total_days === 1 ? t('common.day') : t('common.days')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  )
}

export default SeriesView
