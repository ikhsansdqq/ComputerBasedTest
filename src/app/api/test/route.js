import { NextResponse } from 'next/server';

export async function GET() {
    console.log('GET request received');
    return NextResponse.json({ message: 'GET request successful' });
}
