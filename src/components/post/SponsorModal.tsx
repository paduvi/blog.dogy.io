'use client';

import { X } from 'lucide-react';
import BuyMeACoffee from '../common/BuyMeACoffee';

interface SponsorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SponsorModal({ isOpen, onClose }: SponsorModalProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black-50 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div
                className="fixed top-1_2 left-1_2 transform translate-neg-1_2 w-full max-w-md bg-white z-50 shadow-2xl rounded-xl overflow-hidden relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2 hover-bg-gray-200 rounded-full transition-colors z-10 bg-white-50 backdrop-blur-sm border-none cursor-pointer"
                >
                    <X size={20} className="text-gray-600" />
                </button>

                <div className="w-full h-full">
                    <BuyMeACoffee />
                </div>
            </div>
        </>
    );
}
