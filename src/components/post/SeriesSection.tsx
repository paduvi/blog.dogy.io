'use client';

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { Link } from '@/i18n/routing';
import { ChevronDown, Calendar, Clock, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import SeriesPostSkeleton from './SeriesPostSkeleton';
import type { Post } from '@/types';
import { useTranslations, useLocale } from 'next-intl';
import { getHashnodeHost, hashnodeApi, mapHashnodePostToPost } from '@/lib/hashnode';
import { usePostStore } from '@/store/postStore';
import { fetchMoreCategoryPosts } from '@/actions/postActions';

const POSTS_PER_PAGE = 6;

function SeriesSectionContent() {
    const t = useTranslations('Post');
    const locale = useLocale();
    const post = usePostStore((state) => state.post);
    const [seriesPosts, setSeriesPosts] = useState<Post[]>([]);
    const [pageInfo, setPageInfo] = useState<{ hasNextPage: boolean; endCursor: string | null }>({ hasNextPage: false, endCursor: null });
    const [totalPosts, setTotalPosts] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showPrevious, setShowPrevious] = useState(false);
    const [isExpanding, setIsExpanding] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const observerTarget = useRef<HTMLDivElement>(null);
    const currentPostRef = useRef<HTMLAnchorElement>(null);
    const previousOffsetRef = useRef<number>(0);

    // We know post is valid here because of the wrapper check
    if (!post || !post.category) return null;

    const categorySlug = post.category.slug;
    const categoryName = post.category.name;
    const currentPostSlug = post.slug;

    // Initialize posts
    useEffect(() => {
        const fetchSeriesPosts = async () => {
            try {
                setLoading(true);
                const host = getHashnodeHost(locale);
                let allFetchedPosts: Post[] = [];
                let found = false;
                let lastPageInfo = { hasNextPage: false, endCursor: null as string | null };

                // First fetch
                const data = await hashnodeApi.getPostsBySeries(host, categorySlug, POSTS_PER_PAGE);

                if (!data.series) {
                    setLoading(false);
                    return;
                }

                let newPosts = data.series.posts.edges.map((edge: any) => mapHashnodePostToPost(edge.node));
                lastPageInfo = data.series.posts.pageInfo;
                allFetchedPosts = [...newPosts];
                
                if (newPosts.some((p: any) => p.slug === currentPostSlug)) {
                    found = true;
                }

                // Subsequent fetches if current post not found
                // Limit to 20 iterations (100 posts) to prevent infinite loops/excessive API usage
                let iterations = 0;
                while (!found && lastPageInfo.hasNextPage && lastPageInfo.endCursor && iterations < 20) {
                    const result = await fetchMoreCategoryPosts(locale, categorySlug, lastPageInfo.endCursor);
                    newPosts = result.posts;
                    lastPageInfo = result.pageInfo;
                    allFetchedPosts = [...allFetchedPosts, ...newPosts];

                    if (newPosts.some((p: any) => p.slug === currentPostSlug)) {
                        found = true;
                    }
                    iterations++;
                }
                
                setSeriesPosts(allFetchedPosts);
                setPageInfo(lastPageInfo);
                setTotalPosts(data.series.posts.totalDocuments || allFetchedPosts.length);

                // Reset showPrevious when changing posts
                setShowPrevious(false);
            } catch (error) {
                console.error("Failed to fetch series posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeriesPosts();
    }, [categorySlug, currentPostSlug, locale]);

    // ... (rest of the code)

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
    }, [isExpanding, showPrevious, seriesPosts]);

    // Load more posts (downwards)
    const loadMore = useCallback(async () => {
        if (loading || !pageInfo.hasNextPage || !pageInfo.endCursor) return;

        setLoading(true);

        try {
            const { posts: newPosts, pageInfo: newPageInfo } = await fetchMoreCategoryPosts(locale, categorySlug, pageInfo.endCursor);
            
            setSeriesPosts(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const uniqueNewPosts = newPosts.filter((p: Post) => !existingIds.has(p.id));
                return [...prev, ...uniqueNewPosts];
            });
            setPageInfo(newPageInfo);
        } catch (error) {
            console.error("Failed to load more series posts:", error);
        } finally {
            setLoading(false);
        }
    }, [loading, pageInfo, locale, categorySlug]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && pageInfo.hasNextPage && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
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
    }, [loadMore, pageInfo.hasNextPage, loading, isExpanded]);

    // ... (rest of the code)

    if (seriesPosts.length === 0 && !loading) {
        return null;
    }

    // Find current post index in the full list
    const currentIndex = seriesPosts.findIndex(p => p.slug === currentPostSlug);

    // Determine which posts to render
    // If showPrevious is true, show all seriesPosts
    // If showPrevious is false, show only seriesPosts starting from currentIndex
    // Note: If currentIndex is -1 (not found yet), we show everything? Or nothing?
    // If not found, it means the current post is likely further down (or up?) 
    // Since we fetch newest first, if the current post is old, it might not be in the list yet.
    // If it's not in the list, we probably should show what we have.
    const visiblePosts = showPrevious || currentIndex === -1
        ? seriesPosts
        : seriesPosts.filter((_, index) => index >= currentIndex);

    const previousPostsCount = currentIndex !== -1 ? currentIndex : 0;

    return (
        <section className="mt-12 max-w-4xl mx-auto">
            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                {/* Header */}
                <div
                    className="p-4 border-b bg-gray-50 flex items-center justify-between cursor-pointer hover-bg-gray-100 transition-colors"
                    onClick={toggleExpanded}
                >
                    <div>
                        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-1">{t('series')}</h3>
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
                            {t(totalPosts === 1 ? 'post' : 'posts', { count: totalPosts })}
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
                                    className="flex cursor-pointer items-center gap-2 px-4 py-1-5 text-xs font-medium text-muted hover-text-primary bg-white border rounded-full shadow-sm hover-bg-gray-50 transition-all group translate-y-neg-half"
                                >
                                    <span>{t(previousPostsCount === 1 ? 'showPreviousPost' : 'showPreviousPosts', { count: previousPostsCount })}</span>
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
                                                {new Date(post.publishedAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Clock size={14} />
                                                {t('readTime', { minutes: post.readTime })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Post Image */}
                                    <div className="flex-shrink-0">
                                        <div className="w-64 h-48 rounded-lg overflow-hidden bg-gray-100 border">
                                            {post.coverImage ? (
                                                <Image
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 300px"
                                                    className="object-cover transform group-hover-scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                    <ImageIcon size={32} className="text-gray-300" />
                                                </div>
                                            )}
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

export default function SeriesSection() {
    const post = usePostStore((state) => state.post);

    if (!post || !post.category || post.category.id === 'uncategorized') return null;

    return <SeriesSectionContent />;
}
