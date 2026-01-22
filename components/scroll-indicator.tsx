"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollIndicator() {
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Fade in after hero text appears
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: -10 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.5, 
        delay: 3.2,
        ease: "power2.out" 
      }
    );

    // Animated growing/shrinking line
    gsap.to(lineRef.current, {
      scaleY: 1.8,
      duration: 1.5,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });

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
      className="fixed bottom-12 sm:bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center gap-4"
      style={{ 
        opacity: 0,
      }}
    >
      {/* Scroll to Explore text */}
      <span 
        className="font-inter font-light text-white/40 tracking-[0.2em] uppercase"
        style={{ fontSize: '10px' }}
      >
        Scroll to Explore
      </span>
      
      {/* Thin animated vertical line */}
      <div
        ref={lineRef}
        className="w-px bg-white/30"
        style={{
          height: '40px',
          transformOrigin: 'top',
          boxShadow: '0 0 8px rgba(255,255,255,0.2)',
        }}
      />
    </div>
  );
}
