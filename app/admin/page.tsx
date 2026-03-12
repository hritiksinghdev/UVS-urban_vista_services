"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Users, Activity, Loader2, Save, Plus } from "lucide-react";

export default function AdminDashboardPage() {
    const { user, getToken } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [metrics, setMetrics] = useState<any>({
        active_requests: 0,
        monthly_requests: 0,
        satisfaction_score: 100
    });
    const [requests, setRequests] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // New request state
    const [newUserId, setNewUserId] = useState('');
    const [newServiceName, setNewServiceName] = useState('');
    const [newDesc, setNewDesc] = useState('');

    const router = useRouter();

    useEffect(() => {
        async function loadData() {
            if (!user) return;
            if (user.role !== 'ADMIN') {
                router.push('/dashboard');
                return;
            }

            try {
                const token = await getToken();
                // Load stats/metrics
                const statsRes = await fetch('/api/admin/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setMetrics(statsData);
                }

                // Load orders/requests
                const ordersRes = await fetch('/api/admin/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setRequests(ordersData.orders || []);
                }

                // Load users for dropdown
                const usersRes = await fetch('/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (usersRes.ok) {
                    const usersData = await usersRes.json();
                    setProfiles(usersData.users || []);
                }
            } catch (err) {
                console.error("Error loading admin data:", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [user, router, getToken]);

    const handleSaveMetrics = async () => {
        alert('Statistics are automatically calculated from orders and users in this version.');
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const token = await getToken();
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
            }
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    const handleInsertRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await getToken();
            const res = await fetch('/api/admin/orders', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: newUserId,
                    serviceName: newServiceName,
                    description: newDesc,
                })
            });

            if (res.ok) {
                const data = await res.json();
                setRequests([data.order, ...requests]);
                setNewServiceName('');
                setNewDesc('');
                alert('Order created!');
            }
        } catch (err) {
            console.error("Error creating order:", err);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><Loader2 className="w-8 h-8 animate-spin text-red-500" /></div>;

    return (
        <div className="min-h-screen bg-slate-900 pt-32 pb-24 px-6 md:px-12 font-sans text-slate-200">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="mb-12 border-b border-red-500/20 pb-8 flex items-center gap-4">
                    <ShieldAlert className="w-10 h-10 text-red-500" />
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                            Admin <span className="text-red-500">Control Center</span>
                        </h1>
                        <p className="text-slate-400">
                            Superuser dashboard. Manage global metrics and client requests.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Metrics Display & Insert Request */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Metrics Card */}
                        <div className="p-6 md:p-8 rounded-[24px] bg-slate-800/50 border border-slate-700 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-red-400" /> Global Metrics
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Orders</p>
                                    <p className="text-2xl font-bold text-white">{metrics.totalOrders || 0}</p>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Active Users</p>
                                    <p className="text-2xl font-bold text-white">{metrics.totalUsers || 0}</p>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Revenue Estimate</p>
                                    <p className="text-2xl font-bold text-emerald-400">${metrics.totalRevenue || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Insert Request Card */}
                        <div className="p-6 md:p-8 rounded-[24px] bg-slate-800/50 border border-slate-700 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-red-400" /> Create Order
                            </h3>
                            <form onSubmit={handleInsertRequest} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Client</label>
                                    <select value={newUserId} onChange={e => setNewUserId(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-red-500 outline-none appearance-none">
                                        <option value="" disabled>Select a client...</option>
                                        {profiles.map((p: any) => (
                                            <option key={p.id} value={p.id}>{p.name || p.email}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Service Name</label>
                                    <input type="text" value={newServiceName} onChange={e => setNewServiceName(e.target.value)} required placeholder="e.g. SEO Campaign" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-red-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                    <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={3} placeholder="Details about the service..." className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-red-500 outline-none"></textarea>
                                </div>
                                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors mt-4">
                                    Submit Request
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Manage Requests */}
                    <div className="lg:col-span-2">
                        <div className="p-6 md:p-8 rounded-[24px] bg-slate-800/50 border border-slate-700 shadow-xl h-full">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Users className="w-5 h-5 text-red-400" /> Manage Client Orders
                            </h3>

                            <div className="space-y-4 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
                                {requests.length === 0 ? (
                                    <p className="text-slate-500">No orders found in database.</p>
                                ) : (
                                    requests.map((req: any) => {
                                        return (
                                            <div key={req.id} className="p-5 rounded-xl border border-slate-700 bg-slate-900/50 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-bold text-white">{req.serviceName}</h4>
                                                    </div>
                                                    <p className="text-sm text-slate-400 mb-2">{req.description}</p>
                                                    <p className="text-xs text-slate-500">Client ID: {req.userId} &bull; Created: {new Date(req.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="shrink-0 flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                                                    <select
                                                        value={req.status}
                                                        onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                                                        className={`bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm font-semibold outline-none cursor-pointer ${req.status === 'COMPLETED' ? 'text-emerald-400' :
                                                                req.status === 'IN_PROGRESS' ? 'text-blue-400' : 'text-amber-400'
                                                            }`}
                                                    >
                                                        <option value="PENDING" className="text-amber-400">PENDING</option>
                                                        <option value="IN_PROGRESS" className="text-blue-400">IN PROGRESS</option>
                                                        <option value="COMPLETED" className="text-emerald-400">COMPLETED</option>
                                                        <option value="CANCELLED" className="text-red-400">CANCELLED</option>
                                                    </select>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(15, 23, 42, 0.5); 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(239, 68, 68, 0.2); 
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(239, 68, 68, 0.5); 
                }
            `}</style>
        </div>
    );
}
