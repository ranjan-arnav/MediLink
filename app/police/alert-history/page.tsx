'use client'

import { AlertTriangle, MapPin, Clock, Search, Filter } from 'lucide-react'

export default function AlertHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="h-8 w-8 text-blue-500" />
            Alert History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Archive of all past emergency responses and incidents.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search incidents..."
              className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <AlertHistoryCard
          id="#9923"
          type="Cardiac Arrest"
          location="123 Main St, Springfield"
          time="Jan 12, 10:42 AM"
          status="Resolved"
          duration="45m"
          responders="Unit 4, Ambulance A12"
        />
        <AlertHistoryCard
          id="#9922"
          type="Car Accident"
          location="Highway 101, Exit 42"
          time="Jan 11, 08:15 PM"
          status="Resolved"
          duration="1h 20m"
          responders="Unit 2, Unit 5, Fire Dept"
        />
        <AlertHistoryCard
          id="#9921"
          type="Unconscious Male"
          location="Central Park West"
          time="Jan 10, 02:30 PM"
          status="False Alarm"
          duration="15m"
          responders="Unit 1"
        />
      </div>
    </div>
  )
}

function AlertHistoryCard({ id, type, location, time, status, duration, responders }: any) {
  const statusColor = status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-l-4 border-l-gray-300 dark:border-l-gray-600 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 dark:text-white">{type}</h3>
              <span className="text-xs font-mono text-gray-400">{id}</span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {location}
            </p>
          </div>
        </div>

        <div className={`self-start md:self-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusColor}`}>
          {status}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-2 text-sm pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="text-gray-500">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Time:</span> {time}
        </div>
        <div className="text-gray-500">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Duration:</span> {duration}
        </div>
        <div className="text-gray-500">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Units:</span> {responders}
        </div>
      </div>
    </div>
  )
}
