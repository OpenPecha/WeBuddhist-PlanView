import { Button } from '@/components/ui/atom/button'
import { Check, Link } from 'lucide-react'
import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

function ShareButton() {
  const shortUrlBase = import.meta.env.VITE_SHORT_URL_BASE
  const [params] = useSearchParams()
  const { planId } = useParams<{ planId: string; date?: string }>()
  const [copied, setCopied] = useState(false)

  const source = params.get('source')
  const date = params.get('date')
  async function sharePlan() {
    let link = shortUrlBase + "/api/v1/plan/" + planId;
    const paramsObj: Record<string, string> = {};
    if (source) paramsObj.source = source;
    if (date) paramsObj.date = date;
    const search = new URLSearchParams(paramsObj).toString();
    if (search) link += `?${search}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
    }
  }
  return <Button variant="ghost" size="icon" onClick={sharePlan} >{copied ? <Check className="size-4" /> : <Link className="size-4" />}</Button>
}

export default ShareButton
