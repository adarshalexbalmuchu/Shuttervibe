"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Component as EtherealBackground } from "@/components/ethereal-shadows-background";
import { GlassButton } from "@/components/glass-button";
import { BrandName } from "@/components/brand-name";
import { HeroMessage } from "@/components/hero-message";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { FeaturedStoryStrip } from "@/components/featured-story-strip";
import { CategorizedGallery } from "@/components/categorized-gallery";
import { Footer } from "@/components/footer";

const HeroToGalleryScene = dynamic(() => import("@/components/hero-to-gallery-scene"), {
  ssr: false,
  loading: () => null,
});

// Defer non-critical components
const LensGlow = dynamic(() => import("@/components/lens-glow").then(m => ({ default: m.LensGlow })), {
  ssr: false,
});

const FilmGrain = dynamic(() => import("@/components/film-grain").then(m => ({ default: m.FilmGrain })), {
  ssr: false,
});

const Vignette = dynamic(() => import("@/components/vignette").then(m => ({ default: m.Vignette })), {
  ssr: false,
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // GSAP ScrollTrigger initialization
  useEffect(() => {
    if (!mounted) return;

    // Defer GSAP initialization significantly to not block LCP
    const timer = setTimeout(() => {
      initScrollTrigger();
    }, 2000);

    async function initScrollTrigger() {
      try {
        const gsap = (await import("gsap")).default;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        
        gsap.registerPlugin(ScrollTrigger);
        
        // Disable lag smoothing for better scroll sync
        gsap.ticker.lagSmoothing(0);
        
        // Refresh ScrollTrigger after init
        ScrollTrigger.refresh();
      } catch (error) {
        console.warn('GSAP not loaded:', error);
      }
    }

    return () => {
      clearTimeout(timer);
    };
  }, [mounted]);

  // Fade out brand name on scroll (deferred to reduce INP)
  useEffect(() => {
    if (!mounted) return;

    // Defer brand animation to after other critical work
    const timer = setTimeout(() => {
      initBrandFade();
    }, 2500);

    const initBrandFade = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      
      gsap.registerPlugin(ScrollTrigger);

      const brandName = document.getElementById('brandName');
      
      if (brandName) {
        // Fade out only when scrolling past hero section
        ScrollTrigger.create({
          trigger: "#scrollWrap",
          start: "80% top",  // Start fading when 80% scrolled through hero
          end: "bottom top",  // Complete fade when leaving viewport
          scrub: 0.5,
          onUpdate: (self) => {
            brandName.style.opacity = String(1 - self.progress);
          }
        });
      }

      // Kill ScrollTriggers on sections that aren't visible (performance optimization)
      ScrollTrigger.config({ limitCallbacks: true });
    };

    return () => clearTimeout(timer);
  }, [mounted]);

  if (!mounted) {
    return (
      <div style={{ background: "#05060a", color: "white", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Loading Shuttervibe...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#000000", color: "white", position: "relative", overflowX: "hidden" }}>
      {/* Ethereal Shadows Background - Fixed behind everything */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }} className="contain-layout">
        <EtherealBackground
          animation={{
            scale: 12,  // Further reduced for better performance
            speed: 15   // Further reduced for smoother animation
          }}
          noise={{
            opacity: 0.15,  // Further reduced
            scale: 1
          }}
        />
      </div>

      {/* Film Grain Overlay */}
      <FilmGrain />

      {/* Vignette Overlay */}
      <Vignette />

      {/* Lens Glow - cursor following effect - only on desktop */}
      {typeof window !== 'undefined' && !/mobile|tablet/i.test(navigator.userAgent) && <LensGlow />}

      {/* Navigation Button - Fixed position */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 pointer-events-auto">
        <a href="#contact" className="block touch-manipulation">
          <GlassButton size="sm">
            Contact
          </GlassButton>
        </a>
      </div>

      {/* Brand Name - Fixed position top left */}
      <BrandName />

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Scroll wrapper with pinned hero */}
      <section id="scrollWrap" style={{ height: "200vh", position: "relative" }}>
        <div id="heroStage" className="relative h-screen w-full">
          {/* Quote & chips behind the camera */}
          <HeroMessage />

          {/* Canvas above the text so the 3D model sits in front */}
          <div className="absolute inset-0 z-20 pointer-events-none" style={{ willChange: 'transform' }}>
            <HeroToGalleryScene />
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
