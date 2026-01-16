'use client'

import { useState } from 'react'
import { Search, Filter, MoreVertical, User, Activity, Calendar, Clock, Utensils, X, Flame } from 'lucide-react'
import { useStore, DietLog } from '@/lib/store'
import { format } from 'date-fns'

export default function PatientManagementPage() {
  // We'll treat "John Doe" as our "Demo Patient" (ID: 1) for the demo flow
  // Ideally, this list would come from the store, but we'll stick to the layout
  // and just wire up the first card.

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Patient Management</h1>
          <p className="text-gray-500 dark:text-gray-400">View and manage patient records, status, and history.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 transition-all shadow-sm focus:shadow-md"
            />
          </div>
          <button className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <PatientCard
          name="Demo Patient" // Updated for Demo Consistency
          id="1" // Matches Demo Patient ID
          age={72}
          gender="Male"
          condition="Hypertension"
          status="Critical"
          lastVisit="2 days ago"
          nextAppt="Tomorrow, 10:00 AM"
          image="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=800&q=80"
          showDiet={true} // Enable Diet View for this patient
        />
        <PatientCard
          name="Sarah Johnson"
          id="#8830"
          age={32}
          gender="Female"
          condition="Post-Op Recovery"
          status="Stable"
          lastVisit="1 week ago"
          nextAppt="Feb 12, 02:00 PM"
          image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80"
        />
        <PatientCard
          name="Michael Brown"
          id="#8831"
          age={58}
          gender="Male"
          condition="Diabetes Type 2"
          status="Attention"
          lastVisit="3 days ago"
          nextAppt="Jan 20, 09:30 AM"
          image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80"
        />
      </div>
    </div>
  )
}

function PatientCard({ name, id, age, gender, condition, status, lastVisit, nextAppt, image, showDiet }: any) {
  const [showDietModal, setShowDietModal] = useState(false)
  const statusStyles = {
    Critical: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    Stable: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    Attention: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
  };

  return (
    <>
      <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-100 dark:from-gray-700/50 to-transparent rounded-bl-[100px] -z-0 opacity-50 transition-transform group-hover:scale-110"></div>

        <div className="relative z-10 flex-1">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
              <img src={image} alt={name} className="w-16 h-16 rounded-2xl object-cover shadow-md ring-2 ring-white dark:ring-gray-700" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{name}</h3>
                <div className="text-sm text-gray-500 space-x-2">
                  <span>#{id}</span>
                  <span>•</span>
                  <span>{age} yrs</span>
                  <span>•</span>
                  <span>{gender}</span>
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                <Activity className="w-4 h-4 text-blue-500" /> {condition}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[status]}`}>
                {status}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Last Visit</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{lastVisit}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30">
                <p className="text-xs text-blue-400 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Next Appt</p>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">{nextAppt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button for Diet */}
        {showDiet && (
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setShowDietModal(true)}
              className="w-full py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <Utensils className="w-4 h-4" /> View Diet Logs
            </button>
          </div>
        )}
      </div>

      {showDietModal && <DietModal patientId={id} onClose={() => setShowDietModal(false)} />}
    </>
  )
}

function DietModal({ patientId, onClose }: { patientId: string, onClose: () => void }) {
  const dietLogs = useStore(state => state.dietLogs)
  const patientLogs = dietLogs.filter(log => log.userId === patientId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Utensils className="w-6 h-6 text-green-500" />
            Patient Nutrition Log
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {patientLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Utensils className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No meals logged for this patient yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patientLogs.map((log) => (
                <div key={log.id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl flex items-start gap-4">
                  <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                    {log.imageUrl && <img src={log.imageUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{log.foodItem}</h3>
                        <p className="text-sm text-gray-500">{format(new Date(log.timestamp), 'MMM d, h:mm a')} • {log.mealType}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${log.healthScore === 'Healthy' ? 'bg-green-100 text-green-700' :
                          log.healthScore === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {log.healthScore}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 italic">"{log.analysis}"</p>
                    <div className="flex gap-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500" /> {log.calories} kcal</span>
                      <span className="flex items-center gap-1">Protocol: {log.protein} protein</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
