'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

type Query = {
    id: string
    name: string
    email: string
    phone: string | null
    business: string | null
    message: string
    status: string
    createdAt: string
}

type Tab = 'ALL' | 'NEW' | 'SEEN' | 'REPLIED'

export default function AdminQueriesPage() {
    const [queries, setQueries] = useState<Query[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<Tab>('ALL')
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const fetchQueries = async () => {
        try {
            const currentUser = auth.currentUser
            if (!currentUser) { setError('Not authenticated'); return }
            const token = await currentUser.getIdToken()
            const res = await fetch('/api/admin/queries', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (!res.ok) throw new Error('Failed to fetch queries')
            const data = await res.json()
            setQueries(data.queries || [])
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchQueries() }, [])

    const updateStatus = async (queryId: string, status: string) => {
        setUpdatingId(queryId)
        try {
            const currentUser = auth.currentUser
            if (!currentUser) throw new Error('Not authenticated')
            const token = await currentUser.getIdToken()
            const res = await fetch(`/api/admin/queries/${queryId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            })
            if (!res.ok) throw new Error('Failed to update')
            await fetchQueries()
        } catch {
            setError('Failed to update query status')
        } finally {
            setUpdatingId(null)
        }
    }

    const tabs: Tab[] = ['ALL', 'NEW', 'SEEN', 'REPLIED']
    const filtered = activeTab === 'ALL' ? queries : queries.filter(q => q.status === activeTab)

    const statusColors: Record<string, string> = {
        NEW: 'bg-blue-100 text-blue-700',
        SEEN: 'bg-slate-100 text-slate-600',
        REPLIED: 'bg-emerald-100 text-emerald-700',
    }

    if (loading) return <div className="p-8"><div className="animate-pulse bg-slate-100 h-64 rounded-2xl" /></div>
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Customer Queries</h1>
                <span className="text-slate-500 text-sm">{queries.filter(q => q.status === 'NEW').length} new</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab} {tab !== 'ALL' && <span className="ml-1 text-xs opacity-60">{queries.filter(q => q.status === tab).length}</span>}
                    </button>
                ))}
            </div>

            {/* Queries */}
            <div className="grid grid-cols-1 gap-4">
                {filtered.map(q => (
                    <div key={q.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-slate-900">{q.name}</h3>
                                <p className="text-xs text-slate-500">{q.email}{q.phone && ` • ${q.phone}`}{q.business && ` • ${q.business}`}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${statusColors[q.status] || 'bg-slate-100 text-slate-600'}`}>
                                {q.status}
                            </span>
                        </div>
                        <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl italic leading-relaxed">"{q.message}"</p>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-400">{new Date(q.createdAt).toLocaleString()}</p>
                            <div className="flex gap-2">
                                {q.status === 'NEW' && (
                                    <button
                                        onClick={() => updateStatus(q.id, 'SEEN')}
                                        disabled={updatingId === q.id}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                                    >
                                        Mark Seen
                                    </button>
                                )}
                                {q.status !== 'REPLIED' && (
                                    <button
                                        onClick={() => updateStatus(q.id, 'REPLIED')}
                                        disabled={updatingId === q.id}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
                                    >
                                        Mark Replied
                                    </button>
                                )}
                                <a
                                    href={`mailto:${q.email}?subject=Re: Your UrbanVista Inquiry&body=Hi ${q.name},%0A%0A`}
                                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                    Reply via Email
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <p className="text-center text-slate-400 py-12">No {activeTab.toLowerCase()} queries</p>}
            </div>
        </div>
    )
}
