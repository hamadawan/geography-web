import { NextResponse } from 'next/server';
import { findAll } from '@/server/services/country';

export async function GET() {
    try {
        const countries = await findAll();
        return NextResponse.json(countries, {
            headers: {
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
            },
        });
    } catch (error) {
        console.error('Error fetching countries:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
