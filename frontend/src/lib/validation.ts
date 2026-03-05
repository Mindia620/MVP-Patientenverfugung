import { z } from 'zod'

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'required').max(100),
  lastName: z.string().min(1, 'required').max(100),
  birthDate: z.string().min(1, 'required'),
  birthPlace: z.string().min(1, 'required').max(100),
  street: z.string().min(1, 'required').max(200),
  postalCode: z.string().regex(/^\d{5}$/, 'invalidPostalCode'),
  city: z.string().min(1, 'required').max(100),
})

export const representativeSchema = z.object({
  firstName: z.string().min(1, 'required').max(100),
  lastName: z.string().min(1, 'required').max(100),
  relationship: z.string().min(1, 'required'),
  street: z.string().min(1, 'required').max(200),
  postalCode: z.string().regex(/^\d{5}$/, 'invalidPostalCode'),
  city: z.string().min(1, 'required').max(100),
  phone: z.string().optional(),
})

const treatmentChoiceSchema = z.enum(['yes', 'no', 'doctor'])

export const medicalPreferencesSchema = z.object({
  cpr: treatmentChoiceSchema,
  ventilation: treatmentChoiceSchema,
  artificialNutrition: treatmentChoiceSchema,
  dialysis: treatmentChoiceSchema,
  antibiotics: treatmentChoiceSchema,
  painManagement: z.enum(['maxRelief', 'lifeFirst', 'balanced']),
})

export const scenarioChoicesSchema = z.object({
  terminalIllness: z.array(z.string()),
  irreversibleUnconsciousness: z.array(z.string()),
  severeDementia: z.array(z.string()),
})

export const personalValuesSchema = z.object({
  personalStatement: z.string().max(2000).optional(),
  religiousWishes: z.string().max(500).optional(),
  organDonation: z.enum(['yes', 'no', 'unspecified']),
})

export const registerSchema = z.object({
  email: z.string().email('invalidEmail'),
  password: z.string().min(10, 'passwordTooShort').max(128),
  confirmPassword: z.string(),
  acceptPrivacy: z.boolean().refine(v => v, 'mustAccept'),
  acceptTerms: z.boolean().refine(v => v, 'mustAccept'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'passwordMismatch',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.string().email('invalidEmail'),
  password: z.string().min(1, 'required'),
})

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>
export type RepresentativeFormData = z.infer<typeof representativeSchema>
export type MedicalPreferencesFormData = z.infer<typeof medicalPreferencesSchema>
export type ScenarioChoicesFormData = z.infer<typeof scenarioChoicesSchema>
export type PersonalValuesFormData = z.infer<typeof personalValuesSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
