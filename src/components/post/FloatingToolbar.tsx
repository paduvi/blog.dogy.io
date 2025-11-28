'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, List, Coffee, Share2 } from 'lucide-react';

interface FloatingToolbarProps {
    onCommentClick: () => void;
    onTocClick: () => void;
    onSponsorClick: () => void;
    onShareClick: () => void;
}

interface ToolbarButtonProps {
    onClick: () => void;
    icon: React.ElementType;
    label: string;
}

function ToolbarButton({ onClick, icon: Icon, label }: ToolbarButtonProps) {
    return (
        <div className="relative group">
            <button
                onClick={onClick}
                className="hover-bg-gray-200 transition-colors btn-transparent rounded-full p-2 cursor-pointer text-gray-600 hover-text-gray-900"
                aria-label={label}
            >
                <Icon size={20} />
            </button>
            {/* Custom Tooltip */}
            <div className="absolute bottom-full left-1_2 transform translate-x-neg-1_2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover-opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {label}
                {/* Arrow */}
                <div className="absolute top-full left-1_2 transform translate-x-neg-1_2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
            </div>
        </div>
    );
}

export default function FloatingToolbar({
    onCommentClick,
    onTocClick,
    onSponsorClick,
    onShareClick
}: FloatingToolbarProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show toolbar after scrolling 100px
            setIsVisible(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-8 left-1_2 transform translate-x-neg-1_2 z-40 flex items-center bg-white rounded-full shadow-2xl px-6 py-3 border border-gray-200">
            {/* Comment */}
            <ToolbarButton
                onClick={onCommentClick}
                icon={MessageSquare}
                label="Comments"
            />

            {/* Divider */}
            <div className="w-px h-5 bg-gray-200 mx-4"></div>

            {/* TOC */}
            <ToolbarButton
                onClick={onTocClick}
                icon={List}
                label="Table of Contents"
            />

            {/* Divider */}
            <div className="w-px h-5 bg-gray-200 mx-4"></div>

            {/* Sponsor */}
            <ToolbarButton
                onClick={onSponsorClick}
                icon={Coffee}
                label="Sponsor"
            />

            {/* Divider */}
            <div className="w-px h-5 bg-gray-200 mx-4"></div>

            {/* Share */}
            <ToolbarButton
                onClick={onShareClick}
                icon={Share2}
                label="Share"
            />
        </div>
    );
}
