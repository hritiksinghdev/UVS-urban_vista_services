export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { createOTP, getUser } from '@/lib/firestore'
import { adminAuth } from '@/lib/firebase-admin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Verify user exists
    const user = await adminAuth.getUserByEmail(email).catch(() => null)
    if (!user) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await createOTP({ email, type: 'PASSWORD_RESET', plainOtp: otp })

    await resend.emails.send({
      from: 'UrbanVista <no-reply@urbanvistaservices.com>',
      to: email,
      subject: 'Reset your UrbanVista password',
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:40px 20px">
          <div style="background:linear-gradient(135deg,#1e3a8a,#2563eb);border-radius:16px;padding:32px;text-align:center;margin-bottom:24px">
            <h1 style="color:white;margin:0;font-size:24px">UrbanVista</h1>
            <p style="color:#bfdbfe;margin:4px 0 0;font-size:13px">Password Reset</p>
          </div>
          <p style="color:#334155;font-size:16px">Hi ${user.displayName || 'there'},</p>
          <p style="color:#64748b">Use the following code to reset your password:</p>
          <div style="text-align:center;margin:32px 0">
            <div style="display:inline-block;background:#eff6ff;border:2px solid #bfdbfe;border-radius:12px;padding:20px 48px">
              <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#1d4ed8;font-family:monospace">${otp}</span>
            </div>
          </div>
          <p style="color:#94a3b8;font-size:13px;text-align:center">Expires in 10 minutes. If you didn't request this, ignore this email.</p>
        </div>`
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error' }, { status: 500 })
  }
}
