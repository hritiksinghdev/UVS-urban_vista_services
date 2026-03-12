'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

export default function DashboardPage() {
  const [stats, setStats] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const currentUser = auth.currentUser
        if (!currentUser) {
          setError('Not authenticated')
          return
        }

        const token = await currentUser.getIdToken()

        const res = await fetch('/api/user/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Failed to fetch dashboard data')
        }

        const data = await res.json()
        setStats(data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <div className="p-8 animate-pulse bg-slate-50 h-screen rounded-3xl" />
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome Back!</h1>
        <p className="text-slate-500 mt-2">Here's what's happening with your account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500 uppercase font-semibold">My Orders</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{stats?.totalOrders ?? (stats?.ordersCount || 0)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500 uppercase font-semibold">Active Requests</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{stats?.activeOrders ?? (stats?.activeRequests || 0)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500 uppercase font-semibold">Account Status</p>
          <p className="text-xl font-bold text-green-600 mt-2">Verified</p>
        </div>
      </div>
    </div>
  )
}
