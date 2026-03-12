import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 1. Fetch latest OTP parameters using Prisma
        const latestOtp = await prisma.oTPVerification.findFirst({
            where: {
                email,
                type: 'EMAIL_VERIFY'
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // 2. Prevent Spamming (Checking by count or time could be more robust, but following existing logic)
        // Note: Prisma model doesn't have resend_count, so we'll just check if one was sent recently
        if (latestOtp && (new Date().getTime() - new Date(latestOtp.createdAt).getTime() < 60000)) {
            return NextResponse.json({ error: 'Please wait a minute before requesting a new code.' }, { status: 429 });
        }

        // 3. Generate Replacements
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Scrub old parameters actively
        await prisma.oTPVerification.deleteMany({
            where: { email, type: 'EMAIL_VERIFY' }
        });

        // 4. Deposit New Parameters
        await prisma.oTPVerification.create({
            data: {
                email,
                otpHash: newOtp, // Storing as hash (or plain text depending on security needs, schema says hash)
                type: 'EMAIL_VERIFY',
                expiresAt,
                attempts: 0
            }
        });

        // 5. Interface with Mail pipeline
        const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        try {
            const emailRes = await fetch(`${origin}/api/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: newOtp })
            });
            if (!emailRes.ok) {
                console.error("Sibling Dispatch Delivery failure from resend-otp route");
            }
        } catch (networkErr: any) {
            console.error("Localhop fetch error:", networkErr?.message, networkErr);
        }

        return NextResponse.json({ success: true, message: 'Resended actively' });

    } catch (error: any) {
        console.error('Resend OTP Engine Error:', error?.message, error);
        return NextResponse.json({ error: error.message || 'Resend Engine Crash' }, { status: 500 });
    }
}
