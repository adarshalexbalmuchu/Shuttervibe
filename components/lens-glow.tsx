"use client";

import { useEffect, useRef } from "react";

export function LensGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Smooth follow with lerp
    let rafId: number;
    const animate = () => {
      if (!glowRef.current) return;

      // Lerp for smooth delayed follow
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.08;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.08;

      glowRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-30"
      style={{
        width: "400px",
        height: "400px",
        marginLeft: "-200px",
        marginTop: "-200px",
        background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)",
        mixBlendMode: "screen",
        opacity: 0.85,
        filter: "blur(40px)",
        willChange: "transform"
      }}
    />
  );
}
