export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP, updateUser } from '@/lib/firestore'
import { adminAuth } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const { email, otp, type, uid } = await request.json()
    if (!email || !otp || !type) {
      return NextResponse.json(
        { error: 'Missing fields' }, { status: 400 }
      )
    }

    const result = await verifyOTP({ 
      email, type, plainOtp: otp 
    })
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error }, { status: 400 }
      )
    }

    if (type === 'EMAIL_VERIFY' && uid) {
      await adminAuth.updateUser(uid, { emailVerified: true })
      await updateUser(uid, { emailVerified: true })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('[verify-otp]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error' },
      { status: 500 }
    )
  }
}
