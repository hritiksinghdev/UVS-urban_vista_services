export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

async function verifyAdmin(request: NextRequest) {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) throw new Error('Missing Authorization header')
    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    const dbUser = await prisma.user.findUnique({ where: { firebaseUid: decodedToken.uid } })
    if (!dbUser || dbUser.role !== 'ADMIN') throw new Error('Forbidden')
    return dbUser
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await verifyAdmin(request)
        const { id } = await context.params
        const order = await prisma.order.findUnique({
            where: { id },
            include: { user: { select: { name: true, email: true } } }
        })
        if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        return NextResponse.json({ order })
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Error' }, { status: 500 })
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await verifyAdmin(request)
        const { id } = await context.params
        const { status, amount, notes } = await request.json()

        const existingOrder = await prisma.order.findUnique({
            where: { id },
            include: { user: true }
        })
        if (!existingOrder) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

        const order = await prisma.order.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(amount !== undefined && { amount: parseFloat(amount) }),
                ...(notes !== undefined && { notes }),
            },
            include: { user: { select: { name: true, email: true } } }
        })

        // Send email when order is completed
        if (status === 'COMPLETED' && existingOrder.status !== 'COMPLETED') {
            await resend.emails.send({
                from: 'UrbanVista <no-reply@urbanvistaservices.com>',
                replyTo: 'support@urbanvistaservices.com',
                to: existingOrder.user.email,
                subject: `Your UrbanVista order is complete! 🎉`,
                html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.06);overflow:hidden;max-width:600px">
        <tr><td style="background:linear-gradient(135deg,#1e3a8a,#2563eb);padding:32px 40px;text-align:center">
          <span style="color:#ffffff;font-size:24px;font-weight:700">UrbanVista</span>
        </td></tr>
        <tr><td style="padding:40px">
          <h2 style="color:#1e293b;margin:0 0 16px">Your order is complete! 🎉</h2>
          <p style="color:#64748b;font-size:15px;line-height:1.6">Hi ${existingOrder.user.name},</p>
          <p style="color:#64748b;font-size:15px;line-height:1.6">
            Great news! Your <strong>${existingOrder.serviceName}</strong> order has been completed.
            ${notes ? `<br><br><strong>Notes from our team:</strong> ${notes}` : ''}
          </p>
          <div style="text-align:center;margin:32px 0">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders" 
              style="background:#2563eb;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;display:inline-block">
              View in Dashboard →
            </a>
          </div>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center">
          <p style="color:#94a3b8;font-size:12px;margin:0">© 2026 UrbanVista | urbanvistaservices.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
            }).catch(console.error)
        }

        return NextResponse.json({ success: true, order })
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Error' }, { status: 500 })
    }
}
