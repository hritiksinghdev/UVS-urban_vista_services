"use client";

import React, { useState, useEffect } from 'react';
import { DiskTransition } from '@/components/auth/DiskTransition';
import { AuthCard } from '@/components/auth/AuthCard';

export default function AuthPage() {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [animState, setAnimState] = useState<'initial' | 'spread' | 'cover'>('initial');

    useEffect(() => {
        // Initial load spread animation start
        const timer = setTimeout(() => {
            setAnimState('spread');
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleToggleMode = (newMode: 'signin' | 'signup') => {
        // Prevent double clicks or running during cover
        if (mode === newMode || animState === 'cover') return;

        // STEP 1: Disks animate inward, covering the form completely.
        // Form inside AuthCard fades out inherently due to AnimatePresence condition.
        setAnimState('cover');

        // STEP 2: After cover animation completes (matching 900ms DiskTransition duration)
        setTimeout(() => {
            // Form state switches internally (no route change)
            setMode(newMode);
            // Disks spread outward again. New form fades + scales into view.
            setAnimState('spread');
        }, 900);
    };

    return (
        <main className="min-h-screen w-full relative flex items-center justify-center font-sans pt-20 overflow-hidden">
            {/* Layer 2: Animated Solid Disks (No blur overlays) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <DiskTransition animState={animState} />
            </div>

            {/* Layer 3: Glassy Form Container (Top Layer) */}
            <div className="relative z-10 w-full px-4 flex justify-center">
                <AuthCard mode={mode} animState={animState} onToggle={handleToggleMode} />
            </div>
        </main>
    );
}
