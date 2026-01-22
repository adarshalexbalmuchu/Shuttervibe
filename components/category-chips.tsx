"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const categories = [
  { id: "portraits", label: "Portraits" },
  { id: "street", label: "Street" },
  { id: "nature", label: "Nature" }
];

export function CategoryChips() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

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
      className="fixed top-56 left-6 z-40 flex gap-3"
      style={{ opacity: 0 }}
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.id)}
          className="group relative px-4 py-1.5 rounded-full border border-gray-600/40 bg-black/20 backdrop-blur-sm text-xs text-gray-400 hover:text-white hover:border-gray-400/60 transition-all duration-300 cursor-pointer"
        >
          <span className="relative z-10">{cat.label}</span>
          
          {/* Underline animation */}
          <span className="absolute bottom-1 left-4 right-4 h-px bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}>
          </span>
          
          {/* Glow effect */}
          <span className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
          
          <style jsx>{`
            button:hover span:nth-child(2) {
              animation: underlineSlide 0.4s ease-out forwards;
            }
            @keyframes underlineSlide {
              to {
                transform: scaleX(1);
              }
            }
          `}</style>
        </button>
      ))}
    </div>
  );
}
