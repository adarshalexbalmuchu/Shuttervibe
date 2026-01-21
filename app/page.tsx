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
          style={{
            position: "absolute",
            top: "105vh",
            right: 0,
            width: "56%",
            minHeight: "90vh",
            padding: "48px 56px",
            opacity: 0,
            transform: "translateY(40px)",
          }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 18 }}>Gallery</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 18 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 16,
                  height: 180,
                  overflow: "hidden",
                }}
              >
                {/* Replace with your real thumbnails */}
                <div style={{ height: "100%", display: "grid", placeItems: "center", opacity: 0.8 }}>
                  Photo {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About section */}
      <section style={{ padding: "80px 56px", maxWidth: 1100 }}>
        <h3 style={{ fontSize: 28, fontWeight: 600 }}>About</h3>
        <p style={{ marginTop: 10, opacity: 0.75, lineHeight: 1.7 }}>
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
