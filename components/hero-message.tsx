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

      // Intro reveal after camera intro
      gsap.timeline({ delay: 1.7 }).to(items, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.12,
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
        top-[90px] sm:top-[110px] md:top-[140px] lg:top-[160px]
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
        className="absolute -inset-8 sm:-inset-12 -z-10"
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
          fontSize: "clamp(36px, 7vw, 82px)",
          fontWeight: 800,
          lineHeight: '1.1',
          letterSpacing: '-0.03em',
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
        className="mt-6 sm:mt-8 flex flex-col gap-1 sm:gap-2 items-start"
      >
        <button
          className="
            pointer-events-auto 
            text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.24em] uppercase 
            text-white/50 hover:text-white/90
            transition-all duration-500
            relative
            group
            py-2 sm:py-1
            min-h-[44px] sm:min-h-0
            flex items-center
          "
        >
          <span className="relative z-10">Portraits</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-500" />
        </button>
        <button
          className="
            pointer-events-auto 
            text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.24em] uppercase 
            text-white/50 hover:text-white/90
            transition-all duration-500
            relative
            group
            py-2 sm:py-1
            min-h-[44px] sm:min-h-0
            flex items-center
          "
        >
          <span className="relative z-10">Street</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-500" />
        </button>
        <button
          className="
            pointer-events-auto 
            text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.24em] uppercase 
            text-white/50 hover:text-white/90
            transition-all duration-500
            relative
            group
            py-2 sm:py-1
            min-h-[44px] sm:min-h-0
            flex items-center
          "
        >
          <span className="relative z-10">Nature</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-500" />
        </button>
      </nav>
    </div>
  );
}
