'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const currentUser = auth.currentUser
        if (!currentUser) {
          setError('Not authenticated')
          return
        }

        const token = await currentUser.getIdToken()

        const res = await fetch('/api/admin/queries', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Failed to fetch queries')
        }

        const data = await res.json()
        setQueries(data.queries || data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        setLoading(false)
      }
    }

    fetchQueries()
  }, [])

  if (loading) return <div className="p-8"><div className="animate-pulse bg-slate-100 h-64 rounded-2xl" /></div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Customer Queries</h1>
      <div className="grid grid-cols-1 gap-4">
        {queries?.map((q: any) => (
          <div key={q.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-900">{q.name}</h3>
                <p className="text-xs text-slate-500">{q.email} • {q.business}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${q.status === 'NEW' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{q.status}</span>
            </div>
            <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl italic">"{q.message}"</p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{new Date(q.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {queries?.length === 0 && <p className="text-center text-slate-400 py-12">No queries found</p>}
      </div>
    </div>
  )
}
