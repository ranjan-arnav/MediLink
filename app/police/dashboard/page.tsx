'use client'

import { useMemo } from 'react'
import { AlertTriangle, Clock, Users, Heart } from 'lucide-react'
import { useStore } from '@/lib/store'
import { formatDistanceToNow } from 'date-fns'

export default function PoliceDashboard() {
  const user = useStore((state) => state.user)
  const allEmergencyAlerts = useStore((state) => state.emergencyAlerts)
  const updateEmergencyAlert = useStore((state) => state.updateEmergencyAlert)
  const addNotification = useStore((state) => state.addNotification)

  const emergencyAlerts = useMemo(() =>
    allEmergencyAlerts.filter((a) => a.status === 'active'),
    [allEmergencyAlerts]
  )

  const handleRespond = (alertId: string) => {
    updateEmergencyAlert(alertId, {
      status: 'responded',
      respondedBy: user?.name || 'Police Officer',
    })

    addNotification({
      userId: user?.id || '',
      title: 'Emergency Responded',
      message: 'You have responded to an emergency alert.',
      type: 'success',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Emergency Alerts
        </h1>
      </div>

      {/* Active Emergencies */}
      {emergencyAlerts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No active emergency alerts at this time.
          </p>
        </div>
      ) : (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <span className="text-red-600 font-bold">activeEmergencies</span>
            <span className="px-2 py-1 bg-red-600 text-white rounded-full text-sm font-bold">
              {emergencyAlerts.length}
            </span>
          </div>
          <p className="text-red-600 mb-4">immediateAttentionRequired</p>

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
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Age : {alert.age} • {alert.conditions.join(', ')}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
                        critical Priority
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
                    onClick={() => handleRespond(alert.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Respond
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  )
}
