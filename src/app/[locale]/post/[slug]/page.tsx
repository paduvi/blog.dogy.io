import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Calendar, Clock, Tag as TagIcon } from 'lucide-react';
import SeriesSection from '@/components/post/SeriesSection';
import TagCloud from '@/components/common/TagCloud';
import PostActions from '@/components/post/PostActions';
import MarkdownContent from '@/components/post/MarkdownContent';
import { getTranslations } from 'next-intl/server';
import { getHashnodeHost, hashnodeApi, mapHashnodePostToPost } from '@/lib/hashnode';

interface PageProps {
    params: Promise<{
        slug: string;
        locale: string;
    }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug, locale } = await params;
    const host = getHashnodeHost(locale);
    const data = await hashnodeApi.getPostBySlug(host, slug);
    const post = data.post ? mapHashnodePostToPost(data.post) : null;

    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Dogy.io`,
        description: post.excerpt,
    };
}

export default async function PostPage({ params }: PageProps) {
    const { slug, locale } = await params;
    const host = getHashnodeHost(locale);
    const data = await hashnodeApi.getPostBySlug(host, slug);
    const post = data.post ? mapHashnodePostToPost(data.post) : null;
    const t = await getTranslations('Post');

    if (!post) {
        notFound();
    }

    // Fetch tags for cloud (can be optimized to fetch once or use static/cached)
    // For now, we can use tags from the current post or fetch latest posts to get tags
    // Let's fetch latest posts to populate tag cloud
    const postsData = await hashnodeApi.getPosts(host);
    const allPosts = postsData.posts.edges.map((edge: any) => mapHashnodePostToPost(edge.node));
    const tagsMap = new Map();
    allPosts.forEach((p: any) => {
        p.tags.forEach((tag: any) => {
            if (!tagsMap.has(tag.slug)) {
                tagsMap.set(tag.slug, tag);
            }
        });
    });
    const tags = Array.from(tagsMap.values());

    return (
        <article className="container py-8 max-w-4xl mx-auto">
            <div className="mb-8">
                {post.category && post.category.id !== 'uncategorized' && (
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
                        <span>{new Date(post.publishedAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{t('readTime', { minutes: post.readTime })}</span>
                    </div>
                </div>
            </div>

            <div className="relative w-full mb-10 rounded-xl overflow-hidden">
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
            </div>

            <MarkdownContent content={post.content} className="prose prose-lg max-w-none mb-12" />

            <div className="border-t pt-8">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <TagIcon size={20} />
                    {t('tags')}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: any) => (
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

            {post.category && post.category.id !== 'uncategorized' && (
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
