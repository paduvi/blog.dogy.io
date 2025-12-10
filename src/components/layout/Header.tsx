"use client";

import React, { useEffect } from 'react';
import { Search, Menu, ChevronDown, Bell, X } from 'lucide-react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import Image from 'next/image';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useModalStore } from '@/store/modalStore';
import { usePostStore } from '@/store/postStore';

interface HeaderProps {
    categories: {
        id: string;
        name: string;
        slug: string;
    }[];
}

export default function Header({ categories }: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations('Header');
    const { setActiveModal } = useModalStore();
    const post = usePostStore((state) => state.post);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Clear search query when navigating away from search page
    useEffect(() => {
        if (!pathname.startsWith('/search')) {
            setSearchQuery('');
        }
    }, [pathname]);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
        setIsMobile(checkMobile);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsMobileSearchOpen(false);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setIsMobileSearchOpen(false);
    };

    const toggleMobileSearch = () => {
        setIsMobileSearchOpen(!isMobileSearchOpen);
        setIsMobileMenuOpen(false);
    };

    const switchLanguage = () => {
        const nextLocale = locale === 'en' ? 'vi' : 'en';

        // Check if we are on a post page and have reference to canonical URL
        if (post?.canonicalUrl) {
           window.location.href = post.canonicalUrl;
           return;
        }
        
        // Redirect to home page of the new locale
        router.replace('/', { locale: nextLocale });
    };

    return (
        <header className="sticky top-0 z-30 bg-white border-b">
            <div className="container h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleMobileMenu}
                            className="md-hidden p-2 rounded-full btn-transparent"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <Link href="/" className="flex items-center gap-2">
                            <Image 
                                className='rounded-lg' 
                                src="/favicon/favicon-32x32.png" 
                                alt="Dogy.io Logo" 
                                width={32} 
                                height={32} 
                            />
                            <span className="font-bold text-xl hidden md-block">Dogy.io</span>
                        </Link>
                    </div>

                    <nav className="hidden md-flex items-center gap-6">
                        <div className="relative group h-16 flex items-center">
                            <button className="flex items-center gap-1 font-medium text-sm text-muted hover-text-main transition-colors btn-transparent">
                                {t('categories')}
                                <ChevronDown size={14} />
                            </button>

                            <div className="absolute top-full left-0 w-48 pt-2 opacity-0 invisible group-hover-opacity-100 group-hover-visible transition-all duration-200 transform translate-y-2 group-hover-translate-y-0 z-50">
                                <div className="bg-white border rounded-lg shadow-lg p-2">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/category/${category.slug}`}
                                            className="block px-4 py-2 text-sm text-muted hover-text-primary hover-bg-gray-50 rounded-md transition-colors"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>

                <div className="flex items-center gap-2 md-gap-4">
                    <form onSubmit={handleSearch} className="hidden md-flex items-center bg-gray-100 rounded-full px-4 w-64 h-10">
                        <Search size={18} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            className="bg-transparent border-none outline-none text-sm w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <div className="relative group flex md-flex items-center">
                        <button
                            onClick={switchLanguage}
                            className="language-toggle-pill bg-gray-100"
                        >
                            {locale === 'en' ? (
                                <>
                                    <div className="flag-circle relative w-full h-full">
                                        <Image
                                            src="https://flagcdn.com/w80/gb.png"
                                            alt="English"
                                            fill
                                            className="flag-img object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                    <span className="language-text">EN</span>
                                </>
                            ) : (
                                <>
                                    <span className="language-text">VI</span>
                                    <div className="flag-circle relative w-full h-full">
                                        <Image
                                            src="https://flagcdn.com/w80/vn.png"
                                            alt="Vietnamese"
                                            fill
                                            className="flag-img object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                </>
                            )}
                        </button>
                        {!isMobile && (
                            <span className="absolute top-full mt-2 left-half translate-x-neg-half px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover-opacity-100 group-hover-visible transition-opacity duration-200 whitespace-nowrap z-50">
                                {locale === 'vi' ? t('switchToEnglish') : t('switchToVietnamese')}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={toggleMobileSearch}
                        className="md-hidden p-2 hover-bg-gray-100 rounded-full border-none"
                    >
                        {isMobileSearchOpen ? <X size={18} /> : <Search size={18} />}
                    </button>

                    <button 
                        onClick={() => setActiveModal('subscribe')}
                        className="hidden cursor-pointer md-flex items-center gap-2 px-4 bg-primary text-white text-sm font-medium rounded-full hover-bg-primary-hover hover-scale-105 transition-all h-10"
                    >
                        <Bell size={16} />
                        {t('subscribe')}
                    </button>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {isMobileSearchOpen && (
                <div className="md-hidden bg-white border-t p-4">
                    <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                        <Search size={18} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none outline-none text-sm w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </form>
                </div>
            )}

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="md-hidden bg-white border-t">
                    <nav className="p-4">
                        <div className="mb-4">
                            <h3 className="font-semibold text-sm text-gray-700 mb-2">{t('categories')}</h3>
                            <div className="flex flex-col gap-1">
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/category/${category.slug}`}
                                        className="block px-4 py-2 text-sm text-muted hover-text-primary hover-bg-gray-50 rounded-md transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}