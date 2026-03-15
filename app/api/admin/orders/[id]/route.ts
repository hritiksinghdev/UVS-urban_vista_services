export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { getUser, updateOrder } from '@/lib/firestore'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' }, { status: 401 }
      )
    }
    const decoded = await adminAuth.verifyIdToken(
      authHeader.split('Bearer ')[1]
    )
    const admin = await getUser(decoded.uid)
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' }, { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    await updateOrder(id, {
      status: body.status,
      notes: body.notes,
      amount: body.amount,
    })

    // Email user if status changed to COMPLETED
    if (body.status === 'COMPLETED' && body.userEmail) {
      await resend.emails.send({
        from: 'UrbanVista <no-reply@urbanvistaservices.com>',
        to: body.userEmail,
        subject: 'Your UrbanVista order is complete! 🎉',
        html: `<p>Hi ${body.userName || 'there'},</p>
          <p>Your <strong>${body.serviceName}</strong> 
          order has been completed!</p>
          <p>Log in to your dashboard to view details.</p>
          <p>— Team UrbanVista</p>`
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error' },
      { status: 500 }
    )
  }
}
