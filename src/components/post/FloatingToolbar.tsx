'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessageCircleMore, List, Coffee, Share2 } from 'lucide-react';
import { CommentCount } from 'disqus-react';
import { useModalStore } from '@/store/modalStore';
import { usePostStore } from '@/store/postStore';
import ShareModal from './ShareModal';
import { useTranslations, useLocale } from 'next-intl';

interface ToolbarButtonProps {
    onClick: () => void;
    icon: React.ElementType;
    label: string;
    children?: React.ReactNode;
    showTooltip?: boolean;
}

function ToolbarButton({ onClick, icon: Icon, label, children, showTooltip = true }: ToolbarButtonProps) {
    return (
        <div className="relative group">
            <button
                onClick={onClick}
                className="hover-bg-gray-200 transition-colors btn-transparent rounded-full p-2 cursor-pointer text-gray-600 hover-text-gray-900"
                aria-label={label}
            >
                <Icon size={20} />
            </button>
            {/* Custom Tooltip - hidden on mobile */}
            {showTooltip && (
                <div className="absolute bottom-full left-1-2 transform translate-x-neg-1-2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover-opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {label}
                    {/* Arrow */}
                    <div className="absolute top-full left-1-2 transform translate-x-neg-1-2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </div>
            )}
            {children}
        </div>
    );
}

export default function FloatingToolbar() {
    const t = useTranslations('Post');
    const locale = useLocale();
    const { activeModal, setActiveModal } = useModalStore();
    const post = usePostStore((state) => state.post);
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    if (!post) return null;

    const postSlug = post.slug;
    const postTitle = post.title;
    const postUrl = typeof window !== 'undefined' ? `${window.location.origin}/${locale}/post/${postSlug}` : '';

    const disqusConfig = useMemo(() => ({
        identifier: locale + "/post/" + postSlug,
        title: postTitle,
        language: locale,
        url: postUrl
    }), [postSlug, postTitle, locale]);

    const disqusShortname = "https-dogy-io";

    useEffect(() => {
        // Detect mobile device
        const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
        setIsMobile(checkMobile);

        const handleScroll = () => {
            // Show toolbar after scrolling 100px
            setIsVisible(window.scrollY > 100);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    const shareOpen = activeModal === 'share';

    return (
        <div className={`fixed bottom-8 left-1-2 transform translate-neg-1-2 w-full flex justify-center pointer-events-none ${shareOpen ? 'z-50' : 'z-40'}`}>
            <div className="flex items-center gap-2 bg-white rounded-full shadow-2xl px-6 py-3 border border-gray-200 pointer-events-auto">
                {/* Comment */}
                <div className="relative group">
                    <button
                        onClick={() => setActiveModal('comments')}
                        className="hover-bg-gray-200 transition-colors btn-transparent rounded-full p-2 cursor-pointer text-gray-600 hover-text-gray-900 flex items-center gap-1"
                        aria-label={t('comments')}
                    >
                        <MessageCircleMore size={20} />
                        <span className="text-xs">
                            <CommentCount
                                shortname={disqusShortname}
                                config={disqusConfig}
                            />
                        </span>
                    </button>
                    {/* Custom Tooltip - hidden on mobile */}
                    {!isMobile && (
                        <div className="absolute bottom-full left-1-2 transform translate-x-neg-1-2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover-opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            {t('comments')}
                            {/* Arrow */}
                            <div className="absolute top-full left-1-2 transform translate-x-neg-1-2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px h-5 bg-gray-200 mx-4"></div>

                {/* TOC */}
                <ToolbarButton
                    onClick={() => setActiveModal('toc')}
                    icon={List}
                    label={t('tableOfContents')}
                    showTooltip={!isMobile}
                />

                {/* Divider */}
                <div className="w-px h-5 bg-gray-200 mx-4"></div>

                {/* Sponsor */}
                <ToolbarButton
                    onClick={() => setActiveModal('sponsor')}
                    icon={Coffee}
                    label={t('sponsor')}
                    showTooltip={!isMobile}
                />

                {/* Divider */}
                <div className="w-px h-5 bg-gray-200 mx-4"></div>

                {/* Share */}
                <ToolbarButton
                    onClick={async () => {
                        if (isMobile && typeof navigator !== 'undefined' && 'share' in navigator) {
                            try {
                                await navigator.share({
                                    title: postTitle,
                                    text: postTitle,
                                    url: `${window.location.origin}/${locale}/post/${postSlug}`,
                                });
                            } catch (err) {
                                console.error('Error sharing:', err);
                            }
                        } else {
                            setActiveModal(shareOpen ? null : 'share')
                        }
                    }}
                    icon={Share2}
                    label={t('shareArticle')}
                    showTooltip={!isMobile}
                >
                    <ShareModal />
                </ToolbarButton>
            </div>
        </div>
    );
}
