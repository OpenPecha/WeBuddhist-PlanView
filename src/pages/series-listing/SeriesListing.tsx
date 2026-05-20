import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import Header from '@/components/ui/molecules/header'
import SeriesCard from '@/components/ui/molecules/cards/series-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/atom/select'
import type { SeriesListResponse } from '@/types/series'

const SERIES_PAGE_SIZE = 50

const fetchSeriesList = async (skip = 0, limit = SERIES_PAGE_SIZE) => {
  const { data } = await api.get<SeriesListResponse>('/api/v1/series', {
    params: { skip, limit },
  })
  return data
}

const SeriesListing = () => {
  const [language, setLanguage] = useState('en')

  const { data, isLoading, error } = useQuery({
    queryKey: ['series-list'],
    queryFn: () => fetchSeriesList(),
  })

  return (
    <main className="max-w-[720px] mx-auto gap-4 flex flex-col">
      <Header />

      <div className="px-4 flex flex-col gap-4">
        <h1 className="text-xl font-semibold text-[#3D3D3A]">Series</h1>

        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="zh">Chinese</SelectItem>
            <SelectItem value="bo">Tibetan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-8">
        {isLoading && <p>Loading series...</p>}
        {error && <p className="text-destructive">Error loading series</p>}
        {data?.series?.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">
            No series found
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
