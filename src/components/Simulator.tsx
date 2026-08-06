'use client';

import React, { useState } from 'react';

// Base de données Stage 1 uniquement
const VEHICLES_DATABASE = [
  
  // --- AUDI ---
  { brand: 'Audi', model: 'A3 8V - 1.6 TDI 116', hpOrig: 116, hpTune: 145, nmOrig: 250, nmTune: 320, fuel: 'Diesel', consumption: 4.4, tankSize: 50 },
  { brand: 'Audi', model: 'A3 8V - 2.0 TDI 150', hpOrig: 150, hpTune: 190, nmOrig: 340, nmTune: 420, fuel: 'Diesel', consumption: 4.8, tankSize: 50 },
  { brand: 'Audi', model: 'A3 8V - 2.0 TFSI 190', hpOrig: 190, hpTune: 245, nmOrig: 320, nmTune: 400, fuel: 'Essence', consumption: 6.8, tankSize: 50 },
  { brand: 'Audi', model: 'S3 8V - 2.0 TFSI 300', hpOrig: 300, hpTune: 360, nmOrig: 380, nmTune: 480, fuel: 'Essence', consumption: 7.8, tankSize: 55 },
  { brand: 'Audi', model: 'A4 B9 - 2.0 TDI 190', hpOrig: 190, hpTune: 230, nmOrig: 400, nmTune: 470, fuel: 'Diesel', consumption: 5.0, tankSize: 54 },

  // --- BMW ---
  { brand: 'BMW', model: 'Série 1 F20 - 116d 116', hpOrig: 116, hpTune: 150, nmOrig: 270, nmTune: 340, fuel: 'Diesel', consumption: 4.3, tankSize: 52 },
  { brand: 'BMW', model: 'Série 1 F20 - 118i 136', hpOrig: 136, hpTune: 210, nmOrig: 220, nmTune: 310, fuel: 'Essence', consumption: 6.0, tankSize: 52 },
  { brand: 'BMW', model: 'Série 1 F20 - 118d 150', hpOrig: 150, hpTune: 190, nmOrig: 320, nmTune: 410, fuel: 'Diesel', consumption: 4.5, tankSize: 52 },
  { brand: 'BMW', model: 'Série 1 F20 - 120d 190', hpOrig: 190, hpTune: 225, nmOrig: 400, nmTune: 470, fuel: 'Diesel', consumption: 4.6, tankSize: 52 },
  { brand: 'BMW', model: 'Série 3 F30 - 320d 190', hpOrig: 190, hpTune: 225, nmOrig: 400, nmTune: 470, fuel: 'Diesel', consumption: 4.7, tankSize: 57 },
  { brand: 'BMW', model: 'Série 3 F30 - 330d 258', hpOrig: 258, hpTune: 310, nmOrig: 560, nmTune: 650, fuel: 'Diesel', consumption: 5.3, tankSize: 57 },
 
  // --- HYUNDAI ---
  { brand: 'Hyundai', model: 'Ioniq - 1.6 Hybrid 141', hpOrig: 141, hpTune: 160, nmOrig: 265, nmTune: 300, fuel: 'Essence', consumption: 3.9, tankSize: 45 },

  // --- lEXUS ---
  { brand: 'Lexus', model: 'IS 300h - 2.5 Hybrid 223', hpOrig: 223, hpTune: 245, nmOrig: 221, nmTune: 250, fuel: 'Essence', consumption: 4.3, tankSize: 66 },
  { brand: 'Lexus', model: 'UX 250h - 2.0 Hybrid 184', hpOrig: 184, hpTune: 205, nmOrig: 190, nmTune: 215, fuel: 'Essence', consumption: 4.1, tankSize: 43 },
  { brand: 'Lexus', model: 'ES 300h - 2.5 Hybrid 218', hpOrig: 218, hpTune: 235, nmOrig: 221, nmTune: 250, fuel: 'Essence', consumption: 4.4, tankSize: 50 },
  
  // --- MERCEDES ---
  { brand: 'Mercedes', model: 'Classe A W176 - A180 CDI 109', hpOrig: 109, hpTune: 140, nmOrig: 260, nmTune: 320, fuel: 'Diesel', consumption: 4.5, tankSize: 50 },
  { brand: 'Mercedes', model: 'Classe A W176 - A200 d 136', hpOrig: 136, hpTune: 170, nmOrig: 300, nmTune: 380, fuel: 'Diesel', consumption: 4.8, tankSize: 50 },
  { brand: 'Mercedes', model: 'Classe A W177 - A200 163', hpOrig: 163, hpTune: 195, nmOrig: 250, nmTune: 310, fuel: 'Essence', consumption: 5.8, tankSize: 43 },
  { brand: 'Mercedes', model: 'Classe C W205 - C220d 170', hpOrig: 170, hpTune: 215, nmOrig: 400, nmTune: 480, fuel: 'Diesel', consumption: 4.7, tankSize: 66 },

  // --- PEUGEOT ---
  { brand: 'Peugeot', model: '208 - 1.2 PureTech 100', hpOrig: 100, hpTune: 130, nmOrig: 205, nmTune: 240, fuel: 'Essence', consumption: 5.4, tankSize: 44 },
  { brand: 'Peugeot', model: '308 II - 1.2 PureTech 130', hpOrig: 130, hpTune: 155, nmOrig: 230, nmTune: 270, fuel: 'Essence', consumption: 5.7, tankSize: 53 },
  { brand: 'Peugeot', model: '308 II - 1.6 BlueHDi 120', hpOrig: 120, hpTune: 150, nmOrig: 300, nmTune: 360, fuel: 'Diesel', consumption: 3.8, tankSize: 53 },
  { brand: 'Peugeot', model: '308 II GT - 2.0 BlueHDi 180', hpOrig: 180, hpTune: 210, nmOrig: 400, nmTune: 460, fuel: 'Diesel', consumption: 4.4, tankSize: 53 },
  { brand: 'Peugeot', model: '3008 II - 1.5 BlueHDi 130', hpOrig: 130, hpTune: 160, nmOrig: 300, nmTune: 360, fuel: 'Diesel', consumption: 4.2, tankSize: 53 },

  // --- RENAULT ---
  { brand: 'Renault', model: 'Clio 4 - 0.9 TCe 90', hpOrig: 90, hpTune: 110, nmOrig: 135, nmTune: 170, fuel: 'Essence', consumption: 5.5, tankSize: 45 },
  { brand: 'Renault', model: 'Clio 4 - 1.5 dCi 90', hpOrig: 90, hpTune: 115, nmOrig: 220, nmTune: 270, fuel: 'Diesel', consumption: 3.6, tankSize: 45 },
  { brand: 'Renault', model: 'Megane 4 - 1.5 dCi 110', hpOrig: 110, hpTune: 135, nmOrig: 260, nmTune: 310, fuel: 'Diesel', consumption: 3.7, tankSize: 47 },
  { brand: 'Renault', model: 'Megane 4 RS - 1.8 TCe 280', hpOrig: 280, hpTune: 320, nmOrig: 390, nmTune: 460, fuel: 'Essence', consumption: 8.0, tankSize: 50 },

  // --- SEAT ---
  { brand: 'Seat', model: 'Leon 5F - 1.6 TDI 115', hpOrig: 115, hpTune: 145, nmOrig: 250, nmTune: 320, fuel: 'Diesel', consumption: 4.0, tankSize: 50 },
  { brand: 'Seat', model: 'Leon 5F - 2.0 TDI 150', hpOrig: 150, hpTune: 190, nmOrig: 340, nmTune: 420, fuel: 'Diesel', consumption: 4.4, tankSize: 50 },
  { brand: 'Seat', model: 'Leon Cupra 300 - 2.0 TSI 300', hpOrig: 300, hpTune: 370, nmOrig: 380, nmTune: 480, fuel: 'Essence', consumption: 7.2, tankSize: 50 },

// --- TOYOTA ---
  { brand: 'Toyota', model: 'Auris II - 1.8 Hybrid 136', hpOrig: 136, hpTune: 155, nmOrig: 142, nmTune: 165, fuel: 'Essence', consumption: 3.6, tankSize: 45 },
  { brand: 'Toyota', model: 'C-HR - 1.8 Hybrid 122', hpOrig: 122, hpTune: 140, nmOrig: 142, nmTune: 165, fuel: 'Essence', consumption: 3.8, tankSize: 43 },
  { brand: 'Toyota', model: 'C-HR - 2.0 Hybrid 184', hpOrig: 184, hpTune: 205, nmOrig: 190, nmTune: 215, fuel: 'Essence', consumption: 4.0, tankSize: 43 },
  { brand: 'Toyota', model: 'Corolla - 1.8 Hybrid 122', hpOrig: 122, hpTune: 140, nmOrig: 142, nmTune: 165, fuel: 'Essence', consumption: 3.6, tankSize: 43 },
  { brand: 'Toyota', model: 'Corolla - 2.0 Hybrid 184', hpOrig: 184, hpTune: 205, nmOrig: 190, nmTune: 215, fuel: 'Essence', consumption: 3.8, tankSize: 43 },
  { brand: 'Toyota', model: 'Prius IV - 1.8 Hybrid 122', hpOrig: 122, hpTune: 140, nmOrig: 142, nmTune: 165, fuel: 'Essence', consumption: 3.4, tankSize: 43 },
  { brand: 'Toyota', model: 'RAV4 - 2.5 Hybrid 218', hpOrig: 218, hpTune: 235, nmOrig: 221, nmTune: 250, fuel: 'Essence', consumption: 4.6, tankSize: 55 },
  { brand: 'Toyota', model: 'RAV4 - 2.5 Hybrid AWD 222', hpOrig: 222, hpTune: 240, nmOrig: 221, nmTune: 250, fuel: 'Essence', consumption: 4.8, tankSize: 55 },
  

  // --- VOLKSWAGEN ---
  { brand: 'Volkswagen', model: 'Golf 7 - 1.6 TDI 110', hpOrig: 110, hpTune: 145, nmOrig: 250, nmTune: 320, fuel: 'Diesel', consumption: 4.5, tankSize: 50 },
  { brand: 'Volkswagen', model: 'Golf 7 - 2.0 TDI 150', hpOrig: 150, hpTune: 190, nmOrig: 340, nmTune: 420, fuel: 'Diesel', consumption: 5.0, tankSize: 50 },
  { brand: 'Volkswagen', model: 'Golf 7 GTD - 2.0 TDI 184', hpOrig: 184, hpTune: 220, nmOrig: 380, nmTune: 450, fuel: 'Diesel', consumption: 5.5, tankSize: 50 },
  { brand: 'Volkswagen', model: 'Golf 7 GTI - 2.0 TSI 220', hpOrig: 220, hpTune: 300, nmOrig: 350, nmTune: 450, fuel: 'Essence', consumption: 7.5, tankSize: 50 },
  { brand: 'Volkswagen', model: 'Golf 7 R - 2.0 TSI 300', hpOrig: 300, hpTune: 360, nmOrig: 380, nmTune: 480, fuel: 'Essence', consumption: 8.5, tankSize: 55 },
  { brand: 'Volkswagen', model: 'Golf 8 - 2.0 TDI 150', hpOrig: 150, hpTune: 195, nmOrig: 360, nmTune: 430, fuel: 'Diesel', consumption: 4.8, tankSize: 50 },
  { brand: 'Volkswagen', model: 'Polo 6 - 1.0 TSI 95', hpOrig: 95, hpTune: 130, nmOrig: 175, nmTune: 220, fuel: 'Essence', consumption: 5.2, tankSize: 40 },

];

