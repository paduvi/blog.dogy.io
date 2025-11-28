"use client";

import { Post } from '@/data/mockData';
import PostCard from '@/components/common/PostCard';
import PostCardSkeleton from '@/components/common/PostCardSkeleton';
import { useState, useEffect, useRef, useCallback } from 'react';

interface InfinitePostGridProps {
    posts: Post[];
}

const POSTS_PER_PAGE = 6;

export default function InfinitePostGrid({ posts }: InfinitePostGridProps) {
    const [displayedPosts, setDisplayedPosts] = useState<Post[]>(posts.slice(0, POSTS_PER_PAGE));
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(posts.length > POSTS_PER_PAGE);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Reset when posts prop changes (e.g. search query changes)
    useEffect(() => {
        setDisplayedPosts(posts.slice(0, POSTS_PER_PAGE));
        setHasMore(posts.length > POSTS_PER_PAGE);
        setPage(1);
        setLoading(false);
    }, [posts]);

    const loadMore = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const nextPage = page + 1;
            const startIndex = page * POSTS_PER_PAGE;
            const endIndex = startIndex + POSTS_PER_PAGE;
            const newPosts = posts.slice(startIndex, endIndex);

            if (newPosts.length > 0) {
                setDisplayedPosts(prev => [...prev, ...newPosts]);
                setPage(nextPage);
                setHasMore(endIndex < posts.length);
            } else {
                setHasMore(false);
            }

            setLoading(false);
        }, 800);
    }, [page, posts, loading, hasMore]);

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

    if (posts.length === 0) {
        return null;
    }

    return (
        <>
            <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-6">
                {displayedPosts.map((post) => (
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

            {!hasMore && displayedPosts.length > 0 && (
                <div className="text-center py-8 text-muted">
                    <p>You've reached the end of the list. 🎉</p>
                </div>
            )}
        </>
    );
}
