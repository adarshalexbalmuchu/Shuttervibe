"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function HeroMessage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll('.fade-in-item');
    
    // Start hidden with blur
    gsap.set(elements, { 
      opacity: 0, 
      filter: "blur(8px)",
      y: 10
    });

    // Cinematic fade in after intro completes (1.6s intro + 0.4s delay)
    const tl = gsap.timeline({ delay: 2.0 });
    
    elements.forEach((el, i) => {
      tl.to(el, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, i * 0.15); // stagger each line
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed top-24 left-6 z-40 pointer-events-none"
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        letterSpacing: '0.02em'
      }}
    >
      <div className="fade-in-item text-sm md:text-base text-gray-300 mb-4">
        Photographer • Visual Storyteller • India
      </div>
      
      <div className="fade-in-item text-xs md:text-sm text-gray-400 mb-2">
        Portraits • Street • Nature
      </div>
    </div>
  );
}
