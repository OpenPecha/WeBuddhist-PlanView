import type { ImageSet } from './image'
import type { LocalizedMetadataItem } from '@/lib/metadata-utils'
import type { GroupSummary } from './group'
import type { PlanTag } from './tag'

export type SeriesMetadataItem = LocalizedMetadataItem

export interface SeriesListItem {
  id: string
  /** Legacy: keyed locale → "title -> description" string */
  name?: Record<string, string>
  metadata?: LocalizedMetadataItem[]
  image?: ImageSet | null
  image_key?: string | null
  author_id: string
  group_id?: string | null
  group?: GroupSummary | null
  featured: boolean
  status: string
  plans?: unknown[]
  plan_count?: number
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
  difficulty_level?: string
  display_order: number
  start_date: string
  total_days: number
  image?: ImageSet | null
  image_key?: string | null
  tags?: PlanTag[]
  status?: string
  featured?: boolean
  group_id?: string | null
}

export interface SeriesDetail extends Omit<SeriesListItem, 'plans'> {
  plans: SeriesPlanSummary[]
}
