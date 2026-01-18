import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'patient' | 'doctor' | 'police'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
}

export interface SymptomReport {
  id: string
  userId: string
  symptoms: string[]
  description?: string
  severity: 'mild' | 'moderate' | 'severe'
  createdAt: string
  status: 'pending' | 'reviewed' | 'resolved'
}

export interface Medication {
  id: string
  userId: string
  name: string
  dosage: string
  frequency: string
  times: string[]
  startDate: string
  endDate?: string
  notes?: string
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  doctorName: string
  specialty: string
  date: string
  time: string
  type: 'in-person' | 'video' | 'phone'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  description: string
  notes?: string
}

export interface EmergencyAlert {
  id: string
  patientId: string
  patientName: string
  age: number
  conditions: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
  location: string
  timestamp: string
  status: 'active' | 'responded' | 'resolved'
  respondedBy?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  createdAt: string
  link?: string
}

export interface MedicalRecord {
  id: string
  userId: string
  date: string
  name: string
  type: 'Voice Consultation' | 'Lab Report' | 'Clinical Note' | 'Imaging' | 'Immunization'
  provider: string
  summary: string
  severity: 'mild' | 'moderate' | 'severe' | 'critical'
  recommendations: string[]
  rawAnswers?: string[]
}

export interface DietLog {
  id: string
  userId: string
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
  foodItem: string
  calories: number
  protein: string
  carbs: string
  fats: string
  healthScore: 'Healthy' | 'Moderate' | 'Unhealthy'
  analysis: string
  timestamp: string
  imageUrl?: string
}

interface AppState {
  // Auth
  // User moved to useUserStore

  // No user here anymore, check useUserStore


  // Symptom Reports
  symptomReports: SymptomReport[]
  addSymptomReport: (report: Omit<SymptomReport, 'id' | 'createdAt'>) => void
  updateSymptomReport: (id: string, updates: Partial<SymptomReport>) => void

  // Medications
  medications: Medication[]
  addMedication: (medication: Omit<Medication, 'id'>) => void
  updateMedication: (id: string, updates: Partial<Medication>) => void
  deleteMedication: (id: string) => void

  // Appointments
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  deleteAppointment: (id: string) => void

  // Emergency Alerts
  emergencyAlerts: EmergencyAlert[]
  addEmergencyAlert: (alert: Omit<EmergencyAlert, 'id' | 'timestamp'>) => void
  updateEmergencyAlert: (id: string, updates: Partial<EmergencyAlert>) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void

  // Patients (for doctors)
  patients: User[]
  addPatient: (patient: User) => void

  // Medical Records
  medicalRecords: MedicalRecord[]
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void

  // Diet Logs
  dietLogs: DietLog[]
  addDietLog: (log: Omit<DietLog, 'id' | 'timestamp'>) => void

  // Diet Plans
  dietPlans: DietPlan[]
  addDietPlan: (plan: Omit<DietPlan, 'id' | 'generatedAt' | 'status'>) => void
  updateDietPlanStatus: (id: string, status: 'approved' | 'rejected', feedback?: string) => void

  // Wound Reports
  woundReports: WoundReport[]
  addWoundReport: (report: Omit<WoundReport, 'id' | 'timestamp' | 'status'>) => void
  updateWoundReportStatus: (id: string, notes: string) => void

  // Chat
  messages: ChatMessage[]
  sendMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>) => void
}

export interface DietPlan {
  id: string
  userId: string
  userName: string
  status: 'pending' | 'approved' | 'rejected'
  meals: { breakfast: any, lunch: any, dinner: any }
  generatedAt: string
  doctorFeedback?: string
}

