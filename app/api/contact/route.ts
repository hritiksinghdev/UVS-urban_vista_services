export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { createContactQuery } from '@/lib/firestore'
import { Resend } from 'resend'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sanitizeString, sanitizeEmail, sanitizePhone } from '@/lib/sanitize'

const resend = new Resend(process.env.RESEND_API_KEY || 're_123')

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rl = rateLimit(`contact:${ip}`, { limit: 3, windowSec: 3600 }) // 3 per hour
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many contact submissions. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const name = sanitizeString(body.name, 100)
    const email = sanitizeEmail(body.email)
    const phone = sanitizePhone(body.phone)
    const business = sanitizeString(body.business, 200)
    const message = sanitizeString(body.message, 2000)

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message required' },
        { status: 400 }
      )
    }

    await createContactQuery({ 
      name, email, phone, business, message 
    })

    await resend.emails.send({
      from: 'UrbanVista <no-reply@urbanvistaservices.com>',
      to: 'hritikcsingh@gmail.com',
      subject: `New inquiry from ${name}`,
      html: `<p><strong>${name}</strong> (${email}) 
        sent a message:</p>
        <p>${message}</p>
        <p>Phone: ${phone || 'N/A'} | 
        Business: ${business || 'N/A'}</p>`
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error' },
      { status: 500 }
    )
  }
}
