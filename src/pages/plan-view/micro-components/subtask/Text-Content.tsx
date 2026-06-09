import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { isMarkdown } from "@/lib/utils"

const contentClassName = "text-[20px] leading-[1.7] text-[#3a3a3a]"

export function TextContent({ content }: { content: string }) {
    if (isMarkdown(content)) {
        return (
            <div
                className={`${contentClassName} rich-html [&_p:not(:last-child)]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-[#ECECEC] [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:bg-[#fbfbfb] [&_pre]:p-3 [&_code]:rounded-sm [&_code]:bg-[#fbfbfb] [&_code]:px-1`}
            >
                <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
            </div>
        )
    }
    return (
        <div className={`whitespace-pre-wrap ${contentClassName}`}>
            {content}
        </div>
    )
}

export default TextContent
