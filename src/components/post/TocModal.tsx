'use client';

import { X } from 'lucide-react';

interface TocModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TocModal({ isOpen, onClose }: TocModalProps) {
    if (!isOpen) return null;

    // Mock table of contents - in a real app, this would be generated from the post content
    const tocItems = [
        { id: 'intro', title: 'Introduction', level: 1 },
        { id: 'section1', title: 'Getting Started', level: 1 },
        { id: 'subsection1', title: 'Installation', level: 2 },
        { id: 'subsection2', title: 'Configuration', level: 2 },
        { id: 'section2', title: 'Advanced Topics', level: 1 },
        { id: 'conclusion', title: 'Conclusion', level: 1 },
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
                <div className="flex flex-col max-h-screen-80">
                    {/* Header */}
                    <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                        <h3 className="font-bold text-lg">Table of Contents</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover-bg-gray-200 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 overflow-y-auto">
                        <nav>
                            <ul className="space-y-2">
                                {tocItems.map((item) => (
                                    <li key={item.id}>
                                        <a
                                            href={`#${item.id}`}
                                            onClick={onClose}
                                            className={`block py-2 px-3 rounded hover-bg-gray-100 transition-colors ${item.level === 2 ? 'ml-4 text-sm text-muted' : 'font-medium'
                                                }`}
                                        >
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}
