import { create } from 'zustand';

interface PublicationStore {
    publicationIds: Record<string, string>; // host -> publicationId mapping
    setPublicationId: (host: string, publicationId: string) => void;
    getPublicationId: (host: string) => string | undefined;
}

export const usePublicationStore = create<PublicationStore>((set, get) => ({
    publicationIds: {},
    setPublicationId: (host: string, publicationId: string) => {
        set((state) => ({
            publicationIds: {
                ...state.publicationIds,
                [host]: publicationId,
            },
        }));
    },
    getPublicationId: (host: string) => {
        return get().publicationIds[host];
    },
}));
