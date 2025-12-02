import { create } from 'zustand';

type ModalType = 'comments' | 'toc' | 'sponsor' | 'share' | 'subscribe' | null;

interface ModalStore {
    activeModal: ModalType;
    setActiveModal: (modal: ModalType) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
    activeModal: null,
    setActiveModal: (modal) => set({ activeModal: modal }),
}));
