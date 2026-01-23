"use client";

export function Vignette() {
  return (
    <div 
      className="fixed inset-0 z-[4] pointer-events-none"
      style={{
        opacity: 0.2,
        background: 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.7) 100%)'
      }}
    />
  );
}
