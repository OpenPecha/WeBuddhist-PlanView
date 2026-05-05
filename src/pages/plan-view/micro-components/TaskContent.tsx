import { SubtaskContent } from "./subtask/SubtaskContent"
import type { Task } from "@/types/plan"
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/atom/accordion"

interface TaskSectionProps {
    task: Task
    index?: number
}

export function TaskSection({ task, index }: TaskSectionProps) {
    const sortedSubtasks = [...task.subtasks].sort(
        (a, b) => a.display_order - b.display_order
    )

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
                {sortedSubtasks.map((subtask) => (
                    <SubtaskContent key={subtask.id} subtask={subtask} />
                ))}
            </AccordionContent>
        </AccordionItem>
    )
}
