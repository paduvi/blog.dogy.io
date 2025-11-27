'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SortControl() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'newest';

    const toggleSort = () => {
        const newSort = currentSort === 'newest' ? 'oldest' : 'newest';
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', newSort);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <button
                onClick={toggleSort}
                className="text-sm font-medium text-primary hover-underline focus-outline-none"
            >
                {currentSort === 'newest' ? 'Newest' : 'Oldest'}
            </button>
        </div>
    );
}
