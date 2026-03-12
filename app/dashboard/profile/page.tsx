'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

export default function ProfilePage() {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = auth.currentUser
        if (!currentUser) {
          setError('Not authenticated')
          return
        }

        const token = await currentUser.getIdToken()

        const res = await fetch('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!res.ok) throw new Error('Failed to fetch profile')

        const data = await res.json()
        setUser(data.user)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) return <div className="p-8 animate-pulse bg-slate-50 h-screen rounded-3xl" />
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account information</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b border-slate-50">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl font-bold uppercase">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-xl font-bold text-slate-900 truncate">{user?.name}</h3>
            <p className="text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Role</p>
            <p className="font-semibold text-slate-900">{user?.role}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Email Status</p>
            <p className={`font-semibold ${user?.emailVerified ? 'text-green-600' : 'text-amber-600'}`}>{user?.emailVerified ? 'Verified' : 'Unverified'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
