"use client";

import { useSearchParams } from 'next/navigation';
import { posts } from '@/data/mockData';
import PostCard from '@/components/common/PostCard';
import { Search } from 'lucide-react';
import { Suspense } from 'react';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const searchResults = posts.filter((post) => {
        const searchTerm = query.toLowerCase();
        return (
            post.title.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm)
        );
    });

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
                    <Search size={32} className="text-primary" />
                    Search Results
                </h1>
                <p className="text-muted text-lg">
                    Found {searchResults.length} results for <span className="font-bold text-main">"{query}"</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md_grid-cols-2 lg_grid-cols-3 gap-6">
                {searchResults.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            {searchResults.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Search size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No results found</h3>
                    <p className="text-muted">Try searching for something else.</p>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="container py-8">Loading...</div>}>
            <SearchResults />
        </Suspense>
    );
}
