import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/atom/dialog"
import { Button } from "@/components/ui/atom/button"
import { InfoIcon } from "lucide-react"

const InfoModal = () => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="outline" size="icon">
                    <InfoIcon className="size-4 text-gray-600" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Info</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default InfoModal