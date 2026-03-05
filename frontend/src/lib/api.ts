import type { WizardAnswers } from "../wizardSchema";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type ApiUser = {
  id: string;
  email: string;
};

export type GeneratedDocSummary = {
  id: string;
  type: "PATIENTENVERFUEGUNG" | "VORSORGEVOLLMACHT" | "BETREUUNGSVERFUEGUNG";
  fileName: string;
  version?: number;
  createdAt: string;
};

export type PackageSummary = {
  id: string;
  status: "DRAFT" | "GENERATED";
  locale: "de" | "en";
  createdAt: string;
  generatedDocuments: GeneratedDocSummary[];
};

const jsonFetch = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    const maybeJson = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(maybeJson.message ?? `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
};

export const api = {
  register: async (email: string, password: string) => {
    return jsonFetch<{ user: ApiUser }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  login: async (email: string, password: string) => {
    return jsonFetch<{ user: ApiUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return jsonFetch<void>("/api/auth/logout", {
      method: "POST",
    });
  },

  me: async () => {
    return jsonFetch<{ user: ApiUser }>("/api/auth/me");
  },

  listPackages: async () => {
    return jsonFetch<{ packages: PackageSummary[] }>("/api/packages");
  },

  createPackage: async (locale: "de" | "en", answers: WizardAnswers) => {
    return jsonFetch<{ package: { id: string } }>("/api/packages", {
      method: "POST",
      body: JSON.stringify({ locale, answers }),
    });
  },

  generateDocuments: async (packageId: string) => {
    return jsonFetch<{ documents: GeneratedDocSummary[] }>(`/api/packages/${packageId}/generate`, {
      method: "POST",
    });
  },

  downloadUrl: (packageId: string, documentId: string) =>
    `${API_URL}/api/packages/${packageId}/documents/${documentId}/download`,
};
