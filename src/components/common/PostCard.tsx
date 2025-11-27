import Link from 'next/link';
import { Post } from '@/data/mockData';
import { BookOpen } from 'lucide-react';

interface PostCardProps {
    post: Post;
    compact?: boolean;
}

export default function PostCard({ post, compact = false }: PostCardProps) {
    return (
        <div className={`card group flex ${compact ? 'flex-row h-32' : 'flex-col'}`}>
            <div className={`relative ${compact ? 'w-one-third overflow-hidden' : 'w-full h-48 overflow-hidden'}`}>
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover-scale_115"
                />
            </div>

            <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                    <span className="text-xs text-muted">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>

                <Link href={`/post/${post.slug}`} className="static">
                    <h3 className={`font-bold group-hover-text-primary cursor-pointer transition-colors mb-2 ${compact ? 'text-sm line-clamp-2' : 'text-xl'}`}>
                        {post.title}
                    </h3>
                </Link>

                {!compact && (
                    <p className="text-muted text-sm line-clamp-2 mb-4">
                        {post.excerpt}
                    </p>
                )}

                <div className="flex flex-col gap-3 mt-auto">
                    <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-muted" />
                        <span className="text-xs text-muted">{post.readTime}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {/* Only show first tag if compact */}
                        {post.tags.slice(0, compact ? 1 : 2).map(tag => (
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
