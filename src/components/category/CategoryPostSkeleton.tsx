export default function CategoryPostSkeleton() {
    return (
        <div className="grid grid-cols-1 md_grid-cols-3 gap-6 pb-8 border-b">
            {/* Left: Content - 2 columns on medium screens */}
            <div className="md_col-span-2 flex flex-col justify-between">
                <div>
                    {/* Title skeleton - 2 lines */}
                    <div className="mb-3">
                        <div className="skeleton-title shimmer" style={{ height: '2rem' }}></div>
                        <div className="skeleton-title-short shimmer" style={{ height: '2rem', width: '70%' }}></div>
                    </div>

                    {/* Excerpt skeleton - 2 lines */}
                    <div className="mb-4">
                        <div className="skeleton-excerpt shimmer"></div>
                        <div className="skeleton-excerpt shimmer" style={{ width: '85%' }}></div>
                    </div>
                </div>

                {/* Meta info skeleton */}
                <div className="flex items-center gap-4">
                    {/* Date */}
                    <div className="flex items-center gap-2">
                        <div className="skeleton-category shimmer" style={{ width: '14px', height: '14px', marginBottom: 0 }}></div>
                        <div className="skeleton-text shimmer" style={{ width: '100px', height: '14px' }}></div>
                    </div>
                    {/* Read time */}
                    <div className="flex items-center gap-2">
                        <div className="skeleton-category shimmer" style={{ width: '14px', height: '14px', marginBottom: 0 }}></div>
                        <div className="skeleton-text shimmer" style={{ width: '60px', height: '14px' }}></div>
                    </div>
                </div>
            </div>

            {/* Right: Image - 1 column on medium screens */}
            <div className="relative aspect-video md_aspect-square rounded-lg overflow-hidden">
                <div className="skeleton-image shimmer"></div>
            </div>
        </div>
    );
}
