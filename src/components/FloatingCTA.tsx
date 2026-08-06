export default function FloatingCTA() {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden flex gap-3">
      {/* Bouton Téléphone / Appel direct */}
      <a
        href="tel:0699189363" // Remplacez par votre vrai numéro
        className="flex-1 bg-slate-900 border border-slate-700 text-white font-bold py-3 px-4 rounded-xl shadow-xl flex items-center justify-center gap-2 text-xs backdrop-blur-md"
      >
        <span>📞</span> Appeler
      </a>

      {/* Bouton Prendre RDV / Devis */}
      <a
        href="#rdv" // Pointe vers votre formulaire ou ancre de réservation
        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black py-3 px-4 rounded-xl shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 text-xs text-center"
      >
        <span>⚡</span> Prendre RDV
      </a>
    </div>
  );
}