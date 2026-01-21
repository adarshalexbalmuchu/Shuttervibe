"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Component as EtherealBackground } from "@/components/ethereal-shadows-background";

const HeroToGalleryScene = dynamic(() => import("@/components/hero-to-gallery-scene"), {
  ssr: false,
  loading: () => null,
});

const Footer = dynamic(() => import("@/components/footer"), {
  loading: () => null,
});

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

      {/* Scroll wrapper: gives us enough scroll distance for the full transition */}
      <section id="scrollWrap" style={{ height: "220vh", position: "relative", zIndex: 1 }}>
        {/* Sticky stage */}
        <div style={{ position: "sticky", top: 0, height: "100vh" }}>
          <HeroToGalleryScene />
        </div>

        {/* Gallery reveal layer (positioned on top of sticky stage) */}
        <div
          id="galleryPanel"
          className="w-full sm:w-11/12 md:w-3/5 lg:w-[56%] px-4 sm:px-6 md:px-8 lg:px-14 py-6 md:py-10 lg:py-12"
          style={{
            position: "absolute",
            top: "105vh",
            right: 0,
            minHeight: "90vh",
            opacity: 0,
            transform: "translateY(40px)",
          }}
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 md:mb-6">Gallery</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl overflow-hidden h-40 sm:h-44 md:h-48 lg:h-52 transition-transform hover:scale-105 cursor-pointer"
              >
                {/* Replace with your real thumbnails */}
                <div className="h-full grid place-items-center opacity-80 text-sm md:text-base">
                  Photo {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="px-4 sm:px-8 md:px-12 lg:px-14 py-12 md:py-16 lg:py-20 max-w-6xl mx-auto">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold">About</h3>
        <p className="mt-3 md:mt-4 opacity-75 leading-relaxed text-sm md:text-base">
          This is where your story, awards, and philosophy go. Keep it minimal and cinematic.
        </p>
      </section>

      {/* Footer */}
      <Footer
        leftLinks={[
          { href: "#", label: "About" },
          { href: "#", label: "Services" },
          { href: "#", label: "Contact" },
        ]}
        rightLinks={[
          { href: "#", label: "Privacy" },
          { href: "#", label: "Terms" },
          { href: "#", label: "Support" },
        ]}
        copyrightText="© 2026 Shuttervibe. All rights reserved."
      />
    </div>
  );
}
