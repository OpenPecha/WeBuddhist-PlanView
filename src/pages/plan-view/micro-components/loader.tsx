import { Skeleton } from "@/components/ui/skeleton";

export function PlanViewerSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-20 w-full" />
            </div>
        </div>
    )
} 