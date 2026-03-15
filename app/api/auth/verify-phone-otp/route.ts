export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/firestore'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rl = rateLimit(`verify-phone-otp:${ip}`, { limit: 10, windowSec: 300 }) // 10 per 5 min
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please wait.' },
        { status: 429 }
      )
    }

    const { phone, otp, type } = await request.json()
    if (!phone || !otp || !type) {
      return NextResponse.json(
        { error: 'Missing fields' }, { status: 400 }
      )
    }

    const result = await verifyOTP({ 
      email: phone, type, plainOtp: otp 
    })
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error }, { status: 400 }
      )
    }

    // Phone verification successful, actual auth linkage is done by client immediately after 
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('[verify-phone-otp]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error' },
      { status: 500 }
    )
  }
}
