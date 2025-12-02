import CategoryPostList from '@/components/category/CategoryPostList';
import TagCloud from '@/components/common/TagCloud';
import BuyMeACoffee from '@/components/common/BuyMeACoffee';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getHashnodeHost, hashnodeApi, mapHashnodePostToPost } from '@/lib/hashnode';
import { fetchMoreCategoryPosts } from '@/actions/postActions';

interface PageProps {
    params: Promise<{
        slug: string;
        locale: string;
    }>;
    searchParams: Promise<{
        sort?: string;
    }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug, locale } = await params;
    const host = getHashnodeHost(locale);
    const data = await hashnodeApi.getPostsBySeries(host, slug, 1);
    const category = data.series;

    if (!category) return { title: 'Category Not Found' };

    const url = `https://dogy.io/${locale}/category/${slug}`;
    const ogImage = category.coverImage || '/favicon/dog_logo.png';
    const title = `${category.name} Posts`;
    const description = `Browse all posts in ${category.name} on Dogy.io`;

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: url,
            siteName: 'Dogy.io',
            locale: locale === 'vi' ? 'vi_VN' : 'en_US',
            type: 'website',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: category.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [ogImage],
        },
        alternates: {
            canonical: url,
            languages: {
                'en': `https://dogy.io/en/category/${slug}`,
                'vi': `https://dogy.io/vi/category/${slug}`,
            },
        },
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug, locale } = await params;
    const host = getHashnodeHost(locale);
    const t = await getTranslations('Post');

    const data = await hashnodeApi.getPostsBySeries(host, slug, 6); // Fetch 6 initially to match POSTS_PER_PAGE
    const category = data.series;

    if (!category) {
        notFound();
    }

    const categoryPosts = category.posts.edges.map((edge: any) => mapHashnodePostToPost(edge.node));
    const pageInfo = category.posts.pageInfo;

    return (
        <div className="container py-8">
            {/* Header Section - Two Column Layout */}
            <div className="grid grid-cols-1 lg-grid-cols-2 gap-8 mb-12">
                {/* Left: Category Info */}
                <div className="flex flex-col justify-center">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider mb-3">{t('seriesTitle')}</span>
                    <h1 className="text-4xl md-text-5xl font-bold mb-4">{category.name}</h1>
                    <div className="text-muted text-lg mb-6" dangerouslySetInnerHTML={{ __html: category.description?.html || '' }} />
                </div>

                {/* Right: Cover Image */}
                <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video lg-aspect-auto lg-h-full min-h-300">
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
                <h2 className="text-xl font-semibold text-center">{t('series')}</h2>
            </div>

            {/* Posts List with Sidebar */}
            <div className="grid grid-cols-1 lg-grid-cols-12 gap-8">
                {/* Main Content */}
                <div className="lg-col-span-8">
                    <CategoryPostList 
                        initialPosts={categoryPosts} 
                        initialPageInfo={pageInfo}
                        fetchMoreAction={fetchMoreCategoryPosts.bind(null, locale, slug)}
                    />
                </div>

                {/* Sidebar */}
                <aside className="lg-col-span-4">
                    <div className="sticky top-24 flex flex-col gap-6">
                        <BuyMeACoffee />
                        <TagCloud />
                    </div>
                </aside>
            </div>
        </div>
    );
}
