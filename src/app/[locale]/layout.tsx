import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlobalBackdrop from '@/components/common/GlobalBackdrop';
import SubscribeModal from '@/components/post/SubscribeModal';
import { SpeedInsights } from "@vercel/speed-insights/next";

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://dogy.io'),
  title: {
    default: 'Dogy.io - Personal Blog',
    template: '%s | Dogy.io'
  },
  description: 'A personal blog sharing insights on technology, coding, and more.',
  openGraph: {
    title: 'Dogy.io - Personal Blog',
    description: 'A personal blog sharing insights on technology, coding, and more.',
    url: 'https://dogy.io',
    siteName: 'Dogy.io',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/favicon/dog_logo.png', // Using the existing logo as OG image for now
        width: 800,
        height: 600,
        alt: 'Dogy.io Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dogy.io - Personal Blog',
    description: 'A personal blog sharing insights on technology, coding, and more.',
    images: ['/favicon/dog_logo.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon/safari-pinned-tab.svg', color: '#5bbad5' },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-config': '/favicon/browserconfig.xml',
  },
};

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getHashnodeHost, hashnodeApi } from '@/lib/hashnode';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Fetch categories (series) for the header
  const host = getHashnodeHost(locale);
  const data = await hashnodeApi.getSeries(host);
  const categories = data.seriesList.edges.map((edge: any) => ({
    id: edge.node.id,
    name: edge.node.name,
    slug: edge.node.slug,
  }));

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Header categories={categories} />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <GlobalBackdrop />
          <SubscribeModal />
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
