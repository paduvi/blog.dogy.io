'use client';

import { useState } from 'react';
import FloatingToolbar from './FloatingToolbar';
import CommentsModal from './CommentsModal';
import TocModal from './TocModal';
import SponsorModal from './SponsorModal';
import ShareModal from './ShareModal';

interface PostActionsProps {
    postSlug: string;
    postTitle: string;
}

export default function PostActions({ postSlug, postTitle }: PostActionsProps) {
    const [activeModal, setActiveModal] = useState<'comments' | 'toc' | 'sponsor' | 'share' | null>(null);

    const postUrl = typeof window !== 'undefined' ? `${window.location.origin}/post/${postSlug}` : '';

    return (
        <>
            <FloatingToolbar
                onCommentClick={() => setActiveModal('comments')}
                onTocClick={() => setActiveModal('toc')}
                onSponsorClick={() => setActiveModal('sponsor')}
                onShareClick={() => setActiveModal('share')}
            />

            <CommentsModal
                isOpen={activeModal === 'comments'}
                onClose={() => setActiveModal(null)}
                postSlug={postSlug}
                postTitle={postTitle}
            />

            <TocModal
                isOpen={activeModal === 'toc'}
                onClose={() => setActiveModal(null)}
            />

            <SponsorModal
                isOpen={activeModal === 'sponsor'}
                onClose={() => setActiveModal(null)}
            />

            <ShareModal
                isOpen={activeModal === 'share'}
                onClose={() => setActiveModal(null)}
                postTitle={postTitle}
                postUrl={postUrl}
            />
        </>
    );
}
