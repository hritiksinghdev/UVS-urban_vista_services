"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';

interface AuthFormProps {
    mode: 'signin' | 'signup';
    onToggle: (mode: 'signin' | 'signup') => void;
}

export function AuthForm({ mode, onToggle }: AuthFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isSignIn = mode === 'signin';
    const title = isSignIn ? "Welcome Back" : "Create Account";
    const subtitle = isSignIn
        ? "Access your dashboard and manage your services."
        : "Join UrbanVista and start growing your business.";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        <div className="relative z-10 w-full">
            <div className="text-center mb-8 relative z-10">
                <h1 className="text-2xl md:text-[28px] font-semibold text-[#E6EDF7] mb-2 tracking-wide font-sans">
                    {title}
                </h1>
                <p className="text-[rgba(255,255,255,0.6)] text-sm">
                    {subtitle}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                {!isSignIn && (
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[rgba(255,255,255,0.8)] ml-1">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="John Doe"
                                required
                                className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl pl-11 pr-4 py-3.5 text-[#E6EDF7] placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300"
                            />
                            <User className="w-5 h-5 text-[rgba(255,255,255,0.4)] absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[rgba(255,255,255,0.8)] ml-1">Email Address</label>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="you@example.com"
                            required
                            className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl pl-11 pr-4 py-3.5 text-[#E6EDF7] placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300"
                        />
                        <Mail className="w-5 h-5 text-[rgba(255,255,255,0.4)] absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[rgba(255,255,255,0.8)] ml-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            required
                            className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl pl-11 pr-12 py-3.5 text-[#E6EDF7] placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300"
                        />
                        <Lock className="w-5 h-5 text-[rgba(255,255,255,0.4)] absolute left-4 top-1/2 -translate-y-1/2" />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.4)] hover:text-white transition-colors p-1"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            <motion.div whileTap={{ scale: 0.8 }} transition={{ duration: 0.2 }}>
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </motion.div>
                        </button>
                    </div>
                </div>

                {!isSignIn && (
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[rgba(255,255,255,0.8)] ml-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl pl-11 pr-4 py-3.5 text-[#E6EDF7] placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300"
                            />
                            <Lock className="w-5 h-5 text-[rgba(255,255,255,0.4)] absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                )}

                {isSignIn && (
                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input type="checkbox" className="peer sr-only" />
                                <div className="w-4 h-4 rounded border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] peer-checked:bg-[#3B82F6] peer-checked:border-[#3B82F6] transition-colors" />
                                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <span className="text-sm text-[rgba(255,255,255,0.6)] group-hover:text-white transition-colors">Remember me</span>
                        </label>
                        <button type="button" className="text-sm text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
                            Forgot password?
                        </button>
                    </div>
                )}

                <motion.button
                    whileHover={{ scale: 1.01, filter: "brightness(1.1)", boxShadow: "0 0 20px rgba(59,130,246,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-medium py-3.5 mt-2 flex items-center justify-center transition-all disabled:opacity-70"
                >
                    {isLoading ? (
                        <motion.span
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="flex items-center gap-2"
                        >
                            <Loader2 className="w-5 h-5 animate-spin" /> {isSignIn ? "Verifying..." : "Creating Account..."}
                        </motion.span>
                    ) : (
                        isSignIn ? "Secure Sign In" : "Create Account"
                    )}
                </motion.button>

                <div className="text-center pt-4 text-sm text-[rgba(255,255,255,0.6)]">
                    {isSignIn ? (
                        <p>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => onToggle('signup')}
                                className="text-[#3B82F6] hover:text-[#60A5FA] font-medium transition-colors"
                            >
                                Sign up
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => onToggle('signin')}
                                className="text-[#3B82F6] hover:text-[#60A5FA] font-medium transition-colors"
                            >
                                Sign in
                            </button>
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}
