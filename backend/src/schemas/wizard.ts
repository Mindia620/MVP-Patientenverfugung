import { z } from "zod";

const consentEnum = z.enum(["yes", "no", "case_by_case"]);
const painEnum = z.enum(["full_relief", "balanced", "minimal"]);
const scenarioEnum = z.enum(["continue_treatment", "limit_treatment", "comfort_only"]);

export const wizardAnswersSchema = z.object({
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

export const createPackageSchema = z.object({
  locale: z.enum(["de", "en"]).default("de"),
  answers: wizardAnswersSchema,
});

export type WizardAnswers = z.infer<typeof wizardAnswersSchema>;
