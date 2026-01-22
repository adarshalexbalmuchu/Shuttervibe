"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Component as EtherealBackground } from "@/components/ethereal-shadows-background";
import { AnimatedText } from "@/components/animated-text";
import { GlassButton } from "@/components/glass-button";
import { HeroMessage } from "@/components/hero-message";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { LensGlow } from "@/components/lens-glow";
import { CategoryChips } from "@/components/category-chips";
import { FilmGrain } from "@/components/film-grain";
import { Vignette } from "@/components/vignette";
import { FeaturedStoryStrip } from "@/components/featured-story-strip";
import { CategorizedGallery } from "@/components/categorized-gallery";
import FeaturedProjects from "@/components/featured-projects";

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
          duration: 1.2,
          lerp: 0.1,
          orientation: 'vertical' as const,
          gestureOrientation: 'vertical' as const,
          touchMultiplier: 2,
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

      {/* Film Grain Overlay */}
      <FilmGrain />

      {/* Vignette Overlay */}
      <Vignette />

      {/* Lens Glow - cursor following effect */}
      <LensGlow />

      {/* Navigation Button - Fixed position */}
      <div className="fixed top-6 right-6 z-50">
        <a href="#contact">
          <GlassButton size="sm">
            Contact
          </GlassButton>
        </a>
      </div>

      {/* Brand Name - Fixed position top left */}
      <div className="fixed top-6 left-6 z-50 flex items-center">
        <AnimatedText 
          text="ADARSH ALEX BALMUCHU"
          gradientColors="linear-gradient(90deg, #fff, #888, #fff)"
          gradientAnimationDuration={3}
          hoverEffect={true}
          className="!py-0 !my-0"
          textClassName="!text-xl sm:!text-2xl md:!text-3xl lg:!text-4xl !font-bold !uppercase !leading-none"
        />
      </div>

      {/* Hero Message - positioning statement with poetic line */}
      <HeroMessage />

      {/* Category Chips */}
      <CategoryChips />

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Scroll wrapper with pinned hero */}
      <section id="scrollWrap" style={{ height: "200vh", position: "relative" }}>
        <div id="heroStage" style={{ height: "100vh", width: "100%", position: "relative" }}>
          <HeroToGalleryScene />

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
            }}
          />

          {/* Flash overlay (hard flash) */}
          <div
            id="flashOverlay"
            style={{
              position: "absolute",
              inset: 0,
              background: "white",
              opacity: 0,
              pointerEvents: "none",
              zIndex: 50,
            }}
          />
        </div>

        {/* Transition spacer */}
        <div style={{ height: "100vh", background: "#000" }} />
      </section>

      {/* Featured Story Strip */}
      <FeaturedStoryStrip />

      {/* Featured Projects Section (3D Carousel) */}
      <FeaturedProjects />

      {/* Categorized Gallery */}
      <CategorizedGallery />
    </div>
  );
}
