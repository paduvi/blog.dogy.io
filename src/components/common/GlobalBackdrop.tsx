'use client';

import { useModalStore } from '@/store/useModalStore';

export default function GlobalBackdrop() {
    const { activeModal, setActiveModal } = useModalStore();

    if (!activeModal) return null;

    return (
        <div
            className="fixed inset-0 bg-black-50 z-40 transition-opacity"
            onClick={() => setActiveModal(null)}
        />
    );
}
