import { useState } from "react"
import { InfoIcon, Loader2, XIcon } from "lucide-react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/atom/dialog"
import { Button } from "@/components/ui/atom/button"
import { useAboutPlanWithFallback } from "@/client_details/hooks"




const InfoModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const {data,isLoading:isPending}=useAboutPlanWithFallback(isOpen)
   
    const handleOpenChange = (open: boolean) => {
        if(open){
              window.scroll({
                top:0
              })
        }
        setIsOpen(open)
    }
  


    const sortedTasks = data
        ? [...data.tasks].sort((a, b) => a.display_order - b.display_order)
        : []

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <div className='flex pl-2 items-center gap-1 cursor-pointer text-xs hover:underline'>
                    <InfoIcon className="size-3 text-gray-500/80" />
                    <span className="text-gray-500/80 ">How it works</span>
                </div>
            </DialogTrigger>
            <DialogContent
                showCloseButton={false}
                className="sm:min-w-3xl rounded-none sm:rounded-lg w-full h-screen sm:h-max overflow-y-auto max-w-full sm:max-w-3xl p-0"
            >
                <DialogHeader className="sticky top-0 z-10 border-b bg-popover ">
                   
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
