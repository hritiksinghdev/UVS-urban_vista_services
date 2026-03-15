import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || 're_123')

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json()

        await resend.emails.send({
            from: "UrbanVista <no-reply@urbanvistaservices.com>",
            to: email,
            subject: "Your OTP Code",
            html: `<h2>Your OTP is ${otp}</h2>`
        })

        return Response.json({ success: true })
    } catch (error: any) {
        console.error("Resend error:", error?.message, error)
        return new Response("Email failed", { status: 500 })
    }
}
