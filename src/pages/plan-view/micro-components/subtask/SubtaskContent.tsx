import type { Subtask } from '@/types/plan'
import { SourceReferenceContent } from './SourceReference-Content'
import { TextContent } from './Text-Content'
import ImageContent from './Image-Content'
import VideoContent from './Video-Content'

export function SubtaskContent({ subtask }: { subtask: Subtask }) {
    switch (subtask.content_type) {
        case "TEXT":
            return <TextContent content={subtask.content} />

        case "IMAGE":
            return <ImageContent content={subtask.content} />

        case "VIDEO":
            return <VideoContent content={subtask.content} />

        case "SOURCE_REFERENCE":
            return <SourceReferenceContent content={subtask.content} />

        default:
            return (
                <div className="text-sm text-[#9a9a9a]">{subtask.content}</div>
            )
    }
}
