export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { adminAuth } from '@/lib/firebase-admin'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const { email, otp, newPassword } = await request.json()

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
        }

        const otpRecord = await prisma.oTPVerification.findFirst({
            where: {
                email,
                type: 'PASSWORD_RESET',
                used: false,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        })

        if (!otpRecord) {
            return NextResponse.json({ error: 'OTP expired. Request a new one.' }, { status: 400 })
        }

        const isValid = await bcrypt.compare(otp, otpRecord.otpHash)
        if (!isValid) {
            await prisma.oTPVerification.update({
                where: { id: otpRecord.id },
                data: { attempts: { increment: 1 } }
            })
            return NextResponse.json({ error: 'Incorrect OTP. Try again.' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        await prisma.oTPVerification.update({
            where: { id: otpRecord.id },
            data: { used: true }
        })

        await adminAuth.updateUser(user.firebaseUid, { password: newPassword })

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('[auth/reset-password] error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}
