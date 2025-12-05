export const GQL_ENDPOINT = 'https://gql.hashnode.com';

export const getHashnodeHost = (locale: string) => {
    return locale === 'vi' ? 'blog-vi.dogy.io' : 'blog-en.dogy.io';
};

async function fetchGraphQL(query: string, variables: any = {}) {
    const response = await fetch(GQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query,
            variables,
        }),
        next: { revalidate: 60 },
    });

    const data = await response.json();

    if (data.errors) {
        console.error('GraphQL Errors:', data.errors);
        throw new Error('Failed to fetch data from Hashnode');
    }
    return data.data;
}

export const GET_POSTS = `
    query GetPosts($host: String!, $first: Int!, $after: String) {
        publication(host: $host) {
            id
            pinnedPost {
                id
                title
                subtitle
                slug
                brief
                coverImage {
                    url
                }
                author {
                    name
                    profilePicture
                    username
                }
                publishedAt
                readTimeInMinutes
                series {
                    name
                    slug
                }
                tags {
                    name
                    slug
                }
            }
            posts(first: $first, after: $after) {
                edges {
                    node {
                        id
                        title
                        subtitle
                        slug
                        brief
                        coverImage {
                            url
                        }
                        author {
                            name
                            profilePicture
                            username
                        }
                        publishedAt
                        readTimeInMinutes
                        series {
                            name
                            slug
                        }
                        tags {
                            name
                            slug
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    }
`;

export const GET_PUBLICATION_ID = `
    query GetPublicationId($host: String!) {
        publication(host: $host) {
            id
        }
    }
`;

export const GET_POST_BY_SLUG = `
    query GetPostBySlug($host: String!, $slug: String!) {
        publication(host: $host) {
            id
            post(slug: $slug) {
                id
                title
                subtitle
                slug
                brief
                content {
                    markdown
                }
                hasLatexInPost
                coverImage {
                    url
                }
                author {
                    name
                    profilePicture
                    username
                }
                publishedAt
                readTimeInMinutes
                series {
                    name
                    slug
                }
                tags {
                    name
                    slug
                }
            }
        }
    }
`;

export const GET_SERIES = `
    query GetSeries($host: String!, $first: Int!) {
        publication(host: $host) {
            id
            seriesList(first: $first) {
                edges {
                    node {
                        id
                        name
                        slug
                        coverImage
                    }
                }
            }
        }
    }
`;

export const GET_POSTS_BY_SERIES = `
    query GetPostsBySeries($host: String!, $slug: String!, $first: Int!, $after: String) {
        publication(host: $host) {
            id
            series(slug: $slug) {
                name
                slug
                description {
                    html
                    markdown
                }
                coverImage
                posts(first: $first, after: $after) {
                    edges {
                        node {
                            id
                            title
                            subtitle
                            slug
                            brief
                            coverImage {
                                url
                            }
                            author {
                                name
                                profilePicture
                                username
                            }
                            publishedAt
                            readTimeInMinutes
                            series {
                                name
                                slug
                            }
                            tags {
                                name
                                slug
                            }
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        }
    }
`;

export const GET_POSTS_BY_SEARCH = `
    query GetPostsBySearch($publicationId: ObjectId!, $query: String!, $first: Int!, $after: String) {
        searchPostsOfPublication(first: $first, after: $after, filter: {
                  publicationId: $publicationId
                  query: $query 
                }) {
            edges {
                node {
                    id
                    title
                    subtitle
                    slug
                    brief
                    coverImage {
                        url
                    }
                    author {
                        name
                        profilePicture
                        username
                    }
                    publishedAt
                    readTimeInMinutes
                    series {
                        name
                        slug
                    }
                    tags {
                        name
                        slug
                    }
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
        }
    }
`;

export const GET_POSTS_BY_TAG = `
    query GetPostsByTag($host: String!, $slug: String!, $first: Int!, $after: String) {
        publication(host: $host) {
            id
            posts(first: $first, after: $after, filter: { tagSlugs: [$slug] }) {
                edges {
                    node {
                        id
                        title
                        subtitle
                        slug
                        brief
                        coverImage {
                            url
                        }
                        author {
                            name
                            profilePicture
                            username
                        }
                        publishedAt
                        readTimeInMinutes
                        series {
                            name
                            slug
                        }
                        tags {
                            name
                            slug
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
                totalDocuments
            }
        }
    }
`;

