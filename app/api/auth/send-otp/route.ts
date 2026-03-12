export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import bcrypt from 'bcryptjs'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
    try {
        const { email, type, name } = await request.json()

        if (!email || !type) {
            throw new Error('Email and type are required')
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpHash = await bcrypt.hash(otp, 10)

        await prisma.oTPVerification.create({
            data: {
                email,
                otpHash,
                type,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
            }
        })

        const subject = type === 'EMAIL_VERIFY'
            ? `${otp} is your UrbanVista verification code`
            : type === 'PASSWORD_RESET'
            ? `${otp} — Reset your UrbanVista password`
            : `${otp} is your UrbanVista OTP`

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.06);overflow:hidden;max-width:600px">
        <tr><td style="background:linear-gradient(135deg,#1e3a8a,#2563eb);padding:32px 40px;text-align:center">
          <span style="color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px">UrbanVista</span>
          <p style="color:#bfdbfe;margin:4px 0 0;font-size:13px">Local to Global</p>
        </td></tr>
        <tr><td style="padding:40px">
          <p style="color:#334155;font-size:16px;margin:0 0 8px">Hi ${name || 'there'},</p>
          <p style="color:#64748b;font-size:15px;margin:0 0 32px;line-height:1.6">
            Here is your verification code for UrbanVista. This code expires in <strong>10 minutes</strong>.
          </p>
          <div style="text-align:center;margin:32px 0">
            <div style="display:inline-block;background:#eff6ff;border:2px solid #bfdbfe;border-radius:12px;padding:20px 40px">
              <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#1d4ed8;font-family:monospace">${otp}</span>
            </div>
          </div>
          <p style="color:#94a3b8;font-size:13px;text-align:center;margin:24px 0">
            If you didn't request this, ignore this email.
          </p>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center">
          <p style="color:#94a3b8;font-size:12px;margin:0">
            © 2026 UrbanVista | urbanvistaservices.com<br>
            Delhi NCR, India
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

        await resend.emails.send({
            from: 'UrbanVista <no-reply@urbanvistaservices.com>',
            replyTo: 'support@urbanvistaservices.com',
            to: email,
            subject,
            html: emailHtml,
            headers: {
                'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36)}`,
                'List-Unsubscribe': '<mailto:unsubscribe@urbanvistaservices.com>',
            },
            tags: [{ name: 'category', value: 'transactional' }]
        })

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('[auth/send-otp] error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}
