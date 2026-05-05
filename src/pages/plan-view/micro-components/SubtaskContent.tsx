import { extractYouTubeId } from '@/lib/utils'
import type { Subtask } from '@/types/plan'

export const SourceReferenceContent = ({ content }: { content: string }) => {
    const segments = content
        .replace(/⤵/g, '<br />')
        .split("\n")
        .filter(Boolean)

    return (
        <div className="space-y-3">
            {segments.map((text, index) => (
                <div
                    key={index}
                    className="w-full font-serif min-h-12 whitespace-pre-wrap text-base p-3 border rounded-md bg-white"
                >
                    <span className="font-medium">{index + 1}. </span>
                    <span dangerouslySetInnerHTML={{ __html: text }} />
                </div>
            ))}
        </div>
    )
}

export function SubtaskContent({ subtask }: { subtask: Subtask }) {
    switch (subtask.content_type) {
        case "TEXT":
            return (
                <div className="whitespace-pre-wrap font-serif text-[15px] leading-[1.7] text-[#3a3a3a]">
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

        case "SOURCE_REFERENCE":
            return <SourceReferenceContent content={subtask.content} />

        default:
            return (
                <div className="text-sm text-[#9a9a9a]">{subtask.content}</div>
            )
    }
}
