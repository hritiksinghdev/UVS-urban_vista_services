export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAndGetUser } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hritikcsingh@gmail.com'

export async function POST(request: NextRequest) {
    try {
        const decoded = await verifyAndGetUser(request)
        const { serviceName, description, budget, timeline } = await request.json()

        if (!serviceName) {
            return NextResponse.json({ error: 'Service name is required' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } })
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                serviceName,
                description: description || null,
                budget: budget || null,
                timeline: timeline || null,
                status: 'PENDING'
            }
        })

        // Notify admin of new order
        await resend.emails.send({
            from: 'UrbanVista <no-reply@urbanvistaservices.com>',
            to: ADMIN_EMAIL,
            subject: `New Order: ${serviceName} from ${user.name}`,
            html: `<p>New order received from ${user.name} (${user.email}).</p><p><strong>Service:</strong> ${serviceName}</p><p><strong>Budget:</strong> ${budget || 'Not specified'}</p><p><strong>Timeline:</strong> ${timeline || 'Flexible'}</p>`
        }).catch(console.error)

        return NextResponse.json({ success: true, order })
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error' },
            { status: 500 }
        )
    }
}
