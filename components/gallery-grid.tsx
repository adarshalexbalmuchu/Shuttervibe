"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  location: string;
  year: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
}

export function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '-100px' }
    );

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, [images]);

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      {images.map((image, index) => (
        <div
          key={image.id}
          ref={(el) => { itemsRef.current[index] = el; }}
          className="gallery-item group relative aspect-[3/4] sm:aspect-[4/5] cursor-pointer overflow-hidden rounded-md sm:rounded-lg"
          onClick={() => onImageClick(image)}
          style={{ 
            contentVisibility: 'auto',
            animationDelay: `${(index % 8) * 0.05}s`,
          }}
        >
          <Image
            src={image.url}
            alt={image.title}
            fill
            loading="lazy"
            quality={65}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Metadata Overlay on Hover */}
          <div className="gallery-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
            <div className="gallery-metadata">
              <h3 className="text-white text-xs sm:text-sm md:text-base font-medium mb-1">
                {image.title}
              </h3>
              <p className="text-gray-300 text-[10px] sm:text-xs">
                {image.location} • {image.year}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
