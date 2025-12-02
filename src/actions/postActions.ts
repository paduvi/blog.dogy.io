'use server';

import { getHashnodeHost, hashnodeApi, mapHashnodePostToPost } from '@/lib/hashnode';

const POSTS_PER_PAGE = 6;

export async function fetchMoreCategoryPosts(locale: string, slug: string, cursor: string) {
    const host = getHashnodeHost(locale);
    const data = await hashnodeApi.getPostsBySeries(host, slug, POSTS_PER_PAGE, cursor);
    
    if (!data.series) {
        return { posts: [], pageInfo: { hasNextPage: false, endCursor: null } };
    }

    const posts = data.series.posts.edges.map((edge: any) => mapHashnodePostToPost(edge.node));
    const pageInfo = data.series.posts.pageInfo;

    return { posts, pageInfo };
}

export async function fetchMoreTagPosts(locale: string, slug: string, cursor: string) {
    const host = getHashnodeHost(locale);
    const data = await hashnodeApi.getPostsByTag(host, slug, POSTS_PER_PAGE, cursor);
    
    const posts = data.posts.edges.map((edge: any) => mapHashnodePostToPost(edge.node));
    const pageInfo = data.posts.pageInfo;

    return { posts, pageInfo };
}

export async function fetchMoreSearchPosts(locale: string, query: string, cursor: string) {
    const host = getHashnodeHost(locale);
    
    // We need publicationId for search. 
    // Since this is a server action, we can fetch it or rely on the client to pass it.
    // But passing locale is safer/easier.
    const publicationId = await hashnodeApi.getPublicationId(host);
    
    const data = await hashnodeApi.searchPosts(publicationId, query, POSTS_PER_PAGE, cursor);
    
    const posts = data.edges.map((edge: any) => mapHashnodePostToPost(edge.node));
    const pageInfo = data.pageInfo;

    return { posts, pageInfo };
}
