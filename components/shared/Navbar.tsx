"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Our Work', href: '/work' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const isActive = (path: string) => {
        if (path === "/services") {
            return pathname.startsWith("/services");
        }
        return pathname === path;
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-7xl h-16 rounded-[28px] flex items-center justify-between px-6 bg-white/35 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-white/40 ring-1 ring-white/20 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/40 before:to-transparent before:rounded-[28px] before:pointer-events-none"
        >
            <Link href="/" className="flex items-center gap-2 group relative z-10">
                <div className="relative flex items-center justify-center p-0 m-0 bg-transparent">
                    <img
                        src="/logo-icon.png"
                        alt="UrbanVista Logo"
                        className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <span className="text-xl font-semibold tracking-tight text-[#111] group-hover:text-blue-600 transition-colors">
                    UrbanVista
                </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 relative z-10">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`${isActive(link.href)
                            ? "text-blue-600 font-semibold scale-105"
                            : "text-gray-600 hover:text-blue-500 font-medium"
                            } transition-all duration-300 text-sm`}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            <div className="hidden md:flex items-center gap-4 relative z-10">
                <Link href="/auth">
                    <Button variant="secondary" size="sm" className="rounded-full px-6 font-medium bg-white/50 hover:bg-white/80">Sign In</Button>
                </Link>
            </div>

            {/* Mobile Toggle */}
            <button
                className="md:hidden text-[#111] relative z-10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X /> : <Menu />}
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="md:hidden absolute top-20 left-0 right-0 bg-white/80 backdrop-blur-3xl rounded-[28px] border border-white/40 p-6 flex flex-col gap-4 shadow-2xl ring-1 ring-white/20 z-50"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`${isActive(link.href)
                                ? "text-blue-600 font-semibold scale-105"
                                : "text-gray-600 hover:text-blue-500 font-medium"
                                } transition-all duration-300 text-lg block`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-3 mt-4">
                        <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="primary" className="w-full justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Sign In</Button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};
