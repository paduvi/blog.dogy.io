import { create } from 'zustand';

type ModalType = 'comments' | 'toc' | 'sponsor' | 'share' | null;

interface PostStore {
    activeModal: ModalType;
    postSlug: string;
    postTitle: string;
    postUrl: string;
    setActiveModal: (modal: ModalType) => void;
    setPostData: (data: { slug: string; title: string; url: string }) => void;
}

export const usePostStore = create<PostStore>((set) => ({
    activeModal: null,
    postSlug: '',
    postTitle: '',
    postUrl: '',
    setActiveModal: (modal) => set({ activeModal: modal }),
    setPostData: (data) => set({
        postSlug: data.slug,
        postTitle: data.title,
        postUrl: data.url
    }),
}));
