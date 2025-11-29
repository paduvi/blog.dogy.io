"use client";

import { Link } from '@/i18n/routing';
import { Post } from '@/data/mockData';
import { BookOpen, Pin } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PinnedPostsProps {
    posts: Post[];
}

export default function PinnedPosts({ posts }: PinnedPostsProps) {
    const t = useTranslations('Home');

    if (posts.length === 0) return null;

    // Only show first 3 pinned posts
    const displayPosts = posts.slice(0, 3);
    const fixedPost = displayPosts[0];
    const rightSidePosts = displayPosts.slice(1);

    // Calculate how many placeholders we need (should have 2 posts on the right)
    const placeholdersNeeded = 2 - rightSidePosts.length;

    return (
        <section className="mb-12">
            <div className="grid grid-cols-1 lg-grid-cols-10 gap-4">
                {/* Fixed Post - Left Side */}
                <Link href={`/post/${fixedPost.slug}`} className="group lg-col-span-7">
                    <div className="relative h-600 rounded-xl overflow-hidden bg-white shadow-sm border">
                        <img
                            src={fixedPost.coverImage}
                            alt={fixedPost.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover-scale-115"
                        />
                        <div className="absolute inset-0 bg-black-30 bg-gradient-to-t from-black-80 via-black-30 to-transparent flex flex-col justify-end p-6 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <Pin size={14} className="text-primary" fill="currentColor" />
                                <span className="text-gray-300 text-xs font-semibold">{t('pinnedLabel')}</span>
                            </div>
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{fixedPost.excerpt}</p>
                            <h2 className="text-2xl md-text-3xl font-bold mb-4 group-hover-underline decoration-2 underline-offset-4 line-clamp-2">
                                {fixedPost.title}
                            </h2>
                            <div className="flex items-center gap-2 text-sm">
                                <BookOpen size={14} />
                                <span>{t('readTime', { minutes: fixedPost.readTime })}</span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Right Side - 2 Posts Stacked */}
                <div className="lg-col-span-3 flex flex-col gap-4 h-600">
                    {rightSidePosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/post/${post.slug}`}
                            className="card-group flex-1"
                        >
                            <div className="relative h-full rounded-xl overflow-hidden bg-white shadow-sm border">
                                <div className="relative h-full rounded-lg overflow-hidden card-img-scale">
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black-30 bg-gradient-to-t from-black-80 via-black-30 to-transparent flex flex-col justify-end p-5 text-white">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Pin size={12} className="text-primary" fill="currentColor" />
                                            <span className="text-gray-300 text-xs font-semibold">{t('pinnedLabel')}</span>
                                        </div>
                                        <p className="text-gray-300 text-xs mb-2 line-clamp-2">{post.excerpt}</p>
                                        <h3 className="text-lg md-text-xl font-bold mb-3 card-group-hover-underline decoration-2 underline-offset-4 line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs">
                                            <BookOpen size={12} />
                                            <span>{t('readTime', { minutes: post.readTime })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Empty Placeholders */}
                    {Array.from({ length: placeholdersNeeded }).map((_, idx) => (
                        <div key={`placeholder-${idx}`} className="flex-1">
                            <div className="relative h-full rounded-xl overflow-hidden bg-gray-200 shadow-sm border">
                                <div className="relative h-full rounded-lg overflow-hidden bg-gray-200">
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
