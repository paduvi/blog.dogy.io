'use client';

import { useMemo, useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { DiscussionEmbed } from 'disqus-react';
import { useModalStore } from '@/store/modalStore';
import { usePostStore } from '@/store/postStore';
import { useTranslations, useLocale } from 'next-intl';
import BuyMeACoffee from '../common/BuyMeACoffee';

export default function CommentsModal() {
    const t = useTranslations('Comments');
    const locale = useLocale();
    const { activeModal, setActiveModal } = useModalStore();
    const post = usePostStore((state) => state.post);
    const isOpen = activeModal === 'comments';

    if (!post) return null;

    const postSlug = post.slug;
    const postTitle = post.title;
    const [postUrl, setPostUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPostUrl(`${window.location.origin}/${locale}/post/${postSlug}`);
        }
    }, [locale, postSlug]);

    const disqusConfig = useMemo(() => ({
        identifier: locale + "/post/" + postSlug,
        title: postTitle,
        language: locale,
        url: postUrl
    }), [postSlug, postTitle, locale, postUrl]);
    
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
        setIsMobile(checkMobile);
    }, []);

    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setIsBlocked(false);
            return;
        }

        const checkDisqus = setTimeout(() => {
            const disqusFrame = document.querySelector('#disqus_thread iframe');
            // If the iframe doesn't exist or has no height, it's likely blocked
            if (!disqusFrame || disqusFrame.clientHeight === 0) {
                setIsBlocked(true);
            }
        }, 3000);

        return () => clearTimeout(checkDisqus);
    }, [isOpen, postSlug]);

    const disqusShortname = "https-dogy-io";

    return (
        <>
            {/* Modal Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full lg-w-1-3 bg-white z-50 shadow-2xl transition-all duration-300 ease-in-out 
                    ${isMobile 
                        ? (isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none') 
                        : (isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none')
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                        <h3 className="font-bold text-lg">{t('title')}</h3>
                        <button
                            onClick={() => setActiveModal(null)}
                            className="p-2 hover-bg-gray-200 rounded-full btn-transparent cursor-pointer transition-colors"
                        >
                            <X size={20} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <BuyMeACoffee isModal/>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 relative">
                        {isBlocked && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex flex-col items-center text-center">
                                <AlertCircle className="text-amber-500 mb-2" size={32} />
                                <h4 className="font-bold text-amber-800 mb-1">{t('commentsBlockedTitle', { defaultMessage: 'Comments Unable to Load' })}</h4>
                                <p className="text-sm text-amber-700">
                                    {t('commentsBlockedMessage', { defaultMessage: 'Please disable your ad blocker to view and join the discussion.' })}
                                </p>
                            </div>
                        )}
                        <DiscussionEmbed
                            shortname={disqusShortname}
                            config={disqusConfig}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
