"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HeroMessage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const container = containerRef.current!;
      const items = container.querySelectorAll("[data-hero-item]");

      // Start hidden + blurred
      gsap.set(items, { opacity: 0, y: 20, filter: "blur(8px)" });

      // Intro reveal after camera intro
      gsap.timeline({ delay: 1.8 }).to(items, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.15,
      });

      // Fade out as we leave the hero
      gsap.to(container, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#scrollWrap",
          start: "65% top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 flex items-center"
      style={{
        paddingLeft: 'clamp(24px, 8vw, 120px)',
        paddingRight: 'clamp(24px, 4vw, 60px)',
      }}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* 2-column grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column: Hero text */}
          <div className="space-y-8 order-2 lg:order-1">
            <div data-hero-item className="space-y-6">
              {/* Main hero text with mixed typography */}
              <h1 
                className="font-inter font-bold leading-[1.1] tracking-tight"
                style={{ 
                  fontSize: 'clamp(40px, 6vw, 84px)',
                  textShadow: '0 4px 40px rgba(0,0,0,0.4)',
                }}
              >
                <span className="text-white/95 block mb-2">I photograph</span>
                <span className="text-white/95 block mb-2">silence inside</span>
                <span 
                  className="font-playfair italic font-normal text-white/90 inline-block"
                  style={{
                    textShadow: '0 4px 40px rgba(255,255,255,0.1)',
                  }}
                >
                  chaos.
                </span>
              </h1>
            </div>

            {/* Subtle divider line */}
            <div 
              data-hero-item 
              className="h-px bg-gradient-to-r from-white/20 via-white/40 to-transparent"
              style={{ width: 'clamp(100px, 40%, 300px)' }}
            />

            {/* Subtitle */}
            <p 
              data-hero-item
              className="font-inter font-light text-white/60 leading-relaxed tracking-wide"
              style={{ 
                fontSize: 'clamp(14px, 1.5vw, 18px)',
                letterSpacing: '0.05em',
                maxWidth: '500px',
              }}
            >
              Capturing the extraordinary moments that exist between heartbeats.
            </p>
          </div>

          {/* Right column: 3D Camera (empty here, handled by parent) */}
          <div className="order-1 lg:order-2" />
        </div>
      </div>
    </div>
  );
}
