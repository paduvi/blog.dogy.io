'use client';

import { X, Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    postTitle: string;
    postUrl: string;
}

export default function ShareModal({ isOpen, onClose, postTitle, postUrl }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(postUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = [
        {
            name: 'Twitter',
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`,
            color: 'bg-blue-400 hover-bg-blue-500'
        },
        {
            name: 'Facebook',
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
            color: 'bg-blue-600 hover-bg-blue-700'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
            color: 'bg-blue-700 hover-bg-blue-800'
        }
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black-50 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div
                className="fixed top-1_2 left-1_2 transform translate-neg-1_2 w-full max-w-md bg-white z-50 shadow-2xl rounded-xl overflow-hidden"
            >
                <div className="flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                        <h3 className="font-bold text-lg">Share This Post</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover-bg-gray-200 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="space-y-3 mb-4">
                            {shareLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 p-3 rounded-lg text-white transition-colors ${link.color}`}
                                >
                                    <link.icon size={20} />
                                    <span className="font-medium">Share on {link.name}</span>
                                </a>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <button
                                onClick={handleCopyLink}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover-bg-gray-200 transition-colors"
                            >
                                <LinkIcon size={20} className="text-gray-600" />
                                <span className="font-medium text-gray-700">
                                    {copied ? 'Link Copied!' : 'Copy Link'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
