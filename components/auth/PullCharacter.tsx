"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function PullCharacter({ isSwitching }: { isSwitching: boolean }) {
    return (
        <motion.div
            initial={false}
            animate={{
                x: isSwitching ? 40 : 0,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-[280px] md:w-[350px] h-[400px] relative pointer-events-none"
        >
            <svg viewBox="0 0 300 400" className="w-full h-full overflow-visible">
                {/* Glowing Rope - Extends far right to attach cleanly behind panel */}
                <motion.line
                    x1="180" y1="180"
                    x2="2000" y2="180"
                    stroke="#3B82F6"
                    initial={false}
                    animate={{
                        x1: isSwitching ? 210 : 175,
                        y1: isSwitching ? 190 : 175,
                        strokeWidth: isSwitching ? 1.5 : 3,
                    }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ filter: "drop-shadow(0 0 6px rgba(59,130,246,0.8))" }}
                />

                {/* Minimal Character Silhouette */}
                <motion.g
                    initial={{ rotate: -12 }} // Start pulling position layout
                    style={{ transformOrigin: "150px 380px" }}
                    animate={{ rotate: isSwitching ? 3 : -12 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Back Leg */}
                    <path d="M 125 240 L 90 380 L 125 380 L 150 240 Z" fill="#0F172A" />
                    {/* Front Leg */}
                    <path d="M 160 240 L 180 380 L 215 380 L 180 240 Z" fill="#1E293B" />

                    {/* Torso */}
                    <path d="M 115 130 Q 150 100 180 130 Q 195 190 185 240 Q 150 250 120 240 Q 105 180 115 130 Z" fill="#1E293B" />

                    {/* Head/Hoodie Style */}
                    <path d="M 120 100 C 120 50, 180 50, 180 100 C 185 130, 150 140, 120 100 Z" fill="#1E293B" />

                    {/* Back Arm */}
                    <path d="M 130 140 Q 110 170 130 200" fill="none" stroke="#0F172A" strokeWidth="16" strokeLinecap="round" />

                    {/* Front Arm (Pulling constraint) */}
                    <motion.path
                        fill="none" stroke="#2B394A" strokeWidth="18" strokeLinecap="round"
                        initial={false}
                        animate={{
                            d: isSwitching
                                ? "M 160 140 Q 190 170 210 190" // Relaxed Slack
                                : "M 160 140 Q 170 170 175 175"  // Tense Pulling
                        }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />

                    {/* Brand Blue Rim Light to accent the edge of character silhouette */}
                    <path d="M 175 65 A 30 30 0 0 1 180 100" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 5px rgba(59,130,246,0.6))" }} />
                    <path d="M 183 140 Q 195 180 186 220" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 5px rgba(59,130,246,0.6))" }} />
                </motion.g>
            </svg>
        </motion.div>
    );
}
