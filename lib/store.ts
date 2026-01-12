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

interface AppState {
  // Auth
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void

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
}

export const useStore = create<AppState>()(
  // Temporarily disabled persist to debug infinite loop
  // persist(
    (set) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),

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
    })
  // Temporarily disabled persist to debug infinite loop
  // }),
  // {
  //   name: 'care-connect-storage',
  //   partialize: (state) => ({
  //     user: state.user,
  //     symptomReports: state.symptomReports,
  //     medications: state.medications,
  //     appointments: state.appointments,
  //     emergencyAlerts: state.emergencyAlerts,
  //     notifications: state.notifications,
  //     patients: state.patients,
  //   }),
  // }
  // )
)
