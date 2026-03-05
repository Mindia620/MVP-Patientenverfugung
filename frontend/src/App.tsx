import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import type { FieldPath } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { api, type GeneratedDocSummary, type PackageSummary } from "./lib/api";
import { clearDraft, loadDraft, saveDraft } from "./lib/draftStorage";
import { defaultAnswers, type WizardAnswers, wizardSchema } from "./wizardSchema";

type User = {
  id: string;
  email: string;
};

const stepKeys = [
  "intro",
  "personal",
  "trusted",
  "medical",
  "scenarios",
  "values",
  "summary",
  "account",
  "generate",
] as const;

const stepValidationFields: Partial<Record<number, FieldPath<WizardAnswers>[]>> = {
  1: [
    "personal.firstName",
    "personal.lastName",
    "personal.birthDate",
    "personal.addressLine1",
    "personal.postalCode",
    "personal.city",
  ],
  2: ["trustedPerson.fullName", "trustedPerson.relationship", "trustedPerson.phone"],
  3: [
    "medical.cpr",
    "medical.ventilation",
    "medical.artificialNutrition",
    "medical.dialysis",
    "medical.antibiotics",
    "medical.painManagement",
  ],
  4: ["scenarios.terminalIllness", "scenarios.irreversibleUnconsciousness", "scenarios.severeDementia"],
};

const medicalTooltips = {
  de: {
    cpr: "Wiederbelebung bei Herz-Kreislauf-Stillstand.",
    ventilation: "Maschinelle Unterstützung der Atmung.",
    artificialNutrition: "Ernährung über Sonde oder Infusion.",
    dialysis: "Blutwäsche bei Nierenversagen.",
    antibiotics: "Medikamente gegen bakterielle Infektionen.",
    painManagement: "Festlegung, wie stark Schmerzen gelindert werden sollen.",
  },
  en: {
    cpr: "Resuscitation after cardiac arrest.",
    ventilation: "Mechanical support for breathing.",
    artificialNutrition: "Tube or infusion-based nutrition.",
    dialysis: "Blood filtering treatment for kidney failure.",
    antibiotics: "Medication against bacterial infections.",
    painManagement: "How aggressively pain should be treated.",
  },
};

const authInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function App() {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(0);
  const [view, setView] = useState<"wizard" | "dashboard">("wizard");
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [packages, setPackages] = useState<PackageSummary[]>([]);
  const [lastGeneration, setLastGeneration] = useState<{
    packageId: string;
    documents: GeneratedDocSummary[];
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const tooltipLocale = i18n.language.startsWith("en") ? "en" : "de";
  const appLocale = i18n.language.startsWith("en") ? "en" : "de";

  const { register, handleSubmit, watch, trigger, getValues, setError, formState, reset } = useForm<WizardAnswers>({
    resolver: zodResolver(wizardSchema),
    defaultValues: defaultAnswers,
    mode: "onBlur",
  });

  useEffect(() => {
    const draft = loadDraft();
    reset(draft);
  }, [reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      const merged = wizardSchema.safeParse({ ...defaultAnswers, ...value });
      if (merged.success) {
        saveDraft(merged.data);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const loadSession = async () => {
    try {
      const me = await api.me();
      setUser(me.user);
      const result = await api.listPackages();
      setPackages(result.packages);
    } catch {
      setUser(null);
      setPackages([]);
    }
  };

  useEffect(() => {
    void loadSession();
  }, []);

  const nextStep = async () => {
    const validationFields = stepValidationFields[step];
    if (validationFields) {
      const isValid = await trigger(validationFields);
      if (!isValid) {
        return;
      }
    }

    if (step === 6) {
      const accepted = getValues("disclaimerAccepted");
      if (!accepted) {
        setError("disclaimerAccepted", { type: "manual", message: t("common.required") });
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, stepKeys.length - 1));
  };

  const previousStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const submitAuth = async () => {
    setAuthError("");
    const parsed = authInputSchema.safeParse({ email: authEmail, password: authPassword });
    if (!parsed.success) {
      setAuthError("Please provide valid credentials (email + min 8 character password).");
      return;
    }

    setIsAuthLoading(true);
    try {
      const authResult =
        authMode === "register"
          ? await api.register(parsed.data.email, parsed.data.password)
          : await api.login(parsed.data.email, parsed.data.password);

      setUser(authResult.user);
      const result = await api.listPackages();
      setPackages(result.packages);
      setStep(8);
      setStatusMessage("Authenticated. You can now securely save and generate your documents.");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGenerate = async (answers: WizardAnswers) => {
    if (!user) {
      setStatusMessage("Please authenticate before generating documents.");
      setStep(7);
      return;
    }

    setIsGenerating(true);
    setStatusMessage("");
    try {
      const created = await api.createPackage(appLocale, answers);
      const generated = await api.generateDocuments(created.package.id);
      setLastGeneration({ packageId: created.package.id, documents: generated.documents });
      const result = await api.listPackages();
      setPackages(result.packages);
      clearDraft();
      setStatusMessage("PDF documents created successfully.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Failed to generate documents.");
    } finally {
      setIsGenerating(false);
    }
  };

  const answers = watch();

  const stepTitle = useMemo(() => t(`steps.${stepKeys[step]}`), [step, t]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8">
        <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">{t("appTitle")}</h1>
              <p className="text-sm text-slate-600">{t("subtitle")}</p>
              <p className="mt-2 rounded-md bg-amber-50 p-2 text-xs text-amber-800">{t("disclaimer")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={buttonClass(view === "wizard")}
                onClick={() => setView("wizard")}
              >
                {t("nav.wizard")}
              </button>
              <button
                type="button"
                className={buttonClass(view === "dashboard")}
                onClick={() => user && setView("dashboard")}
                disabled={!user}
              >
                {t("nav.dashboard")}
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
                onClick={() => i18n.changeLanguage(i18n.language.startsWith("en") ? "de" : "en")}
              >
                {i18n.language.startsWith("en") ? "DE" : "EN"}
              </button>
              {user && (
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
                  onClick={async () => {
                    await api.logout();
                    setUser(null);
                    setPackages([]);
                    setView("wizard");
                    setStep(7);
                  }}
                >
                  {t("nav.logout")}
                </button>
              )}
            </div>
          </div>
        </header>

        {view === "wizard" ? (
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <p className="text-sm text-slate-500">
                Step {step + 1} / {stepKeys.length}
              </p>
              <h2 className="text-xl font-semibold">{stepTitle}</h2>
            </div>

            <form
              onSubmit={handleSubmit(async (data) => {
                await handleGenerate(data);
              })}
              className="space-y-6"
            >
              {step === 0 && (
                <div className="space-y-4">
                  <p>
                    {i18n.language.startsWith("en")
                      ? "The wizard guides you through legally structured German advance directive documents in clear steps."
                      : "Der Wizard führt Sie schrittweise durch rechtlich strukturierte deutsche Vorsorgedokumente."}
                  </p>
                  <p className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    {i18n.language.startsWith("en")
                      ? "You can complete everything anonymously first. Account creation is only required before cloud save and PDF generation."
                      : "Sie können zunächst alles anonym ausfüllen. Ein Konto ist erst vor Online-Speicherung und PDF-Erstellung erforderlich."}
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label={label(i18n.language, "First name", "Vorname")} error={formState.errors.personal?.firstName?.message}>
                    <input className={inputClass} {...register("personal.firstName")} />
                  </Input>
                  <Input label={label(i18n.language, "Last name", "Nachname")} error={formState.errors.personal?.lastName?.message}>
                    <input className={inputClass} {...register("personal.lastName")} />
                  </Input>
                  <Input label={label(i18n.language, "Date of birth", "Geburtsdatum")} error={formState.errors.personal?.birthDate?.message}>
                    <input type="date" className={inputClass} {...register("personal.birthDate")} />
                  </Input>
                  <Input label={label(i18n.language, "Address", "Adresse")} error={formState.errors.personal?.addressLine1?.message}>
                    <input className={inputClass} {...register("personal.addressLine1")} />
                  </Input>
                  <Input label={label(i18n.language, "Postal code", "PLZ")} error={formState.errors.personal?.postalCode?.message}>
                    <input className={inputClass} {...register("personal.postalCode")} />
                  </Input>
                  <Input label={label(i18n.language, "City", "Ort")} error={formState.errors.personal?.city?.message}>
                    <input className={inputClass} {...register("personal.city")} />
                  </Input>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label={label(i18n.language, "Trusted person full name", "Name der Vertrauensperson")}
                    error={formState.errors.trustedPerson?.fullName?.message}
                  >
                    <input className={inputClass} {...register("trustedPerson.fullName")} />
                  </Input>
                  <Input
                    label={label(i18n.language, "Relationship", "Beziehung")}
                    error={formState.errors.trustedPerson?.relationship?.message}
                  >
                    <input className={inputClass} {...register("trustedPerson.relationship")} />
                  </Input>
                  <Input label={label(i18n.language, "Phone", "Telefon")} error={formState.errors.trustedPerson?.phone?.message}>
                    <input className={inputClass} {...register("trustedPerson.phone")} />
                  </Input>
                  <Input label={label(i18n.language, "Email (optional)", "E-Mail (optional)")}>
                    <input type="email" className={inputClass} {...register("trustedPerson.email")} />
                  </Input>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <Choice
                    label={label(i18n.language, "CPR", "Wiederbelebung (CPR)")}
                    tooltip={medicalTooltips[tooltipLocale].cpr}
                    value={answers.medical?.cpr}
                    onChange={register("medical.cpr").onChange}
                    name="medical.cpr"
                  />
                  <Choice
                    label={label(i18n.language, "Ventilation", "Beatmung")}
                    tooltip={medicalTooltips[tooltipLocale].ventilation}
                    value={answers.medical?.ventilation}
                    onChange={register("medical.ventilation").onChange}
                    name="medical.ventilation"
                  />
                  <Choice
                    label={label(i18n.language, "Artificial nutrition", "Künstliche Ernährung")}
                    tooltip={medicalTooltips[tooltipLocale].artificialNutrition}
                    value={answers.medical?.artificialNutrition}
                    onChange={register("medical.artificialNutrition").onChange}
                    name="medical.artificialNutrition"
                  />
                  <Choice
                    label={label(i18n.language, "Dialysis", "Dialyse")}
                    tooltip={medicalTooltips[tooltipLocale].dialysis}
                    value={answers.medical?.dialysis}
                    onChange={register("medical.dialysis").onChange}
                    name="medical.dialysis"
                  />
                  <Choice
                    label={label(i18n.language, "Antibiotics", "Antibiotika")}
                    tooltip={medicalTooltips[tooltipLocale].antibiotics}
                    value={answers.medical?.antibiotics}
                    onChange={register("medical.antibiotics").onChange}
                    name="medical.antibiotics"
                  />
                  <Choice
                    label={label(i18n.language, "Pain management", "Schmerzbehandlung")}
                    tooltip={medicalTooltips[tooltipLocale].painManagement}
                    value={answers.medical?.painManagement}
                    onChange={register("medical.painManagement").onChange}
                    name="medical.painManagement"
                    options={[
                      { value: "full_relief", label: label(i18n.language, "Maximal relief", "Maximale Linderung") },
                      { value: "balanced", label: label(i18n.language, "Balanced", "Ausgewogen") },
                      { value: "minimal", label: label(i18n.language, "Minimal", "Zurückhaltend") },
                    ]}
                  />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <Choice
                    label={label(i18n.language, "Terminal illness", "Terminale Erkrankung")}
                    value={answers.scenarios?.terminalIllness}
                    onChange={register("scenarios.terminalIllness").onChange}
                    name="scenarios.terminalIllness"
                    options={scenarioOptions(i18n.language)}
                  />
                  <Choice
                    label={label(i18n.language, "Irreversible unconsciousness", "Irreversible Bewusstlosigkeit")}
                    value={answers.scenarios?.irreversibleUnconsciousness}
                    onChange={register("scenarios.irreversibleUnconsciousness").onChange}
                    name="scenarios.irreversibleUnconsciousness"
                    options={scenarioOptions(i18n.language)}
                  />
                  <Choice
                    label={label(i18n.language, "Severe dementia", "Schwere Demenz")}
                    value={answers.scenarios?.severeDementia}
                    onChange={register("scenarios.severeDementia").onChange}
                    name="scenarios.severeDementia"
                    options={scenarioOptions(i18n.language)}
                  />
                </div>
              )}

              {step === 5 && (
                <Input label={label(i18n.language, "Values and personal wishes (optional)", "Werte und persönliche Wünsche (optional)")}>
                  <textarea rows={6} className={inputClass} {...register("valuesAndWishes")} />
                </Input>
              )}

              {step === 6 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">{label(i18n.language, "Review your inputs", "Eingaben prüfen")}</h3>
                  <pre className="overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
                    {JSON.stringify(answers, null, 2)}
                  </pre>
                  <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" className="mt-1" {...register("disclaimerAccepted")} />
                    <span>
                      {label(
                        i18n.language,
                        "I understand this service is not legal advice and I should review final documents with qualified professionals where needed.",
                        "Ich verstehe, dass dieser Service keine Rechtsberatung ist und ich die finalen Dokumente bei Bedarf mit qualifizierten Fachpersonen prüfen sollte.",
                      )}
                    </span>
                  </label>
                  {formState.errors.disclaimerAccepted && (
                    <p className="text-sm text-red-600">{formState.errors.disclaimerAccepted.message}</p>
                  )}
                </div>
              )}

              {step === 7 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">{t("auth.title")}</h3>
                  <p className="text-sm text-slate-600">{t("auth.saveInfo")}</p>
                  <Input label={t("auth.email")}>
                    <input type="email" className={inputClass} value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
                  </Input>
                  <Input label={t("auth.password")}>
                    <input
                      type="password"
                      className={inputClass}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                    />
                  </Input>
                  {authError && <p className="text-sm text-red-600">{authError}</p>}
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
                      onClick={() => void submitAuth()}
                      disabled={isAuthLoading}
                    >
                      {authMode === "register" ? t("auth.register") : t("auth.login")}
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50"
                      onClick={() => setAuthMode((prev) => (prev === "register" ? "login" : "register"))}
                    >
                      {authMode === "register" ? t("auth.switchToLogin") : t("auth.switchToRegister")}
                    </button>
                  </div>
                </div>
              )}

              {step === 8 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    {label(i18n.language, "Generate your A4 PDFs", "A4-PDF-Dokumente erzeugen")}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {label(
                      i18n.language,
                      "This will create Patientenverfügung, Vorsorgevollmacht, and Betreuungsverfügung from your answers.",
                      "Es werden Patientenverfügung, Vorsorgevollmacht und Betreuungsverfügung aus Ihren Angaben erstellt.",
                    )}
                  </p>
                  <button
                    type="submit"
                    className="rounded-md bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-600 disabled:opacity-70"
                    disabled={isGenerating}
                  >
                    {isGenerating
                      ? label(i18n.language, "Generating...", "Erzeuge...")
                      : label(i18n.language, "Save package and generate PDFs", "Paket speichern und PDFs erzeugen")}
                  </button>

                  {lastGeneration && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                      <h4 className="font-medium">{label(i18n.language, "Downloads", "Downloads")}</h4>
                      <ul className="mt-2 space-y-1 text-sm">
                        {lastGeneration.documents.map((doc) => (
                          <li key={doc.id}>
                            <a
                              className="text-emerald-800 underline"
                              href={api.downloadUrl(lastGeneration.packageId, doc.id)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {doc.fileName}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {statusMessage && <p className="rounded-md bg-slate-100 p-3 text-sm text-slate-700">{statusMessage}</p>}

              <div className="flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50 disabled:opacity-60"
                  onClick={previousStep}
                  disabled={step === 0}
                >
                  {t("common.back")}
                </button>
                {step < 8 && (
                  <button
                    type="button"
                    className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
                    onClick={() => void nextStep()}
                  >
                    {t("common.next")}
                  </button>
                )}
              </div>
            </form>
          </section>
        ) : (
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">{t("nav.dashboard")}</h2>
            {!user ? (
              <p className="mt-2 text-sm text-slate-600">
                {label(i18n.language, "Please sign in to view packages.", "Bitte anmelden, um gespeicherte Pakete zu sehen.")}
              </p>
            ) : packages.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">
                {label(i18n.language, "No saved packages yet.", "Noch keine gespeicherten Pakete.")}
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {packages.map((pkg) => (
                  <article key={pkg.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{pkg.id}</p>
                      <p className="text-xs text-slate-500">{new Date(pkg.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      Status: {pkg.status} · Locale: {pkg.locale}
                    </p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                      {pkg.generatedDocuments.map((doc) => (
                        <li key={doc.id}>
                          <a
                            href={api.downloadUrl(pkg.id, doc.id)}
                            className="text-slate-800 underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {doc.fileName}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function label(locale: string, en: string, de: string) {
  return locale.startsWith("en") ? en : de;
}

function Input({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}

function Choice({
  label,
  name,
  value,
  onChange,
  tooltip,
  options,
}: {
  label: string;
  name: string;
  value?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  tooltip?: string;
  options?: { value: string; label: string }[];
}) {
  const defaultOptions = [
    { value: "yes", label: "Yes / Ja" },
    { value: "no", label: "No / Nein" },
    { value: "case_by_case", label: "Case by case / Einzelfall" },
  ];
  const finalOptions = options ?? defaultOptions;

  return (
    <fieldset className="rounded-md border border-slate-200 p-3">
      <legend className="px-1 text-sm font-medium">
        {label} {tooltip && <span title={tooltip}>ⓘ</span>}
      </legend>
      <div className="mt-2 flex flex-wrap gap-3">
        {finalOptions.map((option) => (
          <label key={option.value} className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 transition focus:border-slate-500 focus:ring-2";

const buttonClass = (active: boolean) =>
  `rounded-md px-3 py-2 text-sm ${active ? "bg-slate-900 text-white" : "border border-slate-300 hover:bg-slate-50"}`;

const scenarioOptions = (locale: string) => [
  {
    value: "continue_treatment",
    label: label(locale, "Continue life-sustaining treatment", "Lebenserhaltende Maßnahmen fortführen"),
  },
  {
    value: "limit_treatment",
    label: label(locale, "Limit treatment", "Maßnahmen begrenzen"),
  },
  {
    value: "comfort_only",
    label: label(locale, "Comfort-focused care only", "Nur palliative Komfortversorgung"),
  },
];

export default App;
