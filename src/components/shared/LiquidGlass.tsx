import { useId, useRef, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/utils/cn";

/**
 * Refraksiya (backdrop-filter: url(#svg)) hozircha faqat Chromium'da ishlaydi.
 * Boshqa brauzerlarda qatlam oddiy yengil xiralashtirishga qaytadi — dizayn buzilmaydi.
 */
const SUPPORTS_REFRACTION =
  typeof navigator !== "undefined" &&
  Boolean(
    (
      navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }
    ).userAgentData?.brands?.some((b) => b.brand === "Chromium")
  );

const REDUCED_MOTION =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * LIQUID GLASS — iOS uslubidagi shisha sirt.
 *
 *   <LiquidGlass className="rounded-[2rem] p-8">…</LiquidGlass>
 *
 * - `refract`     — chetlarda orqa fon "suyuq" egiladi (katta panellar uchun)
 * - `interactive` — yaltirash kursorga ergashadi
 * - `blur`        — markaziy frost kuchi (px)
 *
 * ⚠️ Faqat urg'u joylarida: login, suzuvchi vidjetlar. Kabinet ichidagi bloklar — SectionCard (tekis).
 */
export function LiquidGlass({
  children,
  className,
  contentClassName,
  refract = true,
  interactive = true,
  blur = 20,
  edge = 16,
  scale = 55,
  style,
}: {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  refract?: boolean;
  interactive?: boolean;
  blur?: number;
  /** Refraksiya ko'rinadigan chet kengligi (px) */
  edge?: number;
  /** Refraksiya kuchi */
  scale?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const filterId = `glass-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const withRefraction = refract && SUPPORTS_REFRACTION;
  const trackPointer = interactive && !REDUCED_MOTION;

  return (
    <div
      ref={ref}
      className={cn("liquid-glass", className)}
      style={
        {
          "--glass-blur": `${blur}px`,
          "--glass-edge": refract ? `${edge}px` : "0px",
          ...style,
        } as CSSProperties
      }
      onPointerMove={
        trackPointer
          ? (e) => {
              const el = ref.current;
              if (!el) return;
              const r = el.getBoundingClientRect();
              el.style.setProperty("--glass-x", `${e.clientX - r.left}px`);
              el.style.setProperty("--glass-y", `${e.clientY - r.top}px`);
            }
          : undefined
      }
      onPointerLeave={
        trackPointer
          ? () => {
              ref.current?.style.removeProperty("--glass-x");
              ref.current?.style.removeProperty("--glass-y");
            }
          : undefined
      }
    >
      {withRefraction && (
        <svg aria-hidden width="0" height="0" className="absolute">
          <filter
            id={filterId}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.006 0.009"
              numOctaves="2"
              seed="11"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="3" result="map" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      )}
      {refract && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] liquid-glass-refract"
          style={
            withRefraction ? { backdropFilter: `url(#${filterId}) saturate(170%)` } : undefined
          }
        />
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] liquid-glass-frost"
      />
      <span
        aria-hidden
        className="liquid-glass-surface pointer-events-none absolute inset-0 rounded-[inherit]"
      />
      <div className={cn("relative", contentClassName)}>{children}</div>
    </div>
  );
}
