import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import api from '@/lib/api'
import Header from '@/components/ui/molecules/header'
import SeriesCard from '@/components/ui/molecules/cards/series-card'
import ContentLanguageSelect from '@/components/ui/molecules/ContentLanguageSelect'
import type { SeriesListResponse } from '@/types/series'
import { useSearchParams } from 'react-router-dom'

const SERIES_PAGE_SIZE = 50

const fetchSeriesList = async (skip = 0, limit = SERIES_PAGE_SIZE) => {
  const { data } = await api.get<SeriesListResponse>('/api/v1/series', {
    params: { skip, limit },
  })
  return data
}

const SeriesListing = () => {
  const { t } = useTranslation()
  const [params,]=useSearchParams();
  const lang = params.get('lang') 
  const [language, setLanguage] = useState(lang)
  const { data, isLoading, error } = useQuery({
    queryKey: ['series-list'],
    queryFn: () => fetchSeriesList(),
  })

  return (
    <main className="max-w-[720px] mx-auto gap-4 flex flex-col">
      <Header />

      <div className="px-4 flex flex-col gap-4">
        <h1 className="text-xl font-semibold text-[#3D3D3A]">{t('seriesListing.title')}</h1>

        <ContentLanguageSelect value={language} onValueChange={setLanguage} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-8">
        {isLoading && <p>{t('seriesListing.loadingSeries')}</p>}
        {error && <p className="text-destructive">{t('seriesListing.errorLoadingSeries')}</p>}
        {data?.series?.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">
            {t('seriesListing.noSeriesFound')}
          </p>
        )}
        {data?.series?.map((series) => (
          <SeriesCard key={series.id} series={series} language={language} />
        ))}
      </div>
    </main>
  )
}

export default SeriesListing
