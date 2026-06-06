export interface LocalizedMetadataItem {
  id: string
  title: string
  sub_title?: string | null
  description: string
  language?: string
}

/** Locale-keyed metadata map, e.g. `{ en: {...}, bo: {...} }`. */
export type LocalizedMetadataMap = Record<string, LocalizedMetadataItem>

export type MetadataInput =
  | LocalizedMetadataItem
  | LocalizedMetadataItem[]
  | LocalizedMetadataMap
  | null
  | undefined

function normalizeLangKey(key: string): string {
  return key.toLowerCase().split('-')[0]
}

function isMetadataItem(value: unknown): value is LocalizedMetadataItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'title' in value &&
    typeof (value as LocalizedMetadataItem).title === 'string'
  )
}

function isMetadataMap(value: unknown): value is LocalizedMetadataMap {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  if (isMetadataItem(value)) return false
  return Object.values(value).some(
    (entry) =>
      typeof entry === 'object' &&
      entry !== null &&
      'title' in entry &&
      typeof (entry as LocalizedMetadataItem).title === 'string',
  )
}

function findInMetadataArray(
  metadata: LocalizedMetadataItem[],
  language: string,
  fallback = true,
): LocalizedMetadataItem | undefined {
  const lang = normalizeLangKey(language)
  const exact = metadata.find(
    (item) => normalizeLangKey(item.language ?? '') === lang,
  )
  if (exact) return exact
  if (!fallback) return undefined

  return (
    metadata.find((item) => normalizeLangKey(item.language ?? '') === 'en') ??
    metadata[0]
  )
}

function findInMetadataMap(
  metadata: LocalizedMetadataMap,
  language: string,
  fallback = true,
): LocalizedMetadataItem | undefined {
  const lang = normalizeLangKey(language)

  if (metadata[lang]) return metadata[lang]
  if (metadata[language]) return metadata[language]

  const exact = Object.entries(metadata).find(
    ([key]) => normalizeLangKey(key) === lang,
  )?.[1]
  if (exact) return exact
  if (!fallback) return undefined

  const english =
    metadata.en ??
    metadata.EN ??
    Object.entries(metadata).find(
      ([key]) => normalizeLangKey(key) === 'en',
    )?.[1]

  if (english) return english
  return Object.values(metadata)[0]
}

/** Exact locale match only (no English / first-entry fallback). */
export function getExactLocalizedMetadata(
  metadata: MetadataInput,
  language: string,
): LocalizedMetadataItem | undefined {
  if (!metadata) return undefined

  if (isMetadataItem(metadata)) {
    const lang = normalizeLangKey(language)
    const itemLang = normalizeLangKey(metadata.language ?? '')
    return itemLang === lang ? metadata : undefined
  }

  if (Array.isArray(metadata)) {
    return findInMetadataArray(metadata, language, false)
  }

  if (isMetadataMap(metadata)) {
    return findInMetadataMap(metadata, language, false)
  }

  return undefined
}

/** Preferred locale, then English, then first available entry. */
export function getLocalizedMetadata(
  metadata: MetadataInput,
  language: string,
): LocalizedMetadataItem | undefined {
  if (!metadata) return undefined

  if (isMetadataItem(metadata)) {
    return metadata
  }

  if (Array.isArray(metadata)) {
    return findInMetadataArray(metadata, language)
  }

  if (isMetadataMap(metadata)) {
    return findInMetadataMap(metadata, language)
  }

  return undefined
}
