export default function CategoryPostSkeleton() {
    return (
        <div className="grid grid-cols-1 md-grid-cols-3 gap-6 pb-8 border-b">
            {/* Left: Content - 2 columns on medium screens */}
            <div className="md-col-span-2 flex flex-col justify-between">
                <div>
                    {/* Title skeleton - 2 lines */}
                    <div className="mb-3">
                        <div className="skeleton-title shimmer h-8"></div>
                        <div className="skeleton-title-short shimmer h-8 w-3-4"></div>
                    </div>

                    {/* Excerpt skeleton - 2 lines */}
                    <div className="mb-4">
                        <div className="skeleton-excerpt shimmer"></div>
                        <div className="skeleton-excerpt shimmer w-4-5"></div>
                    </div>
                </div>

                {/* Meta info skeleton */}
                <div className="flex items-center gap-4">
                    {/* Date */}
                    <div className="flex items-center gap-2">
                        <div className="skeleton-category shimmer w-4 h-4"></div>
                        <div className="skeleton-text shimmer w-24 h-4"></div>
                    </div>
                    {/* Read time */}
                    <div className="flex items-center gap-2">
                        <div className="skeleton-category shimmer w-4 h-4"></div>
                        <div className="skeleton-text shimmer w-16 h-4"></div>
                    </div>
                </div>
            </div>

            {/* Right: Image - 1 column on medium screens */}
            <div className="relative aspect-video md-aspect-square rounded-lg overflow-hidden">
                <div className="skeleton-image shimmer"></div>
            </div>
        </div>
    );
}
