"use client";

import { useEffect } from "react";
import Image from "next/image";
import { GalleryImage } from "./gallery-grid";

interface LightboxProps {
  image: GalleryImage | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({ image, onClose, onNext, onPrev }: LightboxProps) {
  useEffect(() => {
    if (!image) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [image, onClose, onNext, onPrev]);

  if (!image) return null;

  return (
    <div
      className="lightbox-backdrop fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))"
      }}
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        style={{
          top: "max(1rem, env(safe-area-inset-top))",
          right: "max(1rem, env(safe-area-inset-right))"
        }}
        aria-label="Close"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 sm:left-6 z-10 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        style={{
          left: "max(1rem, env(safe-area-inset-left))"
        }}
        aria-label="Previous image"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 sm:right-6 z-10 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        style={{
          right: "max(1rem, env(safe-area-inset-right))"
        }}
        aria-label="Next image"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image Container */}
      <div
        className="lightbox-content relative max-w-6xl w-full h-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="relative w-full h-full"
          style={{ maxHeight: "calc(100dvh - 8rem)" }}
        >
          <Image
            src={image.url}
            alt={image.title}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Metadata */}
        <div className="lightbox-metadata mt-6 text-center">
          <h2 className="text-2xl text-white font-light mb-2">{image.title}</h2>
          <p className="text-gray-400 text-sm">
            {image.location} • {image.year}
          </p>
        </div>
      </div>
    </div>
  );
}
