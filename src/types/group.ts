export interface GroupMetadataItem {
  id: string
  title: string
  description: string
  language: string
}

export interface GroupSocialLink {
  platform: string
  url: string
}

export interface Group {
  id: string
  slug: string
  is_public: boolean
  metadata: GroupMetadataItem[]
  tags: unknown[]
  follower_count: number
  member_count: number
  sign_up?: string | null
  banner_url?: string | null
  social_links?: GroupSocialLink[]
}
