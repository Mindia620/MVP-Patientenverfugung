import { z } from 'zod'

const personalInfoSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  birthDate: z.string().min(1),
  birthPlace: z.string().min(1).max(100),
  street: z.string().min(1).max(200),
  postalCode: z.string().regex(/^\d{5}$/),
  city: z.string().min(1).max(100),
})

const representativeSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  relationship: z.string().min(1),
  street: z.string().min(1).max(200),
  postalCode: z.string().regex(/^\d{5}$/),
  city: z.string().min(1).max(100),
  phone: z.string().optional(),
})

const treatmentChoice = z.enum(['yes', 'no', 'doctor'])

const medicalPreferencesSchema = z.object({
  cpr: treatmentChoice,
  ventilation: treatmentChoice,
  artificialNutrition: treatmentChoice,
  dialysis: treatmentChoice,
  antibiotics: treatmentChoice,
  painManagement: z.enum(['maxRelief', 'lifeFirst', 'balanced']),
})

const scenarioChoicesSchema = z.object({
  terminalIllness: z.array(z.string()),
  irreversibleUnconsciousness: z.array(z.string()),
  severeDementia: z.array(z.string()),
})

const personalValuesSchema = z.object({
  personalStatement: z.string().max(2000).optional(),
  religiousWishes: z.string().max(500).optional(),
  organDonation: z.enum(['yes', 'no', 'unspecified']),
})

export const wizardAnswersSchema = z.object({
  personalInfo: personalInfoSchema,
  representative: representativeSchema,
  substituteRepresentative: representativeSchema.optional(),
  medicalPreferences: medicalPreferencesSchema,
  scenarioChoices: scenarioChoicesSchema,
  personalValues: personalValuesSchema,
})

export const createPackageSchema = z.object({
  answers: wizardAnswersSchema,
  title: z.string().max(200).optional(),
})

export type WizardAnswersData = z.infer<typeof wizardAnswersSchema>
export type CreatePackageBody = z.infer<typeof createPackageSchema>
