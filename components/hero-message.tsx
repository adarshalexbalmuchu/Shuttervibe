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
        left-8 md:left-16 lg:left-20
        top-[120px] md:top-[140px] lg:top-[160px]
        w-[min(520px,calc(100vw-4rem))]
      "
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Subtle backdrop glow */}
      <div 
        className="absolute -inset-12 -z-10"
        style={{
          background: "radial-gradient(ellipse 500px 350px at 30% 40%, rgba(255,255,255,0.035), transparent 70%)",
          filter: "blur(40px)"
        }}
      />

      {/* Quote: enhanced typography, smaller but still impactful */}
      <h1
        data-hero-item
        className="
          text-white font-bold
          tracking-[-0.025em]
          leading-[0.94]
          text-[32px] sm:text-[38px]
          md:text-[46px]
          lg:text-[52px]
          xl:text-[58px]
          max-w-[480px]
        "
        style={{ 
          textShadow: "0 4px 24px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)",
          filter: "drop-shadow(0 0 16px rgba(255,255,255,0.025))"
        }}
      >
        I photograph silence
        <br />
        inside chaos.
      </h1>

      {/* Editorial navigation - vertical stack */}
      <nav 
        data-hero-item 
        className="mt-8 flex flex-col gap-2 items-start"
      >
        <button
          className="
            pointer-events-auto 
            text-[11px] tracking-[0.24em] uppercase 
            text-white/50 hover:text-white/90
            transition-all duration-500
            relative
            group
            py-1
          "
        >
          <span className="relative z-10">Portraits</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-500" />
        </button>
        <button
          className="
            pointer-events-auto 
            text-[11px] tracking-[0.24em] uppercase 
            text-white/50 hover:text-white/90
            transition-all duration-500
            relative
            group
            py-1
          "
        >
          <span className="relative z-10">Street</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-500" />
        </button>
        <button
          className="
            pointer-events-auto 
            text-[11px] tracking-[0.24em] uppercase 
            text-white/50 hover:text-white/90
            transition-all duration-500
            relative
            group
            py-1
          "
        >
          <span className="relative z-10">Nature</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-500" />
        </button>
      </nav>
    </div>
  );
}
