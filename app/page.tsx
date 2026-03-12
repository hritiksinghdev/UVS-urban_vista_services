import { Hero } from "@/components/hero/Hero";
import { MotionSection } from "@/components/shared/MotionSection";
import { ValueProp } from "@/components/sections/ValueProp";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const services = [
    {
        title: "Social Media Marketing",
        description: "Data-driven Instagram & Facebook campaigns. We manage your entire social presence — from strategy to daily posting to follower growth.",
        tag: "Most Popular",
        tagColor: "bg-blue-100 text-blue-700",
        icon: "📱",
        image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800",
        href: "/services/social-media-marketing",
    },
    {
        title: "Google Business Optimization",
        description: "We visit your location, shoot professional photos & videos, then upload and optimize your Google listing to rank #1 locally.",
        tag: "Core Service",
        tagColor: "bg-orange-100 text-orange-700",
        icon: "📍",
        image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=800",
        href: "/services/photography-videography",
    },
    {
        title: "Photography & Videography",
        description: "Professional business shoots at your location. Menu photography, interior shots, team photos, and product videos that convert.",
        tag: "On-Ground",
        tagColor: "bg-purple-100 text-purple-700",
        icon: "📸",
        image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800",
        href: "/services/photography-videography",
    },
    {
        title: "Website Development",
        description: "Fast, modern websites built to rank on Google and convert visitors into paying customers. Mobile-first, always.",
        tag: "Growth",
        tagColor: "bg-indigo-100 text-indigo-700",
        icon: "💻",
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800",
        href: "/services/website-development",
    },
    {
        title: "Viral Content Campaigns",
        description: "Reels, shorts, and viral content strategy that puts your brand in front of thousands. Organic growth that compounds.",
        tag: "Trending",
        tagColor: "bg-rose-100 text-rose-700",
        icon: "🚀",
        image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&q=80&w=800",
        href: "/services/viral-campaigns",
    },
    {
        title: "Global Outreach",
        description: "Take your local brand international with multi-platform strategy, translations, and global ad campaigns.",
        tag: "Scale",
        tagColor: "bg-emerald-100 text-emerald-700",
        icon: "🌍",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
        href: "/services/global-outreach",
    },
]

const steps = [
    {
        number: "01",
        title: "We Visit You",
        description: "Our team comes to your business location. Restaurant, shop, clinic — wherever you are in Delhi NCR.",
        icon: "🏪",
        color: "bg-blue-50 border-blue-200"
    },
    {
        number: "02",
        title: "We Shoot & Create",
        description: "Professional photos, videos, reels. We capture your business in the best possible light.",
        icon: "📸",
        color: "bg-purple-50 border-purple-200"
    },
    {
        number: "03",
        title: "We Optimize & Upload",
        description: "Google Business Profile perfected. All images, descriptions, hours, and posts uploaded and optimized.",
        icon: "📍",
        color: "bg-orange-50 border-orange-200"
    },
    {
        number: "04",
        title: "You See Results",
        description: "More Google calls, more foot traffic, more Instagram followers. Track it all in your dashboard.",
        icon: "📈",
        color: "bg-emerald-50 border-emerald-200"
    },
]

const results = [
    { number: "500+", label: "Posts Created", icon: "✍️" },
    { number: "50+", label: "Businesses Served", icon: "🏪" },
    { number: "3x", label: "Avg. Google Ranking Improvement", icon: "📍" },
    { number: "10K+", label: "Followers Generated", icon: "👥" },
]

const testimonials = [
    {
        name: "Rajesh Kumar",
        business: "Kumar's Restaurant, Lajpat Nagar",
        text: "After UrbanVista optimized our Google listing and shot our menu photos, our calls increased by 3x within 2 months.",
        rating: 5,
        avatar: "RK"
    },
    {
        name: "Priya Sharma",
        business: "Priya Boutique, South Extension",
        text: "Our Instagram went from 200 to 5000 followers in 3 months. The reels they create are absolutely stunning.",
        rating: 5,
        avatar: "PS"
    },
    {
        name: "Amit Gupta",
        business: "Gupta Clinic, Saket",
        text: "Professional photos transformed how patients see our clinic. We now rank #1 on Google Maps for our area.",
        rating: 5,
        avatar: "AG"
    },
]

// Next.js allows external image domains; Unsplash is pre-allowed by most configs
export default function Home() {
  return (
    <div className="flex flex-col w-full bg-light">
      {/* HERO */}
      <Hero title="Local to Global" subtitle="Delhi's top digital marketing agency. We visit your business, shoot professional content, and grow your presence online." />

      {/* VALUE PROP */}
      <ValueProp />

      {/* SERVICES */}
      <section className="w-full py-24 md:py-32 bg-[#f8fafc]">
        <div className="container mx-auto px-6">
          <MotionSection>
            <div className="mb-16 text-center">
              <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">What We Do</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-3 mb-4">Our Services</h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">Everything your business needs to go from local to global.</p>
            </div>
          </MotionSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <MotionSection key={s.title} delay={i * 0.1}>
                <Link href={s.href} className="group block h-full">
                  <div className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                    <div className="relative h-48 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${s.tagColor}`}>{s.tag}</span>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-2xl mb-2">{s.icon}</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed flex-grow">{s.description}</p>
                      <div className="mt-4 flex items-center text-blue-600 text-sm font-medium gap-1 group-hover:gap-2 transition-all">
                        Learn more <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="w-full py-24 bg-white">
        <div className="container mx-auto px-6">
          <MotionSection>
            <div className="mb-16 text-center">
              <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">Our Process</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-3 mb-4">How We Work</h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">Four simple steps from first contact to real results.</p>
            </div>
          </MotionSection>
          <div className="grid md:grid-cols-4 gap-6 relative">
            {steps.map((step, i) => (
              <MotionSection key={step.number} delay={i * 0.15}>
                <div className={`rounded-2xl border-2 p-6 ${step.color} space-y-4 relative`}>
                  <div className="text-4xl">{step.icon}</div>
                  <div className="text-xs font-black text-slate-300 uppercase tracking-widest">{step.number}</div>
                  <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-slate-300 text-2xl">→</div>
                  )}
                </div>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS STATS */}
      <section className="w-full py-20 bg-[#0f172a]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {results.map((r) => (
              <div key={r.label} className="space-y-2">
                <div className="text-3xl">{r.icon}</div>
                <div className="text-4xl md:text-5xl font-black text-white">{r.number}</div>
                <div className="text-slate-400 text-sm font-medium">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="w-full py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6">
          <MotionSection>
            <div className="mb-16 text-center">
              <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">Client Stories</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-3 mb-4">What Our Clients Say</h2>
            </div>
          </MotionSection>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <MotionSection key={t.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">{t.avatar}</div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                      <p className="text-slate-400 text-xs">{t.business}</p>
                    </div>
                  </div>
                </div>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="w-full py-24 bg-gradient-to-br from-slate-900 to-blue-950">
        <div className="container mx-auto px-6 text-center">
          <MotionSection>
            <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">Ready to grow?</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
              Your business deserves to be seen.
            </h2>
            <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
              We come to you. No long contracts. Pay only if you love the results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth?mode=signup">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-500 transition-colors text-lg">
                  Start Free Today →
                </button>
              </Link>
              <Link href="/contact">
                <button className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors text-lg">
                  Talk to Us First
                </button>
              </Link>
            </div>
            <p className="text-slate-500 text-sm mt-6">
              No credit card required · Delhi NCR · Response within 2 hours
            </p>
          </MotionSection>
        </div>
      </section>
    </div>
  );
}