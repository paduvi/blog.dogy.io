'use client';

import { useModalStore } from '@/store/useModalStore';
import NewsletterSubscribe from '@/components/common/NewsletterSubscribe';

export default function SubscribeModal() {
    const { activeModal, setActiveModal } = useModalStore();
    const isOpen = activeModal === 'subscribe';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-200 pointer-events-auto">
                <NewsletterSubscribe 
                    variant="modal" 
                    onClose={() => setActiveModal(null)} 
                />
            </div>
        </div>
    );
}
