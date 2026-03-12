export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAILS = ['hritikcsingh@gmail.com']

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Missing or malformed Authorization header' }, { status: 401 })
        }
        const token = authHeader.split('Bearer ')[1]
        const decoded = await adminAuth.verifyIdToken(token)

        const body = await request.json()
        const isAdmin = ADMIN_EMAILS.includes(decoded.email ?? '')

        const user = await prisma.user.upsert({
            where: { firebaseUid: decoded.uid },
            create: {
                firebaseUid: decoded.uid,
                name: body.name || decoded.name || 'User',
                email: decoded.email!,
                phone: body.phone || null,
                businessType: body.businessType || null,
                emailVerified: isAdmin ? true : (body.emailVerified ?? false),
                role: isAdmin ? 'ADMIN' : 'USER',
            },
            update: {
                emailVerified: isAdmin ? true : (body.emailVerified !== undefined ? body.emailVerified : undefined),
                role: isAdmin ? 'ADMIN' : undefined,
                name: body.name || undefined,
                phone: body.phone || undefined,
                businessType: body.businessType || undefined,
            },
            include: { orders: true }
        })

        return NextResponse.json({ success: true, user })
    } catch (error: unknown) {
        console.error('[auth/sync-user] error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}
