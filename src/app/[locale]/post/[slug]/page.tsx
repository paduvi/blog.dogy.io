import {notFound} from 'next/navigation';
import {getTranslations} from 'next-intl/server';
import {getHashnodeHost, hashnodeApi, mapHashnodePostToPost} from '@/lib/hashnode';
import PostContent from '@/components/post/PostContent';

interface PageProps {
    params: Promise<{
        slug: string;
        locale: string;
    }>;
}

export async function generateMetadata({params}: PageProps) {
    const {slug, locale} = await params;
    const host = getHashnodeHost(locale);
    const data = await hashnodeApi.getPostBySlug(host, slug);
    const post = data.post ? mapHashnodePostToPost(data.post) : null;

    if (!post) return {title: 'Post Not Found'};

    return {
        title: `${post.title} | Dogy.io`,
        description: post.excerpt,
    };
}

export default async function PostPage({params}: PageProps) {
    const {slug, locale} = await params;
    const host = getHashnodeHost(locale);
    const data = await hashnodeApi.getPostBySlug(host, slug);
    const post = data.post ? mapHashnodePostToPost(data.post) : null;
    const t = await getTranslations('Post');

    if (!post) {
        notFound();
    }

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

    return (
        <PostContent
            post={post}
            tags={tags}
            locale={locale}
            translations={{
                tags: t('tags'),
                readTime: t('readTime', {minutes: 0}).replace('0', '{minutes}')
            }}
        />
    );
}

