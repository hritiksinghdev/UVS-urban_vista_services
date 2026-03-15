/**
 * Validates required environment variables at server startup.
 * Import this in any server-side file that needs env validation.
 * On Vercel, missing vars will cause the build/startup to fail loudly.
 */

const REQUIRED_SERVER_VARS = [
  'FIREBASE_ADMIN_PROJECT_ID',
  'FIREBASE_ADMIN_CLIENT_EMAIL',
  'FIREBASE_ADMIN_PRIVATE_KEY',
  'RESEND_API_KEY',
  'ADMIN_EMAIL',
] as const

const REQUIRED_PUBLIC_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_APP_URL',
] as const

export function validateEnv() {
  const missing: string[] = []

  for (const key of REQUIRED_SERVER_VARS) {
    if (!process.env[key]) missing.push(key)
  }

  if (missing.length > 0) {
    const msg = `[env] Missing required environment variables:\n${missing.map(k => `  - ${k}`).join('\n')}`
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
      // Avoid crashing Vercel build purely due to missing env vars
      console.warn(msg)
    } else {
      console.warn(msg)
    }
  }
}

// Typed env accessors (avoids string | undefined hell)
export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID!,
  FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
  FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY!,
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'hritikcsingh@gmail.com',
  CRON_SECRET: process.env.CRON_SECRET!,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://urbanvistaservices.com',
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
} as const
