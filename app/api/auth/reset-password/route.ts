export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/firestore'
import { adminAuth } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json()
    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const result = await verifyOTP({ email, type: 'PASSWORD_RESET', plainOtp: otp })
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    const user = await adminAuth.getUserByEmail(email)
    await adminAuth.updateUser(user.uid, { password: newPassword })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error' }, { status: 500 })
  }
}
