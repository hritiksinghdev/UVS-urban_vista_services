"use client";

import { MotionSection } from "@/components/shared/MotionSection";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function GalleryPage() {
    const projects = [
        { id: 1, title: "Modern Architecture", category: "Photography", image: "/placeholder-1.jpg" }, // Replace with real images if available or use generic placeholders
        { id: 2, title: "Urban Lifestyle", category: "Social Media", image: "/placeholder-2.jpg" },
        { id: 3, title: "Tech Startup Launch", category: "Campaign", image: "/placeholder-3.jpg" },
        { id: 4, title: "Global Expansion", category: "Strategy", image: "/placeholder-4.jpg" },
        { id: 5, title: "Creative Studio", category: "Branding", image: "/placeholder-5.jpg" },
        { id: 6, title: "Event Coverage", category: "Videography", image: "/placeholder-6.jpg" },
    ];

    return (
        <div className="w-full bg-light min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-6">
                <MotionSection>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">Our Work</h1>
                        <p className="text-xl text-muted">A showcase of our finest projects and campaigns.</p>
                    </div>
                </MotionSection>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <MotionSection key={project.id} delay={index * 0.1}>
                            <Link href={`/portfolio/${project.id}`} className="group block">
                                <div className="relative aspect-[4/3] rounded-2xl bg-white/40 backdrop-blur-md overflow-hidden border border-white/30 shadow-sm transition-all duration-300 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:-translate-y-2">
                                    <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400">
                                        {/* Placeholder for image */}
                                        <span>{project.title} Image</span>
                                    </div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <span className="text-white/80 text-sm font-medium mb-1">{project.category}</span>
                                        <h3 className="text-white text-xl font-bold flex items-center gap-2">
                                            {project.title}
                                            <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0" />
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        </MotionSection>
                    ))}
                </div>
            </div>
        </div>
    );
}
