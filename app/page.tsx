"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Component as EtherealBackground } from "@/components/ethereal-shadows-background";
import { GlassButton } from "@/components/glass-button";
import { BrandName } from "@/components/brand-name";
import { HeroMessage } from "@/components/hero-message";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { LensGlow } from "@/components/lens-glow";
import { FilmGrain } from "@/components/film-grain";
import { Vignette } from "@/components/vignette";
import { FeaturedStoryStrip } from "@/components/featured-story-strip";
import { CategorizedGallery } from "@/components/categorized-gallery";
import { Footer } from "@/components/footer";

const HeroToGalleryScene = dynamic(() => import("@/components/hero-to-gallery-scene"), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lenis smooth scroll with proper ScrollTrigger sync
  useEffect(() => {
    if (!mounted) return;

    let lenis: any;

    const initLenis = async () => {
      try {
        const { default: Lenis } = await import("@studio-freight/lenis");
        const gsap = (await import("gsap")).default;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        
        lenis = new Lenis({ 
          smoothWheel: true, 
          duration: 1.0,  // Reduced from 1.2 for better performance
          lerp: 0.15,     // Increased from 0.1 for less recalculation
          orientation: 'vertical' as const,
          gestureOrientation: 'vertical' as const,
          touchMultiplier: 2,
          infinite: false,
        });
        
        // Sync Lenis with ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);
        
        // Use GSAP ticker for smoother integration
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        
        // Disable lag smoothing for better scroll sync
        gsap.ticker.lagSmoothing(0);
        
        // Refresh ScrollTrigger after init
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      } catch (error) {
        console.warn('Lenis not loaded:', error);
      }
    };

    initLenis();

    return () => {
      lenis?.destroy?.();
    };
  }, [mounted]);

  // Fade out brand name on scroll (optimized)
  useEffect(() => {
    if (!mounted) return;

    const initBrandFade = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      
      gsap.registerPlugin(ScrollTrigger);

      const brandName = document.getElementById('brandName');
      
      if (brandName) {
        // Use direct opacity change instead of nested gsap.to for better performance
        ScrollTrigger.create({
          trigger: "#scrollWrap",
          start: "bottom bottom",
          end: "bottom top",
          scrub: 0.5,
          onUpdate: (self) => {
            brandName.style.opacity = String(1 - self.progress);
          }
        });
      }

      // Kill ScrollTriggers on sections that aren't visible (performance optimization)
      ScrollTrigger.config({ limitCallbacks: true });
    };

    initBrandFade();
  }, [mounted]);

  if (!mounted) {
    return (
      <div style={{ background: "#05060a", color: "white", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Loading Shuttervibe...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0D0D0D", color: "white", position: "relative", overflowX: "hidden" }} className="grain-overlay">
      {/* Ethereal Shadows Background - Fixed behind everything */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }} className="contain-layout">
        <EtherealBackground
          animation={{
            scale: 20,  // Further reduced for better performance
            speed: 20   // Further reduced for smoother animation
          }}
          noise={{
            opacity: 0.2,  // Further reduced
            scale: 1
          }}
        />
      </div>

      {/* Film Grain Overlay */}
      <FilmGrain />

      {/* Vignette Overlay */}
      <Vignette />

      {/* Lens Glow - cursor following effect */}
      <LensGlow />

      {/* Contact Button - Pill-shaped ghost button top right */}
      <div className="fixed top-8 sm:top-10 md:top-12 right-6 sm:right-8 md:right-12 lg:right-16 z-50">
        <a 
          href="#contact"
          className="inline-block px-8 py-3 border border-white/20 hover:border-white/40 transition-all duration-300 font-inter font-light text-white/80 hover:text-white text-sm tracking-[0.15em] uppercase backdrop-blur-sm hover:bg-white/5"
          style={{
            borderRadius: '50px',
            letterSpacing: '0.15em',
          }}
        >
          Contact
        </a>
      </div>

      {/* Brand Name - Fixed position top left */}
      <BrandName />

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Scroll wrapper with pinned hero */}
      <section id="scrollWrap" style={{ height: "200vh", position: "relative" }}>
        <div id="heroStage" className="relative h-screen w-full">
          {/* 2-column layout: Text left, Camera right */}
          <HeroMessage />

          {/* Canvas positioned in right column */}
          <div className="absolute inset-0 z-20 pointer-events-none" style={{ willChange: 'transform' }}>
            <div className="h-full w-full flex items-center justify-end" style={{ paddingRight: 'clamp(24px, 8vw, 120px)' }}>
              <div className="w-full lg:w-1/2 h-full">
                <HeroToGalleryScene />
              </div>
            </div>
          </div>

          {/* Flash glow (soft bloom) */}
          <div
            id="flashGlow"
            style={{
              position: "absolute",
              inset: "-10%",
              background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.85), rgba(255,255,255,0) 60%)",
              opacity: 0,
              pointerEvents: "none",
              filter: "blur(18px)",
              zIndex: 49,
              transform: "scale(0.98)",
              willChange: 'opacity, transform',
            }}
          />

          {/* Flash overlay (hard flash) */}
          <div
            id="flashOverlay"
            className="absolute inset-0 z-50 pointer-events-none"
            style={{
              background: "white",
              opacity: 0,
              willChange: 'opacity',
            }}
          />
        </div>

        {/* Transition spacer */}
        <div style={{ height: "100vh", background: "#000" }} />
      </section>

      {/* Featured Story Strip */}
      <FeaturedStoryStrip />

      {/* Categorized Gallery */}
      <CategorizedGallery />

      {/* Footer */}
      <Footer />
    </div>
  );
}
