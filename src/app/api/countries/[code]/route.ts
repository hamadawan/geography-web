import { NextRequest, NextResponse } from 'next/server';
import { findOne } from '@/server/services/country';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const country = await findOne(code);
        if (!country) {
            return NextResponse.json({ error: `Country with code ${code} not found` }, { status: 404 });
        }
        return NextResponse.json(country);
    } catch (error) {
        console.error(`Error fetching country ${params}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
