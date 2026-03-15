export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { getAllOrders, getUser } from '@/lib/firestore'

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
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' }, { status: 403 }
      )
    }

    const orders = await getAllOrders()
    return NextResponse.json({ orders })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error' },
      { status: 500 }
    )
  }
}
