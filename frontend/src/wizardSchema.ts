import { z } from "zod";

export const consentEnum = z.enum(["yes", "no", "case_by_case"]);
export const painEnum = z.enum(["full_relief", "balanced", "minimal"]);
export const scenarioEnum = z.enum(["continue_treatment", "limit_treatment", "comfort_only"]);

export const wizardSchema = z.object({
  personal: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    birthDate: z.string().min(1),
    addressLine1: z.string().min(1),
    postalCode: z.string().min(1),
    city: z.string().min(1),
  }),
  trustedPerson: z.object({
    fullName: z.string().min(1),
    relationship: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
  }),
  medical: z.object({
    cpr: consentEnum,
    ventilation: consentEnum,
    artificialNutrition: consentEnum,
    dialysis: consentEnum,
    antibiotics: consentEnum,
    painManagement: painEnum,
  }),
  scenarios: z.object({
    terminalIllness: scenarioEnum,
    irreversibleUnconsciousness: scenarioEnum,
    severeDementia: scenarioEnum,
  }),
  valuesAndWishes: z.string().max(2000).optional().or(z.literal("")),
  disclaimerAccepted: z.boolean(),
});

export type WizardAnswers = z.infer<typeof wizardSchema>;

export const defaultAnswers: WizardAnswers = {
  personal: {
    firstName: "",
    lastName: "",
    birthDate: "",
    addressLine1: "",
    postalCode: "",
    city: "",
  },
  trustedPerson: {
    fullName: "",
    relationship: "",
    phone: "",
    email: "",
  },
  medical: {
    cpr: "case_by_case",
    ventilation: "case_by_case",
    artificialNutrition: "case_by_case",
    dialysis: "case_by_case",
    antibiotics: "case_by_case",
    painManagement: "balanced",
  },
  scenarios: {
    terminalIllness: "comfort_only",
    irreversibleUnconsciousness: "comfort_only",
    severeDementia: "comfort_only",
  },
  valuesAndWishes: "",
  disclaimerAccepted: false,
};
