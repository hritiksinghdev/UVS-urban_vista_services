export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { createOrder, getUser } from '@/lib/firestore'
import { Resend } from 'resend'
import { sanitizeString } from '@/lib/sanitize'

const resend = new Resend(process.env.RESEND_API_KEY || 're_123')

export async function POST(request: NextRequest) {
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
    const body = await request.json()
    const user = await getUser(decoded.uid)
    if (!user) return NextResponse.json(
      { error: 'User not found' }, { status: 404 }
    )

    const serviceName = sanitizeString(body.serviceName, 200)
    const description = sanitizeString(body.description, 2000)
    const budget = sanitizeString(body.budget, 100)
    const timeline = sanitizeString(body.timeline, 100)

    const orderId = await createOrder({
      userId: decoded.uid,
      userEmail: decoded.email!,
      userName: user.name,
      serviceName,
      description,
      budget,
      timeline,
    })

    // Email admin
    await resend.emails.send({
      from: 'UrbanVista <no-reply@urbanvistaservices.com>',
      to: 'hritikcsingh@gmail.com',
      subject: `New order: ${body.serviceName} from ${user.name}`,
      html: `<p>New order from ${user.name} 
        (${decoded.email})</p>
        <p>Service: ${body.serviceName}</p>
        <p>Budget: ${body.budget || 'Not specified'}</p>
        <p>Order ID: ${orderId}</p>`
    })

    return NextResponse.json({ success: true, orderId })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error' },
      { status: 500 }
    )
  }
}
