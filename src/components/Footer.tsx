"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { MailIcon, MapPinIcon, PhoneIcon } from "./Icons";

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "Suivi", href: "/suivi" }, // ⚡ Ajouté ici dans le footer
  { label: "FAQ", href: "#faq" },
  { label: "Rendez-vous", href: "#rdv" },
];

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
          <p className="mt-4 inline-flex items-center gap-2.5 border border-ok/30 bg-ok/10 px-4 py-2 rounded-lg text-xs text-ok">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Déplacement gratuit dans un rayon de 10 km
          </p>
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

        {/* Colonne 3 : Contact */}
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
          <a href="#" className="hover:text-snow transition-colors">Mentions légales</a>
          <span>•</span>
          <span>Reprog hors route & compétition selon législation</span>
        </div>
      </div>
    </footer>
  );
} 