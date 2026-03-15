import {
  collection, doc, getDoc, getDocs, setDoc,
  addDoc, updateDoc, query, where, orderBy,
  limit, Timestamp, serverTimestamp,
  DocumentData, QueryConstraint
} from 'firebase/firestore'
import { db } from './firebase-client'
import bcrypt from 'bcryptjs'

// ─── USERS ───────────────────────────────────────────

export async function upsertUser(uid: string, data: {
  email: string
  name: string
  phone?: string
  businessType?: string
  emailVerified?: boolean
  role?: 'USER' | 'ADMIN'
}) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  
  const ADMIN_EMAILS = ['hritikcsingh@gmail.com']
  const isAdmin = ADMIN_EMAILS.includes(data.email)
  
  if (!snap.exists()) {
    await setDoc(ref, {
      uid,
      email: data.email,
      name: data.name,
      phone: data.phone || null,
      businessType: data.businessType || null,
      emailVerified: isAdmin ? true : (data.emailVerified ?? false),
      phoneVerified: false,
      role: isAdmin ? 'ADMIN' : 'USER',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  } else {
    const updateData: DocumentData = { updatedAt: serverTimestamp() }
    if (data.name) updateData.name = data.name
    if (data.phone) updateData.phone = data.phone
    if (data.businessType) updateData.businessType = data.businessType
    if (data.emailVerified !== undefined) 
      updateData.emailVerified = isAdmin ? true : data.emailVerified
    if (isAdmin) updateData.role = 'ADMIN'
    await updateDoc(ref, updateData)
  }
  
  const updated = await getDoc(ref)
  return updated.data()
}

export async function getUser(uid: string) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

export async function getAllUsers() {
  const snap = await getDocs(
    query(collection(db, 'users'), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateUser(uid: string, data: DocumentData) {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp()
  })
}

// ─── ORDERS ──────────────────────────────────────────

export async function createOrder(data: {
  userId: string
  userEmail: string
  userName: string
  serviceName: string
  description?: string
  budget?: string
  timeline?: string
}) {
  const ref = await addDoc(collection(db, 'orders'), {
    ...data,
    status: 'PENDING',
    notes: null,
    amount: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function getUserOrders(userId: string) {
  const snap = await getDocs(
    query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getAllOrders() {
  const snap = await getDocs(
    query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateOrder(id: string, data: DocumentData) {
  await updateDoc(doc(db, 'orders', id), {
    ...data,
    updatedAt: serverTimestamp()
  })
}

// ─── CONTACT QUERIES ─────────────────────────────────

export async function createContactQuery(data: {
  userId?: string
  name: string
  email: string
  phone?: string
  business?: string
  message: string
}) {
  const ref = await addDoc(collection(db, 'contactQueries'), {
    userId: data.userId || null,
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    business: data.business || null,
    message: data.message,
    status: 'NEW',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function getAllQueries() {
  const snap = await getDocs(
    query(
      collection(db, 'contactQueries'),
      orderBy('createdAt', 'desc')
    )
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateQuery(id: string, data: DocumentData) {
  await updateDoc(doc(db, 'contactQueries', id), {
    ...data,
    updatedAt: serverTimestamp()
  })
}

// ─── OTP ─────────────────────────────────────────────

export async function createOTP(data: {
  email?: string
  phone?: string
  type: 'EMAIL_VERIFY' | 'PHONE_VERIFY' | 'PASSWORD_RESET'
  plainOtp: string
}) {
  // Invalidate all previous unused OTPs for this email+type
  const existing = await getDocs(
    query(
      collection(db, 'otpVerifications'),
      where('email', '==', data.email || null),
      where('type', '==', data.type),
      where('used', '==', false)
    )
  )
  for (const d of existing.docs) {
    await updateDoc(d.ref, { used: true })
  }

  const otpHash = await bcrypt.hash(data.plainOtp, 10)
  
  await addDoc(collection(db, 'otpVerifications'), {
    email: data.email || null,
    phone: data.phone || null,
    otpHash,
    type: data.type,
    expiresAt: Timestamp.fromDate(
      new Date(Date.now() + 10 * 60 * 1000)
    ),
    attempts: 0,
    used: false,
    createdAt: serverTimestamp(),
  })
}

export async function verifyOTP(data: {
  email?: string
  type: 'EMAIL_VERIFY' | 'PHONE_VERIFY' | 'PASSWORD_RESET'
  plainOtp: string
}): Promise<{ success: boolean; error?: string }> {
  const snap = await getDocs(
    query(
      collection(db, 'otpVerifications'),
      where('email', '==', data.email || null),
      where('type', '==', data.type),
      where('used', '==', false),
      orderBy('createdAt', 'desc'),
      limit(1)
    )
  )

  if (snap.empty) {
    return { success: false, error: 'OTP expired. Request a new one.' }
  }

  const record = snap.docs[0]
  const recordData = record.data()

  if (recordData.expiresAt.toDate() < new Date()) {
    await updateDoc(record.ref, { used: true })
    return { success: false, error: 'OTP expired. Request a new one.' }
  }

  const isValid = await bcrypt.compare(data.plainOtp, recordData.otpHash)

  if (!isValid) {
    await updateDoc(record.ref, { 
      attempts: recordData.attempts + 1 
    })
    return { success: false, error: 'Incorrect code. Try again.' }
  }

  await updateDoc(record.ref, { used: true })
  return { success: true }
}

// ─── ADMIN STATS ─────────────────────────────────────

export async function getAdminStats() {
  const [usersSnap, ordersSnap, queriesSnap] = await Promise.all([
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'orders')),
    getDocs(
      query(
        collection(db, 'contactQueries'),
        where('status', '==', 'NEW')
      )
    )
  ])

  const orders = ordersSnap.docs.map(d => d.data())
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.amount || 0), 0
  )

  const recentUsers = await getDocs(
    query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc'),
      limit(5)
    )
  )
  const recentOrders = await getDocs(
    query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(5)
    )
  )
  const recentQueries = await getDocs(
    query(
      collection(db, 'contactQueries'),
      orderBy('createdAt', 'desc'),
      limit(5)
    )
  )

  return {
    totalUsers: usersSnap.size,
    totalOrders: ordersSnap.size,
    newQueries: queriesSnap.size,
    totalRevenue,
    recentUsers: recentUsers.docs.map(d => ({ 
      id: d.id, ...d.data() 
    })),
    recentOrders: recentOrders.docs.map(d => ({ 
      id: d.id, ...d.data() 
    })),
    recentQueries: recentQueries.docs.map(d => ({ 
      id: d.id, ...d.data() 
    })),
  }
}
