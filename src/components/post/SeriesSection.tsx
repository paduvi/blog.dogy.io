'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { posts, categories } from '@/data/mockData';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { Post } from '@/data/mockData';

interface SeriesSectionProps {
    categorySlug: string;
    categoryName: string;
    currentPostSlug: string;
}

const POSTS_PER_PAGE = 5;

export default function SeriesSection({ categorySlug, categoryName, currentPostSlug }: SeriesSectionProps) {
    const [seriesPosts, setSeriesPosts] = useState<Post[]>([]);
    const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showPrevious, setShowPrevious] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Initialize posts
    useEffect(() => {
        // Get category to find sortOrder
        const category = categories.find(c => c.slug === categorySlug);
        const sortOrder = category?.sortOrder || 'newest';

        // Filter posts by category
        const categoryPosts = posts.filter(p => p.category?.slug === categorySlug);

        // Sort posts according to sortOrder
        const sortedPosts = [...categoryPosts].sort((a, b) => {
            const dateA = new Date(a.publishedAt).getTime();
            const dateB = new Date(b.publishedAt).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        setSeriesPosts(sortedPosts);

        // Find current post index
        const currentIndex = sortedPosts.findIndex(p => p.slug === currentPostSlug);

        // Load enough posts to cover up to currentIndex + initial batch
        const endIndex = currentIndex + POSTS_PER_PAGE;
        setDisplayedPosts(sortedPosts.slice(0, endIndex));
        setHasMore(endIndex < sortedPosts.length);
        setPage(Math.ceil(endIndex / POSTS_PER_PAGE));

        // Reset showPrevious when changing posts
        setShowPrevious(false);
    }, [categorySlug, currentPostSlug]);

    // Load more posts (downwards)
    const loadMore = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);

        setTimeout(() => {
            const currentLength = displayedPosts.length;
            const nextLength = currentLength + POSTS_PER_PAGE;
            const newPosts = seriesPosts.slice(currentLength, nextLength);

            if (newPosts.length > 0) {
                setDisplayedPosts(prev => [...prev, ...newPosts]);
                setHasMore(nextLength < seriesPosts.length);
            } else {
                setHasMore(false);
            }

            setLoading(false);
        }, 300);
    }, [displayedPosts.length, seriesPosts, loading, hasMore]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadMore, hasMore, loading]);

    if (seriesPosts.length === 0) {
        return null;
    }

    // Find current post index in the full list
    const currentIndex = seriesPosts.findIndex(p => p.slug === currentPostSlug);

    // Determine which posts to render
    // If showPrevious is true, show all displayedPosts
    // If showPrevious is false, show only displayedPosts starting from currentIndex
    const visiblePosts = showPrevious
        ? displayedPosts
        : displayedPosts.filter((_, index) => index >= currentIndex);

    const previousPostsCount = currentIndex;

    return (
        <section className="mt-12 max-w-4xl mx-auto">
            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                {/* Header */}
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-1">ARTICLE SERIES</h3>
                        <Link href={`/category/${categorySlug}`} className="text-lg font-bold text-primary hover-underline">
                            {categoryName}
                        </Link>
                    </div>
                    <div className="text-xs font-medium text-muted bg-gray-100 px-2 py-1 rounded">
                        {seriesPosts.length} Posts
                    </div>
                </div>

                {/* Posts List */}
                <div className="divide-y relative">
                    {/* Previous Posts Toggle - Absolutely positioned to float on first divider */}
                    {!showPrevious && previousPostsCount > 0 && (
                        <div className="absolute left-0 right-0 top-0 flex justify-center z-10 w-full">
                            <button
                                onClick={() => setShowPrevious(true)}
                                className="flex cursor-pointer items-center gap-2 px-4 py-1_5 text-xs font-medium text-muted hover-text-primary bg-white border rounded-full shadow-sm hover-bg-gray-50 transition-all group translate-y-neg-half"
                            >
                                <span>Show {previousPostsCount} previous posts</span>
                                <ChevronDown size={14} />
                            </button>
                        </div>
                    )}

                    {visiblePosts.map((post) => {
                        const isCurrentPost = post.slug === currentPostSlug;
                        // Find the actual index in the full series for numbering
                        const postNumber = seriesPosts.findIndex(p => p.id === post.id) + 1;

                        return (
                            <Link
                                key={post.id}
                                href={`/post/${post.slug}`}
                                className={`flex items-center gap-4 p-4 transition-all hover-bg-gray-50 group ${isCurrentPost ? 'bg-blue-50' : ''
                                    }`}
                            >
                                {/* Post Number */}
                                <div className="flex-shrink-0">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${isCurrentPost
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-600 group-hover-bg-gray-300 transition-colors'
                                        }`}>
                                        {postNumber}
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div className="flex-grow min-w-0">
                                    <h4 className={`font-bold mb-1 text-base leading-tight ${isCurrentPost ? 'text-primary' : 'text-gray-900 group-hover-text-primary transition-colors'
                                        }`}>
                                        {post.title}
                                    </h4>
                                    <p className="text-xs text-muted line-clamp-2 leading-relaxed">{post.excerpt}</p>
                                </div>

                                {/* Post Image */}
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-16 md_w-32 md_h-20 rounded-lg overflow-hidden bg-gray-100 border">
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform group-hover-scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Loading indicator */}
                {loading && (
                    <div className="text-center py-4 text-muted border-t">
                        Loading more posts...
                    </div>
                )}

                {/* Intersection observer target */}
                <div ref={observerTarget} className="h-1" />
            </div>
        </section>
    );
}
