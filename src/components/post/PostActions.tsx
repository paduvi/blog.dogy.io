'use client';

import { usePostStore } from '@/store/postStore';
import FloatingToolbar from './FloatingToolbar';
import CommentsModal from './CommentsModal';
import TocModal from './TocModal';
import SponsorModal from './SponsorModal';

export default function PostActions() {
    const post = usePostStore((state) => state.post);
    
    if (!post) return null;
    return (
        <>
            <FloatingToolbar />
            <CommentsModal />
            <TocModal />
            <SponsorModal />
        </>
    );
}
