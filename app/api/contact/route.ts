export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { createContactQuery } from '@/lib/firestore'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, business, message } = body

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
