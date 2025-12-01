"use client";

import { useEffect, useState } from 'react';
import { Calendar, Clock, Tag as TagIcon } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { MarkdownToHtml } from '@/components/post/markdown-to-html';
import SeriesSection from '@/components/post/SeriesSection';
import TagCloud from '@/components/common/TagCloud';
import PostActions from '@/components/post/PostActions';
import handleMathJax from '@/utils/handle-math-jax';
import { useEmbeds } from '@/utils/renderer/hooks/useEmbeds';
import { loadIframeResizer } from '@/utils/renderer/services/embed';
import { triggerCustomWidgetEmbed } from '@/utils/trigger-custom-widget-embed';
import '@/styles/hljs.css';
import '@/styles/hashnode.css';

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: {
        markdown: string;
    };
    coverImage: string;
    publishedAt: string;
    readTime: number;
    tags: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
    category?: {
        id: string;
        name: string;
        slug: string;
    } | null;
    publication?: {
        id: string;
    };
    hasLatexInPost?: boolean;
}

interface PostContentProps {
    post: Post;
    tags: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
    locale: string;
    translations: {
        tags: string;
        readTime: string;
    };
}

export default function PostContent({ post, tags, locale, translations }: PostContentProps) {
    const [, setMobMount] = useState(false);
    const [canLoadEmbeds, setCanLoadEmbeds] = useState(false);
    useEmbeds({ enabled: canLoadEmbeds });

    useEffect(() => {
        if (typeof window !== 'undefined' && window.screen.width <= 425) {
            setMobMount(true);
        }

        if (!post) {
            return;
        }

        // Handle MathJax if needed
        if (post.hasLatexInPost) {

            setTimeout(() => {
                handleMathJax(true);
            }, 500);
        }

        // Load embeds and custom widgets
        (async () => {
            await loadIframeResizer();
            triggerCustomWidgetEmbed(post.publication?.id.toString());
            setCanLoadEmbeds(true);
        })();
    }, [post]);

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
                        <span>{translations.readTime.replace('{minutes}', post.readTime.toString())}</span>
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

            <MarkdownToHtml contentMarkdown={post.content.markdown} />

            <div className="border-t pt-8">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <TagIcon size={20} />
                    {translations.tags}
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
