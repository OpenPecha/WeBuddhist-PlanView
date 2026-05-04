import { SubtaskContent } from "./SubtaskContent"
import type { Task } from "@/types/plan"

export function TaskSection({ task }: { task: Task }) {
    const sortedSubtasks = [...task.subtasks].sort(
        (a, b) => a.display_order - b.display_order
    )

    return (
        <section className="space-y-2">
            <h2 className="text-lg font-serif text-foreground">
                {task.title}
            </h2>
            <div className="space-y-2">
                {sortedSubtasks.map((subtask) => (
                    <SubtaskContent key={subtask.id} subtask={subtask} />
                ))}
            </div>
        </section>
    )
} 