'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

export default function OrdersPage() {
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

        const res = await fetch('/api/user/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!res.ok) throw new Error('Failed to fetch orders')

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

  if (loading) return <div className="p-8 animate-pulse bg-slate-50 h-screen rounded-3xl" />
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
      <div className="grid grid-cols-1 gap-4">
        {orders?.map((o: any) => (
          <div key={o.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">{o.serviceName}</h3>
              <p className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">{o.amount ? `₹${o.amount.toLocaleString()}` : 'Processing'}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${o.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{o.status}</span>
            </div>
          </div>
        ))}
        {orders?.length === 0 && <p className="text-slate-400 py-12 text-center">No orders yet.</p>}
      </div>
    </div>
  )
}
