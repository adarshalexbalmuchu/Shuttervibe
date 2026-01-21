"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollIndicator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !dotRef.current) return;

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

    // Animate dot moving down the line
    const dotAnimation = gsap.to(dotRef.current, {
      y: 40,
      duration: 1.5,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true
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

    return () => {
      dotAnimation.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3 pointer-events-none"
      style={{ opacity: 0 }}
    >
      <div className="text-[10px] md:text-xs text-gray-400 tracking-widest uppercase">
        Scroll to shoot
      </div>
      
      <div className="relative w-[1px] h-16 bg-gradient-to-b from-gray-600 to-transparent">
        <div
          ref={dotRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-lg shadow-white/50"
        />
      </div>
    </div>
  );
}
