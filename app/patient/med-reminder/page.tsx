'use client'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Clock, AlertCircle, Plus, Phone, Trash2, Edit2, Loader2, X } from 'lucide-react'
import { useStore } from '@/lib/store'
import { medicationSchema, type MedicationFormData } from '@/lib/schemas'
import { format } from 'date-fns'

export default function MedReminderPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMedication, setEditingMedication] = useState<string | null>(null)
  const user = useStore((state) => state.user)
  const allMedications = useStore((state) => state.medications)
  const medications = useMemo(() =>
    allMedications.filter((m) => m.userId === user?.id),
    [allMedications, user?.id]
  )
  const addMedication = useStore((state) => state.addMedication)
  const updateMedication = useStore((state) => state.updateMedication)
  const deleteMedication = useStore((state) => state.deleteMedication)
  const addNotification = useStore((state) => state.addNotification)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      times: [],
    },
  })

  const onSubmit = async (data: MedicationFormData) => {
    if (!user) return

    try {
      if (editingMedication) {
        updateMedication(editingMedication, {
          ...data,
          userId: user.id,
        })
        addNotification({
          userId: user.id,
          title: 'Medication Updated',
          message: `${data.name} has been updated successfully.`,
          type: 'success',
        })
      } else {
        addMedication({
          ...data,
          userId: user.id,
        })
        addNotification({
          userId: user.id,
          title: 'Medication Added',
          message: `${data.name} has been added to your reminders.`,
          type: 'success',
        })
      }

      reset()
      setEditingMedication(null)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving medication:', error)
    }
  }

  const handleEdit = (medicationId: string) => {
    const medication = medications.find((m) => m.id === medicationId)
    if (medication) {
      setValue('name', medication.name)
      setValue('dosage', medication.dosage)
      setValue('frequency', medication.frequency)
      setValue('times', medication.times)
      setValue('startDate', medication.startDate)
      setValue('endDate', medication.endDate || '')
      setValue('notes', medication.notes || '')
      setEditingMedication(medicationId)
      setIsModalOpen(true)
    }
  }

  const handleDelete = (medicationId: string) => {
    if (confirm('Are you sure you want to delete this medication?')) {
      deleteMedication(medicationId)
      addNotification({
        userId: user?.id || '',
        title: 'Medication Removed',
        message: 'Medication has been removed from your reminders.',
        type: 'info',
      })
    }
  }

  const timeSlots = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM',
    '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            Medication Reminders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your medication schedule and get reminders for each dose.
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Demo Voice Reminder Call */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            addNotification({
              userId: user?.id || '',
              title: 'Voice Reminder Demo',
              message: 'This is a demo of the voice reminder call feature.',
              type: 'info',
            })
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Clock className="w-5 h-5" />
          Demo Voice Reminder Call
        </button>
      </div>

      {/* Medications Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Medications</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your current medication schedule</p>
          </div>
          <button
            onClick={() => {
              reset()
              setEditingMedication(null)
              setIsModalOpen(true)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>

        {medications.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No medications set. Add your first reminder above.
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((medication) => (
              <div
                key={medication.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                      {medication.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {medication.dosage} • {medication.frequency}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {medication.times.map((time) => (
                        <span
                          key={time}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                    {medication.startDate && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Start: {format(new Date(medication.startDate), 'MMM d, yyyy')}
                        {medication.endDate && ` • End: ${format(new Date(medication.endDate), 'MMM d, yyyy')}`}
                      </p>
                    )}
                    {medication.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {medication.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(medication.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(medication.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingMedication ? 'Edit Medication' : 'Add Medication'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  reset()
                  setEditingMedication(null)
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Medication Name *
                </label>
                <input
                  {...register('name')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Aspirin"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dosage *
                  </label>
                  <input
                    {...register('dosage')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 100mg"
                  />
                  {errors.dosage && (
                    <p className="text-red-500 text-sm mt-1">{errors.dosage.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Frequency *
                  </label>
                  <select
                    {...register('frequency')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select frequency</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Four times daily">Four times daily</option>
                    <option value="As needed">As needed</option>
                  </select>
                  {errors.frequency && (
                    <p className="text-red-500 text-sm mt-1">{errors.frequency.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reminder Times * (Select all that apply)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => {
                    const currentTimes = watch('times') || []
                    return (
                      <label
                        key={time}
                        className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${currentTimes.includes(time)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-300 dark:border-gray-600'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={currentTimes.includes(time)}
                          onChange={(e) => {
                            const newTimes = e.target.checked
                              ? [...currentTimes, time]
                              : currentTimes.filter((t) => t !== time)
                            setValue('times', newTimes)
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-900 dark:text-white">{time}</span>
                      </label>
                    )
                  })}
                </div>
                {errors.times && (
                  <p className="text-red-500 text-sm mt-1">{errors.times.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    {...register('endDate')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingMedication ? 'Update Medication' : 'Add Medication'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    reset()
                    setEditingMedication(null)
                  }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <button className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
          <Phone className="w-6 h-6" />
        </button>
      </div>
    </div>

  )
}
