import { Button } from '@/components/ui/atom/button'
import { Check, Link, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const generateShortUrl = async (link: string) => {
  const { data } = await axios.post<{ short_url: string }>('shortener/api/v1/', { url: link })
  return data.short_url
}

function ShareButton() {
  const websiteBaseUrl = import.meta.env.VITE_WEBSITE_BASE_URL
  const [params] = useSearchParams()
  const { planId } = useParams<{ planId: string; date?: string }>()
  const [copied, setCopied] = useState(false)

  const source = params.get('source')
  const date = params.get('date')

  const { mutate: sharePlan, isPending } = useMutation({
    mutationFn: async () => {
      let link = websiteBaseUrl + "/" + planId
      const paramsObj: Record<string, string> = {}
      if (source) paramsObj.source = source
      if (date) paramsObj.date = date
      const search = new URLSearchParams(paramsObj).toString()
      if (search) link += `?${search}`
      return generateShortUrl(link)
    },
    onSuccess: async (shortUrl) => {
      if (!navigator.clipboard?.writeText) return
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    },
  })

  return (
    <Button variant="ghost" size="icon" onClick={() => sharePlan()} disabled={isPending}>
      {isPending ? <Loader2 className="size-4 animate-spin" /> : copied ? <Check className="size-4" /> : <Link className="size-4" />}
    </Button>
  )
}

export default ShareButton
