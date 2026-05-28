import type { AxiosError } from "axios"
import type { PlanError } from "@/types/plan"
import { useTranslation } from "react-i18next"

export function ErrorState({ error }: { error: Error }) {
    const { t } = useTranslation()
    const axiosError = error as AxiosError<PlanError>
    const detail = axiosError.response?.data?.detail
    const is404 = axiosError.response?.status === 404

    return (
        <div className="flex flex-col items-center w-full justify-center text-center">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#9a9a9a]">
                {is404 ? t("error.notFound") : t("common.error")}
            </span>
            <h2 className="font-serif text-2xl tracking-[-0.02em] text-[#1a1a1a]">
                {is404 ? t("error.noContent") : t("error.somethingWrong")}
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-[#707070]">
                {detail ?? error.message}
            </p>
        </div>
    )
}
