export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hritikcsingh@gmail.com'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, phone, business, message } = body

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
        }

        const query = await prisma.contactQuery.create({
            data: {
                name,
                email,
                phone: phone || null,
                business: business || null,
                message,
                status: 'NEW'
            }
        })

        // Notify admin
        await resend.emails.send({
            from: 'UrbanVista <no-reply@urbanvistaservices.com>',
            to: ADMIN_EMAIL,
            subject: `New Query from ${name} — ${business || 'Unknown Business'}`,
            html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <h2>New Contact Query</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p><strong>Business:</strong> ${business || 'Not specified'}</p>
              <hr>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            </div>`
        }).catch(console.error)

        return NextResponse.json({ success: true, query })
    } catch (error: unknown) {
        console.error('[contact] error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}
