// Données en mémoire (simulées ou connectées à une base de données)
export let TRACKING_DATABASE = [
  {
    token: "FLEX-842",
    clientName: "Thomas M.",
    vehicle: "Audi S3 2.0 TFSI",
    plate: "AB-123-CD",
    currentStep: 3, // 1 à 5
    estimatedTime: "Aujourd'hui à 17h30",
    notes: "Stage 1 en cours + suppression soft des clapets d'admission.",
  },
  {
    token: "FLEX-991",
    clientName: "Alexandre L.",
    vehicle: "BMW M140i",
    plate: "EF-456-GH",
    currentStep: 4,
    estimatedTime: "Dans 1 heure",
    notes: "Reprogrammation validée sur banc, passage aux tests sur route.",
  }
];

// Fonction pour mettre à jour ou ajouter un véhicule
export function updateVehicleStep(token, newStep, notes, estimatedTime) {
  const vehicle = TRACKING_DATABASE.find(item => item.token.toUpperCase() === token.toUpperCase());
  if (vehicle) {
    vehicle.currentStep = Number(newStep);
    if (notes !== undefined) vehicle.notes = notes;
    if (estimatedTime !== undefined) vehicle.estimatedTime = estimatedTime;
    return true;
  }
  return false;
}