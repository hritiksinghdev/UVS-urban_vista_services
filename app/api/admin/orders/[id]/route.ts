export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'

async function verifyAdmin(request: NextRequest) {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
        throw new Error('Missing or malformed Authorization header')
    }
    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)

    const dbUser = await prisma.user.findUnique({
        where: { firebaseUid: decodedToken.uid }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
        throw new Error('Forbidden')
    }
    return dbUser
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        await verifyAdmin(request)

        const body = await request.json()
        const updated = await prisma.order.update({
            where: { id },
            data: { status: body.status, notes: body.notes }
        })

        return NextResponse.json({ success: true, order: updated })
    } catch (error: unknown) {
        console.error('[admin/orders/[id]] PATCH error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}
