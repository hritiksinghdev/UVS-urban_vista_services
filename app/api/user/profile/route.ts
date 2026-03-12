export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAndGetUser } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const decoded = await verifyAndGetUser(request)
        const user = await prisma.user.findUnique({
            where: { firebaseUid: decoded.uid }
        })
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        return NextResponse.json({ user })
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const decoded = await verifyAndGetUser(request)
        const { name, phone, businessType } = await request.json()

        const user = await prisma.user.update({
            where: { firebaseUid: decoded.uid },
            data: {
                ...(name && { name }),
                ...(phone && { phone }),
                ...(businessType && { businessType }),
            }
        })

        return NextResponse.json({ success: true, user })
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error' },
            { status: 500 }
        )
    }
}
