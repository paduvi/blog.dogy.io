'use server';

import { getHashnodeHost, hashnodeApi } from '@/lib/hashnode';

import { unstable_cache } from 'next/cache';

const getCachedTags = unstable_cache(
    async (locale: string) => {
        const host = getHashnodeHost(locale);
        const tagMap = new Map<string, { id: string; name: string; slug: string; count: number }>();
        let hasNextPage = true;
        let endCursor: string | undefined = undefined;

        try {
            // Loop through all pages to get all posts
            // Safety limit of 50 pages (approx 1000 posts with 20 per page)
            let iterations = 0;
            while (hasNextPage && iterations < 50) {
                const data = await hashnodeApi.getPosts(host, 20, endCursor);
                
                if (!data.posts) break;

                const posts = data.posts.edges;
                
                posts.forEach((edge: any) => {
                    const post = edge.node;
                    if (post.tags) {
                        post.tags.forEach((tag: any) => {
                            if (tagMap.has(tag.slug)) {
                                const existing = tagMap.get(tag.slug)!;
                                existing.count++;
                            } else {
                                tagMap.set(tag.slug, {
                                    id: tag.slug, // Use slug as ID if ID is missing or inconsistent
                                    name: tag.name,
                                    slug: tag.slug,
                                    count: 1
                                });
                            }
                        });
                    }
                });

                hasNextPage = data.posts.pageInfo.hasNextPage;
                endCursor = data.posts.pageInfo.endCursor;
                iterations++;
            }

            // Convert map to array and sort by count desc
            const sortedTags = Array.from(tagMap.values()).sort((a, b) => b.count - a.count);
            return sortedTags;
        } catch (error) {
            console.error("Failed to fetch all tags:", error);
            return []; // Return empty array on error to avoid crashing cache
        }
    },
    ['all-tags-data'],
    { revalidate: 3600 } // Cache for 1 hour
);

export async function fetchAllTags(locale: string) {
    return getCachedTags(locale);
}
