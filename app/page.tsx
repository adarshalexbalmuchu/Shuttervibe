"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Component as EtherealBackground } from "@/components/ethereal-shadows-background";
import { ZoomParallax } from "@/components/zoom-parallax";
import { AnimatedText } from "@/components/animated-text";
import { GlassButton } from "@/components/glass-button";

const HeroToGalleryScene = dynamic(() => import("@/components/hero-to-gallery-scene"), {
  ssr: false,
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

      {/* Scroll wrapper: gives us enough scroll distance for the full transition */}
      <section id="scrollWrap" style={{ height: "220vh", position: "relative", zIndex: 1 }}>
        {/* Sticky stage with heroStage id for fade-out */}
        <div id="heroStage" style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
          <HeroToGalleryScene />
        </div>
      </section>

      {/* Zoom Parallax Gallery - Isolated scroll section */}
      <section style={{ position: "relative", zIndex: 2, background: "#000" }}>
        <ZoomParallax images={galleryImages} />
      </section>
    </div>
  );
}
