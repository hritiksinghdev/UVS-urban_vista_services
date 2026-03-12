'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

export default function SecurityPage() {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = auth.currentUser
      if (currentUser) {
        setUser(currentUser)
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  if (loading) return <div className="p-8 animate-pulse bg-slate-50 h-64 rounded-3xl" />

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Security & Privacy</h1>
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Password</h3>
            <p className="text-sm text-slate-500">Secure your account</p>
          </div>
          <button className="text-blue-600 font-semibold text-sm hover:underline">Change</button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Two-Factor Authentication</h3>
            <p className="text-sm text-slate-500">Add an extra layer of security</p>
          </div>
          <button className="bg-slate-50 px-4 py-2 rounded-xl text-slate-600 font-bold text-xs uppercase tracking-wider">Enable</button>
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div>
            <h3 className="font-bold text-red-600">Delete Account</h3>
            <p className="text-sm text-slate-500">Permanently remove your data</p>
          </div>
          <button className="text-red-600 font-semibold text-sm hover:underline">Delete</button>
        </div>
      </div>
    </div>
  )
}
