"use client";

import { useSearchParams } from 'next/navigation';
import InfinitePostGrid from '@/components/common/InfinitePostGrid';
import TagCloud from '@/components/common/TagCloud';
import BuyMeACoffee from '@/components/common/BuyMeACoffee';
import { Search } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { getHashnodeHost, hashnodeApi, mapHashnodePostToPost } from '@/lib/hashnode';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const locale = useLocale();
    const t = useTranslations('Search');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) {
                setSearchResults([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const host = getHashnodeHost(locale);

                // Get publication ID (from cache or fetch)
                const { getPublicationId: getCachedId, setPublicationId } = await import('@/store/publicationStore').then(m => m.usePublicationStore.getState());
                let publicationId: string | undefined = getCachedId(host);

                if (!publicationId) {
                    // Fetch and cache publication ID
                    const fetchedId = await hashnodeApi.getPublicationId(host);
                    setPublicationId(host, fetchedId);
                    publicationId = fetchedId;
                }

                // Search for posts using publication ID
                const data = await hashnodeApi.searchPosts(publicationId!, query, 20);
                const posts = data.edges.map((edge: any) => mapHashnodePostToPost(edge.node));
                setSearchResults(posts);

                // Fetch tags for cloud
                const postsData = await hashnodeApi.getPosts(host);
                const allPosts = postsData.posts.edges.map((edge: any) => mapHashnodePostToPost(edge.node));
                const tagsMap = new Map();
                allPosts.forEach((p: any) => {
                    p.tags.forEach((tag: any) => {
                        if (!tagsMap.has(tag.slug)) {
                            tagsMap.set(tag.slug, tag);
                        }
                    });
                });
                setTags(Array.from(tagsMap.values()));
            } catch (error) {
                console.error("Failed to fetch search results:", error);
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, locale]);

    if (loading) {
        return (
            <div className="container py-8">
                <div className="text-center py-12">
                    <p className="text-muted">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
                    <Search size={32} className="text-primary" />
                    {t('results')}
                </h1>
                <p className="text-muted text-lg">
                    {t(searchResults.length === 1 ? 'foundPost' : 'foundPosts', { count: searchResults.length })} <span className="font-bold text-main">"{query}"</span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg-grid-cols-12 gap-8">
                <div className="lg-col-span-8">
                    <InfinitePostGrid posts={searchResults} />

                    {searchResults.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <Search size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-700 mb-2">{t('noResults')}</h3>
                            <p className="text-muted">Try searching for something else.</p>
                        </div>
                    )}
                </div>

                <aside className="lg-col-span-4">
                    <div className="sticky top-24 flex flex-col gap-6">
                        <BuyMeACoffee />
                        <TagCloud tags={tags} />
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default function SearchPage() {
    const t = useTranslations('Common');

    return (
        <Suspense fallback={<div className="container py-8">{t('loading')}</div>}>
            <SearchResults />
        </Suspense>
    );
}
