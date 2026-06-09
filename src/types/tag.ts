import type { ImageSet } from './image'

export interface PlanTag {
  id: string
  name: string
  image: ImageSet | null
  image_key: string | null
  description: string | null
  featured: boolean
}
