import { NextRequest, NextResponse } from 'next/server';
import { findAll, create } from '@/server/services/postal-code';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const state = searchParams.get('state') || undefined;
        const paginate = searchParams.get('paginate') !== 'false';
        const search = searchParams.get('search') || '';

        const postalCodes = await findAll(page, limit, state, paginate, search);
        return NextResponse.json(postalCodes, {
            headers: {
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
            },
        });
    } catch (error) {
        console.error('Error fetching postal codes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const postalCode = await create(body);
        return NextResponse.json(postalCode, { status: 21 });
    } catch (error) {
        console.error('Error creating postal code:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
