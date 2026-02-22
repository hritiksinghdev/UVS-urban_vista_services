"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Our Work', href: '/work' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-7xl h-16 rounded-[28px] flex items-center justify-between px-6 bg-white/35 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-white/40 ring-1 ring-white/20 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/40 before:to-transparent before:rounded-[28px] before:pointer-events-none"
        >
            <Link href="/" className="flex items-center gap-2 group">
                <div className="relative flex items-center justify-center p-0 m-0 bg-transparent">
                    <img
                        src="/logo-icon.png"
                        alt="UrbanVista Logo"
                        className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <span className="text-xl font-semibold tracking-tight text-[#111] group-hover:text-[#2563eb] transition-colors">
                    UrbanVista
                </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="text-[#111] hover:text-[#2563eb] transition-colors text-sm font-medium"
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
                <Link href="/login">
                    <Button variant="secondary" size="sm" className="rounded-full px-6 font-medium">Sign In</Button>
                </Link>
            </div>

            {/* Mobile Toggle */}
            <button
                className="md:hidden text-[#111]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X /> : <Menu />}
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="md:hidden absolute top-20 left-0 right-0 bg-white/80 backdrop-blur-3xl rounded-[28px] border border-white/40 p-6 flex flex-col gap-4 shadow-2xl ring-1 ring-white/20"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[#111] hover:text-[#2563eb] text-lg font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-3 mt-4">
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="primary" className="w-full justify-center rounded-lg bg-[#2563eb] text-white">Sign In</Button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};
