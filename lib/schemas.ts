import { z } from 'zod'

export const symptomScreeningSchema = z.object({
  symptoms: z.array(z.string()).min(1, 'Please select at least one symptom'),
  description: z.string().optional(),
  severity: z.enum(['mild', 'moderate', 'severe']),
})

export const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  times: z.array(z.string()).min(1, 'At least one time is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  notes: z.string().optional(),
})

export const appointmentSchema = z.object({
  doctorId: z.string().min(1, 'Doctor is required'),
  doctorName: z.string().min(1, 'Doctor name is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  type: z.enum(['in-person', 'video', 'phone']),
  description: z.string().min(1, 'Description is required'),
  notes: z.string().optional(),
})

export type SymptomScreeningFormData = z.infer<typeof symptomScreeningSchema>
export type MedicationFormData = z.infer<typeof medicationSchema>
export type AppointmentFormData = z.infer<typeof appointmentSchema>
