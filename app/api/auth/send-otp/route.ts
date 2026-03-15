export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { createOTP } from '@/lib/firestore'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, type, name } = await request.json()
    if (!email || !type) {
      return NextResponse.json(
        { error: 'Email and type required' }, { status: 400 }
      )
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    await createOTP({ email, type, plainOtp: otp })

    const isVerify = type === 'EMAIL_VERIFY'
    const subject = isVerify
      ? `${otp} is your UrbanVista verification code`
      : `${otp} — Reset your UrbanVista password`

    await resend.emails.send({
      from: 'UrbanVista <no-reply@urbanvistaservices.com>',
      to: email,
      subject,
      html: `
        <div style="font-family:-apple-system,sans-serif;
          max-width:520px;margin:0 auto;padding:40px 20px">
          <div style="background:linear-gradient(135deg,
            #1e3a8a,#2563eb);border-radius:16px;
            padding:32px;text-align:center;margin-bottom:24px">
            <h1 style="color:white;margin:0;font-size:24px">
              UrbanVista</h1>
            <p style="color:#bfdbfe;margin:4px 0 0;font-size:13px">
              Local to Global</p>
          </div>
          <p style="color:#334155;font-size:16px">
            Hi ${name || 'there'},</p>
          <p style="color:#64748b">
            Your ${isVerify ? 'verification' : 'password reset'} 
            code:</p>
          <div style="text-align:center;margin:32px 0">
            <div style="display:inline-block;background:#eff6ff;
              border:2px solid #bfdbfe;border-radius:12px;
              padding:20px 48px">
              <span style="font-size:40px;font-weight:800;
                letter-spacing:12px;color:#1d4ed8;
                font-family:monospace">${otp}</span>
            </div>
          </div>
          <p style="color:#94a3b8;font-size:13px;text-align:center">
            Expires in 10 minutes. 
            If you didn't request this, ignore this email.</p>
          <p style="color:#cbd5e1;font-size:12px;
            text-align:center;margin-top:32px">
            © 2026 UrbanVista · urbanvistaservices.com</p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('[send-otp]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error' },
      { status: 500 }
    )
  }
}
