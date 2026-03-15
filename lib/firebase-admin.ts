import * as admin from 'firebase-admin'
import { NextRequest } from 'next/server'
import { validateEnv } from './env'

validateEnv()

export const ADMIN_EMAILS = [process.env.ADMIN_EMAIL || 'hritikcsingh@gmail.com']

function initFirebaseAdmin() {
  if (admin.apps.length > 0) return

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    // In production, this is a fatal misconfiguration
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Firebase Admin SDK: Missing required environment variables')
    }
    console.warn('[firebase-admin] Missing env vars — Admin SDK not initialized (dev mode)')
    return
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    })
  } catch (error) {
    console.error('Firebase Admin init error:', error)
    // Do not throw to prevent crashing the Vercel build step
  }
}

initFirebaseAdmin()

export const adminAuth = admin.apps.length ? admin.auth() : null as unknown as admin.auth.Auth

export async function verifyAndGetUser(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header')
  }
  const token = authHeader.split('Bearer ')[1]

  if (!token || token.length < 100) {
    throw new Error('Malformed token')
  }

  try {
    return await adminAuth.verifyIdToken(token)
  } catch {
    throw new Error('Unauthorized: invalid or expired token')
  }
}
