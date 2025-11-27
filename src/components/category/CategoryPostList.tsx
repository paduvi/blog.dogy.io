"use client";

import { Post } from '@/data/mockData';
import PostCardSkeleton from '@/components/common/PostCardSkeleton';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';

interface CategoryPostListProps {
    posts: Post[];
}

const POSTS_PER_PAGE = 6;

export default function CategoryPostList({ posts }: CategoryPostListProps) {
    const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Initialize with first page
    useEffect(() => {
        setDisplayedPosts(posts.slice(0, POSTS_PER_PAGE));
        setHasMore(posts.length > POSTS_PER_PAGE);
        setPage(1);
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
            <div className="flex flex-col gap-8">
                {displayedPosts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/post/${post.slug}`}
                        className="group grid grid-cols-1 md_grid-cols-3 gap-6 pb-8 border-b hover-border-primary transition-colors"
                    >
                        {/* Left: Content */}
                        <div className="md_col-span-2 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold mb-3 group-hover-text-primary transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-muted mb-4 line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} />
                                    <span>{post.readTime}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Image */}
                        <div className="relative aspect-video md_aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover-scale-105 transition-transform duration-300"
                            />
                        </div>
                    </Link>
                ))}

                {/* Show skeleton loaders while loading */}
                {loading && (
                    <>
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
                    <p>You've reached the end of the list. 🎉</p>
                </div>
            )}

            {displayedPosts.length === 0 && !loading && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border">
                    <p className="text-muted">No posts found in this category.</p>
                </div>
            )}
        </section>
    );
}
