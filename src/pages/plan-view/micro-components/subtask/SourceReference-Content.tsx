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

    const render = (text: string) =>
        targetScript && targetScript !== SCRIPTS.RO
            ? convertPali(text, targetScript, SCRIPTS.RO)
            : text

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
