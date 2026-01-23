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
        left-4 sm:left-8 md:left-16 lg:left-20
        top-[70px] sm:top-[90px] md:top-[120px] lg:top-[140px]
        right-4 sm:right-auto
        px-safe
      "
      style={{ 
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "min(520px, calc(100vw - 2rem))"
      }}
    >
      {/* Subtle backdrop glow */}
      <div 
        className="absolute -inset-6 sm:-inset-8 md:-inset-12 -z-10"
        style={{
          background: "radial-gradient(ellipse 500px 350px at 30% 40%, rgba(255,255,255,0.035), transparent 70%)",
          filter: "blur(40px)"
        }}
      />

      {/* Quote: Bold Sans-Serif with Serif italic accent for 'chaos' */}
      <h1
        data-hero-item
        className="
          text-white font-inter
          max-w-[620px]
          overflow-visible
        "
        style={{ 
          fontSize: "clamp(28px, 8vw, 82px)",
          fontWeight: 800,
          lineHeight: '1.15',
          letterSpacing: '-0.02em',
          textShadow: '0 2px 40px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)',
          paddingRight: '8px',
        }}
      >
        <span className="font-inter" style={{ fontWeight: 800 }}>
          I photograph silence inside{' '}
        </span>
        <span 
          className="font-playfair"
          style={{ 
            fontStyle: 'italic',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block',
            paddingRight: '4px',
          }}
        >
          chaos
        </span>
        <span className="font-inter" style={{ fontWeight: 800 }}>.</span>
      </h1>

      {/* Editorial navigation - vertical stack */}
      <nav 
        data-hero-item 
        className="mt-8 sm:mt-10 md:mt-12 flex flex-col gap-2 sm:gap-3 items-start"
      >
        <button
          className="
            pointer-events-auto 
            text-[11px] sm:text-[12px] tracking-[0.18em] sm:tracking-[0.24em] uppercase 
            text-white/60 hover:text-white/90 active:text-white
            transition-all duration-500
            relative
            group
            py-3 sm:py-2 md:py-1
            min-h-[48px] sm:min-h-[44px] md:min-h-0
            flex items-center
            px-1
          "
        >
          <span className="relative z-10">Portraits</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full group-active:w-full transition-all duration-500" />
        </button>
        <button
          className="
            pointer-events-auto 
            text-[11px] sm:text-[12px] tracking-[0.18em] sm:tracking-[0.24em] uppercase 
            text-white/60 hover:text-white/90 active:text-white
            transition-all duration-500
            relative
            group
            py-3 sm:py-2 md:py-1
            min-h-[48px] sm:min-h-[44px] md:min-h-0
            flex items-center
            px-1
          "
        >
          <span className="relative z-10">Street</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full group-active:w-full transition-all duration-500" />
        </button>
        <button
          className="
            pointer-events-auto 
            text-[11px] sm:text-[12px] tracking-[0.18em] sm:tracking-[0.24em] uppercase 
            text-white/60 hover:text-white/90 active:text-white
            transition-all duration-500
            relative
            group
            py-3 sm:py-2 md:py-1
            min-h-[48px] sm:min-h-[44px] md:min-h-0
            flex items-center
            px-1
          "
        >
          <span className="relative z-10">Nature</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full group-active:w-full transition-all duration-500" />
        </button>
      </nav>
    </div>
  );
}
