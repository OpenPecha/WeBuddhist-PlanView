export function TextContent({ content }: { content: string }) {
    return (
        <div className="whitespace-pre-wrap text-[20px] leading-[1.7] text-[#3a3a3a]">
            {content}
        </div>
    )
}

export default TextContent