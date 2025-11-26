import { posts, tags } from '@/data/mockData';
import PostCard from '@/components/common/PostCard';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: PageProps) {
    const tag = tags.find((t) => t.slug === params.slug);
    if (!tag) return { title: 'Tag Not Found' };

    return {
        title: `#${tag.name} Posts | Dogy.io`,
        description: `Browse all posts tagged with #${tag.name}`,
    };
}

export default function TagPage({ params }: PageProps) {
    const tag = tags.find((t) => t.slug === params.slug);

    if (!tag) {
        notFound();
    }

    const tagPosts = posts.filter((post) => post.tags.some((t) => t.slug === params.slug));

    return (
        <div className="container py-8">
            <div className="mb-8 text-center py-12 bg-gray-50 rounded-xl border">
                <span className="text-sm font-bold text-primary uppercase tracking-wider mb-2 block">Tag</span>
                <h1 className="text-4xl font-bold mb-4">#{tag.name}</h1>
                <p className="text-muted">A collection of {tagPosts.length} posts</p>
            </div>

            <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-6">
                {tagPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            {tagPosts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted">No posts found with this tag.</p>
                </div>
            )}
        </div>
    );
}
