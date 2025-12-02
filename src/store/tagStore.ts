import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Tag {
    id: string;
    name: string;
    slug: string;
    count: number;
}

interface TagState {
    tags: Tag[];
    isLoading: boolean;
    error: string | null;
    lastFetched: number | null;
    setTags: (tags: Tag[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useTagStore = create<TagState>()(
    persist(
        (set) => ({
            tags: [],
            isLoading: false,
            error: null,
            lastFetched: null,
            setTags: (tags) => set({ tags, lastFetched: Date.now() }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
        }),
        {
            name: 'tag-storage',
            partialize: (state) => ({ tags: state.tags, lastFetched: state.lastFetched }),
        }
    )
);
