import { Skeleton } from "@/components/ui/skeleton";

// Mirrors TopBar.tsx: title on the left, search in the middle, theme
// toggle + notifications + avatar on the right.
export default function TopBarSkeleton() {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-32" />
            </div>
            <div className="hidden flex-1 max-w-xl mx-4 md:block">
                <Skeleton className="h-9 w-full rounded-lg" />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-full" />
            </div>
        </header>
    );
}