export default function Simulator() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [showE85Results, setShowE85Results] = useState(false);
  const availableModels = VEHICLES_DATABASE.filter(
    (v) => v.brand === selectedBrand
  );

  const currentVehicle = VEHICLES_DATABASE.find(
    (v) => v.brand === selectedBrand && v.model === selectedModel
  );

  // Utilisation directe de la propriété fuel du véhicule sélectionné
  const isE85Compatible = currentVehicle ? currentVehicle.fuel === 'Essence' : false;

  const brands = Array.from(new Set(VEHICLES_DATABASE.map((v) => v.brand)));

  const handleBooking = () => {
    if (!currentVehicle) return;

    // Découpage du modèle et de la motorisation
    const parts = currentVehicle.model.split(" - ");
    const modelName = parts[0] || currentVehicle.model;
    const engineName = parts[1] || "";

    // Envoi de l'événement vers Booking.tsx
    const event = new CustomEvent("selectVehicle", {
      detail: {
        brand: currentVehicle.brand,
        model: modelName,
        engine: engineName,
      },
    });

    window.dispatchEvent(event);
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 p-6 rounded-2xl shadow-2xl backdrop-blur-md">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white tracking-wide uppercase">
          ⚡ Simulez vos gains
        </h3>
        <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2.5 py-1 rounded-full font-mono">
          Stage 1 & FlexFuel
        </span>
      </div>

      {/* Choix de la marque */}
      <div className="space-y-3 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            1. Marque
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel('');
            }}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 focus:border-cyan-400 focus:outline-none cursor-pointer text-sm font-medium"
          >
            <option value="">Sélectionnez la marque...</option>
            {brands.map((b, i) => (
              <option key={i} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Choix du modèle */}
        {selectedBrand && (
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
              2. Modèle & Motorisation
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 focus:border-cyan-400 focus:outline-none cursor-pointer text-sm font-medium"
            >
              <option value="">Sélectionnez le moteur...</option>
              {availableModels.map((v, i) => (
                <option key={i} value={v.model}>
                  {v.model}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Affichage des Gains Stage 1 */}
      {currentVehicle ? (
        <div className="space-y-4">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Puissance moteur</span>
              <span className="text-emerald-400 font-bold">
                +{currentVehicle.hpTune - currentVehicle.hpOrig} ch
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-slate-500 text-xs">
                Origine: {currentVehicle.hpOrig} ch
              </span>
              <span className="text-2xl font-black text-cyan-400">
                {currentVehicle.hpTune} <span className="text-sm">ch</span>
              </span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Couple moteur</span>
              <span className="text-emerald-400 font-bold">
                +{currentVehicle.nmTune - currentVehicle.nmOrig} Nm
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-slate-500 text-xs">
                Origine: {currentVehicle.nmOrig} Nm
              </span>
              <span className="text-2xl font-black text-cyan-400">
                {currentVehicle.nmTune} <span className="text-sm">Nm</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {/* Bouton classique de réservation */}
            <button
              type="button"
              onClick={handleBooking}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg transition-all text-sm uppercase tracking-wider"
            >
              Réserver pour ce modèle →
            </button>
          </div>

          {/* Bouton vert E85 dynamique (affiché uniquement si essence) */}
          {isE85Compatible && (
            <div className="mt-4 w-full">
              <button
                type="button"
                onClick={() => setShowE85Results(!showE85Results)}
                className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-bold py-3 px-4 rounded-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🌱</span> Calculer mes économies E85
              </button>

              {showE85Results && (
  <div className="mt-4 p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-200 text-sm animate-fadeIn">
    <h5 className="font-bold mb-3 flex items-center gap-2 text-emerald-300">
      <span>📊</span> Comparatif SP98 vs E85 : {currentVehicle.model}
    </h5>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      {/* Colonne SP98 */}
      <div className="bg-black/30 p-3 rounded-lg border border-slate-800">
        <div className="text-xs text-slate-400 font-semibold mb-1">SP98 (Origine)</div>
        <div className="text-sm text-white">Conso : <span className="font-bold">{currentVehicle.consumption} L / 100km</span></div>
        <div className="text-sm text-white">Plein ({currentVehicle.tankSize}L) : <span className="font-bold text-cyan-400">{(currentVehicle.tankSize * 1.85).toFixed(2)} €</span></div>
        <div className="text-xs text-slate-400 mt-1">Coût aux 100km : <span className="text-slate-200 font-bold">{((currentVehicle.consumption * 1.85)).toFixed(2)} €</span></div>
      </div>

      {/* Colonne E85 (+20% de conso) */}
      <div className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/30">
        <div className="text-xs text-emerald-400 font-semibold mb-1">E85 (Flexfuel) [+20% conso]</div>
        <div className="text-sm text-white">Conso : <span className="font-bold">{(currentVehicle.consumption * 1.2).toFixed(1)} L / 100km</span></div>
        <div className="text-sm text-white">Plein ({currentVehicle.tankSize}L) : <span className="font-bold text-emerald-400">{(currentVehicle.tankSize * 0.85).toFixed(2)} €</span></div>
        <div className="text-xs text-slate-400 mt-1">Coût aux 100km : <span className="text-emerald-300 font-bold">{((currentVehicle.consumption * 1.2 * 0.85)).toFixed(2)} €</span></div>
      </div>
    </div>

    {/* Résumé des économies */}
    <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30 text-center">
      <span className="text-xs text-emerald-300 block">Économie nette réalisée aux 100 km :</span>
      <span className="text-lg font-black text-emerald-400">
        {(((currentVehicle.consumption * 1.85) - (currentVehicle.consumption * 1.2 * 0.85))).toFixed(2)} € / 100 km
      </span>
      <div className="text-xs text-slate-400 mt-1">
        Soit environ <span className="text-emerald-400 font-bold">~ {Math.round((((currentVehicle.consumption * 1.85) - (currentVehicle.consumption * 1.2 * 0.85)) * 150)) } €</span> d'économie par an (pour 15 000 km).
      </div>
    </div>

    <p className="text-[10px] text-gray-400 mt-3 text-center">
      * Basé sur SP98 (1,85€/L) vs E85 (0,85€/L) avec une surconsommation de 20%.
    </p>
  </div>
)}

{/* --- INDICATEUR DE RENTABILITÉ E85 --- */}
<div className="mt-3 bg-cyan-950/30 p-3 rounded-lg border border-cyan-500/30 text-center">
  <span className="text-xs text-cyan-300 block font-semibold">⚡ Amortissement de la conversion :</span>
  <span className="text-sm font-bold text-white mt-1 block">
    Votre prestation est rentabilisée en seulement <span className="text-cyan-400 font-black">
      {Math.round(250 / (((currentVehicle.consumption * 1.85) - (currentVehicle.consumption * 1.2 * 0.85)) / 100))} km
    </span> !
  </span>
  <span className="text-[10px] text-slate-400 block mt-0.5">
    (Calculé sur la base d'une conversion à 250 €)
  </span>
</div>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-500 text-xs">
          {!selectedBrand
            ? "Sélectionnez une marque pour commencer la simulation Stage 1."
            : "Choisissez une motorisation dans le menu déroulant."}
        </div>
      )}
    </div>
  );
}