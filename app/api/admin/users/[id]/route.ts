export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { getUser, updateUser } from '@/lib/firestore'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const admin = await getUser(decoded.uid)
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' }, { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    await updateUser(id, { role: body.role })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error' },
      { status: 500 }
    )
  }
}
