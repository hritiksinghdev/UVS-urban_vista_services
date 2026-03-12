'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

type UserRow = {
    id: string
    name: string
    email: string
    phone: string | null
    businessType: string | null
    role: string
    emailVerified: boolean
    createdAt: string
    orders: { id: string }[]
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserRow[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [togglingId, setTogglingId] = useState<string | null>(null)

    const fetchUsers = async () => {
        try {
            const currentUser = auth.currentUser
            if (!currentUser) { setError('Not authenticated'); return }
            const token = await currentUser.getIdToken()
            const res = await fetch('/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (!res.ok) throw new Error('Failed to fetch users')
            const data = await res.json()
            setUsers(data.users || [])
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchUsers() }, [])

    const toggleRole = async (userId: string, currentRole: string) => {
        setTogglingId(userId)
        try {
            const currentUser = auth.currentUser
            if (!currentUser) throw new Error('Not authenticated')
            const token = await currentUser.getIdToken()
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ role: currentRole === 'ADMIN' ? 'USER' : 'ADMIN' })
            })
            if (!res.ok) throw new Error('Failed to update role')
            await fetchUsers()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update')
        } finally {
            setTogglingId(null)
        }
    }

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.businessType || '').toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <div className="p-8"><div className="animate-pulse bg-slate-100 h-64 rounded-2xl" /></div>
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                <span className="text-slate-500 text-sm">{users.length} total users</span>
            </div>
            <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email, or business..."
                className="w-full max-w-md px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
            />
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            {['User', 'Phone', 'Business', 'Role', 'Verified', 'Orders', 'Joined', 'Actions'].map(h => (
                                <th key={h} className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filtered.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            {u.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 text-sm">{u.name}</p>
                                            <p className="text-xs text-slate-500">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-sm text-slate-600">{u.phone || '—'}</td>
                                <td className="px-5 py-4 text-sm text-slate-600">{u.businessType || '—'}</td>
                                <td className="px-5 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    {u.emailVerified
                                        ? <span className="text-emerald-600 text-xs font-semibold">✓ Yes</span>
                                        : <span className="text-amber-600 text-xs font-semibold">✗ No</span>}
                                </td>
                                <td className="px-5 py-4 text-sm text-slate-600">{u.orders?.length ?? 0}</td>
                                <td className="px-5 py-4 text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td className="px-5 py-4">
                                    <button
                                        onClick={() => toggleRole(u.id, u.role)}
                                        disabled={togglingId === u.id}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                                    >
                                        {togglingId === u.id ? '...' : u.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={8} className="text-center py-12 text-slate-400">No users found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
