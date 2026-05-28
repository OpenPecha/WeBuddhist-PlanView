export interface SeriesMetadataItem {
  id: string
  title: string
  description: string
  language: string
}

export interface SeriesListItem {
  id: string
  /** Legacy: keyed locale → "title -> description" string */
  name?: Record<string, string>
  metadata?: SeriesMetadataItem[]
  image?: string | null
  image_key?: string | null
  author_id: string
  group_id: string | null
  featured: boolean
  status: string
  plans: unknown[]
  total_days: number
}

export interface SeriesListResponse {
  series: SeriesListItem[]
  skip: number
  limit: number
  total: number
}

export interface SeriesPlanSummary {
  id: string
  title?: string
  description?: string
  language?: string
  display_order: number
  start_date: string
  total_days: number
  image_url?: string | null
}

export interface SeriesDetail extends Omit<SeriesListItem, 'plans'> {
  plans: SeriesPlanSummary[]
}
