import type { ImageSet } from './image'
import type { LocalizedMetadataItem } from '@/lib/metadata-utils'
import type { PlanTag } from './tag'

export type ContentType = "TEXT" | "IMAGE" | "VIDEO" | "SOURCE_REFERENCE"

export interface Subtask {
  id: string
  content_type: ContentType
  content: string
  display_order: number
  source_text_id: string | null
  pecha_segment_id: string | null
  segment_ids: string[] | null
  audio_url?: string | null
  duration?: number | null
  image_url?: string | null
  start_ms?: number | null
  end_ms?: number | null
}

export interface Task {
  id: string
  title: string
  estimated_time: number
  display_order: number
  subtasks: Subtask[]
  start_ms?: number | null
  end_ms?: number | null
}

/** Nested series payload on `GET /api/v1/plans/:id/daily`. */
export interface PlanDaySeries {
  id: string
  metadata: LocalizedMetadataItem
  image: ImageSet
}

export interface PlanDay {
  image: ImageSet
  series?: PlanDaySeries
  plan_id: string
  plan_title: string
  plan_description: string
  date: string
  day_number: number
  total_days: number
  start_date: string
  end_date: string
  previous_date: string | null
  next_date: string | null
  previous_plan_id: string | null
  next_plan_id: string | null
  tasks: Task[]
  audio_url?: string | null
  audio_duration_ms?: number | null
}

export interface PlanListAuthor {
  id: string
  firstname: string
  lastname: string
  image: ImageSet | null
}

export interface PlanListItem {
  id: string
  title: string
  description: string
  language: string
  difficulty_level: string
  image: ImageSet
  total_days: number
  tags: PlanTag[]
  author: PlanListAuthor
  start_date: string | null
  display_order?: number
  group_id?: string | null
}

export interface PlansListResponse {
  plans: PlanListItem[]
  skip?: number
  limit?: number
  total?: number
}

export interface PlanError {
  detail: string
}
