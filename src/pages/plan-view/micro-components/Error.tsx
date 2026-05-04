import type { AxiosError } from "axios"
import { AlertCircle } from "lucide-react"
import type { PlanError } from "@/types/plan"

export function ErrorState({ error }: { error: Error }) {
    const axiosError = error as AxiosError<PlanError>
    const detail = axiosError.response?.data?.detail
    const is404 = axiosError.response?.status === 404

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="size-8 text-destructive" />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">
                    {is404 ? "No Content Available" : "Something went wrong"}
                </h2>
                <p className="max-w-md text-sm text-muted-foreground">
                    {detail ?? error.message}
                </p>
            </div>
        </div>
    )
}