import { extractYouTubeId } from '@/lib/utils'

const VideoContent = ({ content }: { content: string }) => {
    const videoId = extractYouTubeId(content)
    if (!videoId) {
        return (
            <a
                href={content}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block break-all text-sm text-[#1a1a1a] underline decoration-[#9a9a9a] decoration-1 underline-offset-4 transition-colors hover:decoration-[#1a1a1a]"
            >
                {content}
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

export default VideoContent