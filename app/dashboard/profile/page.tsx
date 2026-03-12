'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

type UserProfile = {
    id: string
    name: string
    email: string
    phone: string | null
    businessType: string | null
    role: string
    emailVerified: boolean
    phoneVerified: boolean
    createdAt: string
}

const BUSINESS_TYPES = [
    'Restaurant & Food', 'Retail Shop', 'Fashion & Clothing',
    'Real Estate', 'Healthcare & Clinic', 'Education & Coaching',
    'Photography Studio', 'Tech Startup', 'Hotel & Hospitality', 'Other'
]

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState('')
    const [editName, setEditName] = useState('')
    const [editPhone, setEditPhone] = useState('')
    const [editBusiness, setEditBusiness] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const currentUser = auth.currentUser
                if (!currentUser) { setError('Not authenticated'); return }
                const token = await currentUser.getIdToken()
                const res = await fetch('/api/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (!res.ok) throw new Error('Failed to fetch profile')
                const data = await res.json()
                setUser(data.user)
                setEditName(data.user.name || '')
                setEditPhone(data.user.phone?.replace('+91', '') || '')
                setEditBusiness(data.user.businessType || '')
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to load')
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        setError(null)
        setSuccess('')
        try {
            const currentUser = auth.currentUser
            if (!currentUser) throw new Error('Not authenticated')
            const token = await currentUser.getIdToken()
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    name: editName,
                    phone: editPhone ? `+91${editPhone.replace(/\D/g, '')}` : undefined,
                    businessType: editBusiness
                })
            })
            if (!res.ok) throw new Error('Failed to update profile')
            const data = await res.json()
            setUser(data.user)
            setSuccess('Profile updated successfully!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8 animate-pulse"><div className="h-64 bg-slate-100 rounded-2xl" /></div>
    if (error && !user) return <div className="p-8 text-red-600">Error: {error}</div>

    return (
        <div className="p-8 max-w-2xl space-y-8">
            <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                {/* Avatar + name row */}
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                    <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl font-black">
                        {(user?.name?.[0] || 'U').toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                        <p className="text-slate-500 text-sm">{user?.email}</p>
                        <div className="flex gap-2 mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>{user?.role}</span>
                            {user?.emailVerified && <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">Email Verified</span>}
                        </div>
                    </div>
                </div>

                {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
                {success && <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">{success}</div>}

                {/* Editable fields */}
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Full Name</label>
                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Phone Number</label>
                        <div className="flex gap-2">
                            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600">+91</div>
                            <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder="9818xxxxxx" className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Business Type</label>
                        <select value={editBusiness} onChange={e => setEditBusiness(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white">
                            <option value="">Select business type</option>
                            {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Email Address</label>
                        <input type="email" value={user?.email || ''} disabled
                            className="w-full px-4 py-3 border border-slate-100 rounded-xl text-sm bg-slate-50 text-slate-400 cursor-not-allowed" />
                        <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
                    </div>
                </div>

                <button onClick={handleSave} disabled={saving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3.5 transition-all disabled:opacity-70">
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Info */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Member Since</p>
                    <p className="font-semibold text-slate-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' }) : '—'}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Account ID</p>
                    <p className="font-mono text-sm text-slate-700 truncate">{user?.id}</p>
                </div>
            </div>
        </div>
    )
}
