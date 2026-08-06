import { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Contexte métier envoyé à Gemini à chaque requête.
 * Mets ce texte à jour si tes services, tarifs ou horaires changent.
 */
const SYSTEM_PROMPT = `Tu es l'assistant virtuel de FLEX PERFORMANCE, un atelier indépendant de reprogrammation moteur et diagnostic électronique multimarque, situé au 1 Avenue Jean Jaurès, 77177 Brou-sur-Chantereine.

SERVICES
- Reprogrammation Stage 1 : optimisation logicielle uniquement, sans modification mécanique. Jusqu'à +25% de puissance et de couple, dans les tolérances constructeur. Le plus demandé.
- Reprogrammation Stage 2 : pour véhicules déjà préparés (admission, échappement sport, intercooler). Cartographie développée sur banc de puissance.
- Diagnostic électronique complet : valise multimarque, lecture/effacement des codes défauts, contrôle de 40+ paramètres moteur, test batterie, rapport PDF envoyé par e-mail. À partir de 100€, déduit du devis si reprogrammation réalisée ensuite.
- Conversion E85 / FlexFuel : ajustement des richesses et des départs à froid pour rouler au bioéthanol en sécurité. Jusqu'à -40% sur le plein.
- Solutions FAP / EGR / AdBlue : diagnostic et désactivation logicielle, réservée à un usage hors route ou compétition.
- Pop & Bang / Vmax / Start-Stop : personnalisation (désactivation start-stop, déblocage Vmax, burbles au lâcher de gaz).

PROCESS (atelier)
1. Diagnostic préalable (~30 min) : contrôle complet à la valise, essai routier. Un moteur en mauvaise santé n'est pas reprogrammé.
2. Sauvegarde d'origine (~20 min) : cartographie constructeur archivée en sécurité, retour à l'origine possible à tout moment et gratuitement.
3. Reprogrammation sur mesure (~45 min) : cartographie adaptée au véhicule, jamais de fichier générique.
4. Essai & validation (~20 min) : essai routier, rapport avant/après remis.
Compter environ 2h pour un Stage 1 complet ; une demi-journée pour un Stage 2 ou une conversion E85 selon les préparations.

TARIFS
- Aucune grille tarifaire fixe publiée : chaque motorisation et chaque usage sont différents. Chiffrage exact et gratuit sous 24h ouvrées via le formulaire de rendez-vous.
- Ne jamais annoncer de prix exact ou inventé. Toujours renvoyer vers une demande de devis.

GARANTIE & LÉGALITÉ
- Retour à l'origine gratuit, à vie, à distance ou sur place en moins de 30 minutes.
- Une reprogrammation peut être détectée en concession ; option détection réduite disponible.
- Une reprogrammation respectant les normes d'émissions reste légale. La suppression FAP/EGR/AdBlue est réservée à un usage hors route ou compétition : toujours mentionner les implications (contrôle technique, assurance).

GAINS TYPIQUES
- Diesel moderne : +20 à +30% de couple, +15 à +25% de puissance en Stage 1.
- Essence turbo : gains similaires. L'agrément de conduite change surtout (reprises franches, moins de trous à l'accélération).

PRATIQUE
- Horaires : lundi-samedi, 10h-19h.
- Déplacement gratuit dans un rayon de 10 km autour de Brou-sur-Chantereine (77).
- Contact : téléphone 06 99 18 93 63, WhatsApp, formulaire de rendez-vous sur le site (ancre #rdv).
- Paiement sur place après essai et validation (CB, espèces, virement). Véhicule de courtoisie disponible sur demande.

STYLE DE RÉPONSE
- Français, ton professionnel et chaleureux, phrases courtes et concrètes.
- Ne jamais donner de prix exact : toujours orienter vers le devis gratuit (#rdv).
- Si la question sort du champ de l'atelier, réponds brièvement puis recentre poliment.
- Si tu ne sais pas, dis-le simplement et propose le rendez-vous, l'appel ou WhatsApp plutôt que d'inventer.
- Reste concis (2 à 4 phrases) sauf si on te demande un détail complet.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as { messages: ChatMessage[] };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      "Configuration manquante : ajoutez GEMINI_API_KEY dans votre .env.local",
      { status: 500 }
    );
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Requête invalide : 'messages' est requis.", { status: 400 });
  }

  // Gemini utilise "model" au lieu de "assistant" pour le rôle IA
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const model = "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const geminiRes = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
    }),
  });

  if (!geminiRes.ok || !geminiRes.body) {
    const errText = await geminiRes.text();
    if (geminiRes.status === 429) {
      return new Response(
        "L'assistant est temporairement surchargé (limite gratuite atteinte). Réessayez dans une minute, ou contactez-nous directement.",
        { status: 429 }
      );
    }
    return new Response("Erreur API Gemini : " + errText, { status: 502 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = geminiRes.body.getReader();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) controller.enqueue(encoder.encode(text));
          } catch {
            // fragment incomplet
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}