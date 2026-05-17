"use client";

import { useEffect, useRef, useState } from "react";

const AD_CLIENT = "ca-pub-9120376243585799";

type AdFormat = "auto" | "rectangle" | "horizontal" | "vertical";

const placeholderHeight: Record<AdFormat, number> = {
  horizontal: 100,
  rectangle: 280,
  vertical: 600,
  auto: 280,
};

function log(slot: string, msg: string, data?: unknown) {
  console.log(
    `%c[AdSense:${slot}]%c ${msg}`,
    "color:#2563eb;font-weight:600",
    "color:inherit",
    data ?? ""
  );
}

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
  const insRef = useRef<HTMLElement | null>(null);
  const [unfilled, setUnfilled] = useState(false);

  useEffect(() => {
    if (pushedRef.current || !containerRef.current) return;
    pushedRef.current = true;

    const container = containerRef.current;

    // ── Diagnostic 1: is adsbygoogle.js loaded? ──
    const adsbygoogleLoaded = typeof window.adsbygoogle !== "undefined";
    log(slot, `adsbygoogle.js loaded: ${adsbygoogleLoaded}`);

    // ── Create ins element programmatically ──
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.style.width = "100%";
    ins.setAttribute("data-ad-client", AD_CLIENT);
    ins.setAttribute("data-ad-slot", slot);
    ins.setAttribute("data-ad-format", format);
    ins.setAttribute("data-full-width-responsive", "true");
    container.appendChild(ins);
    insRef.current = ins;
    log(slot, `<ins> created and appended to DOM`, {
      client: AD_CLIENT,
      slot,
      format,
      parentWidth: container.offsetWidth,
    });

    // ── Diagnostic 2: push to adsbygoogle ──
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      log(slot, "adsbygoogle.push({}) called successfully");
    } catch (err) {
      log(slot, "ERROR: adsbygoogle.push({}) threw — likely adblocker", err);
      setUnfilled(true);
      return;
    }

    // ── Diagnostic 3: monitor what AdSense does ──
    const checkStatus = (stage: string) => {
      const status = ins.getAttribute("data-ad-status");
      const hasChild = !!ins.firstChild;
      const childTag = hasChild ? ins.firstChild?.nodeName : "none";
      const inlineHeight = ins.style.height;
      const inlineWidth = ins.style.width;
      log(slot, `[${stage}] status=${status || "unset"} firstChild=${childTag} height=${inlineHeight} width=${inlineWidth}`);
      return { status, hasChild };
    };

    // Check after 1.5s
    const t1 = setTimeout(() => checkStatus("1.5s"), 1500);
    // Check after 4s, collapse if still unfilled
    const t2 = setTimeout(() => {
      const { status, hasChild } = checkStatus("4s");
      if (status === "unfilled" || !hasChild) {
        log(slot, "→ collapsing — no ad filled");
        setUnfilled(true);
      } else if (status === "filled" || hasChild) {
        log(slot, "→ ad appears filled, keeping visible");
      } else {
        log(slot, `→ unknown state, status="${status}", hasChild=${hasChild}`);
        setUnfilled(true);
      }
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
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
