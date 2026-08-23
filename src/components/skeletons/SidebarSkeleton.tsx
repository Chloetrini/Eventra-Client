import { Skeleton } from "@/components/ui/skeleton";

// Mirrors SideBar.tsx's actual layout section-for-section (logo, admin
// console card, then the 4 nav groups) so there's no visible reflow when
// the real content swaps in.
export default function SideBarSkeleton() {
    return (
        <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card p-4">
            {/* Logo area */}
            <div className="mb-6 flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-12 rounded-md" />
            </div>

            {/* Admin console card */}
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2 w-1/2" />
                </div>
            </div>

            {/* Navigation menu */}
            <div className="space-y-6">
                {/* Overview */}
                <div className="space-y-2">
                    <Skeleton className="h-9 w-full rounded-lg" />
                </div>

                {/* Needs Action */}
                <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-9 w-full rounded-lg" />
                    <Skeleton className="h-9 w-full rounded-lg" />
                    <Skeleton className="h-9 w-full rounded-lg" />
                </div>

                {/* Manage */}
                <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-9 w-full rounded-lg" />
                    <Skeleton className="h-9 w-full rounded-lg" />
                    <Skeleton className="h-9 w-full rounded-lg" />
                </div>

                {/* Platform */}
                <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-9 w-full rounded-lg" />
                    <Skeleton className="h-9 w-full rounded-lg" />
                    <Skeleton className="h-9 w-full rounded-lg" />
                </div>
            </div>
        </aside>
    );
}
