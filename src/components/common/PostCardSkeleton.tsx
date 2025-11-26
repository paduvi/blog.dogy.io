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
                    <div className="skeleton-category" style={{ width: '120px', height: '14px' }}></div>
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
                        <div className="skeleton-category" style={{ width: '14px', height: '14px', marginBottom: 0 }}></div>
                        <div className="skeleton-text" style={{ width: '60px', height: '14px' }}></div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2">
                        <div className="skeleton-category" style={{ width: '80px', marginBottom: 0 }}></div>
                        <div className="skeleton-category" style={{ width: '90px', marginBottom: 0 }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