// Types
export interface HashnodePost {
    id: string;
    title: string;
    subtitle: string;
    slug: string;
    brief: string;
    content?: {
        markdown: string;
        html: string;
    };
    coverImage: {
        url: string;
    };
    author: {
        name: string;
        profilePicture: string;
        username: string;
    };
    publishedAt: string;
    readTimeInMinutes: number;
    series?: {
        name: string;
        slug: string;
    };
    tags?: {
        name: string;
        slug: string;
    }[];
    hasLatexInPost?: boolean;
}

export interface HashnodeSeries {
    id: string;
    name: string;
    slug: string;
    coverImage?: string;
}

export const hashnodeApi = {
    getPosts: async (host: string, first: number = 10, after?: string) => {
        const data = await fetchGraphQL(GET_POSTS, { host, first, after });
        const publication = data.publication;
        // Cache publication ID
        const { setPublicationId } = await import('@/store/publicationStore').then(m => m.usePublicationStore.getState());
        setPublicationId(host, publication.id);
        return publication;
    },
    getPostBySlug: async (host: string, slug: string) => {
        const data = await fetchGraphQL(GET_POST_BY_SLUG, { host, slug });
        const publication = data.publication;
        // Cache publication ID
        const { setPublicationId } = await import('@/store/publicationStore').then(m => m.usePublicationStore.getState());
        setPublicationId(host, publication.id);
        return publication;
    },
    getSeries: async (host: string, first: number = 20) => {
        const data = await fetchGraphQL(GET_SERIES, { host, first });
        const publication = data.publication;
        // Cache publication ID
        const { setPublicationId } = await import('@/store/publicationStore').then(m => m.usePublicationStore.getState());
        setPublicationId(host, publication.id);
        return publication;
    },
    getPostsBySeries: async (host: string, slug: string, first: number = 10, after?: string) => {
        const data = await fetchGraphQL(GET_POSTS_BY_SERIES, { host, slug, first, after });
        const publication = data.publication;
        // Cache publication ID
        const { setPublicationId } = await import('@/store/publicationStore').then(m => m.usePublicationStore.getState());
        setPublicationId(host, publication.id);
        return publication;
    },
    getPostsByTag: async (host: string, slug: string, first: number = 10, after?: string) => {
        const data = await fetchGraphQL(GET_POSTS_BY_TAG, { host, slug, first, after });
        const publication = data.publication;
        // Cache publication ID
        const { setPublicationId } = await import('@/store/publicationStore').then(m => m.usePublicationStore.getState());
        setPublicationId(host, publication.id);
        
        return {
            ...publication,
            posts: {
                ...publication.posts,
                totalDocuments: publication.posts.totalDocuments
            }
        };
    },
    getPublicationId: async (host: string) => {
        const data = await fetchGraphQL(GET_PUBLICATION_ID, { host });
        const publicationId = data.publication.id;
        // Cache publication ID
        const { setPublicationId } = await import('@/store/publicationStore').then(m => m.usePublicationStore.getState());
        setPublicationId(host, publicationId);
        return publicationId;
    },
    searchPosts: async (publicationId: string, query: string, first: number = 20, after?: string) => {
        const data = await fetchGraphQL(GET_POSTS_BY_SEARCH, { publicationId, query, first, after });
        return data.searchPostsOfPublication;
    },
    subscribeToNewsletter: async (publicationId: string, email: string) => {
        const data = await fetchGraphQL(SUBSCRIBE_TO_NEWSLETTER, { input: { publicationId, email } });
        return data.subscribeToNewsletter;
    }
};

export const SUBSCRIBE_TO_NEWSLETTER = `
    mutation SubscribeToNewsletter($input: SubscribeToNewsletterInput!) {
        subscribeToNewsletter(input: $input) {
            status
        }
    }
`;

export const mapHashnodePostToPost = (node: HashnodePost): any => {
    return {
        id: node.id,
        title: node.title,
        slug: node.slug,
        excerpt: node.subtitle || node.brief,
        content: node.content,
        coverImage: node.coverImage?.url || '',
        author: {
            name: node.author.name,
            avatar: node.author.profilePicture,
            username: node.author.username,
        },
        publishedAt: node.publishedAt,
        readTime: node.readTimeInMinutes,
        category: node.series ? {
            id: node.series.slug,
            name: node.series.name,
            slug: node.series.slug,
        } : {
            id: 'uncategorized',
            name: 'Uncategorized',
            slug: 'uncategorized',
        },
        tags: node.tags?.map((tag: any) => ({
            id: tag.slug,
            name: tag.name,
            slug: tag.slug,
        })) || [],
        isPinned: false,
        hasLatexInPost: node.hasLatexInPost,
    };
};
