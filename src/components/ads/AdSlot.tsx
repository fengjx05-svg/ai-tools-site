"use client";

import { useEffect, useRef } from "react";

const AD_CLIENT = "ca-pub-4888393944328810";

const formatMap = {
  auto: "auto",
  rectangle: "rectangle",
  horizontal: "horizontal",
  vertical: "vertical",
} as const;

type AdFormat = keyof typeof formatMap;

export default function AdSlot({
  slot,
  format = "auto",
  className = "",
}: {
  slot: string;
  format?: AdFormat;
  className?: string;
}) {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    pushedRef.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adblock or network issue — silently ignore
    }
  }, []);

  return (
    <div className={`my-8 flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", maxWidth: 728 }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={formatMap[format]}
        data-full-width-responsive="true"
      />
    </div>
  );
}
