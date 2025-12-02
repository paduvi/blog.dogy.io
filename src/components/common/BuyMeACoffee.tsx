'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function BuyMeACoffee({isModal = false}: {isModal?: boolean}) {
    const t = useTranslations('Common');
    const tSponsor = useTranslations('Sponsor');

    return (
        <section className="bg-white rounded-xl p-6 border h-fit">
            <h3 className="font-bold text-lg mb-4">{isModal ? tSponsor('title') : t('supportMe')}</h3>
            <p className="text-gray-600 mb-6 text-sm">
                {isModal ? tSponsor('description') : t('supportDescription')}
            </p>
            <Link
                href="https://www.buymeacoffee.com/paduvi"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-bmc w-full shadow-sm"
            >
                <span className="mr-2 text-xl">☕</span>
                {isModal ? tSponsor('buyMeACoffee') : t('buyMeACoffee')}
            </Link>
        </section>
    );
}
