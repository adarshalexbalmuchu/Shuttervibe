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
    // IMPORTANT: keep z lower than Canvas wrapper (Canvas should be z-20)
    <div
      ref={containerRef}
      className="
        absolute z-10 pointer-events-none
        left-6 md:left-12 lg:left-16
        top-[22vh] md:top-[24vh] lg:top-[26vh]
        w-[min(560px,calc(100vw-3rem))]
      "
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Quote: controlled size, controlled line breaks */}
      <h1
        data-hero-item
        className="
          mt-5 text-white/95 font-semibold
          tracking-[-0.02em]
          leading-[0.98]
          text-[34px] sm:text-[40px]
          md:text-[52px]
          lg:text-[60px]
          xl:text-[66px]
        "
        style={{ textShadow: "0 12px 40px rgba(0,0,0,0.45)" }}
      >
        I photograph silence
        <br />
        inside chaos.
      </h1>

      {/* Chips: aligned and not too low */}
      <div data-hero-item className="mt-7 flex flex-wrap gap-3">
        <button
          className="pointer-events-auto rounded-full border border-white/14 bg-white/0
                     px-4 py-2 text-[11px] tracking-[0.18em] uppercase text-white/70
                     hover:border-white/28 hover:text-white/90 transition"
        >
          Portraits
        </button>
        <button
          className="pointer-events-auto rounded-full border border-white/14 bg-white/0
                     px-4 py-2 text-[11px] tracking-[0.18em] uppercase text-white/70
                     hover:border-white/28 hover:text-white/90 transition"
        >
          Street
        </button>
        <button
          className="pointer-events-auto rounded-full border border-white/14 bg-white/0
                     px-4 py-2 text-[11px] tracking-[0.18em] uppercase text-white/70
                     hover:border-white/28 hover:text-white/90 transition"
        >
          Nature
        </button>
      </div>
    </div>
  );
}
