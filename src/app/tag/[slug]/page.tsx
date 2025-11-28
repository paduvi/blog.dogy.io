import { posts, tags } from '@/data/mockData';

import InfinitePostGrid from '@/components/common/InfinitePostGrid';
import TagCloud from '@/components/common/TagCloud';
import BuyMeACoffee from '@/components/common/BuyMeACoffee';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const tag = tags.find((t) => t.slug === slug);
    if (!tag) return { title: 'Tag Not Found' };

    return {
        title: `#${tag.name} Posts | Dogy.io`,
        description: `Browse all posts tagged with #${tag.name}`,
    };
}

export default async function TagPage({ params }: PageProps) {
    const { slug } = await params;
    const tag = tags.find((t) => t.slug === slug);

    if (!tag) {
        notFound();
    }

    const tagPosts = posts.filter((post) => post.tags.some((t) => t.slug === slug));

    return (
        <div className="container py-8">
            <div className="mb-8 text-center py-12 bg-gray-50 rounded-xl border">
                <span className="text-sm font-bold text-primary uppercase tracking-wider mb-2 block">Tag</span>
                <h1 className="text-4xl font-bold mb-4">#{tag.name}</h1>
                <p className="text-muted">A collection of {tagPosts.length} posts</p>
            </div>

            <div className="grid grid-cols-1 lg_grid-cols-12 gap-8">
                <div className="lg_col-span-8">
                    <InfinitePostGrid posts={tagPosts} />

                    {tagPosts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted">No posts found with this tag.</p>
                        </div>
                    )}
                </div>

                <aside className="lg_col-span-4">
                    <div className="sticky top-24 flex flex-col gap-6">
                        <BuyMeACoffee />
                        <TagCloud tags={tags} currentTagSlug={slug} />
                    </div>
                </aside>
            </div>
        </div>
    );
}
