'use client';

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { posts, categories } from '@/data/mockData';
import Link from 'next/link';
import { ChevronDown, Calendar, Clock } from 'lucide-react';
import SeriesPostSkeleton from './SeriesPostSkeleton';
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
    const [isExpanding, setIsExpanding] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const observerTarget = useRef<HTMLDivElement>(null);
    const currentPostRef = useRef<HTMLAnchorElement>(null);
    const previousOffsetRef = useRef<number>(0);

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

    // Handle showing previous posts with scroll preservation
    const handleShowPrevious = () => {
        if (currentPostRef.current) {
            // Store the current post's position relative to the viewport
            const rect = currentPostRef.current.getBoundingClientRect();
            previousOffsetRef.current = rect.top;
            setIsExpanding(true);
            setShowPrevious(true);
        } else {
            setShowPrevious(true);
        }
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    // Adjust scroll position after expansion
    useLayoutEffect(() => {
        if (isExpanding && currentPostRef.current) {
            const newRect = currentPostRef.current.getBoundingClientRect();
            const newTop = newRect.top;
            const offsetDiff = newTop - previousOffsetRef.current;

            if (offsetDiff !== 0) {
                window.scrollBy({
                    top: offsetDiff,
                    behavior: 'instant'
                });
            }

            setIsExpanding(false);
        }
    }, [isExpanding, showPrevious, displayedPosts]);

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
        if (!isExpanded) return; // Don't load more if collapsed

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
    }, [loadMore, hasMore, loading, isExpanded]);

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
                <div
                    className="p-4 border-b bg-gray-50 flex items-center justify-between cursor-pointer hover-bg-gray-100 transition-colors"
                    onClick={toggleExpanded}
                >
                    <div>
                        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-1">ARTICLE SERIES</h3>
                        <Link
                            href={`/category/${categorySlug}`}
                            className="text-lg font-bold text-primary hover-underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {categoryName}
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-xs font-medium text-muted bg-gray-100 px-2 py-1 rounded">
                            {seriesPosts.length} Posts
                        </div>
                        <button
                            className={`p-1 btn-transparent cursor-pointer transition-transform duration-200 ${isExpanded ? '' : 'rotate-180'}`}
                        >
                            <ChevronDown size={20} className="text-muted" />
                        </button>
                    </div>
                </div>

                {/* Posts List */}
                {isExpanded && (
                    <div className="divide-y relative">
                        {/* Previous Posts Toggle - Absolutely positioned to float on first divider */}
                        {!showPrevious && previousPostsCount > 0 && (
                            <div className="absolute left-0 right-0 top-0 flex justify-center z-10 w-full">
                                <button
                                    onClick={handleShowPrevious}
                                    className="flex cursor-pointer items-center gap-2 px-4 py-1_5 text-xs font-medium text-muted hover-text-primary bg-white border rounded-full shadow-sm hover-bg-gray-50 transition-all group translate-y-neg-half"
                                >
                                    <span>Show {previousPostsCount} previous post{previousPostsCount === 1 ? '' : 's'}</span>
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
                                    ref={isCurrentPost ? currentPostRef : null}
                                    className={`flex items-center gap-4 p-4 transition-all hover-bg-gray-50 group ${isCurrentPost ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    {/* Post Number */}
                                    <div className="flex-shrink-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isCurrentPost
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-200 text-gray-600 group-hover-bg-gray-300 transition-colors'
                                            }`}>
                                            {postNumber}
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <div className="flex-grow min-w-0">
                                        <h4 className={`font-bold mb-3 text-xl leading-tight ${isCurrentPost ? 'text-primary' : 'text-gray-900 group-hover-text-primary transition-colors'
                                            }`}>
                                            {post.title}
                                        </h4>
                                        <p className="text-base text-muted line-clamp-2 leading-relaxed mb-4">{post.excerpt}</p>

                                        {/* Post Metadata */}
                                        <div className="flex items-center gap-4 text-sm text-muted">
                                            <span className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Clock size={14} />
                                                {post.readTime}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Post Image */}
                                    <div className="flex-shrink-0">
                                        <div className="w-64 h-48 rounded-lg overflow-hidden bg-gray-100 border">
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

                        {/* Loading indicator */}
                        {loading && (
                            <div className="divide-y border-t">
                                <SeriesPostSkeleton />
                                <SeriesPostSkeleton />
                            </div>
                        )}

                        {/* Intersection observer target */}
                        <div ref={observerTarget} className="h-1" />
                    </div>
                )}
            </div>
        </section>
    );
}
