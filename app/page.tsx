"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Component as EtherealBackground } from "@/components/ethereal-shadows-background";
import { CircularGallery, GalleryItem } from "@/components/circular-gallery";

const HeroToGalleryScene = dynamic(() => import("@/components/hero-to-gallery-scene"), {
  ssr: false,
  loading: () => null,
});

const Footer = dynamic(() => import("@/components/footer"), {
  loading: () => null,
});

// Sample gallery items - replace with your actual photos
const galleryItems: GalleryItem[] = [
  {
    common: "Golden Hour",
    binomial: "Sunset Photography",
    photo: {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      text: "Mountain sunset",
      pos: "center",
      by: "Shuttervibe"
    }
  },
  {
    common: "Urban Life",
    binomial: "Street Photography",
    photo: {
      url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800",
      text: "City streets",
      pos: "center",
      by: "Shuttervibe"
    }
  },
  {
    common: "Nature's Canvas",
    binomial: "Landscape Photography",
    photo: {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      text: "Natural beauty",
      pos: "center",
      by: "Shuttervibe"
    }
  },
  {
    common: "Portrait",
    binomial: "Human Stories",
    photo: {
      url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800",
      text: "People",
      pos: "center",
      by: "Shuttervibe"
    }
  },
  {
    common: "Abstract",
    binomial: "Creative Vision",
    photo: {
      url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800",
      text: "Abstract art",
      pos: "center",
      by: "Shuttervibe"
    }
  },
  {
    common: "Architecture",
    binomial: "Built Environment",
    photo: {
      url: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800",
      text: "Buildings",
      pos: "center",
      by: "Shuttervibe"
    }
  },
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

      {/* Scroll wrapper: gives us enough scroll distance for the full transition */}
      <section id="scrollWrap" style={{ height: "220vh", position: "relative", zIndex: 1 }}>
        {/* Sticky stage */}
        <div style={{ position: "sticky", top: 0, height: "100vh" }}>
          <HeroToGalleryScene />
        </div>

        {/* Circular Gallery reveal layer (positioned on top of sticky stage) */}
        <div
          id="galleryPanel"
          className="w-full h-screen"
          style={{
            position: "absolute",
            top: "100vh",
            right: 0,
            opacity: 0,
            transform: "translateY(40px)",
          }}
        >
          <CircularGallery 
            items={galleryItems} 
            radius={400}
            autoRotateSpeed={0.01}
          />
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
