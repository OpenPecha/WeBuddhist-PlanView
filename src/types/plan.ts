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
}

export interface PlanDay {
  plan_id: string
  plan_title: string
  date: string
  day_number: number
  total_days: number
  start_date: string
  end_date: string
  previous_date: string | null
  next_date: string | null
  tasks: Task[]
}

export interface PlanError {
  detail: string
}
