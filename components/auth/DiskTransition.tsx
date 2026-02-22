"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface DiskTransitionProps {
    animState: 'initial' | 'spread' | 'cover';
}

export function DiskTransition({ animState }: DiskTransitionProps) {
    const diskVariants = {
        center: { x: "-50%", y: "-50%", scale: 1, opacity: 0.9 },
        spread: (custom: { x: string, y: string, scale: number }) => ({
            x: custom.x,
            y: custom.y,
            scale: custom.scale,
            opacity: 0.7,
        })
    };

    const transition = { duration: 0.9, ease: [0.22, 1, 0.36, 1] };
    const stateType = animState === 'initial' || animState === 'cover' ? 'center' : 'spread';

    // Disks spreading to edges. When centered, they all sit at 50% 50% overlaying the card.
    const disks = [
        { id: 1, size: 500, color: 'from-[#3B82F6] to-[#1e3a8a]', custom: { x: "-40vw", y: "-40vh", scale: 1.2 }, delay: 0 },
        { id: 2, size: 600, color: 'from-[#2563EB] to-[#172554]', custom: { x: "35vw", y: "30vh", scale: 1.5 }, delay: 0.1 },
        { id: 3, size: 450, color: 'from-[#3B82F6] to-[#1D4ED8]', custom: { x: "-30vw", y: "35vh", scale: 1.1 }, delay: 0.2 },
        { id: 4, size: 550, color: 'from-[#1D4ED8] to-[#1e3a8a]', custom: { x: "40vw", y: "-35vh", scale: 1.3 }, delay: 0.15 },
        { id: 5, size: 400, color: 'from-[#60A5FA] to-[#2563EB]', custom: { x: "0vw", y: "-45vh", scale: 1.4 }, delay: 0.05 },
    ];

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {disks.map((disk) => (
                <motion.div
                    key={disk.id}
                    custom={disk.custom}
                    variants={diskVariants}
                    initial="center"
                    animate={stateType}
                    transition={{
                        duration: 0.9,
                        ease: [0.22, 1, 0.36, 1] as const,
                        delay: animState === 'spread' ? disk.delay : 0.05 * disk.id
                    }}
                    style={{
                        width: disk.size,
                        height: disk.size,
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        willChange: 'transform, opacity',
                    }}
                    className={`rounded-full bg-[radial-gradient(circle_at_30%_30%,#60A5FA,#2563EB)] opacity-90 shadow-[0_0_40px_rgba(59,130,246,0.3)]`}
                />
            ))}
        </div>
    );
}
