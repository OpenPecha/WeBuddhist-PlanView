import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { logEvent } from "firebase/analytics"
import { analytics } from "@/firebase"

export function FirebaseRouteAnalytics() {
  const location = useLocation()

  useEffect(() => {
    if (!analytics) return

    logEvent(analytics, "page_view", {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [location])

  return null
}
