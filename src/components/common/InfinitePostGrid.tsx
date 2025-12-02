'use client';

import { Post } from '@/types';
import PostCard from '@/components/common/PostCard';
import PostCardSkeleton from '@/components/common/PostCardSkeleton';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface PageInfo {
    hasNextPage: boolean;
    endCursor: string | null;
}

interface InfinitePostGridProps {
    initialPosts: Post[];
    initialPageInfo: PageInfo;
    fetchMoreAction: (cursor: string) => Promise<{ posts: Post[], pageInfo: PageInfo }>;
}

export default function InfinitePostGrid({ initialPosts, initialPageInfo, fetchMoreAction }: InfinitePostGridProps) {
    const t = useTranslations('Common');
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
    const [loading, setLoading] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Reset when initialPosts changes (e.g. search query changes)
    useEffect(() => {
        setPosts(initialPosts);
        setPageInfo(initialPageInfo);
        setLoading(false);
    }, [initialPosts, initialPageInfo]);

    const loadMore = useCallback(async () => {
        if (loading || !pageInfo.hasNextPage || !pageInfo.endCursor) return;

        setLoading(true);

        try {
            const { posts: newPosts, pageInfo: newPageInfo } = await fetchMoreAction(pageInfo.endCursor);
            
            setPosts(prev => [...prev, ...newPosts]);
            setPageInfo(newPageInfo);
        } catch (error) {
            console.error("Failed to load more posts:", error);
        } finally {
            setLoading(false);
        }
    }, [loading, pageInfo, fetchMoreAction]);

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

    if (posts.length === 0) {
        return null;
    }

    return (
        <>
            <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}

                {loading && (
                    <>
                        <PostCardSkeleton />
                        <PostCardSkeleton />
                        <PostCardSkeleton />
                    </>
                )}
            </div>

            <div ref={observerTarget} className="h-10 mt-8" />

            {!pageInfo.hasNextPage && posts.length > 0 && (
                <div className="text-center py-8 text-muted">
                    <p>{t('endOfPosts')} 🎉</p>
                </div>
            )}
        </>
    );
}
