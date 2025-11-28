"use client";

import { Post } from '@/data/mockData';
import PostCard from '@/components/common/PostCard';
import PostCardSkeleton from '@/components/common/PostCardSkeleton';
import { useState, useEffect, useRef, useCallback } from 'react';

interface LatestPostsProps {
    posts: Post[];
}

const POSTS_PER_PAGE = 9;

export default function LatestPosts({ posts }: LatestPostsProps) {
    const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Initialize with first page
    useEffect(() => {
        setDisplayedPosts(posts.slice(0, POSTS_PER_PAGE));
        setHasMore(posts.length > POSTS_PER_PAGE);
    }, [posts]);

    // Load more posts
    const loadMore = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);

        // Simulate network delay for realistic loading
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
        }, 800); // 800ms delay to show shimmer animation
    }, [page, posts, loading, hasMore]);

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

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    Latest Posts
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
            {!hasMore && displayedPosts.length > 0 && (
                <div className="text-center py-8 text-muted">
                    <p>You've reached the end! 🎉</p>
                </div>
            )}
        </section>
    );
}
