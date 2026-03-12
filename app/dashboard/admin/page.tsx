'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

type StatsData = {
    totalRevenue: number
    totalUsers: number
    totalOrders: number
    newQueries: number
    recentUsers: Array<{
        id: string
        name: string
        email: string
        role: string
        emailVerified: boolean
        createdAt: string
    }>
    recentOrders: Array<{
        id: string
        serviceName: string
        status: string
        amount: number | null
        createdAt: string
        user: { name: string; email: string }
    }>
    recentQueries: Array<{
        id: string
        name: string
        email: string
        message: string
        status: string
        createdAt: string
    }>
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
    const colors: Record<string, string> = {
        green: 'bg-emerald-50 border-emerald-100',
        blue: 'bg-blue-50 border-blue-100',
        purple: 'bg-purple-50 border-purple-100',
        orange: 'bg-amber-50 border-amber-100',
    }
    return (
        <div className={`rounded-2xl p-6 border ${colors[color] || 'bg-white border-slate-100'} space-y-3`}>
            <span className="text-2xl">{icon}</span>
            <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
            </div>
        </div>
    )
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<StatsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const currentUser = auth.currentUser
                if (!currentUser) { setError('Not authenticated'); return }
                const token = await currentUser.getIdToken()
                const res = await fetch('/api/admin/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (!res.ok) {
                    const errData = await res.json()
                    throw new Error(errData.error || 'Failed to fetch stats')
                }
                const data = await res.json()
                const statsData = data.stats
                setStats({
                    totalRevenue: statsData.totalRevenue || 0,
                    totalUsers: statsData.totalUsers || 0,
                    totalOrders: statsData.totalOrders || 0,
                    newQueries: statsData.newQueries || 0,
                    recentUsers: statsData.recentUsers || [],
                    recentOrders: statsData.recentOrders || [],
                    recentQueries: statsData.recentQueries || [],
                })
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to load')
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">Error: {error}</div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
                <p className="text-slate-500 mt-1">Platform metrics and oversight</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon="💰" label="Total Revenue" value={`₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`} color="green" />
                <StatCard icon="👥" label="Total Users" value={stats?.totalUsers ?? 0} color="blue" />
                <StatCard icon="📦" label="Total Orders" value={stats?.totalOrders ?? 0} color="purple" />
                <StatCard icon="💬" label="New Queries" value={stats?.newQueries ?? 0} color="orange" />
            </div>

            {/* Latest Users & Orders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h2 className="font-semibold text-slate-900 mb-4">Latest Users</h2>
                    {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentUsers.slice(0, 5).map(u => (
                                <div key={u.id} className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden flex-1">
                                        <p className="text-sm font-medium text-slate-900 truncate">{u.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {u.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm">No users yet</p>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h2 className="font-semibold text-slate-900 mb-4">Latest Orders</h2>
                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentOrders.slice(0, 5).map(o => (
                                <div key={o.id} className="flex items-center gap-3">
                                    <div className="overflow-hidden flex-1">
                                        <p className="text-sm font-medium text-slate-900 truncate">{o.serviceName}</p>
                                        <p className="text-xs text-slate-500 truncate">{o.user?.name || 'Guest'}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 whitespace-nowrap ${o.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : o.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {o.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm">No orders yet</p>
                    )}
                </div>
            </div>

            {/* Recent Queries */}
            {stats?.recentQueries && stats.recentQueries.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h2 className="font-semibold text-slate-900 mb-4">Recent Queries</h2>
                    <div className="space-y-3">
                        {stats.recentQueries.slice(0, 3).map(q => (
                            <div key={q.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                                <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                    {q.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <p className="text-sm font-medium text-slate-900">{q.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{q.email}</p>
                                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{q.message}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${q.status === 'NEW' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {q.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
