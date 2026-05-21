import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"
import "@/firebase"
import App from "./App.tsx"
import { PostHogProvider } from '@posthog/react'

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2026-01-30',
} as const

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN} options={options}>
          <App />
        </PostHogProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
