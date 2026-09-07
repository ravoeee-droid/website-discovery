"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  Globe2,
  Image as ImageIcon,
  MessageCircle,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  WandSparkles,
  Zap,
} from "lucide-react";
import {
  buildRecommendations,
  initialDiscoveryData,
  type DiscoveryData,
} from "@/lib/discovery";

type StepId =
  | "identity"
  | "goals"
  | "audiences"
  | "recruiting"
  | "channels"
  | "media"
  | "visual"
  | "traits"
  | "features"
  | "assistant"
  | "automation"
  | "footprint"
  | "notes"
  | "contact";

const allSteps: StepId[] = [
  "identity",
  "goals",
  "audiences",
  "recruiting",
  "channels",
  "media",
  "visual",
  "traits",
  "features",
  "assistant",
  "automation",
  "footprint",
  "notes",
  "contact",
];

const goalOptions = [
  "Mehr Kundenanfragen",
  "Mehr Bewerbungen",
  "Vertrauen / Markenauftritt",
  "Produkte / Leistungen verkaufen",
  "Termine / Reservierungen",
  "Ich bin mir noch nicht sicher",
];

const audienceOptions = [
  "Interessenten / Neukunden",
  "Bestandskunden",
  "Bewerber",
  "Angehörige / Familien",
  "Geschäftspartner",
  "Andere Zielgruppen",
];

const recruitingOptions = [
  "aktuell keine offenen Stellen",
  "gelegentlich",
  "mehrere offene Stellen",
  "dauerhaft hoher Personalbedarf",
];

const channelOptions = ["Telefon", "WhatsApp", "Rückruf", "Terminbuchung", "Angebotsanfrage", "E-Mail"];
const mediaOptions = ["Logo", "Professionelle Fotos", "Mitarbeiterfotos", "Videos", "Kundenbewertungen", "Referenzen / Projekte", "Texte", "Noch kaum etwas"];
const traitOptions = ["Warm & menschlich", "Klar & hochwertig", "Mutig & modern", "Ruhig & minimalistisch", "Vertrauensvoll", "Dynamisch", "Editorial", "Technisch präzise"];
const featureOptions = ["Interaktiver Anfrage-Funnel", "AI-Assistent", "Bewerbungsfunnel", "Karrierebereich", "Jobangebote", "Terminbuchung", "WhatsApp", "Kundenbewertungen", "Referenzen / Cases", "Video", "Blog / Ratgeber", "Downloads", "Newsletter", "Kundenlogin"];
const assistantOptions = ["Fragen beantworten", "Leistungen erklären", "Passende Leistung finden", "Anfrage qualifizieren", "Termin vereinbaren", "Bewerber beraten", "Bewerbung starten", "Ansprechpartner finden"];
const automationOptions = ["E-Mail an unser Team", "WhatsApp-Benachrichtigung", "Lead direkt ins CRM", "Automatische Bestätigung", "Termin-Reminder", "Follow-up nach X Stunden"];
const languageOptions = ["Deutsch", "Englisch", "Französisch", "Spanisch", "Italienisch", "Thailändisch"];

