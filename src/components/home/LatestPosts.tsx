"use client";

import { Post } from '@/types';
import PostCard from '@/components/common/PostCard';
import PostCardSkeleton from '@/components/common/PostCardSkeleton';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { fetchMoreLatestPosts } from '@/actions/postActions';

interface PageInfo {
    hasNextPage: boolean;
    endCursor: string | null;
}

interface LatestPostsProps {
    posts: Post[];
    initialPageInfo: PageInfo;
    locale: string;
    pinnedPostIds: string[];
}

export default function LatestPosts({ posts, initialPageInfo, locale, pinnedPostIds }: LatestPostsProps) {
    const t = useTranslations('Home');
    const [displayedPosts, setDisplayedPosts] = useState<Post[]>(posts);
    const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
    const [loading, setLoading] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Load more posts from server
    const loadMore = useCallback(async () => {
        if (loading || !pageInfo.hasNextPage || !pageInfo.endCursor) return;

        setLoading(true);

        try {
            const result = await fetchMoreLatestPosts(locale, pageInfo.endCursor);
            
            if (result.posts.length > 0) {
                // Filter out any posts that are in the pinned section
                const filteredPosts = result.posts.filter(
                    (post: Post) => !pinnedPostIds.includes(post.id)
                );
                setDisplayedPosts(prev => [...prev, ...filteredPosts]);
                setPageInfo(result.pageInfo);
            } else {
                setPageInfo(prev => ({ ...prev, hasNextPage: false }));
            }
        } catch (error) {
            console.error('Failed to load more posts:', error);
        } finally {
            setLoading(false);
        }
    }, [locale, pageInfo, loading, pinnedPostIds]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && pageInfo.hasNextPage && !loading) {
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
    }, [loadMore, pageInfo.hasNextPage, loading]);

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    {t('latestPosts')}
                </h2>
            </div>

            <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-6">
                {displayedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}

                {/* Show skeleton loaders while loading */}
                {loading && (
                    <>
                        <PostCardSkeleton />
                        <PostCardSkeleton />
                        <PostCardSkeleton />
                    </>
                )}
            </div>

            {/* Intersection observer target */}
            <div ref={observerTarget} className="h-10 mt-8" />

            {/* End of posts message */}
            {!pageInfo.hasNextPage && (
                <div className="text-center py-8 text-muted">
                    <p>{t('endOfPosts')} 🎉</p>
                </div>
            )}
        </section>
    );
}
