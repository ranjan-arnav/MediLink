'use client'

import { Calendar, Clock, MapPin, Video, MoreVertical, Plus } from 'lucide-react'

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-500" />
            My Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your scheduled consultations and follow-ups.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all">
          <Plus className="h-5 w-5" />
          Book New
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming</h3>
          <span className="text-sm text-gray-500">Jan 2024</span>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <AppointmentItem
            date="Jan 15"
            time="10:00 AM"
            doctor="Dr. Sarah Smith"
            specialty="Cardiologist"
            type="video"
            status="confirmed"
          />
          <AppointmentItem
            date="Jan 18"
            time="02:30 PM"
            doctor="Dr. James Wilson"
            specialty="General Physician"
            type="in-person"
            location="City Hospital, Building A"
            status="pending"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Past Appointments</h3>
        <p className="text-gray-500 mb-4">View history of your previous consultations.</p>
        <button className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          View History
        </button>
      </div>
    </div>
  )
}

function AppointmentItem({ date, time, doctor, specialty, type, location, status }: any) {
  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center justify-center w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
          <span className="text-xs font-bold uppercase">{date.split(' ')[0]}</span>
          <span className="text-lg font-bold">{date.split(' ')[1]}</span>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">{doctor}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{specialty}</p>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {time}
            </span>
            {type === 'video' ? (
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full">
                <Video className="w-3.5 h-3.5" /> Video Call
              </span>
            ) : (
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                <Calendar className="w-3.5 h-3.5" /> In-Person
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {status === 'confirmed' ? (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
            Confirmed
          </span>
        ) : (
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold rounded-full">
            Pending
          </span>
        )}
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
