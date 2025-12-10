'use client';

import { Link } from '@/i18n/routing';
import { Post } from '@/types';
import { BookOpen, Image as ImageIcon } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';

interface PostCardProps {
    post: Post;
    compact?: boolean;
}

export default function PostCard({ post, compact = false }: PostCardProps) {
    const t = useTranslations('Post');
    const locale = useLocale();

    return (
        <div className={`card group flex ${compact ? 'flex-row h-32' : 'flex-col'}`}>
            <div className={`relative ${compact ? 'w-1-3 overflow-hidden' : 'w-full h-48 overflow-hidden'}`}>
                {post.coverImage ? (
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover-scale-115"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <ImageIcon size={32} className="text-gray-300" />
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col gap-4 flex-1">
                <div>
                    <span className="text-xs text-muted">
                        {new Date(post.publishedAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>

                <Link href={`/post/${post.slug}`} className="static">
                    <h3 className={`font-bold group-hover-text-primary cursor-pointer transition-colors mb-2 ${compact ? 'text-sm line-clamp-2' : 'text-xl'}`}>
                        {post.title}
                    </h3>
                </Link>

                {!compact && (
                    <p className="text-muted text-sm line-clamp-6 mb-4">
                        {post.excerpt}
                    </p>
                )}

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-muted" />
                        <span className="text-xs text-muted">{t('readTime', { minutes: post.readTime })}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {/* Only show first tag if compact */}
                        {post.tags.slice(0, compact ? 1 : 4).map(tag => (
                            <Link
                                key={tag.id}
                                href={`/tag/${tag.slug}`}
                                className="badge relative z-2 bg-blue-50 text-blue-600 hover-bg-blue-100"
                            >
                                #{tag.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
