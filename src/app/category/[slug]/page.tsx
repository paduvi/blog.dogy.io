import { posts, categories, tags } from '@/data/mockData';
import CategoryPostList from '@/components/category/CategoryPostList';
import TagCloud from '@/components/common/TagCloud';
import BuyMeACoffee from '@/components/common/BuyMeACoffee';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{
        sort?: string;
    }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const category = categories.find((c) => c.slug === slug);
    if (!category) return { title: 'Category Not Found' };

    return {
        title: `${category.name} Posts | Dogy.io`,
        description: `Browse all posts in ${category.name}`,
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const category = categories.find((c) => c.slug === slug);

    if (!category) {
        notFound();
    }

    let categoryPosts = posts.filter((post) => post.category.slug === slug);

    return (
        <div className="container py-8">
            {/* Header Section - Two Column Layout */}
            <div className="grid grid-cols-1 lg_grid-cols-2 gap-8 mb-12">
                {/* Left: Category Info */}
                <div className="flex flex-col justify-center">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider mb-3">SERIES</span>
                    <h1 className="text-4xl md_text-5xl font-bold mb-4">{category.name}</h1>
                    <p className="text-muted text-lg mb-6">
                        In this series, I will cover most of famous and useful algorithms in the real world
                    </p>
                </div>

                {/* Right: Cover Image */}
                <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video lg_aspect-auto lg_h-full min-h-300">
                    {category.coverImage && (
                        <img
                            src={category.coverImage}
                            alt={category.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                </div>
            </div>

            {/* Articles Section */}
            <div className="mb-8 pb-4 border-b">
                <h2 className="text-xl font-semibold text-center">Articles in this series</h2>
            </div>

            {/* Posts List with Sidebar */}
            <div className="grid grid-cols-1 lg_grid-cols-12 gap-8">
                {/* Main Content */}
                <div className="lg_col-span-8">
                    <CategoryPostList posts={categoryPosts} sortOrder={category.sortOrder} />
                </div>

                {/* Sidebar */}
                <aside className="lg_col-span-4">
                    <div className="sticky top-24 flex flex-col gap-6">
                        <BuyMeACoffee />
                        <TagCloud tags={tags} />
                    </div>
                </aside>
            </div>
        </div>
    );
}
