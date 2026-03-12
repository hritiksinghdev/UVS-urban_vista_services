export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
    try {
        const { email, type } = await request.json()

        if (!email || !type) {
            throw new Error('Email and type are required')
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        await prisma.oTPVerification.create({
            data: {
                email,
                otpHash: otp, // In production, hash this
                type,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
            }
        })

        const subject = type === 'EMAIL_VERIFY'
            ? 'Verify your UrbanVista account'
            : 'Reset your UrbanVista password'

        await resend.emails.send({
            from: 'no-reply@urbanvistaservices.com',
            to: email,
            subject,
            html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
          <h2>${subject}</h2>
          <p>Your one-time password is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #2563EB;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `
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
