import { extractYouTubeId } from '@/lib/utils'
import type { Subtask } from '@/types/plan'

export function SubtaskContent({ subtask }: { subtask: Subtask }) {
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