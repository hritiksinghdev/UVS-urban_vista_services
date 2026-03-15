export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { upsertUser } from '@/lib/firestore'

const ADMIN_EMAILS = ['hritikcsingh@gmail.com']

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' }, { status: 401 }
      )
    }
    const token = authHeader.split('Bearer ')[1]
    const decoded = await adminAuth.verifyIdToken(token)

    const body = await request.json()
    const isAdmin = ADMIN_EMAILS.includes(decoded.email ?? '')

    const user = await upsertUser(decoded.uid, {
      email: decoded.email!,
      name: body.name || decoded.name || 'User',
      phone: body.phone,
      businessType: body.businessType,
      emailVerified: isAdmin ? true : (body.emailVerified ?? false),
      role: isAdmin ? 'ADMIN' : 'USER',
    })

    return NextResponse.json({ success: true, user })
  } catch (error: unknown) {
    console.error('[sync-user]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error' },
      { status: 500 }
    )
  }
}
