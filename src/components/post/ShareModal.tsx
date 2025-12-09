'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faXTwitter, faFacebook, faReddit, faHackerNews } from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { useModalStore } from '@/store/modalStore';
import { usePostStore } from '@/store/postStore';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function ShareModal() {
    const t = useTranslations('Share');
    const locale = useLocale();
    const { activeModal } = useModalStore();
    const post = usePostStore((state) => state.post);
    const [copied, setCopied] = useState(false);
    const isOpen = activeModal === 'share';

    if (!isOpen || !post) return null;

    const postTitle = post.title;
    const postUrl = typeof window !== 'undefined' ? `${window.location.origin}/${locale}/post/${post.slug}` : '';

    const handleCopyLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigator.clipboard.writeText(postUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = [
        {
            name: 'Twitter',
            icon: faXTwitter,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`
        },
        {
            name: 'Facebook',
            icon: faFacebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`
        },
        {
            name: 'LinkedIn',
            icon: faLinkedin,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`
        },
        {
            name: 'Reddit',
            icon: faReddit,
            url: `https://www.reddit.com/submit?url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(postTitle)}`
        },
        {
            name: 'Hacker News',
            icon: faHackerNews,
            url: `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(postUrl)}&t=${encodeURIComponent(postTitle)}`
        }
    ];

    return (
        <>
            {/* Popover Panel */}
            <div
                className="absolute bottom-16 right-0 transform translate-x-4 mb-4 w-56 bg-white z-50 shadow-xl rounded-xl overflow-hidden border border-gray-100"
            >
                <div className="flex flex-col">
                    {/* Content */}
                    <div className="p-4">
                        <div className="space-y-3">
                            {shareLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 text-gray-600 hover-bg-gray-200 transition-colors rounded-lg"
                                >
                                    <FontAwesomeIcon icon={link.icon} size='lg' />
                                    <span className="font-medium">{link.name}</span>
                                </a>
                            ))}
                            <Link
                                href={`/post/${post.slug}`}
                                onClick={handleCopyLink}
                                className="flex items-center gap-2 p-2 text-gray-600 hover-bg-gray-200 transition-colors rounded-lg"
                            >
                                <FontAwesomeIcon icon={faLink} size='lg' />
                                <span className="font-medium">
                                    {copied ? t('linkCopied') : t('copyLink')}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
