"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase";

interface VehicleData {
  token: string;
  client_name: string;
  vehicle: string;
  plate: string;
  current_step: number;
  estimated_time: string;
  notes: string;
  created_at: string;
  included_services: string; // ⚡ Champ dynamique pour récupérer les prestations enregistrées côté admin
}

const STEPS = [
  { id: 1, label: "Véhicule réceptionné", icon: "🚗" },
  { id: 2, label: "Diagnostic en cours", icon: "🔍" },
  { id: 3, label: "Cartographie & Reprog", icon: "💻" },
  { id: 4, label: "Tests sur route", icon: "🏎️" },
  { id: 5, label: "Prêt à récupérer", icon: "🏁" },
  { id: 6, label: "Véhicule récupéré", icon: "✅" },
];

function SuiviClientContent() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token");

  const [searchToken, setSearchToken] = useState(tokenParam || "");
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVehicleData = async (tokenToFetch: string) => {
    if (!tokenToFetch.trim()) return;

    setLoading(true);
    setError("");

    const formattedToken = tokenToFetch.trim().toUpperCase().replace(/[-]/g, "");

    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/vehicles?token=eq.${formattedToken}&select=*`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setVehicle(data[0]);
        } else {
          setVehicle(null);
          setError("Aucun dossier trouvé avec cette référence. Vérifiez les informations reçues.");
        }
      } else {
        setError("Erreur lors de la recherche.");
      }
   } catch (err) {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenParam) {
      setSearchToken(tokenParam);
      fetchVehicleData(tokenParam);
    }
  }, [tokenParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVehicleData(searchToken);
  };

  return (
    <>
      <div>
        {/* Bouton de retour à l'accueil */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-display uppercase tracking-wider text-mute hover:text-flux bg-panel border border-line px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <span>&larr;</span> Retour à l'accueil
          </Link>
        </div>

        {/* Header Moderne */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-flux/10 border border-flux/30 px-4 py-1.5 rounded-full mb-4 shadow-[0_0_20px_rgba(var(--flux-rgb),0.15)]">
            <span className="w-2 h-2 rounded-full bg-flux animate-pulse"></span>
            <span className="text-[11px] font-mono text-flux font-bold tracking-widest uppercase">
              Live Workshop Tracking
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Suivi <span className="text-flux">Atelier</span>
          </h1>
          <p className="text-xs sm:text-sm text-mute mt-2 max-w-md mx-auto">
            Entrez votre référence de suivi confidentielle reçue par WhatsApp pour suivre l'avancement de votre intervention en temps réel
          </p>
        </div>

        {/* Barre de Recherche High-Tech */}
        <form onSubmit={handleSearch} className="mb-10 relative flex items-center shadow-2xl rounded-2xl p-1.5 bg-panel border border-line focus-within:border-flux transition-all">
          <input
            type="text"
            placeholder="Entrez votre référence..."
            value={searchToken}
            onChange={(e) => setSearchToken(e.target.value)}
            required
            className="w-full bg-transparent px-4 py-3 text-sm font-mono uppercase text-flux font-extrabold outline-none placeholder:text-mute placeholder:font-normal"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-flux text-ink font-display text-xs font-bold uppercase px-7 py-3.5 rounded-xl hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all cursor-pointer disabled:opacity-50 tracking-wider whitespace-nowrap"
          >
            {loading ? "Recherche..." : "Consulter"}
          </button>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-center text-xs font-display uppercase tracking-wider mb-6 backdrop-blur-md">
            {error}
          </div>
        )}

        {/* Carte de Résultat Design */}
        {vehicle && (
          <div className="bg-panel/90 border border-flux/40 p-6 sm:p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-flux/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Infos Véhicule */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-line mb-6">
              <div>
                <span className="text-[11px] font-mono text-mute uppercase tracking-widest">Client : {vehicle.client_name}</span>
                <h2 className="font-display text-2xl font-black uppercase text-white mt-1 tracking-wide">
                  {vehicle.vehicle}
                </h2>
                <span className="inline-block mt-1.5 bg-ink-2 border border-line px-2.5 py-0.5 rounded-md text-[11px] font-mono text-flux font-bold">
                  {vehicle.plate}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-ink-2/90 border border-flux/40 px-4 py-3 rounded-2xl text-right shadow-inner">
                  <span className="block text-[9px] font-mono uppercase text-mute tracking-widest">Statut du dossier</span>
                  <span className="font-mono text-xs text-flux font-black tracking-wider uppercase">Sécurisé & Actif</span>
                </div>
                {/* 🔄 Bouton d'actualisation rapide */}
                <button
                  onClick={() => fetchVehicleData(vehicle.token)}
                  disabled={loading}
                  className="bg-ink-2 border border-line hover:border-flux p-3 rounded-2xl text-mute hover:text-flux transition-all cursor-pointer disabled:opacity-50"
                  title="Rafraîchir les données"
                >
                  <span className={`block text-base ${loading ? "animate-spin" : ""}`}>🔄</span>
                </button>
              </div>
            </div>

            {/* 🏁 Alerte si véhicule prêt à récupérer (Étape 5) */}
            {vehicle.current_step === 5 && (
              <div className="mb-6 bg-emerald-500/15 border border-emerald-500/50 p-4.5 rounded-2xl text-center backdrop-blur-md animate-pulse">
                <span className="text-2xl block mb-1">🎉</span>
                <h4 className="font-display text-sm font-black uppercase text-emerald-400 tracking-wide">Votre véhicule est prêt !</h4>
                <p className="text-xs text-snow mt-1 font-medium">Vous pouvez passer à l'atelier pour le récupérer aux heures d'ouverture.</p>
              </div>
            )}

            {/* ⚡ Barre de progression globale */}
            {(() => {
              const progressPercent = Math.min(Math.round((vehicle.current_step / 6) * 100), 100);
              return (
                <div className="mb-6 bg-ink-2/60 p-3.5 rounded-2xl border border-line">
                  <div className="flex justify-between items-center text-[10px] font-mono text-mute uppercase mb-2">
                    <span className="font-bold">Avancement global des travaux</span>
                    <span className="text-flux font-extrabold">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-ink h-2.5 rounded-full overflow-hidden border border-line/50 p-0.5">
                    <div 
                      className="bg-flux h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(var(--flux-rgb),0.8)]"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })()}

            {/* ⚡ Récapitulatif dynamique des prestations incluses */}
            <div className="mb-8 p-4 rounded-2xl bg-flux/5 border border-flux/25 flex flex-col gap-2">
              <span className="text-[11px] font-display uppercase tracking-wider text-mute font-bold">Prestations incluses :</span>
              <div className="flex flex-wrap items-center gap-2">
                {(vehicle.included_services || "Diagnostic Électronique • Optimisation Moteur")
                  .split("•")
                  .map((service, idx) => (
                    <span key={idx} className="bg-flux/10 border border-flux/30 text-flux text-xs font-mono uppercase px-3 py-1.5 rounded-xl font-bold shadow-sm">
                      {service.trim()}
                    </span>
                  ))}
              </div>
            </div>

            {/* Timeline des Étapes Modernisée */}
            <div className="space-y-6 mb-8">
              <h3 className="font-display text-xs font-bold uppercase tracking-widest text-mute mb-2">
                Étapes de préparation
              </h3>
              
              <div className="relative pl-6 space-y-5 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-[2px] before:bg-line">
                {STEPS.map((step) => {
                  const isCompleted = vehicle.current_step >= step.id;
                  const isCurrent = vehicle.current_step === step.id;

                  return (
                    <div key={step.id} className="relative flex items-center gap-4 group">
                      <div
                        className={`absolute -left-[23px] w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition-all font-mono ${
                          isCompleted
                            ? "bg-flux text-ink font-bold shadow-[0_0_15px_rgba(var(--flux-rgb),0.5)] ring-4 ring-flux/10"
                            : "bg-ink-2 border border-line text-mute"
                        }`}
                      >
                        {isCompleted ? "✓" : step.id}
                      </div>

                      <div
                        className={`flex-1 p-4 rounded-2xl border transition-all ${
                          isCurrent
                            ? "bg-flux/10 border-flux/80 shadow-[0_4px_20px_rgba(var(--flux-rgb),0.1)]"
                            : isCompleted
                            ? "bg-ink-2/40 border-line/50 opacity-80"
                            : "bg-ink-2/15 border-line/20 opacity-30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 text-white">
                            <span className="text-base">{step.icon}</span> {step.label}
                          </span>
                          {isCurrent && (
                            <span className="bg-flux text-ink text-[10px] font-black uppercase px-2.5 py-1 rounded-full animate-pulse shadow-sm tracking-widest">
                              {vehicle.current_step === 6 ? "Terminé" : "En cours"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Blocs Infos & Notes */}
            <div className="grid sm:grid-cols-2 gap-4 bg-ink-2/60 p-5 rounded-2xl border border-line">
              <div className="border-b sm:border-b-0 sm:border-r border-line pb-3 sm:pb-0 sm:pr-3">
                <span className="block text-[10px] uppercase font-mono text-mute tracking-wider mb-1">Disponibilité Estimée</span>
                <p className="text-xs font-bold text-flux">{vehicle.estimated_time || "En cours d'évaluation"}</p>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono text-mute tracking-wider mb-1">Notes Atelier</span>
                <p className="text-xs text-snow leading-relaxed">{vehicle.notes || "Aucune note particulière pour le moment."}</p>
              </div>
            </div>

            {/* 💬 Bouton direct "Contacter l'Atelier sur WhatsApp" */}
            <a
              href={`https://wa.me/33600000000?text=${encodeURIComponent(
                `Bonjour Flex Performance, je souhaite avoir une information sur le suivi de mon véhicule (${vehicle.vehicle} - Réf: ${vehicle.token}). Cordialement. `
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full bg-emerald-600/15 border border-emerald-500/40 text-emerald-400 hover:text-white font-display text-xs font-bold uppercase py-4 rounded-2xl hover:bg-emerald-600 transition-all cursor-pointer flex items-center justify-center gap-2.5 tracking-wider shadow-lg"
            >
              <span className="text-lg">💬</span>
              <span>Contacter l'atelier sur WhatsApp</span>
            </a>

            {/* 📍 Rappel d'ouverture & Atelier */}
            <div className="mt-6 pt-4 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-mute font-mono">
              <span className="flex items-center gap-1.5">
                <span className="text-flux">📍</span> Flex Performance
              </span>
              <span>📅 Du Lundi au Samedi de 10h à 19h</span>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center text-xs text-mute mt-16 font-mono">
        &copy; 2026 Flex Performance &bull; Tous droits réservés.
      </footer>
    </>
  );
}

export default function SuiviClientPage() {
  return (
    <main className="min-h-screen pt-[120px] pb-24 px-4 max-w-xl mx-auto text-snow flex flex-col justify-between selection:bg-flux selection:text-ink">
      <Suspense fallback={<div className="text-center text-mute font-mono text-xs uppercase py-20">Chargement du suivi...</div>}>
        <SuiviClientContent />
      </Suspense>
    </main>
  );
}