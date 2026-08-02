import { ReactNode, useState } from "react";

export function Tooltip({ tooltipText, children }: { tooltipText: string; children: ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-[#181819] border border-white/10 text-white text-xs font-semibold whitespace-nowrap shadow-xl z-50 animate-in fade-in duration-150">
          {tooltipText}
        </span>
      )}
    </div>
  );
}
