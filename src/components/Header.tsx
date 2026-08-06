"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { CloseIcon, MenuIcon, PhoneIcon } from "./Icons";

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
  { label: "Avis", href: "#reviews" },
  { label: "Suivi Véhicule", href: "/suivi", highlight: true }, // ⚡ Nouvel onglet de suivi
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <a href="/#accueil" className="shrink-0" aria-label="FLEX Performance — accueil">
          <Logo variant="compact" className="h-11 w-auto" />
        </a>

        {/* Navigation Desktop */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigation principale">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`font-display text-[13px] font-medium uppercase tracking-[0.18em] transition-all ${
                item.highlight
                  ? "bg-flux/10 border border-flux/40 px-3.5 py-1.5 rounded-xl text-flux hover:bg-flux hover:text-ink shadow-sm"
                  : "text-mute hover:text-snow"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="tel:+33699189363"
            className="inline-flex items-center gap-2 font-display text-sm font-semibold text-snow transition-colors hover:text-flux-2"
          >
            <PhoneIcon className="h-4 w-4 text-flux" />
            06 99 18 93 63
          </a>
          <a
            href="/#rdv"
            className="inline-flex -skew-x-[10deg] items-center bg-gradient-to-r from-flux-deep to-flux px-5 py-2.5 font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_8px_24px_-10px_rgba(47,123,255,0.7)] transition-all hover:brightness-110"
          >
            <span className="skew-x-[10deg]">Prendre RDV</span>
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-line bg-panel text-snow lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu Mobile */}
      <div
        className={`overflow-hidden border-b border-line bg-ink/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          open ? "max-h-[420px]" : "max-h-0 border-b-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 py-4" aria-label="Navigation mobile">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`border-l-2 px-3 py-2.5 font-display text-sm font-medium uppercase tracking-[0.16em] transition-colors ${
                item.highlight
                  ? "border-flux bg-flux/10 text-flux font-bold"
                  : "border-transparent text-mute hover:border-flux hover:text-snow"
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/#rdv"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center bg-gradient-to-r from-flux-deep to-flux px-5 py-3 font-display text-sm font-semibold uppercase tracking-[0.16em] text-white"
          >
            Prendre rendez-vous
          </a>
        </nav>
      </div>
    </header>
  );
}