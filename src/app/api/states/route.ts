import { NextRequest, NextResponse } from 'next/server';
import { findAll, create } from '@/server/services/state';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const country = searchParams.get('country') || undefined;
        const paginate = searchParams.get('paginate') !== 'false';

        const states = await findAll(page, limit, country, paginate);
        return NextResponse.json(states, {
            headers: {
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
            },
        });
    } catch (error) {
        console.error('Error fetching states:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const state = await create(body);
        return NextResponse.json(state, { status: 21 });
    } catch (error) {
        console.error('Error creating state:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
