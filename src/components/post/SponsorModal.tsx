'use client';

import { X } from 'lucide-react';
import { useModalStore } from '@/store/modalStore';
import BuyMeACoffee from '../common/BuyMeACoffee';

export default function SponsorModal() {
    const { activeModal, setActiveModal } = useModalStore();
    const isOpen = activeModal === 'sponsor';

    if (!isOpen) return null;

    return (
        <>
            {/* Modal Panel */}
            <div
                className="fixed top-1-2 left-1-2 transform translate-neg-1-2 w-full max-w-md bg-white z-50 shadow-2xl rounded-xl overflow-hidden relative"
            >
                <button
                    onClick={() => setActiveModal(null)}
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
