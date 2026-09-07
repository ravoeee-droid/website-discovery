export type DiscoveryData = {
  companyName: string;
  website: string;
  contactPerson: string;
  goals: string[];
  audiences: string[];
  recruitingNeed: string;
  contactChannels: string[];
  mediaAssets: string[];
  visualDirection: string;
  visualTraits: string[];
  features: string[];
  aiAssistantTasks: string[];
  automations: string[];
  locations: number;
  languages: string[];
  notes: string;
  email: string;
  phone: string;
};

export const initialDiscoveryData: DiscoveryData = {
  companyName: "",
  website: "",
  contactPerson: "",
  goals: [],
  audiences: [],
  recruitingNeed: "",
  contactChannels: [],
  mediaAssets: [],
  visualDirection: "",
  visualTraits: [],
  features: [],
  aiAssistantTasks: [],
  automations: [],
  locations: 1,
  languages: ["Deutsch"],
  notes: "",
  email: "",
  phone: "",
};

export type Recommendation = {
  label: string;
  reason: string;
  category: "core" | "growth" | "recruiting" | "automation" | "media";
};

export function buildRecommendations(data: DiscoveryData): Recommendation[] {
  const items: Recommendation[] = [
    {
      label: "Conversion Website",
      reason: "Klare Nutzerführung, Vertrauen und ein primärer Handlungsweg bilden die Basis.",
      category: "core",
    },
  ];

  const wantsCustomers = data.goals.some((g) =>
    ["Mehr Kundenanfragen", "Termine / Reservierungen", "Produkte / Leistungen verkaufen"].includes(g),
  );
  const wantsRecruiting =
    data.goals.includes("Mehr Bewerbungen") ||
    data.audiences.includes("Bewerber") ||
    ["mehrere offene Stellen", "dauerhaft hoher Personalbedarf"].includes(data.recruitingNeed);

  if (wantsCustomers) {
    items.push({
      label: "Interaktiver Kunden-Funnel",
      reason: "Interessenten werden schrittweise qualifiziert statt in ein langes Kontaktformular geschickt.",
      category: "growth",
    });
  }

  if (wantsRecruiting) {
    items.push(
      {
        label: "Employer Branding & Karrierebereich",
        reason: "Bewerber brauchen eine eigene Journey mit Kultur, Team, Arbeitgeberversprechen und echten Einblicken.",
        category: "recruiting",
      },
      {
        label: "60-Sekunden-Bewerbungsfunnel",
        reason: "Mobile Bewerbung mit minimaler Reibung und ohne unnötige Pflichtfelder.",
        category: "recruiting",
      },
    );
  }

  if (data.aiAssistantTasks.length > 0 || data.features.includes("AI-Assistent")) {
    items.push({
      label: "Digitaler AI-Assistent",
      reason: "Beantwortet echte Unternehmensfragen, erkennt Intent und führt in den passenden nächsten Schritt.",
      category: "automation",
    });
  }

  if (data.automations.length > 0) {
    items.push({
      label: "Lead- & Follow-up-Automation",
      reason: "Anfragen werden nicht nur gesendet, sondern direkt weitergeleitet, bestätigt und nachverfolgt.",
      category: "automation",
    });
  }

  if (data.locations > 1) {
    items.push({
      label: "Multi-Location Architektur",
      reason: `${data.locations} Standorte benötigen klare lokale Einstiege, Ansprechpartner und lokale SEO-Strukturen.`,
      category: "growth",
    });
  }

  if (data.languages.length > 1) {
    items.push({
      label: "Mehrsprachige Experience",
      reason: "Inhalte, Navigation und SEO werden pro Sprache sauber strukturiert statt nur automatisch übersetzt.",
      category: "growth",
    });
  }

  const hasStrongMedia = data.mediaAssets.includes("Professionelle Fotos") && data.mediaAssets.includes("Videos");
  if (!hasStrongMedia) {
    items.push({
      label: "Media Direction",
      reason: "Wir planen fehlende Foto-/Video-Motive und ergänzen nur dort mit KI-Visuals, wo es glaubwürdig und sinnvoll ist.",
      category: "media",
    });
  }

  return items;
}
