import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/atom/select'
import { CONTENT_LANGUAGES } from '@/i18n'

interface ContentLanguageSelectProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

const ContentLanguageSelect = ({
  value,
  onValueChange,
  className,
}: ContentLanguageSelectProps) => {
  const { t } = useTranslation()

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className ?? 'w-fit'}>
        <SelectValue placeholder={t('languages.contentLanguage')} />
      </SelectTrigger>
      <SelectContent>
        {CONTENT_LANGUAGES.map((lng) => (
          <SelectItem key={lng} value={lng}>
            {t(`languages.${lng}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default ContentLanguageSelect

export function contentLanguageFontClass(language: string): string {
  if (language === 'bo') return 'tibetan-font'
  return ''
}
