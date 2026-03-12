'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

type Order = {
    id: string
    serviceName: string
    description: string | null
    budget: string | null
    timeline: string | null
    status: string
    notes: string | null
    amount: number | null
    createdAt: string
    user: { name: string; email: string }
}

const STATUS_OPTIONS = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-red-100 text-red-700',
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [savingId, setSavingId] = useState<string | null>(null)
    const [edits, setEdits] = useState<Record<string, { status?: string; amount?: string; notes?: string }>>({})

    const fetchOrders = async () => {
        try {
            const currentUser = auth.currentUser
            if (!currentUser) { setError('Not authenticated'); return }
            const token = await currentUser.getIdToken()
            const res = await fetch('/api/admin/orders', {
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

    useEffect(() => { fetchOrders() }, [])

    const handleSave = async (orderId: string) => {
        setSavingId(orderId)
        try {
            const currentUser = auth.currentUser
            if (!currentUser) throw new Error('Not authenticated')
            const token = await currentUser.getIdToken()
            const edit = edits[orderId] || {}
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    ...(edit.status && { status: edit.status }),
                    ...(edit.amount !== undefined && { amount: edit.amount }),
                    ...(edit.notes !== undefined && { notes: edit.notes }),
                })
            })
            if (!res.ok) throw new Error('Failed to update order')
            const updatedEdits = { ...edits }
            delete updatedEdits[orderId]
            setEdits(updatedEdits)
            await fetchOrders()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to save')
        } finally {
            setSavingId(null)
        }
    }

    const setEdit = (id: string, field: string, value: string) => {
        setEdits(e => ({ ...e, [id]: { ...e[id], [field]: value } }))
    }

    if (loading) return <div className="p-8"><div className="animate-pulse bg-slate-100 h-64 rounded-2xl" /></div>
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
                <span className="text-slate-500 text-sm">{orders.length} total orders</span>
            </div>
            <div className="space-y-4">
                {orders.length === 0 && <p className="text-slate-400 text-center py-12">No orders yet</p>}
                {orders.map(o => {
                    const edit = edits[o.id] || {}
                    const currentStatus = edit.status ?? o.status
                    const hasEdits = Object.keys(edit).length > 0

                    return (
                        <div key={o.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{o.serviceName}</h3>
                                    <p className="text-sm text-slate-500">{o.user.name} • {o.user.email}</p>
                                    {o.description && <p className="text-sm text-slate-600 mt-1 italic">"{o.description}"</p>}
                                    <div className="flex gap-4 mt-2 text-xs text-slate-400">
                                        {o.budget && <span>Budget: {o.budget}</span>}
                                        {o.timeline && <span>Timeline: {o.timeline}</span>}
                                        <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${statusColors[currentStatus] || 'bg-slate-100 text-slate-600'}`}>
                                    {currentStatus}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-50">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Status</label>
                                    <select
                                        value={currentStatus}
                                        onChange={e => setEdit(o.id, 'status', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                    >
                                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={edit.amount ?? (o.amount?.toString() || '')}
                                        onChange={e => setEdit(o.id, 'amount', e.target.value)}
                                        placeholder="Set amount"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Notes for client</label>
                                    <input
                                        type="text"
                                        value={edit.notes ?? (o.notes || '')}
                                        onChange={e => setEdit(o.id, 'notes', e.target.value)}
                                        placeholder="Internal note..."
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            {hasEdits && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleSave(o.id)}
                                        disabled={savingId === o.id}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors disabled:opacity-70"
                                    >
                                        {savingId === o.id ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
