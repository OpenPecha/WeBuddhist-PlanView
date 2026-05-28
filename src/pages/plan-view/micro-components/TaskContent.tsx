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



interface TaskSectionProps {

    task: Task

    index?: number

    audioURL: string | null

}



function isPaliTask(title: string): boolean {

    return title.toLowerCase().includes("chanting in pali")

}



export function TaskSection({ task, index, audioURL }: TaskSectionProps) {

    const sortedSubtasks = [...task.subtasks].sort(

        (a, b) => a.display_order - b.display_order

    )

    const showScriptDropdown = isPaliTask(task.title)

    const [script, setScript] = useState<(typeof SCRIPTS)[keyof typeof SCRIPTS]>(SCRIPTS.RO)

    const targetScript = showScriptDropdown ? script : null

    const startMs = task.start_ms ?? null

    const endMs = task.end_ms ?? null

    const showTaskAudio =

        audioURL != null && startMs != null && endMs != null



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
                <div className="flex justify-between items-center gap-2 p-2">
                {showTaskAudio && (
                    <AudioPlayButton showText={true} className="w-max px-2 gap-2" src={audioURL} startMs={startMs} endMs={endMs} stopPropagation />
                )}
                {showScriptDropdown && (



                        <PaliScriptDropdown value={script} onChange={setScript} />

                        
                    )}
                    </div>

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

