'use client'

import { useMemo } from 'react'
import { AlertTriangle, Users, Calendar, FileText, Clock, MessageSquare, Phone, Video, Search } from 'lucide-react'
import { useStore } from '@/lib/store'
import { formatDistanceToNow } from 'date-fns'

export default function DoctorDashboard() {
  const user = useStore((state) => state.user)
  const allEmergencyAlerts = useStore((state) => state.emergencyAlerts)
  const appointments = useStore((state) => state.appointments)
  const patients = useStore((state) => state.patients)
  const dietPlans = useStore((state) => state.dietPlans) || []
  const updateDietPlanStatus = useStore((state) => state.updateDietPlanStatus)

  const pendingDietPlans = useMemo(() =>
    dietPlans.filter((p) => p.status === 'pending'),
    [dietPlans]
  )

  const handleReviewPlan = (id: string, status: 'approved' | 'rejected') => {
    updateDietPlanStatus(id, status)
  }

  const emergencyAlerts = useMemo(() =>
    allEmergencyAlerts.filter((a) => a.status === 'active'),
    [allEmergencyAlerts]
  )

  // Mock statistics - in production, calculate from real data
  const stats = {
    totalPatients: patients.length || 156,
    todayAppointments: appointments.filter((a) => {
      const today = new Date().toISOString().split('T')[0]
      return a.date === today
    }).length || 8,
    pendingReviews: pendingDietPlans.length,
    avgConsultTime: '24m',
  }

  // Mock patient list - in production, fetch from API
  const patientList = [
    { id: '1', name: 'John Doe', age: 45, conditions: 'Hypertension, Diabetes' },
    { id: '2', name: 'Jane Smith', age: 32, conditions: 'Migraine' },
    { id: '3', name: 'Bob Johnson', age: 58, conditions: 'Arthritis' },
    { id: '4', name: 'Alice Brown', age: 28, conditions: 'Asthma' },
  ]

  const handleRespondToEmergency = (alertId: string) => {
    const updateAlert = useStore.getState().updateEmergencyAlert
    updateAlert(alertId, {
      status: 'responded',
      respondedBy: user?.name || 'Doctor'
    })

    const addNotification = useStore.getState().addNotification
    addNotification({
      userId: user?.id || '',
      title: 'Emergency Responded',
      message: 'You have responded to an emergency alert.',
      type: 'success',
    })
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome, {user?.name || 'Doctor'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your patient overview for today
        </p>
      </div>

      {/* Active Emergencies */}
      {emergencyAlerts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <span className="text-red-600 font-bold">Active Emergencies</span>
            <span className="px-2 py-1 bg-red-600 text-white rounded-full text-sm font-bold">
              {emergencyAlerts.length}
            </span>
          </div>
          <p className="text-red-600 mb-4">Immediate attention required</p>

          {emergencyAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-red-200 dark:border-red-800 mb-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center relative">
                    <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{alert.patientName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Age: {alert.age} • {alert.conditions.join(', ')}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
                        Critical Priority
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <span>📍</span>
                        {alert.location}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    Details
                  </button>
                  <button
                    onClick={() => handleRespondToEmergency(alert.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <span>❤️</span>
                    Respond
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Diet Plan Approvals */}
      {pendingDietPlans.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/10 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Diet Plan Requests</h2>
              <p className="text-sm text-gray-500">{pendingDietPlans.length} plans waiting for approval</p>
            </div>
          </div>

          <div className="space-y-4">
            {pendingDietPlans.map(plan => (
              <div key={plan.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{plan.userName}</h3>
                    <p className="text-sm text-gray-500">Submitted {formatDistanceToNow(new Date(plan.generatedAt), { addSuffix: true })}</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase">Pending Review</span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Breakfast</span>
                    <p className="font-medium text-gray-900 dark:text-white">{plan.meals.breakfast.title}</p>
                    <p className="text-xs text-gray-500">{plan.meals.breakfast.calories} kcal</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lunch</span>
                    <p className="font-medium text-gray-900 dark:text-white">{plan.meals.lunch.title}</p>
                    <p className="text-xs text-gray-500">{plan.meals.lunch.calories} kcal</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dinner</span>
                    <p className="font-medium text-gray-900 dark:text-white">{plan.meals.dinner.title}</p>
                    <p className="text-xs text-gray-500">{plan.meals.dinner.calories} kcal</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => handleReviewPlan(plan.id, 'rejected')}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
                  >
                    Reject Plan
                  </button>
                  <button
                    onClick={() => handleReviewPlan(plan.id, 'approved')}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-md transition-colors flex items-center gap-2"
                  >
                    Approve Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          label="Total Patients"
          value={stats.totalPatients.toString()}
          change="+2 this week"
          icon={<Users className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          label="Today's Appointments"
          value={stats.todayAppointments.toString()}
          change="3 Completed"
          icon={<Calendar className="w-6 h-6 text-green-600" />}
        />
        <StatCard
          label="Pending Reviews"
          value={stats.pendingReviews.toString()}
          change="requires attention"
          icon={<FileText className="w-6 h-6 text-orange-600" />}
        />
        <StatCard
          label="Avg. Consult Time"
          value={stats.avgConsultTime}
          change="-2m from last week"
          icon={<Clock className="w-6 h-6 text-purple-600" />}
        />
      </div>

      {/* Patient List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Patients</h2>
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="bg-transparent border-none outline-none text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {patientList.map((patient) => (
            <div
              key={patient.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{patient.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Age: {patient.age} • {patient.conditions}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                  <Video className="w-4 h-4" />
                  Start Video Call
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  )
}

function StatCard({ label, value, change, icon }: {
  label: string
  value: string
  change: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{change}</div>
    </div>
  )
}
