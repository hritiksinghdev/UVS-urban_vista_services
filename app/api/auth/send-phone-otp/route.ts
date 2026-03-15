export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { createOTP } from '@/lib/firestore'
import { twilioClient, TWILIO_PHONE } from '@/lib/twilio'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rl = rateLimit(`send-phone-otp:${ip}`, { limit: 5, windowSec: 600 }) // 5 per 10 min
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Try again in 10 minutes.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      )
    }

    const { phone, type } = await request.json()
    if (!phone || !type) {
      return NextResponse.json(
        { error: 'Phone and type required' }, { status: 400 }
      )
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Storing under the phone number as 'email' field in OTP structure, or creating a new identifier
    // For simplicity, we use the `email` field in `createOTP` to store the phone identifier
    await createOTP({ email: phone, type, plainOtp: otp })

    await twilioClient.messages.create({
        body: `${otp} is your UrbanVista verification code. Expires in 10 minutes.`,
        from: TWILIO_PHONE,
        to: phone
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('[send-phone-otp]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error' },
      { status: 500 }
    )
  }
}
