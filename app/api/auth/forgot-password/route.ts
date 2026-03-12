export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            throw new Error('Email is required')
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            // Return success even if not found to prevent email enumeration
            return NextResponse.json({ success: true })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        await prisma.oTPVerification.create({
            data: {
                email,
                otpHash: otp, // In production, hash this
                type: 'PASSWORD_RESET',
                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
            }
        })

        await resend.emails.send({
            from: 'no-reply@urbanvistaservices.com',
            to: email,
            subject: 'Reset your UrbanVista password',
            html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Your password reset code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #2563EB;">${otp}</h1>
          <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `
        })

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('[auth/forgot-password] error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}
