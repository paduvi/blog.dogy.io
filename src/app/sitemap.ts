import { MetadataRoute } from 'next';
import { getHashnodeHost, hashnodeApi, mapHashnodePostToPost } from '@/lib/hashnode';

const BASE_URL = 'https://dogy.io';
const LOCALES = ['en', 'vi'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Add homepage for each locale
    for (const locale of LOCALES) {
        sitemapEntries.push({
            url: `${BASE_URL}/${locale}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        });
    }

    // Fetch posts and series for each locale
    for (const locale of LOCALES) {
        const host = getHashnodeHost(locale);

        try {
            // Fetch all posts using pagination
            const allPosts: any[] = [];
            let hasNextPage = true;
            let endCursor: string | undefined = undefined;
            const POSTS_PER_PAGE = 50;

            while (hasNextPage) {
                const postsData = await hashnodeApi.getPosts(host, POSTS_PER_PAGE, endCursor);
                const posts = postsData.posts.edges.map((edge: any) => mapHashnodePostToPost(edge.node));
                allPosts.push(...posts);
                
                hasNextPage = postsData.posts.pageInfo.hasNextPage;
                endCursor = postsData.posts.pageInfo.endCursor;
            }

            // Collect unique tags from posts
            const tagsSet = new Set<string>();
            // Collect unique categories from posts
            const categoriesSet = new Set<string>();

            // Add post URLs
            for (const post of allPosts) {
                sitemapEntries.push({
                    url: `${BASE_URL}/${locale}/post/${post.slug}`,
                    lastModified: new Date(post.publishedAt),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                });

                // Collect tags from each post
                if (post.tags) {
                    for (const tag of post.tags) {
                        tagsSet.add(tag.slug);
                    }
                }

                // Collect category from each post
                if (post.category && post.category.slug && post.category.slug !== 'uncategorized') {
                    categoriesSet.add(post.category.slug);
                }
            }

            // Add tag URLs
            for (const tagSlug of tagsSet) {
                sitemapEntries.push({
                    url: `${BASE_URL}/${locale}/tag/${tagSlug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.5,
                });
            }

            // Add category URLs
            for (const categorySlug of categoriesSet) {
                sitemapEntries.push({
                    url: `${BASE_URL}/${locale}/category/${categorySlug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.6,
                });
            }
        } catch (error) {
            console.error(`Error fetching data for locale ${locale}:`, error);
        }
    }

    return sitemapEntries;
}
