export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const expiredCount = await prisma.oTPVerification.deleteMany({
            where: {
                expiresAt: { lt: new Date() }
            }
        })

        return NextResponse.json({
            success: true,
            message: `Cleaned up ${expiredCount.count} expired OTPs.`
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal server error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
