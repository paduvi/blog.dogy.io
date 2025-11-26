import { posts, categories } from '@/data/mockData';
import PostCard from '@/components/common/PostCard';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: PageProps) {
    const category = categories.find((c) => c.slug === params.slug);
    if (!category) return { title: 'Category Not Found' };

    return {
        title: `${category.name} Posts | Dogy.io`,
        description: `Browse all posts in ${category.name}`,
    };
}

export default function CategoryPage({ params }: PageProps) {
    const category = categories.find((c) => c.slug === params.slug);

    if (!category) {
        notFound();
    }

    const categoryPosts = posts.filter((post) => post.category.slug === params.slug);

    return (
        <div className="container py-8">
            <div className="mb-8 text-center py-12 bg-gray-50 rounded-xl border">
                <span className="text-sm font-bold text-primary uppercase tracking-wider mb-2 block">Category</span>
                <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
                <p className="text-muted">A collection of {categoryPosts.length} posts</p>
            </div>

            <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-6">
                {categoryPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            {categoryPosts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted">No posts found in this category.</p>
                </div>
            )}
        </div>
    );
}
