import { useParams, useNavigate } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { usePlanDay } from "@/hooks/usePlanDay"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, Clock, AlertCircle } from "lucide-react"
import type { Subtask, Task } from "@/types/plan"
import { useState } from "react"
import { AxiosError } from "axios"
import type { PlanError } from "@/types/plan"

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&/#]+)/
  )
  return match?.[1] ?? null
}

function SubtaskContent({ subtask }: { subtask: Subtask }) {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

  switch (subtask.content_type) {
    case "TEXT":
      return (
        <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
          {subtask.content}
        </div>
      )

    case "IMAGE":
      return (
        <div className="overflow-hidden rounded-lg">
          <img
            src={`${baseUrl}/${subtask.content}`}
            alt=""
            className="w-full rounded-lg object-cover"
            loading="lazy"
          />
        </div>
      )

    case "VIDEO": {
      const videoId = extractYouTubeId(subtask.content)
      if (!videoId) {
        return (
          <a
            href={subtask.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:opacity-80"
          >
            {subtask.content}
          </a>
        )
      }
      return (
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      )
    }

    case "SOURCE_REFERENCE":
      return (
        <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
          <div
            className="prose prose-invert max-w-none text-sm leading-relaxed text-foreground/80"
            dangerouslySetInnerHTML={{ __html: subtask.content }}
          />
        </div>
      )

    default:
      return (
        <div className="text-muted-foreground">{subtask.content}</div>
      )
  }
}

function TaskSection({ task }: { task: Task }) {
  const sortedSubtasks = [...task.subtasks].sort(
    (a, b) => a.display_order - b.display_order
  )

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {task.title}
        </h2>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-3.5" />
          <span>{task.estimated_time} min</span>
        </div>
      </div>
      <div className="space-y-4">
        {sortedSubtasks.map((subtask) => (
          <SubtaskContent key={subtask.id} subtask={subtask} />
        ))}
      </div>
    </section>
  )
}

function PlanViewerSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  )
}

function ErrorState({ error }: { error: Error }) {
  const axiosError = error as AxiosError<PlanError>
  const detail = axiosError.response?.data?.detail
  const is404 = axiosError.response?.status === 404

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="size-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">
          {is404 ? "No Content Available" : "Something went wrong"}
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          {detail ?? error.message}
        </p>
      </div>
    </div>
  )
}

export function PlanViewer() {
  const { planId, date } = useParams<{ planId: string; date: string }>()
  const navigate = useNavigate()
  const { data, isLoading, error } = usePlanDay(planId!, date!)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const currentDate = date ? parseISO(date) : new Date()
  const formattedDate = format(currentDate, "MMMM d")

  function navigateToDate(newDate: string) {
    navigate(`/${planId}/${newDate}`)
  }

  const sortedTasks = data
    ? [...data.tasks].sort((a, b) => a.display_order - b.display_order)
    : []

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-32" />
            </>
          ) : data ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {data.plan_title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Day {data.day_number} of {data.total_days}
              </p>
            </>
          ) : null}
        </div>

        {/* Calendar Popover */}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              {formattedDate}
              <ChevronDownIcon className="size-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={currentDate}
              defaultMonth={currentDate}
              disabled={(d) => {
                if (!data) return false
                const start = parseISO(data.start_date)
                const end = parseISO(data.end_date)
                return d < start || d > end
              }}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  navigateToDate(format(selectedDate, "yyyy-MM-dd"))
                  setCalendarOpen(false)
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </header>

      {/* Divider */}
      <div className="mb-8 h-px bg-border/50" />

      {/* Content */}
      {isLoading ? (
        <PlanViewerSkeleton />
      ) : error ? (
        <ErrorState error={error} />
      ) : data ? (
        <div className="space-y-10">
          {sortedTasks.map((task) => (
            <TaskSection key={task.id} task={task} />
          ))}
        </div>
      ) : null}

      {/* Divider */}
      <div className="mt-10 h-px bg-border/50" />

      {/* Bottom Navigation */}
      <nav className="mt-6 flex items-center justify-between">
        {data?.previous_date ? (
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => navigateToDate(data.previous_date!)}
          >
            <ChevronLeftIcon className="size-4" />
            {format(parseISO(data.previous_date), "MMM d")}
          </Button>
        ) : (
          <div />
        )}
        {data?.next_date ? (
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => navigateToDate(data.next_date!)}
          >
            {format(parseISO(data.next_date), "MMM d")}
            <ChevronRightIcon className="size-4" />
          </Button>
        ) : (
          <div />
        )}
      </nav>
    </div>
  )
}
