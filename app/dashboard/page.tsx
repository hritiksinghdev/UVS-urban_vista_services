'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/lib/AuthContext'
import Link from 'next/link'

type UserStats = {
    activeOrders: number
    completedOrders: number
    totalOrders: number
    emailVerified: boolean
    phoneVerified: boolean
    memberSince: string
    recentOrders: Array<{
        id: string
        serviceName: string
        status: string
        amount: number | null
        createdAt: string
    }>
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-red-100 text-red-700',
}

const statusProgress: Record<string, number> = {
    PENDING: 25,
    IN_PROGRESS: 65,
    COMPLETED: 100,
    CANCELLED: 0,
}

export default function DashboardPage() {
    const { user } = useAuth()
    const [stats, setStats] = useState<UserStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const currentUser = auth.currentUser
                if (!currentUser) { setError('Not authenticated'); return }
                const token = await currentUser.getIdToken()
                const res = await fetch('/api/user/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (!res.ok) throw new Error('Failed to fetch stats')
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

    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
    const firstName = user?.name?.split(' ')[0] || 'there'

    if (loading) return <div className="p-8 animate-pulse space-y-6"><div className="h-20 bg-slate-100 rounded-2xl" /><div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_,i)=><div key={i} className="h-32 bg-slate-100 rounded-2xl"/>)}</div></div>
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>

    return (
        <div className="p-8 space-y-8">
            {/* Greeting */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                <h1 className="text-2xl font-bold">{greeting}, {firstName} 👋</h1>
                <p className="text-blue-100 mt-1">Here's what's happening with your brand</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                    <span className="text-2xl">📦</span>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Active Orders</p>
                    <p className="text-3xl font-bold text-slate-900">{stats?.activeOrders ?? 0}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                    <span className="text-2xl">✅</span>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Completed</p>
                    <p className="text-3xl font-bold text-slate-900">{stats?.completedOrders ?? 0}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                    <span className="text-2xl">🔔</span>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Account</p>
                    <p className="text-lg font-bold text-emerald-600">{stats?.emailVerified ? '✓ Verified' : 'Pending'}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                    <span className="text-2xl">📅</span>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Member Since</p>
                    <p className="text-lg font-bold text-slate-900">
                        {stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}
                    </p>
                </div>
            </div>

            {/* Recent Orders */}
            {stats?.recentOrders && stats.recentOrders.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-slate-900">Recent Orders</h2>
                        <Link href="/dashboard/orders" className="text-blue-600 text-sm font-medium hover:underline">View all</Link>
                    </div>
                    <div className="space-y-4">
                        {stats.recentOrders.map(o => (
                            <div key={o.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-900 text-sm">{o.serviceName}</p>
                                        <p className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        {o.amount && <p className="text-sm font-bold text-slate-900">₹{o.amount.toLocaleString('en-IN')}</p>}
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColors[o.status] || 'bg-slate-100 text-slate-600'}`}>
                                            {o.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                    <div
                                        className="bg-blue-600 h-1.5 rounded-full transition-all"
                                        style={{ width: `${statusProgress[o.status] || 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: '🛍️ Order Service', href: '/services' },
                    { label: '💬 Contact Team', href: '/contact' },
                    { label: '📦 All Orders', href: '/dashboard/orders' },
                    { label: '👤 Profile', href: '/dashboard/profile' },
                ].map(action => (
                    <Link key={action.href} href={action.href}
                        className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 text-center text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-600 hover:shadow-md transition-all">
                        {action.label}
                    </Link>
                ))}
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                    {stats?.emailVerified && (
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">✓</div>
                            <span className="text-slate-600">Email verified</span>
                        </div>
                    )}
                    {stats?.recentOrders && stats.recentOrders.length > 0 && (
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">📦</div>
                            <span className="text-slate-600">Order placed — {stats.recentOrders[0].serviceName}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">🎉</div>
                        <span className="text-slate-600">Account created on UrbanVista</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
