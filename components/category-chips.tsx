"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const categories = [
  { id: "portraits", label: "Portraits" },
  { id: "street", label: "Street" },
  { id: "nature", label: "Nature" }
];

export function CategoryChips() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Fade in after hero text
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 10, filter: "blur(6px)" },
      { 
        opacity: 1, 
        y: 0,
        filter: "blur(0px)",
        duration: 0.8, 
        delay: 2.8,
        ease: "power2.out" 
      }
    );

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
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed top-[420px] md:top-[500px] left-6 md:left-12 z-10 flex flex-wrap gap-3"
      style={{ opacity: 0 }}
    >
      {categories.map((cat, index) => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.id)}
          className="group relative px-5 py-2 rounded-full border border-gray-700/50 bg-black/30 backdrop-blur-md text-xs md:text-sm text-gray-300 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-500 cursor-pointer overflow-hidden"
          style={{ 
            animationDelay: `${index * 0.1}s`,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: '300'
          }}
        >
          {/* Shimmer effect on hover */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <span className="relative z-10">{cat.label}</span>
          
          {/* Bottom border accent */}
          <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
          
          <style jsx>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </button>
      ))}
    </div>
  );
}
