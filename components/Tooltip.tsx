"use client";
import { useState, useRef, useEffect } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ text, children, position = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !wrapperRef.current || !tooltipRef.current) return;
    const wr = wrapperRef.current.getBoundingClientRect();
    const tr = tooltipRef.current.getBoundingClientRect();
    const GAP = 8;

    let top = 0;
    let left = 0;

    if (position === "top") {
      top = wr.top - tr.height - GAP;
      left = wr.left + wr.width / 2 - tr.width / 2;
    } else if (position === "bottom") {
      top = wr.bottom + GAP;
      left = wr.left + wr.width / 2 - tr.width / 2;
    } else if (position === "left") {
      top = wr.top + wr.height / 2 - tr.height / 2;
      left = wr.left - tr.width - GAP;
    } else {
      top = wr.top + wr.height / 2 - tr.height / 2;
      left = wr.right + GAP;
    }

    // Keep inside viewport
    left = Math.max(8, Math.min(left, window.innerWidth - tr.width - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - tr.height - 8));

    setCoords({ top, left });
  }, [visible, position]);

  return (
    <>
      <span
        ref={wrapperRef}
        className="inline-flex items-center gap-1 cursor-default"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
        <span className="text-gray-300 hover:text-gray-400 text-[10px] leading-none select-none">
          ⓘ
        </span>
      </span>

      {visible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{ position: "fixed", top: coords.top, left: coords.left, zIndex: 9999 }}
          className="pointer-events-none px-2.5 py-1.5 bg-gray-900 text-white text-[11px] leading-snug rounded-lg shadow-lg max-w-[200px] animate-fade-in"
        >
          {text}
        </div>
      )}
    </>
  );
}
