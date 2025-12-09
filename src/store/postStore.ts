import { create } from 'zustand';

export interface Post {
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
    canonicalUrl?: string;
}

interface PostStore {
    post: Post | null;
    setPost: (post: Post) => void;
    clearPost: () => void;
}

export const usePostStore = create<PostStore>((set) => ({
    post: null,
    setPost: (post: Post) => set({ post }),
    clearPost: () => set({ post: null }),
}));
