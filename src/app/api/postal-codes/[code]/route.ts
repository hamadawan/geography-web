import { NextRequest, NextResponse } from 'next/server';
import { findOne, update, remove } from '@/server/services/postal-code';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const postalCode = await findOne(code);
        return NextResponse.json(postalCode);
    } catch (error) {
        console.error(`Error fetching postal code ${params}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const body = await request.json();
        const postalCode = await update(code, body);
        return NextResponse.json(postalCode);
    } catch (error) {
        console.error(`Error updating postal code ${params}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const result = await remove(parseInt(code, 10));
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error deleting postal code ${params}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
