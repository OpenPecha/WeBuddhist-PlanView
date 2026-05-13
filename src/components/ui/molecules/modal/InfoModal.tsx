import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { InfoIcon, Loader2, XIcon } from "lucide-react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/atom/dialog"
import { Button } from "@/components/ui/atom/button"
import api from "@/lib/api"
import type { PlanDay } from "@/types/plan"

interface InfoModalProps {
    planId: string
}

const fetchPlanInfo = async (planId: string): Promise<PlanDay> => {
    const { data } = await api.get<PlanDay>(`/api/v1/plans/${planId}/daily`)
    return data
}

const InfoModal = ({ planId }: InfoModalProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const { data, error, isLoading } = useQuery<PlanDay>({
        queryKey: ["planInfo", planId],
        queryFn: () => fetchPlanInfo(planId),
        enabled: isOpen,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })

    const sortedTasks = data
        ? [...data.tasks].sort((a, b) => a.display_order - b.display_order)
        : []

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    aria-label="Open plan information"
                >
                    <InfoIcon className="size-4 text-gray-600" />
                </Button>
            </DialogTrigger>
            <DialogContent
                showCloseButton={false}
                className="sm:min-w-3xl rounded-none sm:rounded-lg w-full h-screen sm:h-[90vh] overflow-y-auto max-w-full sm:max-w-3xl p-0"
            >
                <DialogHeader className="sticky top-0 z-10 border-b bg-popover px-6 py-4 pr-14">
                    <DialogTitle className="font-serif text-lg">
                        {data?.plan_description ?? "Plan information"}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Detailed information about the tasks in this plan.
                    </DialogDescription>
                    {data?.plan_title && (
                        <p className="text-xs text-muted-foreground">
                            {data.plan_title}
                        </p>
                    )}
                    <DialogClose asChild>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Close"
                            className="absolute top-3 right-3"
                        >
                            <XIcon className="size-4" />
                        </Button>
                    </DialogClose>
                </DialogHeader>

                <div className="px-6 pb-8">
                    {isLoading && (
                        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" />
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            Failed to load plan information. Please try again.
                        </div>
                    )}

                    {data && !isLoading && (
                        <ul className="divide-y divide-gray-100">
                            {sortedTasks.map((task) => (
                                <li key={task.id} className="py-5">
                                    <h3 className="mb-2 text-base font-medium text-gray-900">
                                        {task.title}
                                    </h3>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        {task.subtasks
                                            .filter((subtask) => subtask.content_type === "TEXT")
                                            .map((subtask) => (
                                                <p
                                                    key={subtask.id}
                                                    className="whitespace-pre-wrap leading-relaxed"
                                                >
                                                    {subtask.content}
                                                </p>
                                            ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default InfoModal
