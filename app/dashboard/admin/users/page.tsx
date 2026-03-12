'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUser = auth.currentUser
        if (!currentUser) {
          setError('Not authenticated')
          return
        }

        const token = await currentUser.getIdToken()

        const res = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Failed to fetch users')
        }

        const data = await res.json()
        setUsers(data.users || data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) return <div className="p-8"><div className="animate-pulse bg-slate-100 h-64 rounded-2xl" /></div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users?.map((u: any) => (
              <tr key={u.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{u.name}</div>
                  <div className="text-xs text-slate-500">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>{u.role}</span>
                </td>
                <td className="px-6 py-4">
                  {u.emailVerified ? <span className="text-green-600 text-xs font-medium">Verified</span> : <span className="text-amber-600 text-xs font-medium">Pending</span>}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
