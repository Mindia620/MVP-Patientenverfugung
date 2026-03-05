import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {
  de: {
    translation: {
      appTitle: "Vorsorge Wizard",
      subtitle: "Ein vertrauenswürdiger, privatsphäreorientierter Assistent für Vorsorgedokumente.",
      disclaimer:
        "Hinweis: Diese Anwendung bietet strukturierte Entwürfe und ersetzt keine individuelle Rechts- oder Medizinberatung.",
      nav: {
        wizard: "Wizard",
        dashboard: "Dashboard",
        logout: "Abmelden",
      },
      common: {
        back: "Zurück",
        next: "Weiter",
        required: "Pflichtfeld",
      },
      steps: {
        intro: "Intro",
        personal: "Persönliche Angaben",
        trusted: "Vertrauensperson",
        medical: "Medizinische Präferenzen",
        scenarios: "Situative Szenarien",
        values: "Werte und Wünsche",
        summary: "Zusammenfassung",
        account: "Konto erstellen",
        generate: "PDF generieren",
      },
      auth: {
        title: "Konto erstellen oder anmelden",
        saveInfo:
          "Sie können den Wizard anonym nutzen. Für sicheres Online-Speichern und Abruf ist ein Konto erforderlich.",
        email: "E-Mail",
        password: "Passwort",
        register: "Konto erstellen",
        login: "Anmelden",
        switchToLogin: "Bereits ein Konto? Anmelden",
        switchToRegister: "Noch kein Konto? Registrieren",
      },
    },
  },
  en: {
    translation: {
      appTitle: "Vorsorge Wizard",
      subtitle: "A trustworthy, privacy-first assistant for advance directive documents.",
      disclaimer:
        "Disclaimer: This app provides structured drafting support and does not replace individualized legal or medical advice.",
      nav: {
        wizard: "Wizard",
        dashboard: "Dashboard",
        logout: "Logout",
      },
      common: {
        back: "Back",
        next: "Next",
        required: "Required field",
      },
      steps: {
        intro: "Intro",
        personal: "Personal Information",
        trusted: "Trusted Person",
        medical: "Medical Preferences",
        scenarios: "Situational Scenarios",
        values: "Values and Wishes",
        summary: "Summary",
        account: "Create Account",
        generate: "Generate PDF",
      },
      auth: {
        title: "Create account or sign in",
        saveInfo:
          "You can use the wizard anonymously. An account is required before secure cloud save and retrieval.",
        email: "Email",
        password: "Password",
        register: "Create account",
        login: "Sign in",
        switchToLogin: "Already have an account? Sign in",
        switchToRegister: "Need an account? Register",
      },
    },
  },
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: "de",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
