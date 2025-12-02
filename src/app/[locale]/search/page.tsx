import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SearchResults from '@/components/search/SearchResults';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    
    return {
        title: 'Search | Dogy.io',
        description: 'Search for articles on Dogy.io',
        openGraph: {
            title: 'Search | Dogy.io',
            description: 'Search for articles on Dogy.io',
            url: `https://dogy.io/${locale}/search`,
            siteName: 'Dogy.io',
            locale: locale === 'vi' ? 'vi_VN' : 'en_US',
            type: 'website',
        },
        alternates: {
            canonical: `https://dogy.io/${locale}/search`,
            languages: {
                'en': 'https://dogy.io/en/search',
                'vi': 'https://dogy.io/vi/search',
            },
        },
    };
}

export default async function SearchPage() {
    const t = await getTranslations('Common');

    return (
        <Suspense fallback={<div className="container py-8">{t('loading')}</div>}>
            <SearchResults />
        </Suspense>
    );
}
