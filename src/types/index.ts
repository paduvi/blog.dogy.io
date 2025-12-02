export interface Author {
    name: string;
    avatar: string;
    username: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    coverImage?: string;
    sortOrder?: 'newest' | 'oldest';
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
}

export interface CategoryGroup {
    id: string;
    name: string;
    slug: string;
    categories: Category[];
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    author: Author;
    publishedAt: string;
    readTime: number;
    category: Category;
    tags: Tag[];
    isPinned?: boolean;
}