const visualDirections = [
  { id: "warm-premium", name: "Warm Premium", subtitle: "Menschlich, ruhig, vertrauensvoll", className: "visual-warm" },
  { id: "editorial-modern", name: "Editorial Modern", subtitle: "Großzügig, charakterstark, hochwertig", className: "visual-editorial" },
  { id: "bold-confident", name: "Bold & Confident", subtitle: "Klar, kontrastreich, selbstbewusst", className: "visual-bold" },
  { id: "minimal-calm", name: "Minimal & Calm", subtitle: "Reduziert, präzise, sehr ruhig", className: "visual-minimal" },
];

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function OptionCard({ label, selected, onClick, description }: { label: string; selected: boolean; onClick: () => void; description?: string }) {
  return (
    <button type="button" className={`option-card ${selected ? "is-selected" : ""}`} onClick={onClick} aria-pressed={selected}>
      <span className="option-copy">
        <strong>{label}</strong>
        {description ? <small>{description}</small> : null}
      </span>
      <span className="option-check">{selected ? <Check size={16} strokeWidth={3} /> : null}</span>
    </button>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="question-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="chip"><CheckCircle2 size={14} />{children}</span>;
}

export default function DiscoveryFunnel() {
  const reduceMotion = useReducedMotion();
  const [data, setData] = useState<DiscoveryData>(initialDiscoveryData);
  const [stepIndex, setStepIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [leadId, setLeadId] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("dg-website-discovery");
    const url = new URL(window.location.href);
    let next = saved ? { ...initialDiscoveryData, ...JSON.parse(saved) } : { ...initialDiscoveryData };
    next = {
      ...next,
      companyName: url.searchParams.get("company") || next.companyName,
      website: url.searchParams.get("website") || next.website,
      contactPerson: url.searchParams.get("contact") || next.contactPerson,
      email: url.searchParams.get("email") || next.email,
    };
    setData(next);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("dg-website-discovery", JSON.stringify(data));
  }, [data]);

  const needsRecruiting =
    data.goals.includes("Mehr Bewerbungen") || data.audiences.includes("Bewerber");

  const visibleSteps = useMemo(() => {
    return allSteps.filter((step) => {
      if (step === "recruiting" && !needsRecruiting) return false;
      if (step === "assistant" && !data.features.includes("AI-Assistent")) return false;
      return true;
    });
  }, [needsRecruiting, data.features]);

  useEffect(() => {
    if (stepIndex > visibleSteps.length - 1) setStepIndex(Math.max(0, visibleSteps.length - 1));
  }, [stepIndex, visibleSteps.length]);

  const activeStep = visibleSteps[stepIndex];
  const progress = ((stepIndex + 1) / visibleSteps.length) * 100;
  const recommendations = useMemo(() => buildRecommendations(data), [data]);

  const update = <K extends keyof DiscoveryData>(key: K, value: DiscoveryData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const canContinue = useMemo(() => {
    switch (activeStep) {
      case "identity": return Boolean(data.companyName.trim());
      case "goals": return data.goals.length > 0;
      case "audiences": return data.audiences.length > 0;
      case "recruiting": return Boolean(data.recruitingNeed);
      case "channels": return data.contactChannels.length > 0;
      case "media": return data.mediaAssets.length > 0;
      case "visual": return Boolean(data.visualDirection);
      case "traits": return data.visualTraits.length > 0;
      case "features": return true;
      case "assistant": return data.aiAssistantTasks.length > 0;
      case "automation": return true;
      case "footprint": return data.locations > 0 && data.languages.length > 0;
      case "notes": return true;
      case "contact": return Boolean(data.email.trim() || data.phone.trim());
      default: return true;
    }
  }, [activeStep, data]);

  const next = () => {
    if (!canContinue) return;
    if (stepIndex < visibleSteps.length - 1) setStepIndex((i) => i + 1);
  };

  const back = () => setStepIndex((i) => Math.max(0, i - 1));

  async function submit() {
    setSending(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, recommendations }),
      });
      if (!response.ok) throw new Error("Die Angaben konnten nicht gespeichert werden.");
      const result = await response.json();
      setLeadId(result.id || "");
      setSubmitted(true);
      window.localStorage.removeItem("dg-website-discovery");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unbekannter Fehler");
    } finally {
      setSending(false);
    }
  }

  function downloadBriefing() {
    const payload = JSON.stringify({ ...data, recommendations, leadId }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `${(data.companyName || "website").toLowerCase().replace(/[^a-z0-9]+/gi, "-")}-discovery.json`;
    a.click();
    URL.revokeObjectURL(href);
  }

  if (!started) {
    return (
      <main className="site-shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <header className="topbar">
          <a className="brand" href="#" aria-label="Digitale Gewinner">
            <span className="brand-mark">DG</span>
            <span>Digitale Gewinner</span>
          </a>
          <span className="secure-label"><ShieldCheck size={16} /> Vertrauliches Projekt-Briefing</span>
        </header>

        <section className="hero-grid">
          <div className="hero-copy">
            <span className="hero-kicker"><Sparkles size={15} /> Website Discovery</span>
            <h1>Ihre neue Website beginnt nicht mit Design.</h1>
            <p className="hero-lead">Sie beginnt damit, Ihr Unternehmen richtig zu verstehen. In wenigen Minuten erfassen wir Ziele, Zielgruppen, Recruiting, Funktionen und die visuelle Richtung — damit Ihr erster Entwurf bereits erstaunlich nah am Ziel liegt.</p>
            <button className="primary-cta" onClick={() => setStarted(true)}>
              Projekt-Briefing starten <ArrowRight size={18} />
            </button>
            <div className="hero-meta">
              <span>ca. 3–5 Minuten</span><i />
              <span>kein Technik-Wissen nötig</span><i />
              <span>jederzeit fortsetzbar</span>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="signal-card signal-main">
              <span className="signal-icon"><Target size={18} /></span>
              <small>Primäres Ziel erkannt</small>
              <strong>Kunden + Mitarbeiter gewinnen</strong>
              <div className="signal-progress"><span /></div>
            </div>
            <div className="signal-card signal-float one"><Users size={17} /><span>Employer Brand</span><Check size={16} /></div>
            <div className="signal-card signal-float two"><Bot size={17} /><span>AI-Assistent</span><Check size={16} /></div>
            <div className="signal-card signal-float three"><Zap size={17} /><span>Conversion Funnel</span><Check size={16} /></div>
            <div className="orb orb-a" /><div className="orb orb-b" />
          </div>
        </section>

        <footer className="hero-footer">
          <span>Strategie</span><ChevronRight size={14} /><span>Design</span><ChevronRight size={14} /><span>Funnels</span><ChevronRight size={14} /><span>AI</span><ChevronRight size={14} /><span>Launch</span>
        </footer>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="site-shell result-shell">
        <header className="topbar">
          <div className="brand"><span className="brand-mark">DG</span><span>Digitale Gewinner</span></div>
          <span className="secure-label"><CheckCircle2 size={16} /> Briefing vollständig</span>
        </header>
        <section className="result-wrap">
          <div className="result-intro">
            <span className="success-orb"><Check size={32} /></span>
            <span className="eyebrow">Discovery abgeschlossen</span>
            <h1>Wir haben jetzt ein klares Bild.</h1>
            <p>Aus Ihren Antworten entsteht kein Standard-Briefing, sondern eine konkrete Empfehlung für die digitale Experience von <strong>{data.companyName}</strong>.</p>
          </div>

          <div className="recommendation-grid">
            {recommendations.map((item) => (
              <article className="recommendation-card" key={item.label}>
                <span className={`category-dot ${item.category}`} />
                <div><strong>{item.label}</strong><p>{item.reason}</p></div>
              </article>
            ))}
          </div>

          <div className="result-summary">
            <div><span>Designrichtung</span><strong>{visualDirections.find((v) => v.id === data.visualDirection)?.name || "Offen"}</strong></div>
            <div><span>Standorte</span><strong>{data.locations}</strong></div>
            <div><span>Sprachen</span><strong>{data.languages.length}</strong></div>
            <div><span>Interaktive Module</span><strong>{recommendations.filter((r) => ["growth", "recruiting", "automation"].includes(r.category)).length}</strong></div>
          </div>

          <div className="result-actions">
            <button className="secondary-cta" onClick={downloadBriefing}><Download size={17} /> Briefing herunterladen</button>
            <a className="primary-cta" href="mailto:info@digitalegewinner.de">Nächsten Schritt besprechen <ArrowRight size={18} /></a>
          </div>
          {leadId ? <p className="lead-id">Projekt-ID: {leadId}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="site-shell funnel-shell">
      <header className="topbar funnel-topbar">
        <button className="brand brand-button" onClick={() => setStarted(false)}><span className="brand-mark">DG</span><span>Website Discovery</span></button>
        <div className="progress-copy"><span>{Math.round(progress)}%</span> vorbereitet</div>
      </header>
      <div className="progress-track"><motion.span animate={{ width: `${progress}%` }} transition={{ duration: reduceMotion ? 0 : 0.35 }} /></div>

      <section className="funnel-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeStep}
            className="question-card"
            initial={reduceMotion ? false : { opacity: 0, x: 24, filter: "blur(5px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -18, filter: "blur(4px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {activeStep === "identity" && (
              <>
                <SectionHeading eyebrow="01 · Unternehmen" title="Womit dürfen wir arbeiten?" description="Die Basis reicht. Vieles recherchieren und prüfen wir später selbst." />
                <div className="field-grid">
                  <label><span>Unternehmen *</span><input value={data.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="z. B. Walterhof GmbH" autoFocus /></label>
                  <label><span>Aktuelle Website</span><input value={data.website} onChange={(e) => update("website", e.target.value)} placeholder="https://…" inputMode="url" /></label>
                  <label className="field-wide"><span>Ansprechpartner</span><input value={data.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} placeholder="Name der Ansprechperson" /></label>
                </div>
              </>
            )}

            {activeStep === "goals" && (
              <>
                <SectionHeading eyebrow="02 · Ziel" title="Was soll die Website für Ihr Unternehmen leisten?" description="Mehrfachauswahl möglich. Wir bauen die Architektur später um diese Ziele herum." />
                <div className="option-grid">{goalOptions.map((o) => <OptionCard key={o} label={o} selected={data.goals.includes(o)} onClick={() => update("goals", toggle(data.goals, o))} />)}</div>
              </>
            )}

            {activeStep === "audiences" && (
              <>
                <SectionHeading eyebrow="03 · Zielgruppen" title="Für wen muss sich die Website richtig anfühlen?" description="Unterschiedliche Zielgruppen bekommen bei Bedarf eigene Wege statt dieselbe Startseite für alle." />
                <div className="option-grid">{audienceOptions.map((o) => <OptionCard key={o} label={o} selected={data.audiences.includes(o)} onClick={() => update("audiences", toggle(data.audiences, o))} />)}</div>
              </>
            )}

            {activeStep === "recruiting" && (
              <>
                <SectionHeading eyebrow="04 · Recruiting" title="Wie wichtig ist Mitarbeitergewinnung aktuell?" description="Damit entscheiden wir, ob ein Karrierebereich reicht oder eine vollständige Employer-Branding-Experience sinnvoll ist." />
                <div className="option-stack">{recruitingOptions.map((o) => <OptionCard key={o} label={o} selected={data.recruitingNeed === o} onClick={() => update("recruitingNeed", o)} />)}</div>
                {["mehrere offene Stellen", "dauerhaft hoher Personalbedarf"].includes(data.recruitingNeed) ? <div className="smart-note"><WandSparkles size={18} /><div><strong>Unsere Empfehlung</strong><span>Employer Branding + Karrierebereich + 60-Sekunden-Bewerbungsfunnel einplanen.</span></div></div> : null}
              </>
            )}

            {activeStep === "channels" && (
              <>
                <SectionHeading eyebrow="05 · Conversion" title="Wie sollen Menschen am liebsten den nächsten Schritt gehen?" description="Wir setzen nicht überall zehn CTAs ein. Wir bestimmen einen klaren Hauptweg und sinnvolle Alternativen." />
                <div className="option-grid">{channelOptions.map((o) => <OptionCard key={o} label={o} selected={data.contactChannels.includes(o)} onClick={() => update("contactChannels", toggle(data.contactChannels, o))} />)}</div>
              </>
            )}

            {activeStep === "media" && (
              <>
                <SectionHeading eyebrow="06 · Inhalte" title="Welche echten Inhalte stehen bereits zur Verfügung?" description="Echte Unternehmensrealität hat Vorrang. Fehlende Medien können wir gezielt planen und nur sinnvoll mit KI ergänzen." />
                <div className="option-grid">{mediaOptions.map((o) => <OptionCard key={o} label={o} selected={data.mediaAssets.includes(o)} onClick={() => update("mediaAssets", toggle(data.mediaAssets, o))} />)}</div>
              </>
            )}

            {activeStep === "visual" && (
              <>
                <SectionHeading eyebrow="07 · Design DNA" title="Welche Richtung fühlt sich eher nach Ihrem Unternehmen an?" description="Nicht als fertiges Design verstehen — wir nutzen Ihre Auswahl als visuelle Leitplanke." />
                <div className="visual-grid">
                  {visualDirections.map((v) => (
                    <button key={v.id} type="button" className={`visual-card ${v.className} ${data.visualDirection === v.id ? "is-selected" : ""}`} onClick={() => update("visualDirection", v.id)}>
                      <div className="visual-preview"><i /><i /><i /><span /></div>
                      <div className="visual-label"><div><strong>{v.name}</strong><small>{v.subtitle}</small></div><span className="option-check">{data.visualDirection === v.id ? <Check size={16} strokeWidth={3} /> : null}</span></div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {activeStep === "traits" && (
              <>
                <SectionHeading eyebrow="08 · Persönlichkeit" title="Welche Eigenschaften soll die Website ausstrahlen?" description="Wählen Sie die Wörter, die Besucher nach dem ersten Eindruck fühlen sollen." />
                <div className="pill-grid">{traitOptions.map((o) => <button type="button" key={o} className={`choice-pill ${data.visualTraits.includes(o) ? "is-selected" : ""}`} onClick={() => update("visualTraits", toggle(data.visualTraits, o))}>{data.visualTraits.includes(o) ? <Check size={15} /> : null}{o}</button>)}</div>
              </>
            )}

            {activeStep === "features" && (
              <>
                <SectionHeading eyebrow="09 · Funktionen" title="Was wäre für Ihr Unternehmen besonders wertvoll?" description="Sie müssen nicht wissen, was technisch notwendig ist. Wir nutzen die Auswahl als Signal und empfehlen später nur, was wirklich Sinn ergibt." />
                <div className="option-grid compact">{featureOptions.map((o) => <OptionCard key={o} label={o} selected={data.features.includes(o)} onClick={() => update("features", toggle(data.features, o))} />)}</div>
              </>
            )}

            {activeStep === "assistant" && (
              <>
                <SectionHeading eyebrow="10 · AI-Assistent" title="Wobei soll Ihr digitaler Assistent helfen?" description="Er wird als digitaler Assistent gekennzeichnet, wirkt aber wie ein hochwertiger persönlicher Ansprechpartner und kennt nur verifizierte Unternehmensinformationen." />
                <div className="assistant-demo">
                  <div className="assistant-avatar"><Bot size={20} /></div>
                  <div className="assistant-bubble"><strong>Digitaler Assistent</strong><span>„Ich kann Besucher beraten, qualifizieren und direkt zum passenden nächsten Schritt führen.“</span></div>
                </div>
                <div className="option-grid">{assistantOptions.map((o) => <OptionCard key={o} label={o} selected={data.aiAssistantTasks.includes(o)} onClick={() => update("aiAssistantTasks", toggle(data.aiAssistantTasks, o))} />)}</div>
              </>
            )}

            {activeStep === "automation" && (
              <>
                <SectionHeading eyebrow="11 · Danach" title="Was soll nach einer Anfrage automatisch passieren?" description="Eine gute Website endet nicht bei „Formular gesendet“. Sie bringt den Lead zuverlässig in Ihren Prozess." />
                <div className="option-grid">{automationOptions.map((o) => <OptionCard key={o} label={o} selected={data.automations.includes(o)} onClick={() => update("automations", toggle(data.automations, o))} />)}</div>
              </>
            )}

            {activeStep === "footprint" && (
              <>
                <SectionHeading eyebrow="12 · Struktur" title="Wie groß muss die Website denken?" description="Standorte und Sprachen beeinflussen Navigation, Inhalte, lokale Suchmaschinenoptimierung und technische Architektur." />
                <div className="footprint-grid">
                  <label className="number-field"><span>Standorte</span><div><button type="button" onClick={() => update("locations", Math.max(1, data.locations - 1))}>−</button><strong>{data.locations}</strong><button type="button" onClick={() => update("locations", data.locations + 1)}>+</button></div></label>
                  <div className="language-field"><span>Sprachen</span><div className="pill-grid small">{languageOptions.map((o) => <button type="button" key={o} className={`choice-pill ${data.languages.includes(o) ? "is-selected" : ""}`} onClick={() => update("languages", toggle(data.languages, o))}>{data.languages.includes(o) ? <Check size={14} /> : null}{o}</button>)}</div></div>
                </div>
              </>
            )}

            {activeStep === "notes" && (
              <>
                <SectionHeading eyebrow="13 · Kontext" title="Was sollten wir unbedingt über das Projekt wissen?" description="Alles, was im Gespräch wichtig war: besondere Leistungen, aktuelle Probleme, Konkurrenz, Zeitdruck oder eine Idee, die Sie schon länger im Kopf haben." />
                <label className="textarea-field"><textarea value={data.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Optional — schreiben Sie einfach frei drauflos …" rows={7} /><span>{data.notes.length} Zeichen</span></label>
              </>
            )}

            {activeStep === "contact" && (
              <>
                <SectionHeading eyebrow="14 · Abschluss" title="Wohin dürfen wir die nächsten Schritte schicken?" description="Eine Kontaktmöglichkeit reicht. Ihre Angaben werden nur für dieses Projekt verwendet." />
                <div className="field-grid">
                  <label><span>E-Mail</span><input value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="name@unternehmen.de" inputMode="email" /></label>
                  <label><span>Telefon / WhatsApp</span><input value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+49 …" inputMode="tel" /></label>
                </div>
                <div className="preview-chips">
                  <Chip>{data.goals.length} Ziele</Chip><Chip>{data.audiences.length} Zielgruppen</Chip><Chip>{recommendations.length} Empfehlungen</Chip>
                </div>
                <div className="smart-note final-note"><Sparkles size={18} /><div><strong>Danach ist unsere Engine bereit.</strong><span>Ihre Antworten werden als strukturiertes Briefing für Strategie, Design, Funnels und den späteren Website-Build ausgegeben.</span></div></div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <nav className="funnel-nav" aria-label="Fragenavigation">
          <button className="back-button" onClick={back} disabled={stepIndex === 0}><ArrowLeft size={18} /> Zurück</button>
          {stepIndex < visibleSteps.length - 1 ? (
            <button className="primary-cta nav-next" onClick={next} disabled={!canContinue}>Weiter <ArrowRight size={18} /></button>
          ) : (
            <button className="primary-cta nav-next" onClick={submit} disabled={!canContinue || sending}>{sending ? "Wird vorbereitet …" : "Briefing abschließen"}<Sparkles size={17} /></button>
          )}
        </nav>
        {submitError ? <p className="form-error">{submitError}</p> : null}
      </section>

      <aside className="context-rail">
        <span className="context-title">Ihr Projekt</span>
        <div className="context-company"><div className="context-logo">{data.companyName ? data.companyName.slice(0, 2).toUpperCase() : "DG"}</div><div><strong>{data.companyName || "Neues Projekt"}</strong><span>{data.website || "Website Discovery"}</span></div></div>
        <div className="context-divider" />
        <span className="context-title">Bereits erkannt</span>
        <div className="context-items">
          {data.goals.slice(0, 2).map((item) => <span key={item}><Target size={14} />{item}</span>)}
          {needsRecruiting ? <span><BriefcaseBusiness size={14} />Recruiting relevant</span> : null}
          {data.features.includes("AI-Assistent") ? <span><Bot size={14} />AI-Assistent</span> : null}
          {data.mediaAssets.includes("Videos") ? <span><PlayCircle size={14} />Video vorhanden</span> : null}
          {data.mediaAssets.includes("Professionelle Fotos") ? <span><ImageIcon size={14} />Fotomaterial vorhanden</span> : null}
          {data.locations > 1 ? <span><Globe2 size={14} />{data.locations} Standorte</span> : null}
          {data.contactChannels.includes("WhatsApp") ? <span><MessageCircle size={14} />WhatsApp gewünscht</span> : null}
        </div>
        <div className="context-spacer" />
        <div className="privacy-mini"><ShieldCheck size={15} /><span>Zwischenstand wird lokal auf diesem Gerät gespeichert.</span></div>
      </aside>
    </main>
  );
}
