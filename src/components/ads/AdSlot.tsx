"use client";

import { useEffect, useRef, useState } from "react";

const AD_CLIENT = "ca-pub-4888393944328810";

type AdFormat = "auto" | "rectangle" | "horizontal" | "vertical";

const placeholderHeight: Record<AdFormat, number> = {
  horizontal: 100,
  rectangle: 280,
  vertical: 600,
  auto: 280,
};

export default function AdSlot({
  slot,
  format = "auto",
  className = "",
}: {
  slot: string;
  format?: AdFormat;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);
  const [unfilled, setUnfilled] = useState(false);

  useEffect(() => {
    if (pushedRef.current || !containerRef.current) return;
    pushedRef.current = true;

    const container = containerRef.current;

    // Programmatic <ins> creation avoids React hydration conflicts:
    // adsbygoogle.js injects <iframe> into <ins> — if React SSR owns the
    // <ins> node, hydration may nuke the injected content on mismatch.
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.style.width = "100%";
    ins.setAttribute("data-ad-client", AD_CLIENT);
    ins.setAttribute("data-ad-slot", slot);
    ins.setAttribute("data-ad-format", format);
    ins.setAttribute("data-full-width-responsive", "true");
    container.appendChild(ins);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      setUnfilled(true);
      return;
    }

    // After 3s, check if ad filled. If not, collapse whitespace.
    const timer = setTimeout(() => {
      const status = ins.getAttribute("data-ad-status");
      if (status === "unfilled" || !ins.firstChild) {
        setUnfilled(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [slot, format]);

  return (
    <div className={`my-8 flex justify-center ${className}`}>
      <div className="w-full" style={{ maxWidth: 728 }}>
        <p className="text-center text-[10px] text-slate-300 uppercase tracking-wider mb-1 select-none">
          Advertisement
        </p>

        <div
          className={`relative w-full overflow-hidden rounded-lg transition-[min-height] duration-500 ease-in-out ${
            unfilled
              ? "bg-transparent border-0"
              : "border border-dashed border-slate-200 bg-slate-50/30"
          }`}
          style={{ minHeight: unfilled ? 0 : placeholderHeight[format] }}
        >
          <div ref={containerRef} />
        </div>
      </div>
    </div>
  );
}
