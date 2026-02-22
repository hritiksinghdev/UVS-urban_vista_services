import { Hero } from "@/components/hero/Hero";
import { MotionSection } from "@/components/shared/MotionSection";
import { ValueProp } from "@/components/sections/ValueProp";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const data = {
    title: "Transform Your Business",
    subtitle: "Futuristic digital solutions for your business.",
    portfolio: [
      { id: "1", title: "Project Alpha", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" },
      { id: "2", title: "Global Campaign", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" },
      { id: "3", title: "Brand Identity", imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800" },
      { id: "4", title: "Social Impact", imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800" },
    ]
  };

  return (
    <div className="flex flex-col w-full bg-light">
      {/* SECTION 1: HERO */}
      <Hero
        title={data.title}
        subtitle={data.subtitle}
      />

      {/* SECTION 2: ADVERTISING / VALUE PROP */}
      <ValueProp />

      {/* SECTION 3: SERVICES PREVIEW */}
      <section className="w-full py-24 md:py-32">
        <div className="container mx-auto px-6">
          <MotionSection>
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Expertise</h2>
              <p className="text-muted text-lg">Strategies designed to dominate your market.</p>
            </div>
          </MotionSection>

          <div className="grid md:grid-cols-2 gap-10">
            <MotionSection delay={0.2}>
              <Link href="/services" className="block h-full">
                <div className="rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 transition-all duration-300 hover:translate-y-[-6px] hover:shadow-[0_30px_70px_rgba(0,0,0,0.12)] h-full group cursor-pointer">
                  <div className="mb-6 w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-accent">
                    <span className="text-2xl">Create</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-primary group-hover:text-accent transition-colors">Marketing</h3>
                  <p className="text-muted mb-8 leading-relaxed">
                    Social Media Management, Campaign Images, and Expanding Business Reach from Local to Global.
                  </p>
                  <div className="h-48 bg-slate-100/50 rounded-lg overflow-hidden relative border border-slate-200/50">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">Marketing Visual</div>
                  </div>
                </div>
              </Link>
            </MotionSection>

            <MotionSection delay={0.4}>
              <Link href="/services" className="block h-full">
                <div className="rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 transition-all duration-300 hover:translate-y-[-6px] hover:shadow-[0_30px_70px_rgba(0,0,0,0.12)] h-full group cursor-pointer">
                  <div className="mb-6 w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center text-highlight">
                    <span className="text-2xl">Viral</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-primary group-hover:text-highlight transition-colors">Viral Campaigns</h3>
                  <p className="text-muted mb-8 leading-relaxed">
                    Best Photos & Visuals that spread like wildfire across social media, maximizing your organic reach.
                  </p>
                  <div className="h-48 bg-slate-100/50 rounded-lg overflow-hidden relative border border-slate-200/50">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">Campaign Visual</div>
                  </div>
                </div>
              </Link>
            </MotionSection>
          </div>
        </div>
      </section>

      {/* SECTION 4: PORTFOLIO PREVIEW */}
      <section className="w-full py-24 md:py-32 bg-slate-50/50">
        <div className="container mx-auto px-6">
          <MotionSection>
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-primary tracking-tight">
              <span className="text-accent">Masterpiece</span> Gallery
            </h2>
          </MotionSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.portfolio.map((item, i) => (
              <MotionSection key={item.id} delay={i * 0.1}>
                <Link href={`/portfolio/${item.id}`} className="block w-full h-full">
                  <div className="rounded-2xl bg-white/35 backdrop-blur-xl border border-white/25 shadow-[0_15px_40px_rgba(0,0,0,0.07)] p-6 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] aspect-square flex flex-col items-center justify-center overflow-hidden relative group">
                    <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                </Link>
              </MotionSection>
            ))}
          </div>

          <MotionSection delay={0.5}>
            <div className="text-center mt-12">
              <Link href="/work">
                <Button size="lg" variant="secondary" className="px-6 py-3 rounded-xl bg-white/50 backdrop-blur-md border border-white/40 shadow-md hover:scale-105 transition-all duration-300 min-w-[200px]">View All Work</Button>
              </Link>
            </div>
          </MotionSection>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="w-full py-24">
        <div className="container mx-auto px-6">
          <MotionSection>
            <div className="rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-12 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-8">Ready to Scale Your Brand?</h2>
              <p className="text-muted text-xl mb-10 max-w-2xl mx-auto">
                Join hundreds of businesses growing with UrbanVista.
              </p>
              <Link href="/contact">
                <Button size="lg" variant="primary" className="shadow-lg shadow-blue-500/20 group">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </MotionSection>
        </div>
      </section>
    </div>
  );
}