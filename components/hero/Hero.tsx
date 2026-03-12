"use client";

import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Star, Users, Calendar } from 'lucide-react';
import StudioScene from './StudioScene';
import Link from 'next/link';

interface HeroProps {
    title: string;
    subtitle: string;
}

export function Hero({ title, subtitle }: HeroProps) {
    // Logic to style the title dynamically if it contains "Global" or "Local to Global"
    // However, to keep it world-class, we'll implement a robust rendering logic.

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#f1f3f5] pt-20">

            {/* Background Decorative Blobs */}
            <div className="absolute -left-20 top-20 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-40 pointer-events-none z-0 animate-pulse"></div>
            <div className="absolute left-40 bottom-10 w-64 h-64 bg-orange-50 rounded-full blur-[80px] opacity-60 pointer-events-none z-0"></div>

            <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-4 py-1.5 text-sm font-medium mb-6 shadow-sm"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
                        🌍 Trusted by 50+ businesses
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
                        {title.includes("Local to Global") ? (
                            <>
                                Local to <br />
                                <span className="relative">
                                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                                        Global
                                    </span>
                                    <motion.svg
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 1, duration: 1.5 }}
                                        className="absolute -bottom-2 left-0 w-full h-3 text-blue-400/30"
                                        viewBox="0 0 300 20"
                                        fill="none"
                                    >
                                        <path d="M5 15C50 15 100 5 150 5C200 5 250 15 295 15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                    </motion.svg>
                                </span>
                            </>
                        ) : title}
                    </h1>

                    <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8 max-w-lg">
                        {subtitle}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-12">
                        <Link href="/auth">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-8 py-4 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            </motion.button>
                        </Link>

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,1)' }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 font-semibold rounded-xl px-8 py-4 transition-all flex items-center gap-2"
                        >
                            Learn More <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-6 py-4 border-t border-slate-200 w-fit">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Star className="w-4 h-4 text-orange-400" />
                            <span className="text-sm font-medium">500+ Posts Created</span>
                        </div>
                        <div className="h-4 w-px bg-slate-300"></div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">50+ Clients</span>
                        </div>
                        <div className="h-4 w-px bg-slate-300"></div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <Calendar className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">3+ Years</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Content - Visuals */}
                <div className="relative h-[600px] flex items-center justify-center">

                    {/* Floating Card 1 */}
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute right-[12%] top-[15%] z-20 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60 text-sm max-w-[180px]"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="font-bold text-slate-900">Campaign Live</span>
                        </div>
                        <p className="text-slate-600 text-xs mb-1 font-medium">"Urban Bites Restaurant"</p>
                        <p className="text-blue-600 font-bold">+2.4k reach <span className="text-[10px] text-slate-400 font-normal">this week</span></p>
                    </motion.div>

                    {/* Floating Card 2 */}
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute right-[5%] bottom-[20%] z-20 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60 text-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Growth</p>
                                <p className="text-slate-900 font-bold">+127% followers</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* The 3D Component */}
                    <div className="w-full h-[600px] md:h-[700px] relative cursor-grab active:cursor-grabbing">
                        <StudioScene />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </section>
    );
}
