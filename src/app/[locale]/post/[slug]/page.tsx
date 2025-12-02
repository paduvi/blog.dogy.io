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

    const url = `https://dogy.io/${locale}/post/${slug}`;
    const ogImage = post.coverImage || '/favicon/dog_logo.png';

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: url,
            siteName: 'Dogy.io',
            locale: locale === 'vi' ? 'vi_VN' : 'en_US',
            type: 'article',
            publishedTime: post.publishedAt,
            authors: [post.author.name],
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [ogImage],
        },
        alternates: {
            canonical: url,
            languages: {
                'en': `https://dogy.io/en/post/${slug}`,
                'vi': `https://dogy.io/vi/post/${slug}`,
            },
        },
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

    return (
        <PostContent
            post={post}
            locale={locale}
            translations={{
                tags: t('tags'),
                readTime: t('readTime', {minutes: 0}).replace('0', '{minutes}')
            }}
        />
    );
}

