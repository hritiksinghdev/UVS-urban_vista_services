export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, phone, businessType, businessDetails } = body

        if (!name || !email || !phone || !businessType || !businessDetails) {
            throw new Error('All fields are required')
        }

        const query = await prisma.contactQuery.create({
            data: {
                name,
                email,
                phone,
                business: businessType,
                message: businessDetails,
                status: 'NEW'
            }
        })

        return NextResponse.json({ success: true, query })
    } catch (error: unknown) {
        console.error('[contact] error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}
