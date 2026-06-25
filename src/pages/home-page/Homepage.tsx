import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import Header from '@/components/ui/molecules/header'
import { Button } from '@/components/ui/atom/button'
import SeriesCard from '@/components/ui/molecules/cards/series-card'
import type { SeriesListResponse } from '@/types/series'
import type { PlansListResponse } from '@/types/plan'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const PAGE_SIZE = 20

type DashboardTab = 'series' | 'plan'

const VALID_TABS = new Set<DashboardTab>(['series', 'plan'])

function parseTab(raw: string | null): DashboardTab {
  if (raw === 'all') return 'series'
  if (raw && VALID_TABS.has(raw as DashboardTab)) return raw as DashboardTab
  return 'series'
}

async function fetchSeriesPage(
  skip: number,
  limit: number,
  language = 'en',
): Promise<SeriesListResponse> {
  const { data } = await api.get<SeriesListResponse>('/api/v1/series', {
    params: { skip, limit, language },
  })
  return data
}

async function fetchPlansPage(
  language: string,
  page: number,
  pageSize: number,
): Promise<PlansListResponse> {
  const skip = (page - 1) * pageSize
  const { data } = await api.get<PlansListResponse>('/api/v1/plans', {
    params: {
      language,
      skip,
      limit: pageSize,
    },
  })
  return data
}

const Homepage = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const language = searchParams.get('lang') || 'en'



  const tab = parseTab(searchParams.get('tab'))
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1)


  const setPage = (nextPage: number) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev)
      p.set('page', String(nextPage))
      return p
    })
  }

  const seriesQuery = useQuery({
    queryKey: ['dashboard-series', language, page],
    queryFn: () => fetchSeriesPage((page - 1) * PAGE_SIZE, PAGE_SIZE, language),
    enabled: tab === 'series',
  })

  const plansQuery = useQuery({
    queryKey: ['dashboard-plans', language, page],
    queryFn: () => fetchPlansPage(language, page, PAGE_SIZE),
    enabled: tab === 'plan',
  })

  const active = tab === 'series' ? seriesQuery : plansQuery
  const { isLoading, error } = active

  const seriesPagination =
    tab === 'series' && seriesQuery.data
      ? {
          page,
          totalPages: Math.max(1, Math.ceil(seriesQuery.data.total / PAGE_SIZE)),
          total: seriesQuery.data.total,
        }
      : null

  const plansPagination =
    tab === 'plan' && plansQuery.data && typeof plansQuery.data.total === 'number'
      ? {
          page,
          totalPages: Math.max(1, Math.ceil(plansQuery.data.total / PAGE_SIZE)),
          total: plansQuery.data.total,
        }
      : null

  const pagination = seriesPagination ?? plansPagination

  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-4">
      <Header />

      <div className="flex flex-col gap-4 px-4">
        <h1 className="text-2xl font-semibold text-[#3D3D3A]">{t('homepage.dashboard')}</h1>
        {/* <LanguageSwitcher/> */}

      </div>

      <div className="grid grid-cols-1 gap-4 px-4 pb-4 md:grid-cols-2">
        {isLoading && <p className="col-span-full text-muted-foreground">{t('common.loading')}</p>}
        {error && (
          <p className="col-span-full text-destructive">
            {tab === 'series' ? t('homepage.couldNotLoadSeries') : t('homepage.couldNotLoadPlans')}
          </p>
        )}
        {tab === 'series' &&
          !isLoading &&
          !error &&
          seriesQuery.data?.series?.length === 0 && (
            <p className="col-span-full py-8 text-center text-muted-foreground">
              {t('homepage.noSeriesFound')}
            </p>
          )}
    
        {tab === 'series' &&
          seriesQuery.data?.series?.map((series) => (
            <SeriesCard key={series.id} series={series} language={language} />
          ))}
     
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-4 px-4 pb-8">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            {t('common.previous')}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t('homepage.pageOf', { page: pagination.page, totalPages: pagination.totalPages })}
            <span className="ml-1">{t('homepage.totalCount', { total: pagination.total })}</span>
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            {t('common.next')}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </main>
  )
}

export default Homepage
