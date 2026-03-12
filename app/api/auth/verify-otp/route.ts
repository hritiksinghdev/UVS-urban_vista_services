export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { adminAuth } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
    try {
        const { email, otp, type, uid } = await request.json()

        if (!email || !otp || !type) {
            throw new Error('Missing required fields')
        }

        const validOtp = await prisma.oTPVerification.findFirst({
            where: {
                email,
                otpHash: otp,
                type,
                used: false,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        })

        if (!validOtp) {
            throw new Error('Invalid or expired OTP')
        }

        await prisma.oTPVerification.update({
            where: { id: validOtp.id },
            data: { used: true }
        })

        if (type === 'EMAIL_VERIFY' && uid) {
            await adminAuth.updateUser(uid, { emailVerified: true })
            await prisma.user.updateMany({
                where: { email },
                data: { emailVerified: true }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('[auth/verify-otp] error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}
