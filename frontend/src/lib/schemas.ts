import { z } from 'zod';

const medicalPreferenceSchema = z.enum(['yes', 'no', 'situation_dependent']);

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  placeOfBirth: z.string().min(2, 'Place of birth is required'),
  address: z.object({
    street: z.string().min(3, 'Street is required'),
    postalCode: z.string().regex(/^\d{5}$/, 'Postal code must be 5 digits'),
    city: z.string().min(2, 'City is required'),
  }),
});

export const trustedPersonSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
});

export const medicalPreferencesSchema = z.object({
  cpr: medicalPreferenceSchema,
  ventilation: medicalPreferenceSchema,
  artificialNutrition: medicalPreferenceSchema,
  dialysis: medicalPreferenceSchema,
  antibiotics: medicalPreferenceSchema,
  painManagement: medicalPreferenceSchema,
});

const scenarioChoiceSchema = z.union([
  z.literal('same'),
  z.literal('different'), // MVP: "different" = doctor decides with context
  z.object({
    cpr: medicalPreferenceSchema.optional(),
    ventilation: medicalPreferenceSchema.optional(),
    artificialNutrition: medicalPreferenceSchema.optional(),
    dialysis: medicalPreferenceSchema.optional(),
    antibiotics: medicalPreferenceSchema.optional(),
    painManagement: medicalPreferenceSchema.optional(),
  }),
]);

export const scenariosSchema = z.object({
  terminalIllness: scenarioChoiceSchema,
  irreversibleUnconsciousness: scenarioChoiceSchema,
  severeDementia: scenarioChoiceSchema,
});

export const wizardAnswersSchema = z.object({
  personalInfo: personalInfoSchema,
  trustedPerson: trustedPersonSchema,
  alternatePerson: trustedPersonSchema.optional(),
  medicalPreferences: medicalPreferencesSchema,
  scenarios: scenariosSchema,
  additionalWishes: z.string().max(2000).optional(),
});

export type WizardAnswersInput = z.infer<typeof wizardAnswersSchema>;
