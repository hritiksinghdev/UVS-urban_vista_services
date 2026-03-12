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

        const activeOrders = user.orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length
        const completedOrders = user.orders.filter(o => o.status === 'COMPLETED').length

        return NextResponse.json({
            activeOrders,
            completedOrders,
            totalOrders: user.orders.length,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            memberSince: user.createdAt,
            recentOrders: user.orders.slice(0, 3)
        })
    } catch (error: unknown) {
        console.error('[user/stats] error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error' },
            { status: 500 }
        )
    }
}
