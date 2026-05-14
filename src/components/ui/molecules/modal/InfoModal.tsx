import { useEffect, useState } from "react"
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
import { useAboutPlanWithFallback } from "@/client_details/hooks"




const InfoModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [showAboutLabel, setShowAboutLabel] = useState(false)
    const {data,error,isLoading:isPending}=useAboutPlanWithFallback(isOpen)
   
    const handleOpenChange = (open: boolean) => {
        if(open){
              window.scroll({
                top:0
              })
        }
        setIsOpen(open)
    }
    useEffect(() => {
        const footer = document.querySelector("#we_footer")

        if (!footer) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowAboutLabel(entry.isIntersecting)
            },
            { threshold: 0.25 }
        )

        observer.observe(footer)

        return () => {
            observer.disconnect()
        }
    }, [])


    const sortedTasks = data
        ? [...data.tasks].sort((a, b) => a.display_order - b.display_order)
        : []

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size={showAboutLabel ? "default" : "icon"}
                    aria-label={showAboutLabel ? "Open about modal" : "Open plan information"}
                    className={showAboutLabel ? "gap-2 px-3" : undefined}
                >
                    <InfoIcon className="size-4 text-gray-600" />
                    {showAboutLabel && <span>About</span>}
                </Button>
            </DialogTrigger>
            <DialogContent
                showCloseButton={false}
                className="sm:min-w-3xl rounded-none sm:rounded-lg w-full h-screen sm:h-[90vh] overflow-y-auto max-w-full sm:max-w-3xl p-0"
            >
                <DialogHeader className="sticky top-0 z-10 border-b bg-popover ">
                    <img src={data?.image.original} alt={data?.plan_title} className="w-full h-full max-h-96 object-cover rounded-br-2xl" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/20 backdrop-blur-sm ">

                    <DialogTitle className="font-serif text-lg">
                        {data?.plan_description ?? "Plan information"}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Detailed information about the tasks in this plan.
                    </DialogDescription>
                    {data?.plan_title && (
                        <p className="text-xs text-gray-800">
                            {data.plan_title}
                        </p>
                    )}
                    </div>
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
                    {isPending && (
                        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" />
                        </div>
                    )}

                    {error && !isPending && (
                        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            Failed to load plan information. Please try again.
                        </div>
                    )}

                    {data && !isPending && (
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
