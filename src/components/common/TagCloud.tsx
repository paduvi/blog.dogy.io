'use client';

import { Link } from '@/i18n/routing';
import { Tag } from '@/data/mockData';
import { useTranslations } from 'next-intl';

interface TagCloudProps {
    tags: Tag[];
    currentTagSlug?: string;
    fullHeight?: boolean;
}

export default function TagCloud({ tags, currentTagSlug, fullHeight = false }: TagCloudProps) {
    const t = useTranslations('Common');

    return (
        <section className="bg-white rounded-xl p-6 border h-fit">
            <h3 className="font-bold text-lg mb-4">{t('discoverMore')}</h3>
            <div className={`flex flex-wrap gap-2 ${fullHeight ? '' : 'md-max-h-64 md-overflow-y-auto md-pr-2'}`}>
                {tags.map((tag) => {
                    const isCurrentTag = tag.slug === currentTagSlug;

                    if (isCurrentTag) {
                        return (
                            <span
                                key={tag.id}
                                className="badge bg-gray-200 text-gray-500 cursor-not-allowed"
                            >
                                #{tag.name}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={tag.id}
                            href={`/tag/${tag.slug}`}
                            className="badge bg-blue-50 text-blue-700 hover-bg-blue-100 transition-colors"
                        >
                            #{tag.name}
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
