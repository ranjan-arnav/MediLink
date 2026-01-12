'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Calendar, Clock, MapPin, Video, MoreVertical, Plus, User as UserIcon, X, Loader2 } from 'lucide-react'
import { useStore } from '@/lib/store'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const DOCTORS = [
  { id: 'd1', name: 'Dr. Sarah Smith', specialty: 'Cardiologist', image: '/doctors/dr-sarah.jpg' },
  { id: 'd2', name: 'Dr. James Wilson', specialty: 'General Physician', image: '/doctors/dr-james.jpg' },
  { id: 'd3', name: 'Dr. Emily Chen', specialty: 'Dermatologist', image: '/doctors/dr-emily.jpg' },
  { id: 'd4', name: 'Dr. Michael Brown', specialty: 'Neurologist', image: '/doctors/dr-michael.jpg' },
]

export default function AppointmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const user = useStore((state) => state.user)
  const appointments = useStore((state) => state.appointments.filter(a => a.patientId === user?.id))
  const addAppointment = useStore((state) => state.addAppointment)
  const addNotification = useStore((state) => state.addNotification)

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm()

  const upcoming = appointments.filter(a => new Date(a.date) >= new Date() && a.status !== 'cancelled')
  const past = appointments.filter(a => new Date(a.date) < new Date() || a.status === 'cancelled')

  const onSubmit = async (data: any) => {
    if (!user) return

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const doctor = DOCTORS.find(d => d.id === data.doctorId)

    addAppointment({
      patientId: user.id,
      doctorId: data.doctorId,
      doctorName: doctor?.name || 'Unknown Doctor',
      specialty: doctor?.specialty || 'Specialist',
      date: data.date,
      time: data.time,
      type: data.type,
      status: 'confirmed', // Auto-confirm for demo
      description: data.reason,
    })

    addNotification({
      userId: user.id,
      title: 'Appointment Booked',
      message: `Confirmed with ${doctor?.name} on ${data.date} at ${data.time}.`,
      type: 'success'
    })

    setIsModalOpen(false)
    reset()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          Book New
        </button>
      </div>

      {/* Upcoming Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Upcoming Appointments</h3>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700 min-h-[100px]">
          {upcoming.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No upcoming appointments found.</p>
              <button onClick={() => setIsModalOpen(true)} className="text-blue-500 font-semibold mt-2 hover:underline">Book one now</button>
            </div>
          ) : (
            upcoming.map(apt => (
              <AppointmentItem key={apt.id} appointment={apt} />
            ))
          )}
        </div>
      </div>

      {/* Past Section */}
      {past.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 opacity-80">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Past History</h3>
          <div className="space-y-4">
            {past.map(apt => (
              <AppointmentItem key={apt.id} appointment={apt} isPast />
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Book Appointment</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Select Doctor</label>
                <div className="grid grid-cols-2 gap-3">
                  {DOCTORS.map(doc => (
                    <label
                      key={doc.id}
                      className={cn(
                        "flex flex-col p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-blue-300",
                        watch('doctorId') === doc.id ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"
                      )}
                    >
                      <input type="radio" value={doc.id} {...register('doctorId', { required: true })} className="sr-only" />
                      <span className="font-bold text-sm text-gray-900 dark:text-white">{doc.name}</span>
                      <span className="text-xs text-gray-500">{doc.specialty}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Date</label>
                  <input
                    type="date"
                    {...register('date', { required: true })}
                    className="w-full p-3 rounded-xl border bg-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Time</label>
                  <select {...register('time', { required: true })} className="w-full p-3 rounded-xl border bg-transparent">
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Consultation Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="video" {...register('type')} defaultChecked className="w-4 h-4 text-blue-600" />
                    <span>Video Call</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="in-person" {...register('type')} className="w-4 h-4 text-blue-600" />
                    <span>In-Person</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Reason</label>
                <textarea
                  {...register('reason')}
                  rows={3}
                  className="w-full p-3 rounded-xl border bg-transparent"
                  placeholder="e.g., Annual checkup, headache..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function AppointmentItem({ appointment, isPast }: { appointment: any, isPast?: boolean }) {
  return (
    <div className={cn("p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors", isPast ? "bg-gray-50 dark:bg-gray-900/50" : "hover:bg-gray-50 dark:hover:bg-gray-700/30")}>
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center justify-center w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-700 dark:text-blue-300 shrink-0">
          <span className="text-xs font-bold uppercase">{new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}</span>
          <span className="text-xl font-bold">{new Date(appointment.date).getDate()}</span>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white text-lg">{appointment.doctorName}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{appointment.specialty}</p>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5" /> {appointment.time}
            </span>
            {appointment.type === 'video' ? (
              <span className="flex items-center gap-1 text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full font-bold">
                <Video className="w-3.5 h-3.5" /> Video
              </span>
            ) : (
              <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full font-bold">
                <MapPin className="w-3.5 h-3.5" /> In-Person
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className={cn("px-3 py-1 text-xs font-bold rounded-full uppercase",
          appointment.status === 'confirmed' ? "bg-green-100 text-green-700" :
            appointment.status === 'cancelled' ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
        )}>
          {appointment.status}
        </span>
      </div>
    </div>
  )
}
