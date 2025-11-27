export default function PostCardSkeleton() {
    return (
        <div className="card flex flex-col shimmer">
            {/* Image skeleton */}
            <div className="relative w-full h-48 overflow-hidden">
                <div className="skeleton-image"></div>
            </div>

            {/* Content skeleton */}
            <div className="p-4 flex flex-col justify-between flex-1">
                {/* Date skeleton */}
                <div className="mb-2">
                    <div className="skeleton-category w-32 h-4"></div>
                </div>

                {/* Title skeleton */}
                <div className="mb-2">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-title-short"></div>
                </div>

                {/* Excerpt skeleton */}
                <div className="mb-4">
                    <div className="skeleton-excerpt"></div>
                    <div className="skeleton-excerpt"></div>
                </div>

                {/* Footer skeleton */}
                <div className="flex flex-col gap-3 mt-auto">
                    {/* Read time */}
                    <div className="flex items-center gap-2">
                        <div className="skeleton-category w-4 h-4"></div>
                        <div className="skeleton-text w-16 h-4"></div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2">
                        <div className="skeleton-category w-20"></div>
                        <div className="skeleton-category w-24"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
