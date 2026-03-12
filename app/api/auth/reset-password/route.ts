export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { adminAuth } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
    try {
        const { email, otp, newPassword } = await request.json()

        if (!email || !otp || !newPassword) {
            throw new Error('Missing required fields')
        }

        const validOtp = await prisma.oTPVerification.findFirst({
            where: {
                email,
                otpHash: otp,
                type: 'PASSWORD_RESET',
                used: false,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        })

        if (!validOtp) {
            throw new Error('Invalid or expired OTP')
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new Error('User not found')
        }

        await prisma.oTPVerification.update({
            where: { id: validOtp.id },
            data: { used: true }
        })

        await adminAuth.updateUser(user.firebaseUid, {
            password: newPassword
        })

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('[auth/reset-password] error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}
