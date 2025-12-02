'use client';

import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useTagStore } from '@/store/tagStore';
import { useEffect } from 'react';
import { fetchAllTags } from '@/actions/tagActions';

interface TagCloudProps {
    currentTagSlug?: string;
    fullHeight?: boolean;
}

export default function TagCloud({ currentTagSlug, fullHeight = false }: TagCloudProps) {
    const t = useTranslations('Common');
    const locale = useLocale();
    const { tags, isLoading, setTags, setLoading, lastFetched } = useTagStore();

    useEffect(() => {
        const loadTags = async () => {
            // Cache for 1 hour (3600000 ms)
            const CACHE_DURATION = 3600000;
            const now = Date.now();

            if (tags.length === 0 || !lastFetched || (now - lastFetched > CACHE_DURATION)) {
                setLoading(true);
                try {
                    const fetchedTags = await fetchAllTags(locale);
                    setTags(fetchedTags);
                } catch (error) {
                    console.error("Error loading tags:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadTags();
    }, [locale, setTags, setLoading, tags.length, lastFetched]);

    return (
        <section className="bg-white rounded-xl p-6 border h-fit">
            <h3 className="font-bold text-lg mb-4">{t('discoverMore')}</h3>
            
            {isLoading && tags.length === 0 ? (
                <div className="flex flex-wrap gap-2 animate-pulse">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="h-8 w-20 bg-gray-200 rounded-full"></div>
                    ))}
                </div>
            ) : (
                <div className={`flex flex-wrap gap-2 ${fullHeight ? '' : 'md-max-h-64 md-overflow-y-auto md-pr-2'}`}>
                    {tags.map((tag) => {
                        const isCurrentTag = tag.slug === currentTagSlug;

                        if (isCurrentTag) {
                            return (
                                <span
                                    key={tag.id}
                                    className="badge bg-gray-200 text-gray-500 cursor-not-allowed flex items-center gap-1"
                                >
                                    #{tag.name}
                                    <span className="text-xs opacity-70">({tag.count})</span>
                                </span>
                            );
                        }

                        return (
                            <Link
                                key={tag.id}
                                href={`/tag/${tag.slug}`}
                                className="badge bg-blue-50 text-blue-700 hover-bg-blue-100 transition-colors flex items-center gap-1"
                            >
                                #{tag.name}
                                <span className="text-xs opacity-70">({tag.count})</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
