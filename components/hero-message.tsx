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
      gsap.set(items, { opacity: 0, y: 12, filter: "blur(10px)" });

      // Intro reveal after camera intro - simplified for faster INP
      gsap.timeline({ delay: 2.5 }).to(items, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
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
      className="
        absolute z-10 pointer-events-none
        left-[4%] sm:left-[8%] md:left-[12%] lg:left-[16%]
        top-[85px] sm:top-[115px] md:top-[150px] lg:top-[180px]
        right-4 sm:right-auto
        px-safe
      "
      style={{ 
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "min(580px, calc(100vw - 2rem))"
      }}
    >
      {/* Enhanced backdrop with soft gradient shadow for depth */}
      <div 
        className="absolute -inset-6 sm:-inset-10 md:-inset-14 lg:-inset-16 -z-10"
        style={{
          background: "radial-gradient(ellipse 600px 400px at 30% 40%, rgba(0,0,0,0.4), transparent 70%)",
          filter: "blur(50px)"
        }}
      />

      {/* Premium 3-line typography hierarchy */}
      <h1
        data-hero-item
        className="
          text-white
          max-w-[680px]
          overflow-visible
        "
        style={{ 
          textShadow: '0 4px 60px rgba(0,0,0,0.7), 0 12px 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* Line 1: "I photograph" - Regular, smaller, reduced opacity */}
        <div 
          className="font-inter"
          style={{ 
            fontSize: "clamp(16px, 5vw, 58px)",
            fontWeight: 400,
            lineHeight: '1.25',
            letterSpacing: '-0.01em',
            opacity: 0.88,
            marginBottom: 'clamp(2px, 0.8vw, 12px)',
          }}
        >
          I photograph
        </div>

        {/* Line 2: "silence inside" - Bold, primary emphasis, tight leading */}
        <div 
          className="font-inter"
          style={{ 
            fontSize: "clamp(24px, 7.5vw, 82px)",
            fontWeight: 700,
            lineHeight: '0.98',
            letterSpacing: '-0.025em',
            marginBottom: 'clamp(2px, 0.8vw, 12px)',
          }}
        >
          silence inside
        </div>

        {/* Line 3: "chaos." - Serif italic, larger, elegant */}
        <div 
          className="font-playfair"
          style={{ 
            fontSize: "clamp(28px, 8.5vw, 96px)",
            fontWeight: 700,
            fontStyle: 'italic',
            lineHeight: '1.1',
            letterSpacing: '0.03em',
            opacity: 0.92,
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block',
            paddingRight: '4px',
          }}
        >
          chaos.
        </div>
      </h1>

      {/* Curated category navigation - responsive layout */}
      <nav 
        data-hero-item 
        className="mt-5 sm:mt-6 md:mt-7 lg:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center"
      >
        <button
          className="
            pointer-events-auto 
            text-[13px] sm:text-[12px] md:text-[13px] lg:text-[14px] tracking-[0.20em] sm:tracking-[0.22em] uppercase 
            text-white/70 hover:text-white/95 active:text-white
            transition-all duration-500
            relative
            group
            py-2.5 sm:py-2 md:py-1
            min-h-[44px] sm:min-h-[40px] md:min-h-0
            flex items-center
            font-light
          "
        >
          <span className="relative z-10">Portraits</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 group-hover:w-full group-active:w-full transition-all duration-500" />
        </button>
        
        <span className="text-white/40 text-[10px] hidden sm:inline">·</span>
        
        <button
          className="
            pointer-events-auto 
            text-[13px] sm:text-[12px] md:text-[13px] lg:text-[14px] tracking-[0.20em] sm:tracking-[0.22em] uppercase 
            text-white/70 hover:text-white/95 active:text-white
            transition-all duration-500
            relative
            group
            py-2.5 sm:py-2 md:py-1
            min-h-[44px] sm:min-h-[40px] md:min-h-0
            flex items-center
            font-light
          "
        >
          <span className="relative z-10">Street</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 group-hover:w-full group-active:w-full transition-all duration-500" />
        </button>
        
        <span className="text-white/40 text-[10px] hidden sm:inline">·</span>
        
        <button
          className="
            pointer-events-auto 
            text-[13px] sm:text-[12px] md:text-[13px] lg:text-[14px] tracking-[0.20em] sm:tracking-[0.22em] uppercase 
            text-white/70 hover:text-white/95 active:text-white
            transition-all duration-500
            relative
            group
            py-2.5 sm:py-2 md:py-1
            min-h-[44px] sm:min-h-[40px] md:min-h-0
            flex items-center
            font-light
          "
        >
          <span className="relative z-10">Nature</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 group-hover:w-full group-active:w-full transition-all duration-500" />
        </button>
      </nav>
    </div>
  );
}
