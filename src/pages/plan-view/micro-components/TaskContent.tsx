import { SubtaskContent } from "./SubtaskContent"
import type { Task } from "@/types/plan"

export function TaskSection({ task, index }: { task: Task; index?: number }) {
    const sortedSubtasks = [...task.subtasks].sort(
        (a, b) => a.display_order - b.display_order
    )

    return (
        <section className="space-y-5">
            <div className="flex items-baseline gap-3">
                {typeof index === "number" && (
                    <span className="font-serif text-sm tabular-nums text-[#9a9a9a]">
                        {String(index).padStart(2, "0")}
                    </span>
                )}
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#1a1a1a] sm:text-[22px]">
                    {task.title}
                </h2>
            </div>
            <div className="space-y-4 border-l border-[#ECECEC] pl-5 sm:pl-6">
                {sortedSubtasks.map((subtask) => (
                    <SubtaskContent key={subtask.id} subtask={subtask} />
                ))}
            </div>
        </section>
    )
}
