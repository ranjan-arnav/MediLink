'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Activity, ShieldAlert, HeartPulse, Phone, AlertCircle, Loader2, Mic } from 'lucide-react'
import { useStore } from '@/lib/store'
import { analyzeSymptomsAction, type analysisResult } from '@/app/actions/symptom-analysis'
import { cn } from '@/lib/utils'

const commonSymptoms = [
  'Headache', 'Fever', 'Cough', 'Sore Throat', 'Fatigue',
  'Nausea', 'Dizziness', 'Chest Pain', 'Shortness of Breath', 'Joint Pain',
  'Abdominal Pain', 'Rash', 'Anxiety', 'Insomnia', 'Back Pain'
]

type Step = 'symptoms' | 'details' | 'history' | 'analysis' | 'result'

export default function SymptomScreeningPage() {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const addSymptomReport = useStore((state) => state.addSymptomReport)

  const [currentStep, setCurrentStep] = useState<Step>('symptoms')
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('1 day')
  const [painLevel, setPainLevel] = useState(1)
  const [medicalHistory, setMedicalHistory] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const [result, setResult] = useState<analysisResult | null>(null)
  const addMedicalRecord = useStore((state) => state.addMedicalRecord)

  // Poll for completed voice interview analysis
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAnalyzing && currentStep === 'symptoms') {
      interval = setInterval(async () => {
        try {
          // Check for completed analysis from mobile call
          const res = await fetch('/api/analysis-result')
          const json = await res.json()

          if (json.completed && json.record) {
            // Save the medical record to store
            addMedicalRecord({
              userId: user?.id || '',
              ...json.record
            })

            // Clear the analysis result
            await fetch('/api/analysis-result', { method: 'DELETE' })

            setIsAnalyzing(false)
            alert("Voice Interview Complete! Your report has been saved to Medical Records.")
          }
        } catch { }
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [isAnalyzing, currentStep, user, addMedicalRecord])

  const triggerCallInterview = async () => {
    setIsAnalyzing(true) // Using this to show loading/waiting state if we added UI for it
    const questions = [
      "Hello. I am your medical assistant. Please tell me in detail, what are your main symptoms?",
      "How long have you been experiencing these symptoms?",
      "On a scale of one to ten, how severe is the pain?",
      "Do you have any existing medical conditions or history I should know about?"
    ]

    await fetch('/api/call-state', {
      method: 'POST',
      body: JSON.stringify({
        status: 'ringing',
        data: {
          type: 'interview',
          text: 'Incoming Symptom Screen',
          questions: questions,
          contextId: 'symptom-screening'
        }
      })
    })

    alert("Calling your device now... Please answer and speak clearly.")
  }

  // Voice AI Logic
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognition.continuous = false
      recognition.interimResults = false

      setIsListening(true)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setDescription((prev) => prev ? `${prev} ${transcript}` : transcript)
        setIsListening(false)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
        alert('Could not hear you. Please try again.')
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      alert('Voice input is not supported in this browser.')
    }
  }

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom))
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  const handleNext = () => {
    if (currentStep === 'symptoms') setCurrentStep('details')
    else if (currentStep === 'details') setCurrentStep('history')
    else if (currentStep === 'history') runAnalysis()
  }

  const handleBack = () => {
    if (currentStep === 'details') setCurrentStep('symptoms')
    else if (currentStep === 'history') setCurrentStep('details')
  }

  const runAnalysis = async () => {
    setCurrentStep('analysis')
    setIsAnalyzing(true)

    // Call Server Action
    const analysis = await analyzeSymptomsAction(
      selectedSymptoms,
      description,
      medicalHistory,
      duration,
      painLevel
    )

    if (analysis) {
      setResult(analysis)
      setIsAnalyzing(false)
      setCurrentStep('result')

      // Save to store
      if (user) {
        addSymptomReport({
          userId: user.id,
          symptoms: selectedSymptoms,
          description: `Duration: ${duration}. Pain: ${painLevel}/10. History: ${medicalHistory}. ${description}. AI Diagnosis: ${analysis.title}`,
          severity: analysis.severity,
          status: 'pending',
        })
      }
    } else {
      // Fallback error handling
      setIsAnalyzing(false)
      alert("AI Service Unavailable. Please try again.")
      setCurrentStep('details')
    }
  }

  // --- RENDER STEPS ---

  if (currentStep === 'analysis') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 mb-6 relative">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
          <Activity className="absolute inset-0 m-auto text-teal-600 w-10 h-10 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analyzing Symptoms...</h2>
        <p className="text-gray-500 dark:text-gray-400">Our AI engine is checking medical protocols against your inputs.</p>
      </div>
    )
  }

  if (currentStep === 'result' && result) {
    const colorMap = {
      green: 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
      orange: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
      red: 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
    }

    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className={cn("p-8 rounded-3xl border-2 text-center mb-8 shadow-xl", colorMap[result.color])}>
          {result.severity === 'critical' && <ShieldAlert className="w-20 h-20 mx-auto mb-4 animate-bounce" />}
          {result.severity === 'severe' && <AlertCircle className="w-20 h-20 mx-auto mb-4" />}
          {result.severity === 'moderate' && <Activity className="w-20 h-20 mx-auto mb-4" />}
          {result.severity === 'mild' && <HeartPulse className="w-20 h-20 mx-auto mb-4" />}

          <h2 className="text-3xl font-bold mb-4">{result.title}</h2>
          <p className="text-xl mb-6 opacity-90">{result.description}</p>

          <div className="bg-white/50 dark:bg-black/20 rounded-xl p-6 font-semibold text-lg">
            Recommendation: {result.action}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/patient/dashboard')}
            className="px-8 py-4 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-300 transition-colors"
          >
            Return to Dashboard
          </button>

          {['critical', 'severe'].includes(result.severity) && (
            <button className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 animate-pulse shadow-lg hover:shadow-red-500/50 transition-all">
              Contact Emergency Services
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Progress Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Symptom Checker
        </h1>
        <div className="flex gap-2 h-2 mt-4">
          <div className={cn("h-full rounded-full flex-1 transition-all", currentStep === 'symptoms' ? "bg-blue-600" : "bg-blue-200 dark:bg-blue-900")}></div>
          <div className={cn("h-full rounded-full flex-1 transition-all", currentStep === 'details' ? "bg-blue-600" : "bg-blue-200 dark:bg-blue-900")}></div>
          <div className={cn("h-full rounded-full flex-1 transition-all", currentStep === 'history' ? "bg-blue-600" : "bg-blue-200 dark:bg-blue-900")}></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 min-h-[500px] flex flex-col">

        {/* STEP 1: SYMPTOMS */}
        {currentStep === 'symptoms' && (
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">What are you feeling?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
              {commonSymptoms.map(sym => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => toggleSymptom(sym)}
                  className={cn(
                    "p-3 rounded-xl border-2 text-sm font-medium transition-all hover:scale-105 active:scale-95",
                    selectedSymptoms.includes(sym)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                      : "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:border-blue-200"
                  )}
                >
                  {sym}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                onClick={startListening}
                className={cn(
                  "rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center h-40",
                  isListening
                    ? "bg-red-50 dark:bg-red-900/20 border-2 border-red-500 animate-pulse"
                    : "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-2 border-transparent"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-colors mb-2",
                  isListening ? "bg-red-100 text-red-600" : "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"
                )}>
                  {isListening ? <Loader2 className="w-6 h-6 animate-spin" /> : <Mic className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Live Microphone</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Speak directly now
                  </p>
                </div>
              </div>

              <div
                onClick={triggerCallInterview}
                className="rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center h-40 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border-2 border-transparent hover:border-purple-300"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 mb-2">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Phone Interview</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    We call your device
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DETAILS */}
        {currentStep === 'details' && (
          <div className="flex-1 space-y-8">
            <h2 className="text-2xl font-bold">Tell us more details</h2>

            <div>
              <label className="block font-medium mb-3">How long have you felt this way?</label>
              <div className="grid grid-cols-4 gap-3">
                {['< 1 hr', 'Today', '2-3 Days', '1 Week+'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={cn(
                      "py-3 rounded-lg border-2 font-medium",
                      duration === d ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "border-gray-200 dark:border-gray-700"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-3">Pain Level (1-10)</label>
              <input
                type="range"
                min="1" max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2 font-bold">
                <span>1 (Mild)</span>
                <span>5 (Moderate)</span>
                <span>10 (Severe)</span>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Anything else notable?</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                rows={3}
                placeholder="e.g. sharp pain when I breathe in..."
              />
            </div>
          </div>
        )}

        {/* STEP 3: HISTORY */}
        {currentStep === 'history' && (
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold">Relevant History</h2>
            <p className="text-gray-500 dark:text-gray-400">Do you have any existing conditions we should know about?</p>

            <textarea
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none h-48"
              placeholder="e.g. Asthma, Diabetes, Heart Condition, recent surgery..."
            />

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex gap-3 text-yellow-800 dark:text-yellow-200">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="text-sm">We use this to check for complications. Your data is private and secure.</p>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 flex justify-between">
          {currentStep !== 'symptoms' ? (
            <button
              onClick={handleBack}
              className="px-6 py-3 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
          ) : <div></div>}

          <button
            onClick={handleNext}
            disabled={currentStep === 'symptoms' && selectedSymptoms.length === 0}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
          >
            {currentStep === 'history' ? 'Analyze Symptoms' : 'Continue'}
            {currentStep !== 'history' && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
