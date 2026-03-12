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

export async function GET(request: NextRequest) {
    try {
        await verifyAdmin(request)

        const users = await prisma.user.findMany({
            include: {
                orders: true,
                contactQueries: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ users })
    } catch (error: unknown) {
        console.error('[admin/users] GET error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}
