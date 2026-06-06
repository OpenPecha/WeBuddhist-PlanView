export interface ImageSet {
  thumbnail: string
  medium: string
  original: string
}

export type ImageSize = keyof ImageSet

export function getImageUrl(
  image: ImageSet | null | undefined,
  size: ImageSize = 'original',
): string | undefined {
  return image?.[size]
}
