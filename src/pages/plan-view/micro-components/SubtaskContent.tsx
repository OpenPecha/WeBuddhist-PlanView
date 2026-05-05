import { extractYouTubeId } from '@/lib/utils'
import type { Subtask } from '@/types/plan'

export function SubtaskContent({ subtask }: { subtask: Subtask }) {
    switch (subtask.content_type) {
        case "TEXT":
            return (
                <div className="whitespace-pre-wrap text-[15px] leading-[1.7] text-[#3a3a3a]">
                    {subtask.content}
                </div>
            )

        case "IMAGE":
            return (
                <div className="overflow-hidden rounded-xl border border-[#ECECEC] bg-white">
                    <img
                        src={subtask.content}
                        alt=""
                        className="w-full object-cover"
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
                        className="inline-block break-all text-sm text-[#1a1a1a] underline decoration-[#9a9a9a] decoration-1 underline-offset-4 transition-colors hover:decoration-[#1a1a1a]"
                    >
                        {subtask.content}
                    </a>
                )
            }
            return (
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-[#ECECEC] bg-black">
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

        case "SOURCE_REFERENCE": {
            const html = subtask.content.replace(/⤵/g, '<br />')
            return (
                <figure className="rounded-xl border border-[#ECECEC] bg-white p-5 sm:p-6">
                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-px w-6 bg-[#ECECEC]" />
                        <span className="text-[10px] uppercase tracking-[0.12em] text-[#9a9a9a]">
                            Source
                        </span>
                    </div>
                    <div
                        className="prose prose-sm rich-html max-w-none leading-[1.7] text-[#3a3a3a]"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </figure>
            )
        }

        default:
            return (
                <div className="text-sm text-[#9a9a9a]">{subtask.content}</div>
            )
    }
}
