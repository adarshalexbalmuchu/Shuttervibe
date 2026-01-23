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

  // Scroll fade is now handled in page.tsx to avoid conflicts

  return (
    <div
      ref={containerRef}
      id="brandName"
      className="
        fixed top-4 sm:top-6 md:top-8 lg:top-10 
        left-4 sm:left-6 md:left-10 lg:left-14
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
        {/* Main brand name with elegant high-contrast serif font */}
        <div 
          className="font-playfair font-bold"
          style={{
            fontSize: "clamp(24px, 6vw, 110px)",
            letterSpacing: '0.08em',
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 50%, #e8e8e8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 4px 24px rgba(255,255,255,0.15)',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          Shuttervibe
        </div>
      </div>
    </div>
  );
}
