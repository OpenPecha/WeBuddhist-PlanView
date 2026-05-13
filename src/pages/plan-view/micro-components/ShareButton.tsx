import { Button } from '@/components/ui/atom/button'
import { Share } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

function ShareButton() {
 const [params]=useSearchParams()
 const source=params.get('source')

 async function sharePlan() {
    const link = source ?? window.location.href;
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(link);
        }
        if (navigator.share) {
        await navigator.share({ url: link, title: 'Plan' /* optional */ });
        }
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
    }   
  }
  return (
                <Button variant="ghost" size="icon"onClick={sharePlan} ><Share className="size-4" /></Button>
  )
}

export default ShareButton
