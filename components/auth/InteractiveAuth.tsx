"use client";

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PullCharacter } from './PullCharacter';
import { AuthPanel } from './AuthPanel';

export function InteractiveAuth({ initialMode = 'signin' }: { initialMode?: 'signin' | 'signup' }) {
    const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
    const [isSwitching, setIsSwitching] = useState(false);

    const handleToggle = (newMode: 'signin' | 'signup') => {
        if (newMode === mode || isSwitching) return;
        setIsSwitching(true);
        setTimeout(() => {
            setMode(newMode);
        }, 350);

        // Lock until tension/relaxation animation completes
        setTimeout(() => {
            setIsSwitching(false);
        }, 800);
    };

    return (
        <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center lg:justify-end min-h-[600px] h-[calc(100vh-200px)] px-6">

            {/* Character positioned absolutely on left */}
            {/* hidden on mobile interfaces to avoid overlap, active on md+ */}
            <div className="absolute left-[-10%] sm:left-[-5%] md:left-[5%] top-1/2 -translate-y-1/2 hidden md:block z-0 pointer-events-none">
                <PullCharacter isSwitching={isSwitching} />
            </div>

            {/* Central / Right glass container */}
            <div className="relative z-10 w-full flex justify-center lg:justify-end lg:pr-[10%] xl:pr-[5%]">
                <AnimatePresence mode="wait">
                    <AuthPanel key={mode} mode={mode} onToggle={handleToggle} />
                </AnimatePresence>
            </div>

        </div>
    );
}
