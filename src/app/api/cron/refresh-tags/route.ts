import { revalidateTag } from 'next/cache';
import { fetchAllTags } from '@/actions/tagActions';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure this route is not statically cached

export async function GET(request: Request) {
    try {
        // Check for authorization (optional but recommended)
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // 1. Invalidate the cache
        revalidateTag('all-tags-data', 'max');
        console.log('Cache invalidated for tag data');

        // 2. Warm up the cache for supported locales
        // We run these in parallel
        const locales = ['en', 'vi'];
        await Promise.all(locales.map(locale => fetchAllTags(locale)));
        
        console.log('Cache warmed up for locales:', locales);

        return NextResponse.json({ 
            success: true, 
            message: 'Tags cache refreshed and warmed up',
            timestamp: new Date().toISOString() 
        });
    } catch (error) {
        console.error('Cron job failed:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
