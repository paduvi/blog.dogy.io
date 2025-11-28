import React from 'react';

export default function SeriesPostSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 border-b last:border-0">
            {/* Post Number Skeleton */}
            <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-200 shimmer"></div>
            </div>

            {/* Content Skeleton */}
            <div className="flex-grow min-w-0">
                {/* Title */}
                <div className="h-6 bg-gray-200 rounded w-3_4 mb-3 shimmer"></div>

                {/* Excerpt */}
                <div className="h-4 bg-gray-200 rounded w-full mb-2 shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-2_3 mb-4 shimmer"></div>

                {/* Metadata */}
                <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded w-24 shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 shimmer"></div>
                </div>
            </div>

            {/* Image Skeleton */}
            <div className="flex-shrink-0">
                <div className="w-64 h-48 bg-gray-200 rounded-lg shimmer"></div>
            </div>
        </div>
    );
}
