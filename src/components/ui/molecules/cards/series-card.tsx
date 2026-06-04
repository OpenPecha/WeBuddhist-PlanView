import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../atom/card'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import type { SeriesListItem } from '@/types/series'
import { getSeriesTitleAndDescription } from '@/lib/series-utils'
import { contentLanguageFontClass } from '../ContentLanguageSelect'

interface SeriesCardProps {
  series: SeriesListItem
  language: string
}

const SeriesCard = ({ series, language }: SeriesCardProps) => {
  const navigate = useNavigate()
  const [params,]=useSearchParams();
  const { title, description } = getSeriesTitleAndDescription(series, language)
  const fontClass = contentLanguageFontClass(language)
  const handleClick = () => {
    navigate(`/series/${series.id}/plan-day?lang=${language}`)
  }
  const lang = params.get('lang') || 'en'
  const series_language =series.metadata?.find((m) => m.language.toLowerCase() === lang.toLowerCase())
  if (!title) return null
  if (!series_language) return null;
  return (
    <Card
      className={`cursor-pointer p-0 rounded-sm overflow-hidden`}
      onClick={handleClick}
    >
      {series.image && (
        <CardHeader className="p-0">
          <img
            className="h-48 w-full hover:scale-105 transition-all duration-300 object-cover"
            src={series.image}
            alt={title}
            loading="lazy"
          />
        </CardHeader>
      )}
      <CardContent className="p-4 space-y-3">
        <CardTitle className={`text-lg line-clamp-2 ${fontClass} ${language === 'bo' ? 'text-2xl' : ''}`}>
          {title}
        </CardTitle>

        {description && (
          <CardDescription className={`line-clamp-2 ${fontClass} ${language === 'bo' ? 'text-md' : ''}`}>
            {description}
          </CardDescription>
        )}

        {series.total_days > 0 && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {series.total_days} {series.total_days === 1 ? 'day' : 'days'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SeriesCard
