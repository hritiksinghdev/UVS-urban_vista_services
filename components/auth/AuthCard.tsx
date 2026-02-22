"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthForm } from './AuthForm';

interface AuthCardProps {
    mode: 'signin' | 'signup';
    animState: 'initial' | 'spread' | 'cover';
    onToggle: (mode: 'signin' | 'signup') => void;
}

export function AuthCard({ mode, animState, onToggle }: AuthCardProps) {
    const isVisible = animState === 'spread';

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    key={mode} // Re-animate form completely if mode changes, handled safely by wrapper wait 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-[420px] p-7 md:p-10 rounded-[24px] bg-[rgba(15,23,42,0.65)] backdrop-blur-xl border border-[rgba(96,165,250,0.25)] shadow-[0_20px_50px_rgba(59,130,246,0.15)] relative overflow-hidden group z-20"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
                    <AuthForm mode={mode} onToggle={onToggle} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
