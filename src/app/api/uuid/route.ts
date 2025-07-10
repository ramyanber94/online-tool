import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const count = parseInt(searchParams.get('count') || '1', 10)
    const version = searchParams.get('version') || 'v4'

    // Limit count to prevent abuse
    const maxCount = Math.min(Math.max(count, 1), 100)

    try {
        const uuids = Array.from({ length: maxCount }, () => {
            if (version === 'v4') {
                return randomUUID()
            }
            // Add more UUID versions if needed
            return randomUUID()
        })

        return NextResponse.json({
            uuids,
            count: maxCount,
            version
        })
    } catch {
        return NextResponse.json(
            { error: 'Failed to generate UUIDs' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const { count = 1, version = 'v4' } = await request.json()
        const maxCount = Math.min(Math.max(count, 1), 100)

        const uuids = Array.from({ length: maxCount }, () => {
            if (version === 'v4') {
                return randomUUID()
            }
            return randomUUID()
        })

        return NextResponse.json({
            uuids,
            count: maxCount,
            version
        })
    } catch {
        return NextResponse.json(
            { error: 'Failed to generate UUIDs' },
            { status: 500 }
        )
    }
}
