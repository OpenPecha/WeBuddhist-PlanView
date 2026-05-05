export function PlanViewerSkeleton() {
    return (
        <div className="space-y-4">
            {[0, 1].map((i) => (
                <section key={i}>
                    <div className="flex items-baseline gap-3">
                        <div className="h-4 w-6 animate-pulse rounded bg-[#ECECEC]" />
                        <div className="h-6 w-48 animate-pulse rounded bg-[#ECECEC]" />
                    </div>
                    <div className="space-y-4 border-l border-[#ECECEC] pl-5 sm:pl-6">
                        <div className="h-4 w-full animate-pulse rounded bg-[#ECECEC]" />
                        <div className="h-4 w-11/12 animate-pulse rounded bg-[#ECECEC]" />
                        <div className="h-4 w-3/4 animate-pulse rounded bg-[#ECECEC]" />
                    </div>
                </section>
            ))}
        </div>
    )
}
