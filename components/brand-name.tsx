"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function BrandName() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const container = containerRef.current!;

      // Fade out as we leave the hero section
      gsap.to(container, {
        opacity: 0,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#scrollWrap",
          start: "top top",
          end: "15% top",
          scrub: 0.5,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="
        fixed top-6 sm:top-8 md:top-10 lg:top-12 
        left-4 sm:left-6 md:left-12 lg:left-16
        z-50
        pointer-events-none
      "
      style={{
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity',
      }}
    >
      <div
        className="
          leading-none
          select-none
        "
      >
        {/* Main brand name with sophisticated wide-spaced serif */}
        <div 
          className="font-playfair font-normal"
          style={{
            fontSize: "clamp(28px, 3.5vw, 72px)",
            letterSpacing: '0.15em',
            fontWeight: 400,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.92)',
            textShadow: '0 2px 30px rgba(255,255,255,0.08)',
          }}
        >
          Shuttervibe
        </div>
      </div>
    </div>
  );
}
