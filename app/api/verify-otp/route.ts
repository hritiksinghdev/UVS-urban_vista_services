import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        // 1. Fetch OTP row by email using Prisma
        const latestOtp = await prisma.oTPVerification.findFirst({
            where: {
                email,
                type: 'EMAIL_VERIFY',
                used: false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!latestOtp) {
            return NextResponse.json({ error: 'No verification code found. Please request a new one.' }, { status: 400 });
        }

        // 2. Check Expiration
        if (new Date(latestOtp.expiresAt) < new Date()) {
            return NextResponse.json({ error: 'This code has expired. Please request a new one.' }, { status: 400 });
        }

        // 3. Check Attempt Count
        if (latestOtp.attempts >= 5) {
            return NextResponse.json({ error: 'Too many failed attempts. Please request a new code.' }, { status: 400 });
        }

        // 4. Verify Code (Assuming plain text for now as per schema or simple logic, but schema says otpHash. If it's a simple OTP, we compare directly)
        // If it's a hash, we'd need to compare hashes. For now, matching the logic from before where it was 'otp'.
        if (latestOtp.otpHash !== otp) {
            await prisma.oTPVerification.update({
                where: { id: latestOtp.id },
                data: { attempts: latestOtp.attempts + 1 }
            });
            return NextResponse.json({ error: 'Incorrect verification code.' }, { status: 400 });
        }

        // 5. Valid Code: Find User by Email to Update Profile
        const targetUser = await prisma.user.findUnique({
            where: { email }
        });

        if (targetUser) {
            // Update associated profile
            await prisma.user.update({
                where: { id: targetUser.id },
                data: { emailVerified: true }
            });
        } else {
            return NextResponse.json({ error: 'Target user identity missing during verification linkage.' }, { status: 404 });
        }

        // 6. Cleanup successful OTP trace or mark as used
        await prisma.oTPVerification.update({
            where: { id: latestOtp.id },
            data: { used: true }
        });

        // Optionally delete all otps for this email
        await prisma.oTPVerification.deleteMany({
            where: { email }
        });

        return NextResponse.json({ success: true, message: 'Verified Successfully' });

    } catch (error: any) {
        console.error('Verify OTP Error:', error?.message, error);
        return NextResponse.json({ error: error.message || 'Verification Error' }, { status: 500 });
    }
}
