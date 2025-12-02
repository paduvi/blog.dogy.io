'use client';

import { X } from 'lucide-react';
import { useModalStore } from '@/store/modalStore';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function TocModal() {
    const t = useTranslations('Post');
    const { activeModal, setActiveModal } = useModalStore();
    const isOpen = activeModal === 'toc';
    const [tocItems, setTocItems] = useState<{ id: string; title: string; level: number }[]>([]);

    useEffect(() => {
        if (isOpen) {
            const headings = document.querySelectorAll('.hashnode-content-style h1, .hashnode-content-style h2, .hashnode-content-style h3, .hashnode-content-style h4');
            const items = Array.from(headings).map((heading) => {
                const clone = heading.cloneNode(true) as HTMLElement;
                const anchor = clone.querySelector('.heading-anchor');
                if (anchor) {
                    anchor.remove();
                }
                return {
                    id: heading.id,
                    title: clone.textContent || '',
                    level: parseInt(heading.tagName.substring(1)),
                };
            });
            setTocItems(items);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Modal Panel */}
            <div
                className="fixed top-1-2 left-1-2 transform translate-neg-1-2 w-full max-w-md bg-white z-50 shadow-2xl rounded-xl overflow-hidden"
                style={{ maxHeight: '80vh' }}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                        <h3 className="font-bold text-lg">{t('tableOfContents')}</h3>
                        <button
                            onClick={() => setActiveModal(null)}
                            className="p-2 hover-bg-gray-200 rounded-full btn-transparent cursor-pointer"
                        >
                            <X size={20} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 overflow-y-auto">
                        {tocItems.length > 0 ? (
                            <nav>
                                <ul className="space-y-2">
                                    {tocItems.map((item) => (
                                        <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 1}rem` }}>
                                            <a
                                                href={`#${item.id}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const element = document.getElementById(item.id);
                                                    if (element) {
                                                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                        setActiveModal(null);
                                                    }
                                                }}
                                                className="block py-2 px-3 rounded hover-bg-gray-100 transition-colors text-sm font-medium text-gray-700 hover-text-primary"
                                            >
                                                {item.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ) : (
                            <p className="text-center text-muted py-8">{t('noTableOfContents')}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
