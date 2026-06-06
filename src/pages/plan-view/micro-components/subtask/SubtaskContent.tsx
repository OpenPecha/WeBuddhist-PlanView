import type { Subtask } from '@/types/plan'
import { SourceReferenceContent } from './SourceReference-Content'
import { TextContent } from './Text-Content'
import ImageContent from './Image-Content'
import VideoContent from './Video-Content'

interface SubtaskContentProps {
    subtask: Subtask
    targetScript?: any
}

export function SubtaskContent({ subtask, targetScript = null }: SubtaskContentProps) {
    switch (subtask.content_type) {
        case "TEXT":
            return <TextContent content={subtask.content} />

        case "IMAGE":
            return <ImageContent content={subtask.image_url ?? subtask.content} />

        case "VIDEO":
            return <VideoContent content={subtask.content} />

        case "SOURCE_REFERENCE":
            return (
                <SourceReferenceContent
                    content={subtask.content}
                    targetScript={targetScript}
                />
            )

        default:
            return (
                <div className="text-sm text-[#9a9a9a]">{subtask.content}</div>
            )
    }
}
