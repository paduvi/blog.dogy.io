'use client';

import FloatingToolbar from './FloatingToolbar';
import CommentsModal from './CommentsModal';
import TocModal from './TocModal';
import SponsorModal from './SponsorModal';

interface PostActionsProps {
    postSlug: string;
    postTitle: string;
}

export default function PostActions({ postSlug, postTitle }: PostActionsProps) {
    const postUrl = typeof window !== 'undefined' ? `${window.location.origin}/post/${postSlug}` : '';

    return (
        <>
            <FloatingToolbar postSlug={postSlug} postTitle={postTitle} postUrl={postUrl} />
            <CommentsModal postSlug={postSlug} postTitle={postTitle} postUrl={postUrl} />
            <TocModal />
            <SponsorModal />
        </>
    );
}
