"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const setRef = useCallback((el: HTMLElement | null) => {
    ref.current = el;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Tag: ElementType = as;

  return (
    <Tag
      ref={setRef}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export function SectionTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.32em] text-flux-2">
      <span className="h-px w-7 bg-flux" aria-hidden="true" />
      {children}
    </span>
  );
}

export function SkewButton({
  children,
  href,
  type = "button",
  variant = "primary",
  onClick,
  disabled,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "ghost";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-flux-deep to-flux text-white shadow-[0_10px_30px_-10px_rgba(47,123,255,0.65)] hover:shadow-[0_14px_36px_-8px_rgba(47,123,255,0.8)] hover:brightness-110"
      : "border border-line-2 bg-panel/60 text-snow hover:border-flux/60 hover:bg-panel-2";
  const cls = `group inline-flex -skew-x-[10deg] items-center justify-center px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.14em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`;
  const inner = <span className="inline-flex skew-x-[10deg] items-center gap-2.5">{children}</span>;
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {inner}
    </button>
  );
}
