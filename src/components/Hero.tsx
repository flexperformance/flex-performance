import Logo from "./Logo";
import { ArrowRightIcon, BoltIcon, CheckIcon, PulseIcon } from "./Icons";
import { Reveal, SkewButton } from "./ui";
import Simulator from "./Simulator";

const STATS = [
  { value: "100%", label: "satisfaction client" },
  { value: "+35 cv", label: "gain moyen en Stage 1" },
  { value: "-40%", label: "d'économie sur le plein (E85)" },
  { value: "1 an", label: "garantie & remise d'origine offerte" },
];   

export default function Hero() {
  return (
    <section id="accueil" className="relative overflow-hidden pt-[76px]">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] h-[560px] w-[560px] rounded-full bg-flux/12 blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:px-8 lg:pb-28 lg:pt-20">
        
        {/* Colonne de gauche (Textes et CTA) */}
        <div className="min-w-0">
          <Reveal>
            <Logo variant="full" animatePulse className="mb-6 h-32 w-auto max-w-full sm:h-44 lg:h-52" />
          </Reveal>

          <Reveal delay={80}>
            <p className="mb-4 inline-flex flex-wrap items-center gap-2 border border-line bg-panel/70 px-3 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-mute sm:text-[11px] sm:tracking-[0.28em]">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
              </span>
              Brou-sur-Chantereine — Déplacement gratuit dans un rayon 10 km
            </p>
          </Reveal>

          <Reveal delay={140}>
            <h1 className="font-display text-3xl font-bold uppercase leading-[1.1] tracking-tight sm:text-4xl md:text-5xl xl:text-6xl">
              Libérez le vrai
              <br className="hidden sm:inline" /> potentiel de{" "}
              <span className="bg-gradient-to-r from-flux-2 to-flux bg-clip-text text-transparent">
                votre moteur.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-mute sm:text-base lg:text-lg">
              Reprogrammation moteur sur mesure et diagnostic électronique multimarque.
              Plus de couple, plus de puissance, une consommation maîtrisée — sans jamais
              compromettre la fiabilité de votre mécanique.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <SkewButton href="#rdv" className="w-full sm:w-auto justify-center">
                Prendre rendez-vous
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </SkewButton>
              <SkewButton href="#services" variant="ghost" className="w-full sm:w-auto justify-center">
                Nos prestations
              </SkewButton>
            </div>
          </Reveal>

          <Reveal delay={380}>
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="bg-ink-2 px-3 py-4 sm:px-4 sm:py-5">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-xl font-bold text-snow sm:text-2xl">{s.value}</dd>
                  <dd className="mt-1 text-[11px] leading-snug text-mute sm:text-xs">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Colonne de droite (Visuel + Simulateur) */}
        <Reveal delay={200} className="relative w-full min-w-0">
          <div className="relative">
            <div className="diag-stripes absolute -inset-3 -z-10" aria-hidden="true" />
            <div className="relative overflow-hidden border border-line">
              <img
                src="https://images.pexels.com/photos/36608166/pexels-photo-36608166.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                alt="Moteur BMW préparé dans l'atelier FLEX Performance"
                className="h-[280px] w-full object-cover sm:h-[380px] lg:h-[440px]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" aria-hidden="true" />
            </div>

            {/* Simulator Component avec adaptation mobile fluide */}
            <div className="relative z-10 mt-4 w-full sm:-mt-16 sm:w-[88%] sm:ml-auto">
              <Simulator />
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}