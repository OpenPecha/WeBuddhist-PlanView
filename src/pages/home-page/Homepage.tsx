import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState, type ComponentProps } from 'react'
import api from '@/lib/api'
import Header from '@/components/ui/molecules/header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/atom/select'
import { Button } from '@/components/ui/atom/button'
import SeriesCard from '@/components/ui/molecules/cards/series-card'
import PlanCard from '@/components/ui/molecules/cards/plan-card'
import type { SeriesListResponse } from '@/types/series'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 20

type DashboardTab = 'series' | 'plan'

const VALID_TABS = new Set<DashboardTab>(['series', 'plan'])

function parseTab(raw: string | null): DashboardTab {
  if (raw === 'all') return 'series'
  if (raw && VALID_TABS.has(raw as DashboardTab)) return raw as DashboardTab
  return 'series'
}

async function fetchSeriesPage(skip: number, limit: number): Promise<SeriesListResponse> {
  const { data } = await api.get<SeriesListResponse>('/api/v1/series', {
    params: { skip, limit },
  })
  return data
}

/** Plan list shape varies by backend; align with {@link PlanListing} when tagged. */
interface PlansListResponse {
  plans: ComponentProps<typeof PlanCard>['plan'][]
  total?: number
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
  const [searchParams, setSearchParams] = useSearchParams()
  const [language, setLanguage] = useState('en')

  const tab = parseTab(searchParams.get('tab'))
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1)

  const setTab = (next: DashboardTab) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev)
      p.set('tab', next)
      p.set('page', '1')
      return p
    })
  }

  const setPage = (nextPage: number) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev)
      p.set('page', String(nextPage))
      return p
    })
  }

  const seriesQuery = useQuery({
    queryKey: ['dashboard-series', page],
    queryFn: () => fetchSeriesPage((page - 1) * PAGE_SIZE, PAGE_SIZE),
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

  const tabButtons: { value: DashboardTab; label: string }[] = useMemo(
    () => [
      { value: 'series', label: 'Series' },
      { value: 'plan', label: 'Plans' },
    ],
    [],
  )

  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-4">
      <Header />

      <div className="flex flex-col gap-4 px-4">
        <h1 className="text-xl font-semibold text-[#3D3D3A]">Dashboard</h1>

        <div className="flex flex-wrap items-center gap-2">
          {tabButtons.map(({ value, label }) => (
            <Button
              key={value}
              type="button"
              variant={tab === value ? 'default' : 'outline'}
              size="sm"
              className="capitalize"
              onClick={() => setTab(value)}
            >
              {label}
            </Button>
          ))}
        </div>

        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Language for titles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="zh">Chinese</SelectItem>
            <SelectItem value="bo">Tibetan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 pb-4 md:grid-cols-2">
        {isLoading && <p className="col-span-full text-muted-foreground">Loading…</p>}
        {error && (
          <p className="col-span-full text-destructive">
            Could not load {tab === 'series' ? 'series' : 'plans'}.
          </p>
        )}
        {tab === 'series' &&
          !isLoading &&
          !error &&
          seriesQuery.data?.series?.length === 0 && (
            <p className="col-span-full py-8 text-center text-muted-foreground">
              No series found.
            </p>
          )}
        {tab === 'plan' &&
          !isLoading &&
          !error &&
          plansQuery.data?.plans?.length === 0 && (
            <p className="col-span-full py-8 text-center text-muted-foreground">
              No plans found.
            </p>
          )}
        {tab === 'series' &&
          seriesQuery.data?.series?.map((series) => (
            <SeriesCard key={series.id} series={series} language={language} />
          ))}
        {tab === 'plan' &&
          plansQuery.data?.plans?.map((plan) => (
            <PlanCard key={plan.id} plan={plan} language={language} />
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
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
            <span className="ml-1">({pagination.total} total)</span>
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </main>
  )
}

export default Homepage
