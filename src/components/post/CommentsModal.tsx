'use client';

import { X } from 'lucide-react';
import { DiscussionEmbed } from 'disqus-react';

interface CommentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    postSlug: string;
    postTitle: string;
}

export default function CommentsModal({ isOpen, onClose, postSlug, postTitle }: CommentsModalProps) {
    if (!isOpen) return null;

    const disqusConfig = {
        url: typeof window !== 'undefined' ? `${window.location.origin}/post/${postSlug}` : '',
        identifier: postSlug,
        title: postTitle,
        language: 'en_US'
    };

    const disqusShortname = "dogy-io-demo";

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black-50 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div
                className="fixed top-0 right-0 h-full w-full lg_w-1_3 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                        <h3 className="font-bold text-lg">Comments</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover-bg-gray-200 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="min-h-200">
                            <DiscussionEmbed
                                shortname={disqusShortname}
                                config={disqusConfig}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
