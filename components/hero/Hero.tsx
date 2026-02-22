"use client";

import { Canvas } from "@react-three/fiber";
import { StudioScene } from "./StudioScene";
import * as THREE from "three";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

interface HeroProps {
    title?: string;
    subtitle?: string;
}

export function Hero({ title, subtitle }: HeroProps) {
    return (
        <section
            className={`relative min-h-screen w-full overflow-hidden ${inter.className}`}
        >
            {/* Background Texture & Gradient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
                <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-white/80 to-transparent blur-3xl opacity-50" />
            </div>

            {/* SPLIT LAYOUT CONTAINER */}
            <div className="absolute inset-0 z-10 pointer-events-none flex items-center">

                {/* LEFT HALF: HERO CONTENT */}
                <div className="w-1/2 h-full flex items-center justify-start pl-24 pointer-events-auto">
                    <div className="flex flex-col items-start space-y-8 max-w-[620px]">
                        <div className="space-y-2">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-[800] tracking-[-0.02em] text-[#111] leading-[1.1]" dangerouslySetInnerHTML={{ __html: title || 'Local to <span class="text-[#2563eb]" style="text-shadow: 0 0 15px rgba(37, 99, 235, 0.5)">Global</span>' }} />
                            <p className="text-lg md:text-xl text-[#333] opacity-75 font-medium pt-4 max-w-md">
                                {subtitle || 'We Visit. We Click. We Show.'}
                                <br />
                                <span className="font-normal">
                                    Premium digital experiences for modern brands.
                                </span>
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/contact">
                                <button className="px-8 py-4 bg-[#2563eb] text-white font-semibold rounded-lg shadow-lg hover:bg-[#1e40af] transition-all transform hover:-translate-y-1">
                                    Get Started
                                </button>
                            </Link>
                            <Link href="/about">
                                <button className="px-8 py-4 bg-transparent border border-slate-300 text-[#111] font-semibold rounded-lg hover:border-[#2563eb] hover:text-[#2563eb] transition-all">
                                    Learn More
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* RIGHT HALF: 3D SCENE */}
                <div className="w-1/2 h-full flex items-center justify-center pr-24 pointer-events-auto">
                    <div className="w-full h-full max-w-[800px]">
                        <Canvas
                            camera={{ position: [0, 0, 4], fov: 45 }}
                            gl={{
                                alpha: true,
                                antialias: true,
                                powerPreference: "high-performance"
                            }}
                            style={{ background: "transparent" }}
                            dpr={[1, 2]}
                            flat
                        >
                            <StudioScene />
                        </Canvas>
                    </div>
                </div>

            </div>
        </section>
    );
}
