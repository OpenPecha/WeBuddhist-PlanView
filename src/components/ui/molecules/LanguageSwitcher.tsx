import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/atom/select'
import { SUPPORTED_LOCALES } from '@/i18n'
import { useLocale } from '@/i18n/use-locale'

interface LanguageSwitcherProps {
  className?: string
}

const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { t } = useTranslation()
  const { current, setLocale } = useLocale()

  return (
    <Select value={current} onValueChange={setLocale}>
      <SelectTrigger className={className ?? 'w-fit'}>
        <SelectValue placeholder={t('languages.uiLanguage')} />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LOCALES.map((lng) => (
          <SelectItem key={lng} value={lng}>
            {t(`languages.${lng}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default LanguageSwitcher
