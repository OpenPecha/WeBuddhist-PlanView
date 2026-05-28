export type ContentType = "TEXT" | "IMAGE" | "VIDEO" | "SOURCE_REFERENCE"

export interface Subtask {
  id: string
  content_type: ContentType
  content: string
  display_order: number
  source_text_id: string | null
  pecha_segment_id: string | null
  segment_ids: string[] | null
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

export interface PlanSeriesMetadata {
  id: string
  title: string
  description: string
  language: string
}

export interface PlanSeriesPlan {
  id: string
  title: string
  description: string
  language: string
  difficulty_level: string
  image_url: string
  image_key: string
  tags: string[]
  status: string
  featured: boolean
  display_order: number
  start_date: string
  total_days: number
}

export interface PlanSeries {
  id: string
  metadata: PlanSeriesMetadata[]
  image: string
  image_key: string
  author_id: string
  featured: boolean
  status: string
  plans: PlanSeriesPlan[]
  total_days: number
}

export interface PlanDay {
  image: {
    thumbnail: string
    medium: string
    original: string
  }
  series?: PlanSeries
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
}

export interface PlanError {
  detail: string
}
