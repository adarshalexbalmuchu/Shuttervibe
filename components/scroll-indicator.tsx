"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollIndicator() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Fade in after hero text appears
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: -20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        delay: 2.8,
        ease: "power2.out" 
      }
    );

    // Fade out when scroll starts
    ScrollTrigger.create({
      trigger: "#scrollWrap",
      start: "top top",
      end: "top -10",
      scrub: true,
      onUpdate: (self) => {
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 1 - self.progress * 3,
            duration: 0.3
          });
        }
      }
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-[6%] sm:bottom-[8%] md:bottom-[10%] lg:bottom-[12%] left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      style={{ 
        opacity: 0,
        paddingBottom: "max(16px, env(safe-area-inset-bottom))"
      }}
    >
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        <div className="text-[12px] sm:text-[11px] md:text-[12px] lg:text-[13px] text-white/75 tracking-[0.18em] sm:tracking-[0.20em] md:tracking-[0.22em] uppercase font-light">
          Scroll to shoot
        </div>
        {/* Subtle arrow indicator - only bounce on sm+ */}
        <svg 
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60 sm:animate-bounce" 
          style={{ animationDuration: '2s' }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}
