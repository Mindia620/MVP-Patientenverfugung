import { z } from 'zod';

const salutationEnum = z.enum(['herr', 'frau', 'divers']);
const relationshipEnum = z.enum(['ehepartner', 'kind', 'elternteil', 'freund', 'sonstige']);
const treatmentPreferenceEnum = z.enum(['yes', 'no', 'doctor_decides']);
const organDonationEnum = z.enum(['yes', 'no', 'restricted']);

export const personalInfoSchema = z.object({
  salutation: salutationEnum,
  firstName: z.string().min(2, 'min2Chars'),
  lastName: z.string().min(2, 'min2Chars'),
  dateOfBirth: z.string().min(1, 'required'),
  placeOfBirth: z.string().min(2, 'min2Chars'),
  street: z.string().min(3, 'min3Chars'),
  postalCode: z.string().regex(/^\d{5}$/, 'postalCodeFormat'),
  city: z.string().min(2, 'min2Chars'),
  phone: z.string().optional(),
});

const trustedPersonSchema = z.object({
  salutation: salutationEnum,
  firstName: z.string().min(2, 'min2Chars'),
  lastName: z.string().min(2, 'min2Chars'),
  dateOfBirth: z.string().min(1, 'required'),
  relationship: relationshipEnum,
  street: z.string().min(3, 'min3Chars'),
  postalCode: z.string().regex(/^\d{5}$/, 'postalCodeFormat'),
  city: z.string().min(2, 'min2Chars'),
  phone: z.string().min(5, 'phoneFormat'),
});

export const trustedPersonStepSchema = z.object({
  trustedPerson: trustedPersonSchema,
  hasAlternatePerson: z.boolean(),
  alternatePerson: trustedPersonSchema.optional(),
}).refine(
  (data) => !data.hasAlternatePerson || data.alternatePerson !== undefined,
  { message: 'alternatePersonRequired', path: ['alternatePerson'] }
);

export const medicalPreferencesSchema = z.object({
  cpr: treatmentPreferenceEnum,
  ventilation: treatmentPreferenceEnum,
  artificialNutrition: treatmentPreferenceEnum,
  dialysis: treatmentPreferenceEnum,
  antibiotics: treatmentPreferenceEnum,
  painManagement: treatmentPreferenceEnum,
});

export const situationalScenariosSchema = z.object({
  terminalIllness: z.boolean(),
  irreversibleUnconsciousness: z.boolean(),
  severeDementia: z.boolean(),
}).refine(
  (data) => data.terminalIllness || data.irreversibleUnconsciousness || data.severeDementia,
  { message: 'atLeastOneScenario', path: ['terminalIllness'] }
);

export const valuesAndWishesSchema = z.object({
  personalValues: z.string().max(2000).optional(),
  religiousWishes: z.string().max(1000).optional(),
  organDonation: organDonationEnum.optional(),
  burialWishes: z.string().max(1000).optional(),
});

export const summaryConfirmSchema = z.object({
  confirmed: z.literal(true, { invalid_type_error: 'mustConfirm' }),
});
