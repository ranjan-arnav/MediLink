'use client'

import { useMemo } from 'react'

import { Heart, Thermometer, Weight, Calendar, AlertCircle, Phone } from 'lucide-react'
import { useStore } from '@/lib/store'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

export default function PatientDashboard() {
  const user = useStore((state) => state.user)
  const allSymptomReports = useStore((state) => state.symptomReports)
  const allAppointments = useStore((state) => state.appointments)

  const symptomReports = useMemo(() =>
    allSymptomReports.filter((r) => r.userId === user?.id).slice(0, 3),
    [allSymptomReports, user?.id]
  )

  const appointments = useMemo(() =>
    allAppointments.filter((a) => a.patientId === user?.id).slice(0, 3),
    [allAppointments, user?.id]
  )

  // Mock health data - in production, this would come from API
  const healthData = {
    heartRate: 72,
    temperature: 98.6,
    weight: 150,
    lastCheckup: '2 weeks ago',
  }

  const recentActivities = [
    ...symptomReports.map((report) => ({
      title: 'Symptom Report Submitted',
      date: report.createdAt,
      badge: 'report',
      badgeColor: 'gray' as const,
    })),
    ...appointments.map((appointment) => ({
      title: `Video Consultation with ${appointment.doctorName}`,
      date: appointment.date,
      badge: 'appointment',
      badgeColor: 'black' as const,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Hello, {user?.name?.split(' ')[0] || 'Patient'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            How are you feeling today?
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-bold">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          System Online
        </div>
      </div>

      {/* BIG BUTTONS GRID - PRIMARY ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BigActionCard
          href="/patient/symptom-screening"
          icon={<Thermometer className="w-12 h-12" />}
          title="Check Symptoms"
          subtitle="I'm not feeling well"
          color="orange"
        />
        <BigActionCard
          href="/patient/med-reminder"
          icon={<AlertCircle className="w-12 h-12" />} // Changed icon for better clarity
          title="My Medicines"
          subtitle="View reminders & schedule"
          color="blue"
        />
        <BigActionCard
          href="/patient/appointments"
          icon={<Calendar className="w-12 h-12" />}
          title="Doctor Visits"
          subtitle="See upcoming appointments"
          color="teal"
        />
      </div>

      {/* Secondary Actions / Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" /> Vitals Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <VitalStat label="Heart Rate" value={healthData.heartRate} unit="bpm" />
            <VitalStat label="Temperature" value={healthData.temperature} unit="°F" />
            <VitalStat label="Weight" value={healthData.weight} unit="lbs" />
            <VitalStat label="Blood Pressure" value="120/80" unit="mmHg" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Updates</h2>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{activity.title}</p>
                    <p className="text-gray-500">{formatDistanceToNow(new Date(activity.date), { addSuffix: true })}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-lg">No recent activity to show.</p>
          )}
        </div>
      </div>

      {/* Emergency SOS - FIXED BOTTOM */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            if (!user) return
            const addEmergencyAlert = useStore.getState().addEmergencyAlert
            const addNotification = useStore.getState().addNotification

            addEmergencyAlert({
              patientId: user.id,
              patientName: user.name,
              age: 72,
              conditions: ['Emergency'],
              priority: 'critical',
              location: 'Home',
              status: 'active',
            })

            addNotification({
              userId: user.id,
              title: 'Emergency Alert Sent',
              message: 'Help is on the way.',
              type: 'error',
            })

            alert('EMERGENCY ALERT SENT. HELP IS ON THE WAY.')
          }}
          className="h-20 px-8 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center gap-4 transition-transform hover:scale-105 animate-bounce-slow"
        >
          <AlertCircle className="w-8 h-8" />
          <span className="text-xl font-bold uppercase tracking-wider">Emergency SOS</span>
        </button>
      </div>
    </div>
  )
}

function BigActionCard({ href, icon, title, subtitle, color }: any) {
  const colors = {
    orange: 'bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-100 ring-orange-200 dark:ring-orange-800',
    blue: 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100 ring-blue-200 dark:ring-blue-800',
    teal: 'bg-teal-100 text-teal-900 dark:bg-teal-900/40 dark:text-teal-100 ring-teal-200 dark:ring-teal-800',
  }

  return (
    <Link
      href={href}
      className={`group p-8 rounded-3xl ${colors[color]} ring-1 transition-all hover:scale-[1.02] hover:shadow-xl flex flex-col items-center text-center gap-4`}
    >
      <div className="p-4 bg-white dark:bg-white/10 rounded-full shadow-sm">{icon}</div>
      <div>
        <h3 className="text-2xl font-bold mb-1">{title}</h3>
        <p className="text-lg opacity-80">{subtitle}</p>
      </div>
    </Link>
  )
}

function VitalStat({ label, value, unit }: any) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
      <p className="text-gray-500 font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value} <span className="text-sm font-normal text-gray-400">{unit}</span>
      </p>
    </div>
  )
}

function HealthCard({
  icon,
  label,
  value,
  unit,
  status,
  trend
}: {
  icon: React.ReactNode
  label: string
  value: string
  unit: string
  status: string
  trend?: 'up' | 'down'
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 relative">
      {icon && <div className="absolute top-4 right-4">{icon}</div>}
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{label}</div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{unit}</span>
      </div>
      {status && (
        <div className="text-sm text-gray-500 dark:text-gray-500">{status}</div>
      )}
      {trend === 'up' && (
        <div className="absolute top-4 right-4">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-b-green-500"></div>
        </div>
      )}
    </div>
  )
}

function ActivityItem({
  title,
  date,
  badge,
  badgeColor = 'gray'
}: {
  title: string
  date: string
  badge: string
  badgeColor?: 'gray' | 'black'
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </div>
        </div>
      </div>
      <span className={`px-3 py-1 rounded text-xs font-medium ${badgeColor === 'black'
        ? 'bg-black text-white'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}>
        {badge}
      </span>
    </div>
  )
}
