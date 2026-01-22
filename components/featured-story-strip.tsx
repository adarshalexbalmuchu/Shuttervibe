"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

export function FeaturedStoryStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const elements = sectionRef.current.querySelectorAll('.animate-item');

    gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 40
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-16"
      style={{ background: "#000" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Left: Large Image */}
          <div className="animate-item relative h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] rounded-lg overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80"
              alt="Featured Story"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Right: Content */}
          <div className="space-y-4 sm:space-y-6">
            <div className="animate-item">
              <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-2">Featured Story</p>
              <h2 
                className="text-white font-light mb-4"
                style={{ fontSize: "clamp(32px, 5vw, 60px)", lineHeight: 1.1 }}
              >
                Echoes of Mumbai
              </h2>
            </div>

            <div className="animate-item">
              <p className="text-sm text-gray-400 mb-1">Mumbai, India • 2024</p>
            </div>

            <div className="animate-item">
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-2">
                A visual journey through the heart of India's most vibrant metropolis, 
                capturing the intimate moments that exist within the chaos.
              </p>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                From sunrise commutes to midnight street vendors, this series reveals 
                the silent poetry of everyday life.
              </p>
            </div>

            <div className="animate-item">
              <button className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 mt-4 border border-gray-600/50 rounded-full text-sm sm:text-base text-white hover:bg-white/5 hover:border-gray-400/70 transition-all duration-300 min-h-[44px]">
                <span>View story</span>
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
