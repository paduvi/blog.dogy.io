"use client";

import { useEffect, useState } from 'react';
import { Calendar, Clock, Tag as TagIcon, Image as ImageIcon } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { MarkdownToHtml } from '@/components/post/markdown-to-html';
import SeriesSection from '@/components/post/SeriesSection';
import TagCloud from '@/components/common/TagCloud';
import PostActions from '@/components/post/PostActions';
import NewsletterSubscribe from '@/components/common/NewsletterSubscribe';
import handleMathJax from '@/utils/handle-math-jax';
import { useEmbeds } from '@/utils/renderer/hooks/useEmbeds';
import { loadIframeResizer } from '@/utils/renderer/services/embed';
import { triggerCustomWidgetEmbed } from '@/utils/trigger-custom-widget-embed';
import { usePostStore, type Post } from '@/store/postStore';
import '@/styles/hljs.css';
import '@/styles/hashnode.css';


interface PostContentProps {
    post: Post;
    locale: string;
    translations: {
        tags: string;
        readTime: string;
    };
}

export default function PostContent({ post, locale, translations }: PostContentProps) {
    const [, setMobMount] = useState(false);
    const [canLoadEmbeds, setCanLoadEmbeds] = useState(false);
    const { setPost, clearPost } = usePostStore();
    useEmbeds({ enabled: canLoadEmbeds });

    useEffect(() => {
        // Initialize post store
        setPost(post);

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

        // Cleanup on unmount
        return () => {
            clearPost();
        };
    }, [post, setPost, clearPost]);

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
                {post.coverImage ? (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-64 md-h-96 bg-gray-100 flex items-center justify-center">
                        <ImageIcon size={64} className="text-gray-300" />
                    </div>
                )}
            </div>

            <MarkdownToHtml contentMarkdown={post.content.markdown} />

            {/* Newsletter Subscribe Section */}
            <div className="mt-12">
                <NewsletterSubscribe variant="inline" />
            </div>

            {/* Tags Section */}
            <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">{translations.tags}</h3>
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
                <SeriesSection />
            )}

            <div className="mt-12">
                <TagCloud fullHeight />
            </div>

            <PostActions />
        </article>
    );
}
