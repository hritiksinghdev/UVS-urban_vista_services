export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'

async function verifyAdmin(request: NextRequest) {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) throw new Error('Missing Authorization header')
    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    const dbUser = await prisma.user.findUnique({ where: { firebaseUid: decodedToken.uid } })
    if (!dbUser || dbUser.role !== 'ADMIN') throw new Error('Forbidden')
    return dbUser
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await verifyAdmin(request)
        const { id } = await context.params
        const { role } = await request.json()

        const user = await prisma.user.findUnique({ where: { id } })
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const newRole = role ?? (user.role === 'ADMIN' ? 'USER' : 'ADMIN')

        const updated = await prisma.user.update({
            where: { id },
            data: { role: newRole }
        })

        return NextResponse.json({ success: true, user: updated })
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Error' }, { status: 500 })
    }
}
