"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function BrandName() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const container = containerRef.current!;

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
        fixed top-10 md:top-12 left-6 md:left-12 lg:left-16
        z-50
        pointer-events-none
      "
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div
        className="
          whitespace-nowrap
          font-bold uppercase
          tracking-[0.14em]
          text-white/75
          text-[clamp(36px,5.25vw,72px)]
          leading-none
          max-w-[92vw] overflow-hidden text-ellipsis
        "
        style={{ 
          textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          fontWeight: 700
        }}
      >
        ADARSH ALEX BALMUCHU
      </div>
    </div>
  );
}
