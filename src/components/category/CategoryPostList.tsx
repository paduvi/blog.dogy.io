'use client';

import { Post } from '@/types';
import CategoryPostSkeleton from '@/components/category/CategoryPostSkeleton';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from '@/i18n/routing';
import { Calendar, Clock, Image as ImageIcon } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface PageInfo {
    hasNextPage: boolean;
    endCursor: string | null;
}

interface CategoryPostListProps {
    initialPosts: Post[];
    initialPageInfo: PageInfo;
    fetchMoreAction: (cursor: string) => Promise<{ posts: Post[], pageInfo: PageInfo }>;
}

export default function CategoryPostList({ initialPosts, initialPageInfo, fetchMoreAction }: CategoryPostListProps) {
    const t = useTranslations('Post');
    const tCommon = useTranslations('Common');
    const locale = useLocale();
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
    const [loading, setLoading] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Load more posts
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
    }, [loadMore, pageInfo.hasNextPage, loading]);

    return (
        <section>
            <div className="flex flex-col gap-8">
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/post/${post.slug}`}
                        className="group grid grid-cols-1 md-grid-cols-3 gap-6 pb-8 border-b transition-colors"
                    >
                        {/* Left: Image */}
                        <div className="relative aspect-video md-aspect-square rounded-lg overflow-hidden bg-gray-100">
                            {post.coverImage ? (
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover-scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center">
                                    <ImageIcon size={32} className="text-gray-300" />
                                </div>
                            )}
                        </div>

                        {/* Right: Content */}
                        <div className="md-col-span-2 flex flex-col justify-between">
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
                                    <span>{new Date(post.publishedAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} />
                                    <span>{t('readTime', { minutes: post.readTime })}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {/* Show skeleton loaders while loading */}
                {loading && (
                    <>
                        <CategoryPostSkeleton />
                        <CategoryPostSkeleton />
                    </>
                )}
            </div>

            {/* Intersection observer target */}
            <div ref={observerTarget} className="h-10 mt-8" />

            {/* End of posts message */}
            {!pageInfo.hasNextPage && posts.length > 0 && (
                <div className="text-center py-8 text-muted">
                    <p>{tCommon('endOfPosts')} 🎉</p>
                </div>
            )}

            {posts.length === 0 && !loading && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border">
                    <p className="text-muted">No posts found in this category.</p>
                </div>
            )}
        </section>
    );
}
