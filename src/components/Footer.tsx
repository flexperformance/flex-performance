"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { MailIcon, MapPinIcon, PhoneIcon } from "./Icons";

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "FAQ", href: "#faq" },
  { label: "Rendez-vous", href: "#rdv" },
];

function TikTokIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.872 2.897 2.897 0 0 1-2.89-2.872 2.896 2.896 0 0 1 2.89-2.873c.277 0 .543.04.794.113V9.387a6.295 6.295 0 0 0-.794-.051A6.338 6.338 0 0 0 3.125 15.67a6.338 6.338 0 0 0 6.348 6.33 6.338 6.338 0 0 0 6.347-6.33V9.16a8.16 8.16 0 0 0 4.769 1.517V7.218a4.836 4.836 0 0 1-1.000-.532z" />
    </svg>
  );
}

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
      const hours = now.getHours();

      // Ouvert uniquement du Lundi au Samedi (day !== 0) entre 10h et 19h
      setIsOpen(day !== 0 && hours >= 10 && hours < 19);
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer id="contact" className="border-t border-line bg-ink-2">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_1fr]">
        
        {/* Colonne 1 : Logo & Infos */}
        <div>
          <Logo variant="full" className="h-40 w-auto max-w-[340px]" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-mute-2">
            Atelier indépendant spécialisé en reprogrammation moteur et diagnostic
            électronique multimarque. Performance, fiabilité et transparence.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <p className="inline-flex items-center gap-2.5 border border-ok/30 bg-ok/10 px-4 py-2 rounded-lg text-xs text-ok">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Déplacement gratuit dans un rayon de 10 km
            </p>
          </div>
        </div>

        {/* Colonne 2 : Navigation */}
        <nav aria-label="Liens du pied de page" className="lg:pl-6">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-mute-2">
            Navigation
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-snow hover:text-flux transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Colonne 3 : Contact & Réseaux */}
        <div>
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-mute-2">
            Contact
          </p>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a 
                href="https://www.google.com/maps/place/FLEX+PERFORMANCE/@48.8792627,2.6229934,17z/data=!4m15!1m8!3m7!1s0x47e6106f4a66f67b:0xa929e7e0ece37ccb!2s1+Av.+Jean+Jaur%C3%A8s,+77177+Brou-sur-Chantereine!3b1!8m2!3d48.8792627!4d2.6229934!16s%2Fg%2F11c1d574gk!3m5!1s0x47e6112b0ef57f77:0x5544c44ca952fae7!8m2!3d48.8792627!4d2.6229934!16s%2Fg%2F11zh8q1ccn?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-snow hover:opacity-80 transition-opacity"
              >
                <MapPinIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-flux" />
                <span className="leading-snug">
                  1 Avenue Jean Jaurès<br />
                  77177 Brou-sur-Chantereine
                </span>
              </a>
            </li>
            <li>
              <a href="tel:0699189363" className="flex items-center gap-3 text-snow hover:text-flux transition-colors">
                <PhoneIcon className="h-4.5 w-4.5 shrink-0 text-flux" />
                <span>06 99 18 93 63</span>
              </a>
            </li>
            <li>
              <a href="mailto:contact@flexperformance.fr" className="flex items-center gap-3 text-snow hover:text-flux transition-colors">
                <MailIcon className="h-4.5 w-4.5 shrink-0 text-flux" />
                <span>contact@flexperformance.fr</span>
              </a>
            </li>
            <li>
              <a 
                href="https://www.tiktok.com/@flex.performance77" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-snow hover:text-flux transition-colors"
              >
                <TikTokIcon className="h-4.5 w-4.5 shrink-0 text-flux" />
                <span>@flex.performance77</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Colonne 4 : Horaires Dynamiques */}
        <div>
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-mute-2">
            Horaires
          </p>
          <div className="mt-5 space-y-2 text-sm">
            <div className={`flex items-center gap-2.5 font-medium ${isOpen ? "text-emerald-400" : "text-red-500"}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-red-500"}`}></span>
              <span className={isOpen ? "text-emerald-400" : "text-red-500"}> Lun - Sam : 10:00 - 19:00</span>
            </div>
            
            <p className="text-xs text-mute-2">
              {isOpen ? "Ouvert actuellement" : "Fermé actuellement"}
            </p>
          </div>
        </div>
      </div>

      {/* Bas du footer */}
      <div className="border-t border-line py-6 px-5 text-center text-xs text-mute-2 flex flex-col sm:flex-row justify-between max-w-7xl mx-auto gap-4">
        <p>© 2026 FLEX Performance — Tous droits réservés.</p>
        <div className="space-x-4">
          <a href="/mentions-legales" className="hover:text-snow transition-colors">
  Mentions légales</a>
          <span>•</span>
          <span>Reprog hors route & compétition selon législation</span>
        </div>
      </div>
    </footer>
  );
}