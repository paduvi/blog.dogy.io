'use client';

import { useMemo } from 'react';
import { X } from 'lucide-react';
import { DiscussionEmbed } from 'disqus-react';
import { useModalStore } from '@/store/modalStore';
import { useTranslations, useLocale } from 'next-intl';

interface CommentsModalProps {
    postSlug: string;
    postTitle: string;
    postUrl: string;
}

export default function CommentsModal({ postSlug, postTitle, postUrl }: CommentsModalProps) {
    const t = useTranslations('Comments');
    const locale = useLocale();
    const { activeModal, setActiveModal } = useModalStore();
    const isOpen = activeModal === 'comments';

    const disqusConfig = useMemo(() => ({
        url: postUrl,
        identifier: postSlug,
        title: postTitle,
        language: locale === 'vi' ? 'vi' : 'en'
    }), [postUrl, postSlug, postTitle, locale]);

    const disqusShortname = "https-dogy-io";

    return (
        <>
            {/* Modal Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full lg-w-1-3 bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
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
                    <div className="flex-1 overflow-y-auto p-4">
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
