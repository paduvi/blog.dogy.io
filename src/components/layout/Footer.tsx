'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('Footer');

    return (
        <footer className="bg-white border-t mt-12 py-8">
            <div className="container">
                <div className="flex flex-row md-flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        
                        <img className='w-6 h-6 rounded' src="/favicon/favicon-32x32.png" alt="Dogy.io Logo" />
                        <span className="font-bold text-lg">Dogy.io</span>
                        <span className="text-muted text-sm ml-2">© {new Date().getFullYear()}</span>
                    </div>

                    <div className="flex gap-6 text-sm text-muted">
                        <Link href="https://hashnode.com/privacy?source=blog-footer" target="_blank"
                            rel="noopener noreferrer" className="hover-text-main">{t('privacyPolicy')}</Link>
                        <Link href="https://hashnode.com/terms?source=blog-footer" target="_blank"
                            rel="noopener noreferrer" className="hover-text-main">{t('terms')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
