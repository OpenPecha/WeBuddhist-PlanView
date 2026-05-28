export interface AuthorImage {
  thumbnail: string
  medium: string
  original: string
}

export interface AuthorSocialProfile {
  account: string
  url: string
}

export interface Author {
  id: string
  firstname: string
  lastname: string
  email: string
  image: AuthorImage | null
  bio: string
  social_profiles: AuthorSocialProfile[]
}
