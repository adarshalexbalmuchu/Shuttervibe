"use client";

export function BrandName() {
  return (
    <div
      className="
        fixed top-6 left-6 md:left-12 lg:left-16
        z-50
        pointer-events-none
      "
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div
        className="
          whitespace-nowrap
          font-bold uppercase
          tracking-[0.08em]
          text-white/90
          text-[clamp(24px,3.5vw,48px)]
          leading-none
          max-w-[92vw] overflow-hidden text-ellipsis
        "
      >
        ADARSH ALEX BALMUCHU
      </div>
    </div>
  );
}
