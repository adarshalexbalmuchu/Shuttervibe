'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Image {
  src: string;
  alt?: string;
}

interface CinematicGalleryProps {
  images: Image[];
}

export function CinematicGallery({ images }: CinematicGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted || !containerRef.current) return;

    const container = containerRef.current;
    const imageElements = container.querySelectorAll('.gallery-image');

    // Create a scoped GSAP context
    const ctx = gsap.context(() => {
      // Create a master timeline driven by scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: false,
        },
      });

      // Calculate timing for each image
      const totalImages = imageElements.length;
      const durationPerImage = 1 / totalImages;
      const overlapFactor = 0.3; // Images overlap in their animation

      imageElements.forEach((img, index) => {
        const startTime = index * durationPerImage * (1 - overlapFactor);
        const fadeInDuration = durationPerImage * 0.4;
        const holdDuration = durationPerImage * 0.3;
        const fadeOutDuration = durationPerImage * 0.3;

        // Alternate X-axis drift direction for depth
        const xDrift = index % 2 === 0 ? 40 : -40;

        // Set initial state
        gsap.set(img, {
          opacity: 0,
          scale: 0.85,
          x: -xDrift * 0.3,
        });

        // Fade in + zoom in + drift
        tl.to(
          img,
          {
            opacity: 1,
            scale: 1,
            x: 0,
            ease: 'power2.out',
            duration: fadeInDuration,
          },
          startTime
        );

        // Hold (breathe effect with subtle scale pulse)
        tl.to(
          img,
          {
            scale: 1.02,
            ease: 'sine.inOut',
            duration: holdDuration,
          },
          startTime + fadeInDuration
        );

        // Fade out + zoom out + drift opposite direction
        tl.to(
          img,
          {
            opacity: 0,
            scale: 0.9,
            x: xDrift * 0.5,
            ease: 'power2.in',
            duration: fadeOutDuration,
          },
          startTime + fadeInDuration + holdDuration
        );
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [mounted, images.length]);

  if (!mounted) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: `${images.length * 100}vh` }}>
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen overflow-visible bg-black flex items-center justify-center">
        {/* All images positioned at same anchor point */}
        <div className="relative w-full h-full flex items-center justify-center">
          {images.map((image, index) => (
            <div
              key={index}
              className="gallery-image absolute"
              style={{
                // All images share the same center anchor point
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'min(90vw, 800px)',
                height: 'min(60vh, 600px)',
              }}
            >
              <img
                src={image.src}
                alt={image.alt || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover rounded-xl shadow-2xl"
                loading="lazy"
                style={{
                  willChange: 'transform, opacity',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
