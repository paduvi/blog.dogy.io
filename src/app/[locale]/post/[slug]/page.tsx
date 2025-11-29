import { posts, tags } from '@/data/mockData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Tag as TagIcon } from 'lucide-react';
import SeriesSection from '@/components/post/SeriesSection';
import TagCloud from '@/components/common/TagCloud';
import PostActions from '@/components/post/PostActions';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = posts.find((p) => p.slug === slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Dogy.io`,
        description: post.excerpt,
    };
}

export default async function PostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="container py-8 max-w-4xl mx-auto">
            <div className="mb-8">
                {post.category && (
                    <Link href={`/category/${post.category.slug}`} className="text-primary font-medium mb-4 inline-block hover-underline">
                        {post.category.name}
                    </Link>
                )}
                <h1 className="text-4xl md-text-5xl font-bold mb-6 leading-tight">
                    {post.title}
                </h1>

                <div className="flex items-center gap-6 text-muted text-sm mb-8 border-b pb-8">


                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{post.readTime}</span>
                    </div>
                </div>
            </div>

            <div className="relative w-full h-400 mb-10 rounded-xl overflow-hidden">
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="prose prose-lg max-w-none mb-12">
                {/* In a real app, this would be rendered markdown or HTML */}
                <p className="text-xl leading-relaxed mb-6">{post.excerpt}</p>
                <p className="mb-4">{post.content}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <h2 className="text-2xl font-bold mt-8 mb-4">Subheading</h2>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>

            <div className="border-t pt-8">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <TagIcon size={20} />
                    Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <Link
                            key={tag.id}
                            href={`/tag/${tag.slug}`}
                            className="px-4 py-2 bg-gray-100 rounded-full text-sm hover-bg-gray-200 transition-colors"
                        >
                            #{tag.name}
                        </Link>
                    ))}
                </div>
            </div>

            {post.category && (
                <SeriesSection
                    categorySlug={post.category.slug}
                    categoryName={post.category.name}
                    currentPostSlug={post.slug}
                />
            )}

            <div className="mt-12">
                <TagCloud tags={tags} fullHeight />
            </div>

            <PostActions postSlug={post.slug} postTitle={post.title} />
        </article>
    );
}
