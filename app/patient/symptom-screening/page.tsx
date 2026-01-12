'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Phone, AlertCircle, CheckSquare, Loader2 } from 'lucide-react'
import { useStore } from '@/lib/store'
import { symptomScreeningSchema, type SymptomScreeningFormData } from '@/lib/schemas'
import { useRouter } from 'next/navigation'

const commonSymptoms = [
  'Headache', 'Fever', 'Cough', 'Sore Throat', 'Fatigue',
  'Nausea', 'Dizziness', 'Chest Pain', 'Shortness of Breath', 'Joint Pain'
]

export default function SymptomScreeningPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()
  const user = useStore((state) => state.user)
  const addSymptomReport = useStore((state) => state.addSymptomReport)
  const addNotification = useStore((state) => state.addNotification)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SymptomScreeningFormData>({
    resolver: zodResolver(symptomScreeningSchema),
    defaultValues: {
      symptoms: [],
      severity: 'mild',
    },
  })

  const selectedSymptoms = watch('symptoms') || []

  const toggleSymptom = (symptom: string) => {
    const currentSymptoms = selectedSymptoms
    const newSymptoms = currentSymptoms.includes(symptom)
      ? currentSymptoms.filter((s) => s !== symptom)
      : [...currentSymptoms, symptom]
    setValue('symptoms', newSymptoms)
  }

  const onSubmit = async (data: SymptomScreeningFormData) => {
    if (!user) return

    setIsSubmitting(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      addSymptomReport({
        userId: user.id,
        symptoms: data.symptoms,
        description: data.description,
        severity: data.severity,
        status: 'pending',
      })

      addNotification({
        userId: user.id,
        title: 'Symptom Report Submitted',
        message: `Your symptom report with ${data.symptoms.length} symptoms has been submitted successfully.`,
        type: 'success',
        link: '/patient/dashboard',
      })

      setShowSuccess(true)
      setTimeout(() => {
        router.push('/patient/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Error submitting symptom report:', error)
    } finally {
      setIsSubmitting(false)
    }
  }


  if (showSuccess) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Report Submitted Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Symptom Screening
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Provide detailed information about your symptoms for accurate AI analysis
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Voice AI Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Voice AI Symptom Screening
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Get instant symptom assessment through our AI voice assistant
        </p>
        <button
          type="button"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Phone className="w-5 h-5" />
          Start Voice AI Symptom Screening
        </button>
      </div>

      {/* Common Symptoms */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Common Symptoms
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Select all symptoms that apply to you
        </p>

        {errors.symptoms && (
          <p className="text-red-500 text-sm mb-4">{errors.symptoms.message}</p>
        )}

        <div className="grid md:grid-cols-5 gap-4 mb-6">
          {commonSymptoms.map((symptom) => {
            const isSelected = selectedSymptoms?.includes(symptom)
            return (
              <label
                key={symptom}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
              >
                <input
                  type="checkbox"
                  {...register('symptoms')}
                  value={symptom}
                  checked={isSelected}
                  onChange={() => toggleSymptom(symptom)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-900 dark:text-white font-medium">{symptom}</span>
              </label>
            )
          })}
        </div>

        {/* Additional Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Description (Optional)
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your symptoms in detail..."
          />
        </div>

        {/* Severity */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Severity Level
          </label>
          <div className="flex gap-4">
            {(['mild', 'moderate', 'severe'] as const).map((level) => (
              <label
                key={level}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  {...register('severity')}
                  value={level}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-900 dark:text-white capitalize">{level}</span>
              </label>
            ))}
          </div>
          {errors.severity && (
            <p className="text-red-500 text-sm mt-1">{errors.severity.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !selectedSymptoms || selectedSymptoms.length === 0}
          className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Symptom Report'
          )}
        </button>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <button
          type="button"
          className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <Phone className="w-6 h-6" />
        </button>
      </div>
    </form>

  )
}
