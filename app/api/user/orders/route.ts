export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { getUserOrders } from '@/lib/firestore'

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
    const orders = await getUserOrders(decoded.uid)
    return NextResponse.json({ orders })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error' },
      { status: 500 }
    )
  }
}
