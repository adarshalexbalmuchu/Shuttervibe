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
      className="fixed bottom-8 sm:bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      style={{ 
        opacity: 0,
        paddingBottom: "env(safe-area-inset-bottom)"
      }}
    >
      <div className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">
        Scroll to shoot
      </div>
    </div>
  );
}
