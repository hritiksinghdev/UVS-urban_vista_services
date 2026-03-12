'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

type Order = {
    id: string
    serviceName: string
    description: string | null
    status: string
    amount: number | null
    createdAt: string
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

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const currentUser = auth.currentUser
                if (!currentUser) { setError('Not authenticated'); return }
                const token = await currentUser.getIdToken()
                const res = await fetch('/api/user/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (!res.ok) throw new Error('Failed to fetch orders')
                const data = await res.json()
                setOrders(data.orders || [])
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to load')
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    if (loading) return <div className="p-8 animate-pulse space-y-4">{[...Array(3)].map((_,i)=><div key={i} className="h-28 bg-slate-100 rounded-2xl"/>)}</div>
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
            {orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
                    <p className="text-4xl mb-4">📭</p>
                    <p className="text-slate-900 font-semibold">No orders yet</p>
                    <p className="text-slate-400 text-sm mt-1">Place your first order to get started</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(o => (
                        <div key={o.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-slate-900">{o.serviceName}</h3>
                                    {o.description && <p className="text-sm text-slate-500 mt-0.5">{o.description}</p>}
                                    <p className="text-xs text-slate-400 mt-1">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    {o.amount ? (
                                        <p className="font-bold text-slate-900">₹{o.amount.toLocaleString('en-IN')}</p>
                                    ) : (
                                        <p className="text-slate-400 text-sm font-medium">Processing</p>
                                    )}
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColors[o.status] || 'bg-slate-100 text-slate-600'}`}>
                                        {o.status}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Progress</span>
                                    <span>{statusProgress[o.status] || 0}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${o.status === 'COMPLETED' ? 'bg-emerald-500' : o.status === 'CANCELLED' ? 'bg-red-400' : 'bg-blue-600'}`}
                                        style={{ width: `${statusProgress[o.status] || 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
