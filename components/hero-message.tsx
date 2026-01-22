"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HeroMessage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

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

    // Fade out when scrolling past hero section
    ScrollTrigger.create({
      trigger: "#scrollWrap",
      start: "bottom bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 1 - self.progress,
            duration: 0.1
          });
        }
      }
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed top-24 left-6 md:left-8 z-40 pointer-events-none max-w-xl"
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        letterSpacing: '0.02em'
      }}
    >
      <div className="fade-in-item text-xs md:text-sm text-gray-400 mb-3 tracking-[0.15em] uppercase">
        Photographer • Visual Storyteller • India
      </div>
      
      {/* Poetic narrative line - larger and more prominent */}
      <div className="fade-in-item text-xl md:text-3xl lg:text-4xl text-white mb-6 font-light leading-tight" 
           style={{ letterSpacing: '0.01em', lineHeight: '1.3' }}>
        I photograph silence<br/>inside chaos.
      </div>
    </div>
  );
}
