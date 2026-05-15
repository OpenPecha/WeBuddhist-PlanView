import { useState } from "react"
import { SCRIPTS } from "pali_script_convertor"
import { SubtaskContent } from "./subtask/SubtaskContent"
import type { Task } from "@/types/plan"
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/atom/accordion"
import { PaliScriptDropdown } from "./PaliScriptDropdown"
import { AudioPlayButton } from "./AudioPlayButton"
import { useAudioPlayer } from "./AudioPlayerContext"

interface TaskSectionProps {
    task: Task
    index?: number
}

function isPaliTask(title: string): boolean {
    return title.toLowerCase().includes("chanting in pali")
}

export function TaskSection({ task, index }: TaskSectionProps) {
    const sortedSubtasks = [...task.subtasks].sort(
        (a, b) => a.display_order - b.display_order
    )
    const showScriptDropdown = isPaliTask(task.title)
    const [script, setScript] = useState<any>(SCRIPTS.RO)
    const targetScript = showScriptDropdown ? script : null
    return (
        <AccordionItem value={task.id} className="border-0">
            <AccordionTrigger className="w-full p-0 hover:no-underline">
                <section className="flex items-baseline gap-3">
                    {typeof index === "number" && (
                        <span className="font-serif text-sm tabular-nums text-[#9a9a9a]">
                            {String(index).padStart(1, "0")}
                        </span>
                    )}
                    <h2 className="flex items-center gap-2 text-xl tracking-[-0.01em] text-[#3D3D3A]">
                        {task.title}
                    </h2>
                </section>
            </AccordionTrigger>
            <AccordionContent className="mt-4 space-y-2 border-l border-[#ECECEC] pl-5 sm:pl-6">
                {showScriptDropdown && (
                    <div className="flex justify-between items-center gap-2 p-2">
                        <AudioPlayButton showText={true} className="w-max px-2 gap-2" />
                        <PaliScriptDropdown value={script} onChange={setScript} />
                    </div>
                )}
                {sortedSubtasks.map((subtask) => (
                    <SubtaskContent
                        key={subtask.id}
                        subtask={subtask}
                        targetScript={targetScript}
                    />
                ))}
            </AccordionContent>
        </AccordionItem>
    )
}
