export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { adminAuth } from '@/lib/firebase-admin'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const { email, otp, type, uid } = await request.json()

        if (!email || !otp || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const otpRecord = await prisma.oTPVerification.findFirst({
            where: {
                email,
                type,
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

        await prisma.oTPVerification.update({
            where: { id: otpRecord.id },
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
