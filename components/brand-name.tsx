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
        {/* Main brand name with elegant serif font */}
        <div 
          className="font-playfair font-bold"
          style={{
            fontSize: "clamp(24px, 3vw, 64px)",
            letterSpacing: '0.02em',
            marginBottom: 'clamp(2px, 0.3vw, 6px)',
            background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 20px rgba(255,255,255,0.1)',
          }}
        >
          Shuttervibe
        </div>
        
        {/* Decorative separator with fade animation */}
        <div 
          className="flex items-center gap-2 sm:gap-3"
          style={{
            opacity: isLoaded ? 0.7 : 0,
            transform: isLoaded ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        >
          <div 
            className="h-px bg-gradient-to-r from-white/40 to-transparent"
            style={{ width: 'clamp(20px, 2vw, 40px)' }}
          />
          <span 
            className="font-inter font-light text-white/60"
            style={{
              fontSize: "clamp(10px, 1vw, 16px)",
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            by
          </span>
          <div 
            className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
            style={{ width: 'clamp(30px, 3vw, 60px)' }}
          />
        </div>
        
        {/* Author name with modern sans-serif */}
        <div 
          className="font-inter font-light text-white/50"
          style={{
            fontSize: "clamp(11px, 1.2vw, 18px)",
            letterSpacing: '0.08em',
            marginTop: 'clamp(2px, 0.3vw, 6px)',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s, transform 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
          }}
        >
          Adarsh Alex Balmuchu
        </div>
      </div>
    </div>
  );
}
