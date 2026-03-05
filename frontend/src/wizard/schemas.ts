import { z } from 'zod'

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Name erforderlich'),
  street: z.string().min(1, 'Straße erforderlich'),
  postalCode: z.string().regex(/^\d{5}$/, '5-stellige PLZ erforderlich'),
  city: z.string().min(1, 'Ort erforderlich'),
  dateOfBirth: z.string().min(1, 'Geburtsdatum erforderlich'),
  placeOfBirth: z.string().optional(),
})

export const trustedPersonSchema = z.object({
  fullName: z.string().min(1, 'Name erforderlich'),
  relationship: z.string().min(1, 'Beziehung erforderlich'),
  street: z.string().min(1, 'Straße erforderlich'),
  postalCode: z.string().regex(/^\d{5}$/, '5-stellige PLZ erforderlich'),
  city: z.string().min(1, 'Ort erforderlich'),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
})

export const medicalPreferenceSchema = z.enum(['allow', 'refuse', 'delegate'])

export const medicalPreferencesSchema = z.object({
  cpr: medicalPreferenceSchema,
  ventilation: medicalPreferenceSchema,
  artificialNutrition: medicalPreferenceSchema,
  dialysis: medicalPreferenceSchema,
  antibiotics: medicalPreferenceSchema,
  painManagement: medicalPreferenceSchema,
})

export const scenarioSchema = z.object({
  applyGeneral: z.union([z.boolean(), z.enum(['true', 'false'])]).transform((v) => v === true || v === 'true'),
  overrides: z.record(medicalPreferenceSchema).optional(),
  note: z.string().optional(),
})

export const scenariosSchema = z.object({
  terminalIllness: scenarioSchema,
  irreversibleUnconsciousness: scenarioSchema,
  severeDementia: scenarioSchema,
})

export const valuesSchema = z.object({
  religiousWishes: z.string().max(1000).optional(),
  otherWishes: z.string().max(1000).optional(),
})

export const answersSchema = z.object({
  version: z.literal('1.0'),
  personalInfo: personalInfoSchema,
  trustedPerson: trustedPersonSchema,
  trustedPerson2: trustedPersonSchema.optional(),
  medicalPreferences: medicalPreferencesSchema,
  scenarios: scenariosSchema,
  values: valuesSchema.optional(),
})
