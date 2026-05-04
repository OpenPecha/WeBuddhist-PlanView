import type { AxiosError } from "axios"
import type { PlanError } from "@/types/plan"

export function ErrorState({ error }: { error: Error }) {
    const axiosError = error as AxiosError<PlanError>
    const detail = axiosError.response?.data?.detail
    const is404 = axiosError.response?.status === 404

    return (
        <div className="flex flex-col items-center w-full justify-center text-center">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#9a9a9a]">
                {is404 ? "404" : "Error"}
            </span>
            <h2 className="font-serif text-2xl tracking-[-0.02em] text-[#1a1a1a]">
                {is404 ? "No content available" : "Something went wrong"}
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-[#707070]">
                {detail ?? error.message}
            </p>
        </div>
    )
}
