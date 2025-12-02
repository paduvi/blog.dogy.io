import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { hashnodeApi, getHashnodeHost } from '@/lib/hashnode';
import './NewsletterSubscribe.css';

interface NewsletterSubscribeProps {
    onClose?: () => void;
    variant?: 'modal' | 'inline';
}

export default function NewsletterSubscribe({ onClose, variant = 'inline' }: NewsletterSubscribeProps) {
    const t = useTranslations('Newsletter');
    const locale = useLocale();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const host = getHashnodeHost(locale);

        // Get publication ID (from cache or fetch)
        const { getPublicationId: getCachedId, setPublicationId } = await import('@/store/publicationStore').then(m => m.usePublicationStore.getState());
        let publicationId: string | undefined = getCachedId(host);

        if (!publicationId) {
            // Fetch and cache publication ID
            const fetchedId = await hashnodeApi.getPublicationId(host);
            setPublicationId(host, fetchedId);
            publicationId = fetchedId;
        }

        if (!publicationId) {
            console.error('Publication ID not found');
            setStatus('error');
            return;
        }

        setStatus('loading');
        
        try {
            await hashnodeApi.subscribeToNewsletter(publicationId, email);
            setStatus('success');
            // setEmail('');
            
            // Reset success message after 3 seconds
            setTimeout(() => {
                setStatus('idle');
            }, 3000);
        } catch (error) {
            console.error('Subscription failed:', error);
            setStatus('error');
        }
    };

    const isModal = variant === 'modal';
    const siteName = "Dogy.io";

    return (
        <div className={`newsletter-container ${isModal ? 'newsletter-modal' : 'newsletter-inline'}`}>
            <div className="newsletter-card">
                {isModal && onClose && (
                    <button 
                        onClick={onClose}
                        className="newsletter-close"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                )}
                
                <h3 className="newsletter-title">
                    {t('title')}
                </h3>
                <p className="newsletter-subtitle">
                    {t('subtitle', {siteName}).split(siteName)[0]}
                    <strong>{siteName}</strong>
                    {t('subtitle', {siteName}).split(siteName)[1]}
                </p>
                <p className="newsletter-description">
                    {t('description')}
                </p>

                {status === 'success' ? (
                    <div className="newsletter-success">
                        {t('success')}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="newsletter-form">
                        <div className="newsletter-input-group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('placeholder')}
                                className="newsletter-input"
                                required
                                disabled={status === 'loading'}
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="newsletter-button"
                            >
                                {status === 'loading' ? t('loading') : t('button')}
                            </button>
                        </div>
                        {status === 'error' && (
                            <p className="newsletter-error">{t('error')}</p>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}
