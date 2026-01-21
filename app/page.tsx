"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Component as EtherealBackground } from "@/components/ethereal-shadows-background";
import { ZoomParallax } from "@/components/zoom-parallax";
import { AnimatedText } from "@/components/animated-text";

const HeroToGalleryScene = dynamic(() => import("@/components/hero-to-gallery-scene"), {
  ssr: false,
  loading: () => null,
});

const Footer = dynamic(() => import("@/components/footer"), {
  loading: () => null,
});

// Sample gallery images - replace with your actual photos (7 images recommended for best effect)
const galleryImages = [
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80", alt: "Mountain landscape" },
  { src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80", alt: "City skyline" },
  { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80", alt: "Nature scene" },
  { src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80", alt: "Portrait" },
  { src: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200&q=80", alt: "Abstract" },
  { src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200&q=80", alt: "Architecture" },
  { src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&q=80", alt: "Wildlife" },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Optional Lenis smooth scroll (recommended)
  useEffect(() => {
    if (!mounted) return;

    let lenis: any;
    let rafId: number;

    const initLenis = async () => {
      try {
        const { default: Lenis } = await import("@studio-freight/lenis");
        lenis = new Lenis({ 
          smoothWheel: true, 
          duration: 1.2, // Balanced for performance
          lerp: 0.1, // Optimized interpolation
          orientation: 'vertical' as const,
          gestureOrientation: 'vertical' as const,
          touchMultiplier: 2,
        });
        
        const raf = (time: number) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      } catch (error) {
        console.warn('Lenis not loaded:', error);
      }
    };

    initLenis();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy?.();
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div style={{ background: "#05060a", color: "white", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Loading Shuttervibe...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#000000", color: "white", position: "relative" }}>
      {/* Ethereal Shadows Background - Fixed behind everything */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <EtherealBackground
          animation={{
            scale: 50,
            speed: 50
          }}
          noise={{
            opacity: 0.3,
            scale: 1
          }}
        />
      </div>

      {/* Navigation Button - Fixed position */}
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        <a
          href="#about"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-all text-sm font-medium"
        >
          About
        </a>
        <a
          href="#contact"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-all text-sm font-medium"
        >
          Contact
        </a>
      </div>

      {/* Scroll wrapper: gives us enough scroll distance for the full transition */}
      <section id="scrollWrap" style={{ height: "220vh", position: "relative", zIndex: 1 }}>
        {/* Sticky stage */}
        <div style={{ position: "sticky", top: 0, height: "100vh" }}>
          <HeroToGalleryScene />
          
          {/* Brand Name - Centered on hero section */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="text-center">
              <AnimatedText 
                text="Adarsh Alex"
                gradientColors="linear-gradient(90deg, #fff, #888, #fff)"
                gradientAnimationDuration={3}
                hoverEffect={true}
                className="py-0"
                textClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight pointer-events-auto"
              />
              <AnimatedText 
                text="Balmuchu"
                gradientColors="linear-gradient(90deg, #fff, #888, #fff)"
                gradientAnimationDuration={3}
                hoverEffect={true}
                className="py-0 -mt-4"
                textClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight pointer-events-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Zoom Parallax Gallery - Isolated scroll section */}
      <section style={{ position: "relative", zIndex: 2, background: "#000" }}>
        <ZoomParallax images={galleryImages} />
      </section>

      {/* Spacer to ensure smooth transition */}
      <div style={{ height: "20vh", background: "#000" }} />

      {/* About section */}
      <section id="about" className="px-4 sm:px-8 md:px-12 lg:px-14 py-20 md:py-32 max-w-4xl mx-auto" style={{ background: "#000" }}>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6">About</h3>
        <p className="mt-4 opacity-75 leading-relaxed text-base md:text-lg">
          This is where your story, awards, and philosophy go. Keep it minimal and cinematic.
        </p>
      </section>

      {/* Contact/Footer section - Separate page-like section */}
      <section id="contact" className="min-h-screen flex items-center justify-center px-4">
        <Footer
          leftLinks={[
            { href: "#about", label: "About" },
            { href: "#", label: "Services" },
            { href: "#contact", label: "Contact" },
          ]}
          rightLinks={[
            { href: "#", label: "Privacy" },
            { href: "#", label: "Terms" },
            { href: "#", label: "Support" },
          ]}
          copyrightText="© 2026 Shuttervibe. All rights reserved."
        />
      </section>
    </div>
  );
}
