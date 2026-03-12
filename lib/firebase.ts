'use client'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyByTICUa00eowGlEl5yFshV6Lg11c0kgaU",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "urbanvista-a57b8.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "urbanvista-a57b8",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "urbanvista-a57b8.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "240074974122",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:240074974122:web:de9b844b576962fe00c1d3",
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app
