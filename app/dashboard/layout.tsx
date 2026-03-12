"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { LayoutDashboard, ShoppingBag, User, Shield, Users, Inbox, LogOut, Menu, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f1f3f5] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) return null;

    const isAdmin = user?.role === 'ADMIN' || user.email === 'hritikcsingh@gmail.com';
    const isAdminRoute = pathname.startsWith('/dashboard/admin');

    const userLinks = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/orders', label: 'My Orders', icon: ShoppingBag },
        { href: '/dashboard/profile', label: 'Profile', icon: User },
        { href: '/dashboard/security', label: 'Security', icon: Shield },
    ];

    const adminLinks = [
        { href: '/dashboard/admin', label: 'Admin Panel', icon: Shield },
        { href: '/dashboard/admin/users', label: 'Users', icon: Users },
        { href: '/dashboard/admin/orders', label: 'All Orders', icon: ShoppingBag },
        { href: '/dashboard/admin/queries', label: 'Queries', icon: Inbox },
    ];

    const links = isAdminRoute ? adminLinks : userLinks;

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f3f5] flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-20">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        UrbanVista
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {isAdmin && (
                        <div className="mb-6 px-2">
                            {isAdminRoute ? (
                                <Link href="/dashboard" className="flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to User Portal
                                </Link>
                            ) : (
                                <Link href="/dashboard/admin" className="flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                                    Switch to Admin Portal <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                                </Link>
                            )}
                        </div>
                    )}
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
                        {isAdminRoute ? 'Administration' : 'Menu'}
                    </div>
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase">
                            {user.email?.[0] || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Sidebar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    UrbanVista
                </Link>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-600">
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-40 border-r border-slate-200 flex flex-col pt-16">
                        <div className="flex-1 py-6 px-4 space-y-1">
                            {isAdmin && (
                                <div className="mb-6 px-2">
                                    {isAdminRoute ? (
                                        <Link href="/dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center text-sm font-medium text-slate-500">
                                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to User Portal
                                        </Link>
                                    ) : (
                                        <Link href="/dashboard/admin" onClick={() => setSidebarOpen(false)} className="flex items-center text-sm font-medium text-slate-500">
                                            Switch to Admin Portal <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                                        </Link>
                                    )}
                                </div>
                            )}
                            {links.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link onClick={() => setSidebarOpen(false)} key={link.href} href={link.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>
                                        <Icon className="w-5 h-5" /> {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 p-6 sm:p-10 max-w-7xl">
                {children}
            </main>
        </div>
    );
}