export interface WoundReport {
  id: string
  userId: string
  imageUrl: string // base64
  analysis: any // JSON result from AI
  timestamp: string
  status: 'sent' | 'reviewed'
  doctorNotes?: string
}

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  type: 'text' | 'system' | 'image' | 'voice' | 'video'
  read: boolean
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // ... existing auth ...

      // User managed in useUserStore


      // Symptom Reports
      symptomReports: [],
      addSymptomReport: (report) => {
        const newReport: SymptomReport = {
          ...report,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          symptomReports: [...state.symptomReports, newReport],
        }))
      },
      updateSymptomReport: (id, updates) =>
        set((state) => ({
          symptomReports: state.symptomReports.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      // Medications
      medications: [],
      addMedication: (medication) => {
        const newMedication: Medication = {
          ...medication,
          id: crypto.randomUUID(),
        }
        set((state) => ({
          medications: [...state.medications, newMedication],
        }))
      },
      updateMedication: (id, updates) =>
        set((state) => ({
          medications: state.medications.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),
      deleteMedication: (id) =>
        set((state) => ({
          medications: state.medications.filter((m) => m.id !== id),
        })),

      // Appointments
      appointments: [],
      addAppointment: (appointment) => {
        const newAppointment: Appointment = {
          ...appointment,
          id: crypto.randomUUID(),
        }
        set((state) => ({
          appointments: [...state.appointments, newAppointment],
        }))
      },
      updateAppointment: (id, updates) =>
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),
      deleteAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        })),

      // Emergency Alerts
      emergencyAlerts: [],
      addEmergencyAlert: (alert) => {
        const newAlert: EmergencyAlert = {
          ...alert,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        }
        set((state) => ({
          emergencyAlerts: [...state.emergencyAlerts, newAlert],
        }))
      },
      updateEmergencyAlert: (id, updates) =>
        set((state) => ({
          emergencyAlerts: state.emergencyAlerts.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      // Notifications
      notifications: [],
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          read: false,
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }))
      },
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      // Patients
      patients: [],
      addPatient: (patient) =>
        set((state) => ({
          patients: [...state.patients, patient],
        })),

      // Medical Records
      medicalRecords: [],
      addMedicalRecord: (record) => {
        const newRecord: MedicalRecord = {
          ...record,
          id: crypto.randomUUID(),
        }
        set((state) => ({
          medicalRecords: [newRecord, ...state.medicalRecords],
        }))
      },
      // Diet Logs
      dietLogs: [],
      addDietLog: (log) => {
        const newLog: DietLog = {
          ...log,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        }
        set((state) => ({
          dietLogs: [newLog, ...state.dietLogs],
        }))
      },
      // Diet Plans
      dietPlans: [],
      addDietPlan: (plan) => {
        const newPlan: DietPlan = {
          ...plan,
          id: crypto.randomUUID(),
          generatedAt: new Date().toISOString(),
          status: 'pending'
        }
        set((state) => ({
          dietPlans: [...state.dietPlans, newPlan]
        }))
      },
      updateDietPlanStatus: (id, status, feedback) =>
        set((state) => ({
          dietPlans: state.dietPlans.map(p =>
            p.id === id ? { ...p, status, doctorFeedback: feedback } : p
          )
        })),

      // Wound Reports
      woundReports: [],
      addWoundReport: (report) => {
        const newReport: WoundReport = {
          ...report,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          status: 'sent'
        }
        set((state) => ({
          woundReports: [...state.woundReports, newReport]
        }))
      },
      updateWoundReportStatus: (id, notes) =>
        set((state) => ({
          woundReports: state.woundReports.map(r =>
            r.id === id ? { ...r, status: 'reviewed', doctorNotes: notes } : r
          )
        })),

      // Chat
      messages: [], // Start empty
      sendMessage: (msg) => {
        const newMessage: ChatMessage = {
          ...msg,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          read: false
        }
        set((state) => ({
          messages: [...state.messages, newMessage]
        }))
      },
      clearMessages: () => set({ messages: [] }) // Added helper just in case
    }),
    {
      name: 'medilink-storage-v2', // Bumped version to clear old chat data
      partialize: (state) => ({
        symptomReports: state.symptomReports,
        medications: state.medications,
        appointments: state.appointments,
        emergencyAlerts: state.emergencyAlerts,
        notifications: state.notifications,
        patients: state.patients,
        medicalRecords: state.medicalRecords,
        dietLogs: state.dietLogs,
        dietLogs: state.dietLogs,
        dietPlans: state.dietPlans,
        dietPlans: state.dietPlans,
        woundReports: state.woundReports,
        messages: state.messages,
      }),
    }
  )
)
