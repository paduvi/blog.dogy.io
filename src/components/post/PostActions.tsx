'use client';

import { useEffect } from 'react';
import { usePostStore } from '@/store/usePostStore';
import FloatingToolbar from './FloatingToolbar';
import CommentsModal from './CommentsModal';
import TocModal from './TocModal';
import SponsorModal from './SponsorModal';

interface PostActionsProps {
    postSlug: string;
    postTitle: string;
}

export default function PostActions({ postSlug, postTitle }: PostActionsProps) {
    const { activeModal, setPostData } = usePostStore();

    const postUrl = typeof window !== 'undefined' ? `${window.location.origin}/post/${postSlug}` : '';

    // Initialize store with post data
    useEffect(() => {
        setPostData({ slug: postSlug, title: postTitle, url: postUrl });
    }, [postSlug, postTitle, postUrl, setPostData]);

    return (
        <>
            <FloatingToolbar />
            <CommentsModal />
            <TocModal />
            <SponsorModal />

            {activeModal && (
                <div
                    className="fixed inset-0 bg-black-50 z-40 transition-opacity"
                    onClick={() => usePostStore.getState().setActiveModal(null)}
                />
            )}
        </>
    );
}
