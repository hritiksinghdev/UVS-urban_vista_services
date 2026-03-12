'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    totalRevenue: number
    totalUsers: number
    activeOrders: number
    newQueries: number
    latestUsers: Array<{
      id: string
      name: string
      email: string
      role: string
      emailVerified: boolean
      createdAt: string
    }>
    latestOrders: Array<{
      id: string
      serviceName: string
      status: string
      amount: number | null
      createdAt: string
      user: { name: string; email: string }
    }>
  } | null>(null)
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

        const res = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Failed to fetch stats')
        }

        const data = await res.json()
        // API returns { stats: { ... } }, so handle accordingly
        setStats(data.stats || data)
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'Failed to load'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} 
              className="bg-white rounded-2xl p-6 h-32 
                animate-pulse bg-slate-100" 
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 
          rounded-2xl p-6 text-red-700">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Admin Control Center
        </h1>
        <p className="text-slate-500 mt-1">
          Platform metrics and oversight
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 
          border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            ₹{(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 
          border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">Total Users</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {stats?.totalUsers ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 
          border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">Active Orders</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {(stats as any)?.activeOrders ?? (stats as any)?.totalOrders ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 
          border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">New Queries</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {stats?.newQueries ?? 0}
          </p>
        </div>
      </div>

      {/* Latest Users & Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 
          border border-slate-100 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">
            Latest Users
          </h2>
          {(stats as any)?.recentUsers || stats?.latestUsers ? (
            <div className="space-y-3">
              {((stats as any)?.recentUsers || stats?.latestUsers).slice(0, 5).map((u: any) => (
                <div key={u.id} 
                  className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full 
                    bg-blue-600 text-white flex items-center 
                    justify-center font-bold text-sm">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium 
                      text-slate-900 truncate">{u.name}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {u.email}
                    </p>
                  </div>
                  <span className={`ml-auto text-xs px-2 py-1 
                    rounded-full font-medium
                    ${u.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-slate-100 text-slate-600'
                    }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">
              No users yet
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 
          border border-slate-100 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">
            Latest Orders
          </h2>
          {(stats as any)?.recentOrders || stats?.latestOrders ? (
            <div className="space-y-3">
              {((stats as any)?.recentOrders || stats?.latestOrders).slice(0, 5).map((o: any) => (
                <div key={o.id} 
                  className="flex items-center gap-3">
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium 
                      text-slate-900 truncate">{o.serviceName}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {o.user?.name || 'Guest'}
                    </p>
                  </div>
                  <span className={`ml-auto text-xs px-2 py-1 
                    rounded-full font-medium
                    ${o.status === 'COMPLETED' 
                      ? 'bg-green-100 text-green-700'
                      : o.status === 'IN_PROGRESS'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                    }`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">
              No orders yet
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
