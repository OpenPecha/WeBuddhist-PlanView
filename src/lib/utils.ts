import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&/#]+)/
  )
  return match?.[1] ?? null
}

/**
 * Detects if the provided content contains Tibetan script.
 * Returns true if the text contains characters in the Tibetan Unicode block (\u0F00-\u0FFF).
 */
export function isTibetan(content: string): boolean {
  if (typeof content !== "string") return false
  // Tibetan block: U+0F00 to U+0FFF
  return /[\u0F00-\u0FFF]/.test(content)
}