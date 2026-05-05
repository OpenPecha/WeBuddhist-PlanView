export function SourceReferenceContent({ content }: { content: string }) {
    const segments = content
        .replace(/⤵/g, '<br />')
        .split("\n")
        .filter(Boolean)

    return (
        <div className=" rounded-sm bg-white">
            {segments.map((text, index) => (
                <div
                    key={index}
                    className="w-full font-serif min-h-12 whitespace-pre-wrap text-base p-2"
                >
                    <span className="font-medium">{index + 1}. </span>
                    <span dangerouslySetInnerHTML={{ __html: text }} />
                </div>
            ))}
        </div>
    )
}