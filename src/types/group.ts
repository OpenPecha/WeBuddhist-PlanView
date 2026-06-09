import type { LocalizedMetadataItem } from '@/lib/metadata-utils'

export type GroupMetadataItem = LocalizedMetadataItem

export interface GroupSocialLink {
  platform: string
  url: string
}

export interface Group {
  id: string
  slug: string
  is_public: boolean
  avatar_key?: string | null
  banner_key?: string | null
  avatar_url?: string | null
  banner_url?: string | null
  metadata: LocalizedMetadataItem[]
  tags: unknown[]
  follower_count: number
  member_count: number
  sign_up?: string | null
  social_links?: GroupSocialLink[]
}

/** Group object embedded on series list/detail responses. */
export type GroupSummary = Omit<Group, 'sign_up' | 'social_links'>
