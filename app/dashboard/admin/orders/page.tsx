'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const currentUser = auth.currentUser
        if (!currentUser) {
          setError('Not authenticated')
          return
        }

        const token = await currentUser.getIdToken()

        const res = await fetch('/api/admin/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Failed to fetch orders')
        }

        const data = await res.json()
        setOrders(data.orders || data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) return <div className="p-8"><div className="animate-pulse bg-slate-100 h-64 rounded-2xl" /></div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Service</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Client</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders?.map((o: any) => (
              <tr key={o.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{o.serviceName}</div>
                  <div className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {o.user?.name || 'Guest'}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {o.amount ? `₹${o.amount.toLocaleString()}` : '—'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    o.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    o.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
