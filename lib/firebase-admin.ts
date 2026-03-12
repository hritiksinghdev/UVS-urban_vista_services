import * as admin from 'firebase-admin'
import { NextRequest } from 'next/server'

export const ADMIN_EMAILS = ['hritikcsingh@gmail.com']

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || "urbanvista-a57b8",
                clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@urbanvista-a57b8.iam.gserviceaccount.com",
                privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        })
    } catch (error) {
        console.error('Firebase Admin init error:', error)
    }
}

export const adminAuth = admin.auth()

export async function verifyAndGetUser(request: NextRequest) {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
        throw new Error('Missing or invalid Authorization header (Bearer token)')
    }
    const token = authHeader.split('Bearer ')[1]
    try {
        const decodedToken = await adminAuth.verifyIdToken(token)
        return decodedToken
    } catch (error) {
        throw new Error('Unauthorized or invalid token')
    }
}
