import InfinitePostGrid from '@/components/common/InfinitePostGrid';
import TagCloud from '@/components/common/TagCloud';
import BuyMeACoffee from '@/components/common/BuyMeACoffee';
import { notFound } from 'next/navigation';
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
    const data = await hashnodeApi.getPostsByTag(host, slug, 1);
    const posts = data.posts.edges.map((edge: any) => mapHashnodePostToPost(edge.node));

    if (posts.length === 0) return { title: 'Tag Not Found' };

    const tag = posts[0].tags.find((t: any) => t.slug === slug);
    const tagName = tag ? tag.name : slug;

    return {
        title: `#${tagName} Posts | Dogy.io`,
        description: `Browse all posts tagged with #${tagName}`,
    };
}

export default async function TagPage({ params }: PageProps) {
    const { slug, locale } = await params;
    const host = getHashnodeHost(locale);
    const t = await getTranslations('Tag');

    const data = await hashnodeApi.getPostsByTag(host, slug, 20);
    const tagPosts = data.posts.edges.map((edge: any) => mapHashnodePostToPost(edge.node));

    // Fetch tags for cloud
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

    const currentTag = tags.find((t: any) => t.slug === slug);

    if (!currentTag && tagPosts.length === 0) {
        notFound();
    }

    const tagName = currentTag ? currentTag.name : slug;

    return (
        <div className="container py-8">
            <div className="mb-8 text-center py-12 bg-gray-50 rounded-xl border">
                <span className="text-sm font-bold text-primary uppercase tracking-wider mb-2 block">{t('postsTaggedWith')}</span>
                <h1 className="text-4xl font-bold mb-4">#{tagName}</h1>
                <p className="text-muted">{t(tagPosts.length === 1 ? 'post' : 'posts', { count: tagPosts.length })}</p>
            </div>

            <div className="grid grid-cols-1 lg-grid-cols-12 gap-8">
                <div className="lg-col-span-8">
                    <InfinitePostGrid posts={tagPosts} />

                    {tagPosts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted">No posts found with this tag.</p>
                        </div>
                    )}
                </div>

                <aside className="lg-col-span-4">
                    <div className="sticky top-24 flex flex-col gap-6">
                        <BuyMeACoffee />
                        <TagCloud tags={tags} currentTagSlug={slug} />
                    </div>
                </aside>
            </div>
        </div>
    );
}
