'use client';

import { useState } from 'react';
import FloatingToolbar from './FloatingToolbar';
import CommentsModal from './CommentsModal';
import TocModal from './TocModal';
import SponsorModal from './SponsorModal';

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
                shareOpen={activeModal === 'share'}
                onShareClose={() => setActiveModal(null)}
                postTitle={postTitle}
                postUrl={postUrl}
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

            {activeModal && (
                <div
                    className="fixed inset-0 bg-black-50 z-40 transition-opacity"
                    onClick={() => setActiveModal(null)}
                />
            )}
        </>
    );
}
