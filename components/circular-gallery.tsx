'use client';

import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';

// A simple utility for conditional class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
}

// Define the type for a single gallery item
export interface GalleryItem {
  common: string;
  binomial: string;
  photo: {
    url: string; 
    text: string;
    pos?: string;
    by: string;
  };
}

// Define the props for the CircularGallery component
interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
  /** Controls the speed of auto-rotation when not scrolling. */
  autoRotateSpeed?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 600, autoRotateSpeed = 0.02, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Responsive radius based on screen size
    const [deviceRadius, setDeviceRadius] = useState(radius);
    
    // Intersection Observer to pause animation when off-screen
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, []);
    
    useEffect(() => {
      const updateRadius = () => {
        const width = window.innerWidth;
        if (width < 640) {
          setDeviceRadius(radius * 0.45); // 45% for mobile
        } else if (width < 1024) {
          setDeviceRadius(radius * 0.65); // 65% for tablet
        } else {
          setDeviceRadius(radius * 0.85); // 85% for desktop
        }
      };
      
      updateRadius();
      window.addEventListener('resize', updateRadius);
      return () => window.removeEventListener('resize', updateRadius);
    }, [radius]);

    // Effect to handle scroll-based rotation
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        const scrollRotation = scrollProgress * 360;
        setRotation(scrollRotation);

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, []);

    // Effect for auto-rotation when not scrolling and visible
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling && isVisible) {
          setRotation(prev => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      if (isVisible) {
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      }

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isScrolling, autoRotateSpeed, isVisible]);

    const anglePerItem = 360 / items.length;
    
    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn("relative w-full h-full flex items-center justify-center", className)}
        style={{ perspective: '1500px' }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.3, 1 - (normalizedAngle / 180));

            // Use device-specific radius
            const xPos = Math.sin((itemAngle * Math.PI) / 180) * deviceRadius;
            const zPos = Math.cos((itemAngle * Math.PI) / 180) * deviceRadius;
            
            // Responsive card size - smaller for better performance
            const cardWidth = typeof window !== 'undefined' 
              ? (window.innerWidth < 640 ? 150 : window.innerWidth < 1024 ? 180 : 220)
              : 220;
            const cardHeight = typeof window !== 'undefined'
              ? (window.innerWidth < 640 ? 210 : window.innerWidth < 1024 ? 252 : 308)
              : 308;

            return (
              <div
                key={item.photo.url} 
                role="group"
                aria-label={item.common}
                className="absolute"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${deviceRadius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: `-${cardWidth / 2}px`,
                  marginTop: `-${cardHeight / 2}px`,
                  opacity: opacity,
                  transition: 'opacity 0.3s linear'
                }}
              >
                <div className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden group border border-white/10 bg-white/5 backdrop-blur-lg">
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                  />
                  <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold">{item.common}</h2>
                    <em className="text-xs sm:text-sm italic opacity-80">{item.binomial}</em>
                    <p className="text-[10px] sm:text-xs mt-2 opacity-70">Photo by: {item.photo.by}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
