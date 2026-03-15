export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { getUser, updateUser } from '@/lib/firestore'

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
    if (!user) return NextResponse.json(
      { error: 'User not found' }, { status: 404 }
    )
    return NextResponse.json({ user })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
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
    const body = await request.json()
    const allowed = ['name', 'phone', 'businessType']
    const update: Record<string, string> = {}
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key]
    }
    await updateUser(decoded.uid, update)
    const user = await getUser(decoded.uid)
    return NextResponse.json({ user })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error' },
      { status: 500 }
    )
  }
}
