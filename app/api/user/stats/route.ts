export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { getUser, getUserOrders } from '@/lib/firestore'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' }, { status: 401 }
      )
    }
    const decoded = await adminAuth.verifyIdToken(
      authHeader.split('Bearer ')[1]
    )
    const user = await getUser(decoded.uid)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' }, { status: 404 }
      )
    }

    const orders: any[] = await getUserOrders(decoded.uid)
    const activeOrders = orders.filter((o: { status: string }) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length
    const completedOrders = orders.filter((o: { status: string }) => o.status === 'COMPLETED').length

    return NextResponse.json({
        activeOrders,
        completedOrders,
        totalOrders: orders.length,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        memberSince: user.createdAt,
        recentOrders: orders.slice(0, 3)
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error' },
      { status: 500 }
    )
  }
}
