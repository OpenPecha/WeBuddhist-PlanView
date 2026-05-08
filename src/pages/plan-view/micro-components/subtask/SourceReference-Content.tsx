import { convertPali, SCRIPTS } from "pali_script_convertor"

interface SourceReferenceContentProps {
    content: string
    targetScript?: any
}

export function SourceReferenceContent({
    content,
    targetScript = null,
}: SourceReferenceContentProps) {
    const segments = content
        .replace(/⤵/g, '<br />')
        .split("\n")
        .filter(Boolean)

    const extractTags = (html: string) => {
        const tags = html.match(/<[^>]+>/g)
        const content = html.replace(/<[^>]+>/g, "")
        return { tags, content }
    }
    const render = (text: string) => {
        const { tags, content } = extractTags(text)
        if (tags?.length && tags.some(tag => tag.includes("br"))) {
            return text.split("<br />").map((text) => {
                return convertPali(text, targetScript, SCRIPTS.RO)
            }).join("<br />")
        }
        if (tags?.length && tags.some(tag => tag.includes("h"))) {
            const convertedtext = convertPali(content, targetScript, SCRIPTS.RO)
            return `${tags[0]}${convertedtext}${tags[1]}`

        }
        return convertPali(content, targetScript, SCRIPTS.RO)
    }

    return (
        <div className=" rounded-sm bg-white">
            {segments.map((text, index) => (
                <div
                    key={index}
                    className="w-full font-serif min-h-12 whitespace-pre-wrap text-base p-2"
                >
                    <span className="font-medium">{index + 1}. </span>
                    <span dangerouslySetInnerHTML={{ __html: render(text) }} />
                </div>
            ))}
        </div>
    )
}
