export const RegionCardSkeleton = () => {
    return (
        <div className="flex flex-col items-start p-4 rounded-xl border border-border/50 bg-muted/20 animate-pulse">
            <div className="h-4 w-2/3 bg-muted rounded mb-2" />
            <div className="h-3 w-1/3 bg-muted rounded" />
        </div>
    );
};
