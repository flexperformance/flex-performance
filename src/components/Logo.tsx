import { useId } from "react";

type LogoProps = {
  variant?: "full" | "compact";
  tone?: "light" | "dark";
  className?: string;
  animatePulse?: boolean;
};

/**
 * Reproduction vectorielle du logo FLEX PERFORMANCE :
 * "FLEX" italique gras avec diagonale bleue sur le X,
 * "PERFORMANCE" espacé, ligne de pulsation, tagline.
 */
export default function Logo({
  variant = "full",
  tone = "light",
  className,
  animatePulse = false,
}: LogoProps) {
  const gradId = `flex-grad-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const ink = tone === "light" ? "#edf1f7" : "#0b0d11";
  const muteInk = tone === "light" ? "#c3ccda" : "#2a3140";

  if (variant === "compact") {
    return (
      <svg
        viewBox="0 0 430 122"
        className={className}
        role="img"
        aria-label="FLEX Performance"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#0b46d8" />
            <stop offset="1" stopColor="#3f8bff" />
          </linearGradient>
        </defs>
        <text
          x="2"
          y="86"
          textLength="336"
          lengthAdjust="spacingAndGlyphs"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "96px",
            fill: ink,
          }}
        >
          FLE<tspan fill={`url(#${gradId})`}>X</tspan>
        </text>
        <text
          x="6"
          y="118"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "21px",
            letterSpacing: "13px",
            fill: ink,
          }}
        >
          PERFORMANCE
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 560 252"
      className={className}
      role="img"
      aria-label="FLEX Performance — Reprogrammation et diagnostic"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0b46d8" />
          <stop offset="1" stopColor="#3f8bff" />
        </linearGradient>
      </defs>
      <text
        x="4"
        y="112"
        textLength="436"
        lengthAdjust="spacingAndGlyphs"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: "124px",
          fill: ink,
        }}
      >
        FLE<tspan fill={`url(#${gradId})`}>X</tspan>
      </text>
      <text
        x="8"
        y="156"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "27px",
          letterSpacing: "17px",
          fill: ink,
        }}
      >
        PERFORMANCE
      </text>
      {/* ligne de pulsation */}
      <polyline
        points="70,196 218,196 232,174 244,214 254,196 288,196"
        fill="none"
        stroke="#2f7bff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animatePulse ? "pulse-anim" : undefined}
      />
      <line
        x1="308"
        y1="196"
        x2="492"
        y2="196"
        stroke={muteInk}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text
        x="280"
        y="240"
        textAnchor="middle"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "17px",
          letterSpacing: "6px",
          fill: muteInk,
        }}
      >
        REPROGRAMMATION
        <tspan fill="#2f7bff" dx="10" dy="0">
          •
        </tspan>
        <tspan dx="10" dy="0">
          DIAGNOSTIC
        </tspan>
      </text>
    </svg>
  );
}
