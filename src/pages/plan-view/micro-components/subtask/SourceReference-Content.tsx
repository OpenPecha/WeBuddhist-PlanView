import { convertPali, SCRIPTS } from "pali_script_convertor"
import { useAudioPlayer } from "../AudioPlayerContext"
import { useTimeStamps } from "@/client_details/hooks"
import useSeriesData from "../hooks/useSeriesData"

interface SourceReferenceContentProps {
    content: string
    targetScript?: any
}

interface TimestampSegment {
    time_stamp: number
}

function findActiveIndexByTimestamp(
    data: TimestampSegment[] | null,
    currentTime: number,
): number {
    if (!Array.isArray(data) || data.length === 0) return -1;
  
    let left = 0;
    let right = data.length - 1;
    let previousIndex = -1;
  
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const itemTime = data[mid].time_stamp;
  
      if (itemTime <= currentTime) {
        previousIndex = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  
    // If there is an item less than or equal to currentTime, use it
    if (previousIndex !== -1) {
      return previousIndex;
    }
  
    // If currentTime is before the first item, return nearest item
    return 0;
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
                return targetScript ? convertPali(text, targetScript, SCRIPTS.RO) : text
            }).join("<br />")
        }
        if (tags?.length && tags.some(tag => tag.includes("h"))) {
            const convertedtext = targetScript ? convertPali(content, targetScript, SCRIPTS.RO) : content
            return `${tags[0]}${convertedtext}${tags[1]}`

        }
        return targetScript ? convertPali(content, targetScript, SCRIPTS.RO) : content
    }
    const { currentTime, seriesId } = useAudioPlayer();
    const seriesData = useSeriesData(seriesId);
    const data = useTimeStamps(seriesData?.currentDay);    
    return (
        <div className=" rounded-sm bg-[#fbfbfb]">
            {segments.map((text, index) => {
             
             const currentTimestampIndex = findActiveIndexByTimestamp(data, Number(currentTime))
             const shouldHighlight = currentTimestampIndex === index
             return     <div
                    key={index}
                    className={`w-full min-h-12 whitespace-pre-wrap rich-html text-xl font-serif p-2 ${shouldHighlight ? "font-bold" : ""}`}
                >
                    {!text.trim().startsWith("<h") && (
                        <span className="font-medium">{index + 1}. </span>
                    )}
                    <span className={`${targetScript === "tb" && "tibetan-font"}`} dangerouslySetInnerHTML={{ __html: render(text) }} />
                </div>
            }
            )}
        </div>
    )
}
