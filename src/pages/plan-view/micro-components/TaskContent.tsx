import { SubtaskContent } from "./SubtaskContent"
import type { Task } from "@/types/plan"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/atom/collapsible"
import { ChevronDown } from "lucide-react"

interface TaskSectionProps {
    task: Task
    index?: number
    isOpen?: boolean
    onToggle?: () => void
}

export function TaskSection({ task, index, isOpen, onToggle }: TaskSectionProps) {
    const sortedSubtasks = [...task.subtasks].sort(
        (a, b) => a.display_order - b.display_order
    )

    return (
        <Collapsible open={isOpen} onOpenChange={onToggle}>
            <CollapsibleTrigger className="group w-full">
                <section className="flex items-baseline gap-3">
                    {typeof index === "number" && (
                        <span className="font-serif text-sm tabular-nums text-[#9a9a9a]">
                            {String(index).padStart(2, "0")}
                        </span>
                    )}
                    <h2 className="flex items-center gap-2 text-xl tracking-[-0.01em] text-[#3D3D3A]">
                        {task.title}
                        <ChevronDown className="h-5 w-5 transition-transform duration-250 ease-out group-data-[state=closed]:-rotate-90" />
                    </h2>
                </section>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="space-y-4 border-l mt-4 border-[#ECECEC] pl-5 sm:pl-6">
                    {sortedSubtasks.map((subtask) => (
                        <SubtaskContent key={subtask.id} subtask={subtask} />
                    ))}
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}
