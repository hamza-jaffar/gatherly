import { Skeleton } from '@/components/ui/skeleton';

export function SpaceGridSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="flex h-[240px] flex-col overflow-hidden rounded-xl border"
                >
                    <div className="h-24 w-full bg-muted/50" />
                    <div className="flex flex-1 flex-col p-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="mt-2 h-4 w-full" />
                        <Skeleton className="mt-1 h-4 w-2/3" />
                        <div className="mt-auto flex gap-4 pt-4">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
