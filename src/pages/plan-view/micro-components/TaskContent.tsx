import { SubtaskContent } from "./SubtaskContent"
import { Clock } from "lucide-react"
import type { Task } from "@/types/plan"

export function TaskSection({ task }: { task: Task }) {
    const sortedSubtasks = [...task.subtasks].sort(
        (a, b) => a.display_order - b.display_order
    )

    return (
        <section className="space-y-4">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {task.title}
                </h2>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-3.5" />
                    <span>{task.estimated_time} min</span>
                </div>
            </div>
            <div className="space-y-4">
                {sortedSubtasks.map((subtask) => (
                    <SubtaskContent key={subtask.id} subtask={subtask} />
                ))}
            </div>
        </section>
    )
} 