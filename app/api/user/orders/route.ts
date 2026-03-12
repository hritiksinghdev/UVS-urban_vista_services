export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAndGetUser } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const decoded = await verifyAndGetUser(request)
        const user = await prisma.user.findUnique({
            where: { firebaseUid: decoded.uid },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        })
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        return NextResponse.json({ orders: user.orders })
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error' },
            { status: 500 }
        )
    }
}
