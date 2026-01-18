'use client'

import { useState, useRef } from 'react'
import { Heart, AlertCircle, Phone, Calendar, Activity, Thermometer, Smile, Frown, CheckCircle, Clock, Camera, Upload, Loader2, ShieldAlert } from 'lucide-react'
import { format } from 'date-fns'
import { analyzeWoundAction, WoundAnalysisResult } from '@/app/actions/wound-analysis'
import { useStore } from '@/lib/store'
import { useUserStore } from '@/lib/userStore'

export default function PostOpPage() {
  const [activeTab, setActiveTab] = useState<'checkin' | 'timeline' | 'wound'>('checkin')
  const [painLevel, setPainLevel] = useState(3)
  const [temperature, setTemperature] = useState(98.6)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
    // Here you would typically send data to backend
  }

  const milestones = [
    { day: 1, title: 'Surgery Day', completed: true, status: 'Rest & Ice' },
    { day: 2, title: 'First Follow-up', completed: true, status: 'Dressing Change' },
    { day: 5, title: 'Mobility Check', completed: false, status: 'Light Walking' },
    { day: 14, title: 'Suture Removal', completed: false, status: 'Doctor Visit' },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8" />
            Post-Op Recovery
          </h1>
          <p className="opacity-90 text-lg">
            Day 3 after Arthroscopic Knee Surgery
          </p>
        </div>
        <Activity className="absolute -bottom-8 -right-8 w-64 h-64 text-white opacity-10" />
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('checkin')}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'checkin'
            ? 'bg-white dark:bg-gray-700 shadow text-red-600 dark:text-red-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
        >
          Daily Check-in
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'timeline'
            ? 'bg-white dark:bg-gray-700 shadow text-red-600 dark:text-red-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
        >
          Recovery Timeline
        </button>
        <button
          onClick={() => setActiveTab('wound')}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'wound'
            ? 'bg-white dark:bg-gray-700 shadow text-red-600 dark:text-red-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
        >
          Wound Analysis
        </button>
      </div>

      {/* Content */}
      {activeTab === 'checkin' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" /> Pain Level (1-10)
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white w-12 text-center">{painLevel}</span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>No Pain</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-orange-500" /> Temperature
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTemperature(prev => parseFloat((prev - 0.1).toFixed(1)))}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl font-bold"
                >-</button>
                <div className="text-center flex-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{temperature}°F</span>
                </div>
                <button
                  onClick={() => setTemperature(prev => parseFloat((prev + 0.1).toFixed(1)))}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl font-bold"
                >+</button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Symptoms</h3>
              <div className="space-y-3">
                {['Swelling', 'Redness', 'Drainage', 'Nausea', 'Dizziness'].map(symptom => (
                  <label key={symptom} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded text-red-600 focus:ring-red-500 border-gray-300"
                      checked={symptoms.includes(symptom)}
                      onChange={(e) => {
                        if (e.target.checked) setSymptoms([...symptoms, symptom])
                        else setSymptoms(symptoms.filter(s => s !== symptom))
                      }}
                    />
                    <span className="font-medium text-gray-700 dark:text-gray-200">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitted ? 'Check-in Complete ✅' : 'Submit Daily Check-in'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-100 dark:bg-gray-700 rounded-full"></div>

            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="relative flex items-start gap-8">
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 z-10 border-4 border-white dark:border-gray-800 ${milestone.completed
                    ? 'bg-green-500 text-white shadow-green-200 shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`}>
                    <span className="text-xs font-bold uppercase">Day</span>
                    <span className="text-xl font-bold">{milestone.day}</span>
                  </div>

                  <div className={`flex-1 pt-2 p-6 rounded-2xl ${milestone.completed ? 'bg-green-50 dark:bg-green-900/10' : ''
                    }`}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                      {milestone.title}
                      {milestone.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </h3>
                    <p className="text-gray-500 font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {milestone.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'wound' && <WoundScan />}

      {/* Emergency FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="group flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg hover:shadow-red-300 transition-all hover:pr-8">
          <Phone className="w-6 h-6 animate-pulse" />
          <span className="w-0 overflow-hidden group-hover:w-auto transition-all font-bold whitespace-nowrap">
            Call Doctor
          </span>
        </button>
      </div>
    </div>
  )
}

function WoundScan() {
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<WoundAnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addWoundReport = useStore(state => state.addWoundReport)
  const sendMessage = useStore(state => state.sendMessage)
  const user = useUserStore(state => state.user)

  const handleSubmitToDoctor = () => {
    if (!user || !image || !result) return

    addWoundReport({
      userId: user.id,
      imageUrl: image,
      analysis: result,
    })

    // Auto-send chat message
    // 1. Send Image
    sendMessage({
      senderId: user.id,
      receiverId: 'doctor-1',
      content: image,
      type: 'image'
    })

    // 2. Send Analysis Text
    sendMessage({
      senderId: user.id,
      receiverId: 'doctor-1',
      content: `📋 **Wound Analysis Report**\n\n• Status: ${result.status}\n• Healing: ${result.healingPercentage}%\n• Concerns: ${result.concerns.join(', ')}`,
      type: 'text'
    })

    alert("Report sent to your doctor for review.")
    setImage(null)
    setResult(null)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      setImage(base64)
      setAnalyzing(true)

      // Call Server Action
      const analysis = await analyzeWoundAction(base64)
      setResult(analysis)
      setAnalyzing(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 text-center">
        {!image ? (
          <div className="py-12">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Wound Check</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Take a clear photo of your surgical site. Our AI will analyze redness, swelling, and healing progress.
            </p>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg flex items-center gap-2 mx-auto transition-all hover:scale-105"
            >
              <Upload className="w-5 h-5" />
              Upload Photo
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in">
            <div className="relative rounded-2xl overflow-hidden mb-6 border-4 border-white dark:border-gray-700 shadow-lg max-w-sm mx-auto">
              <img src={image} alt="Wound Scan" className="w-full" />
              {analyzing && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                  <Loader2 className="w-10 h-10 animate-spin mb-2" />
                  <p className="font-bold">Analyzing Tissue...</p>
                </div>
              )}
            </div>

            {!analyzing && result && (
              <div className={`text-left bg-${result.color === 'green' ? 'green' : 'orange'}-50 dark:bg-${result.color === 'green' ? 'green' : 'orange'}-900/20 rounded-2xl p-6 border border-${result.color === 'green' ? 'green' : 'orange'}-200 dark:border-${result.color === 'green' ? 'green' : 'orange'}-800`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {result.status}
                      {result.color !== 'green' && <ShieldAlert className="w-5 h-5 text-orange-600" />}
                    </h3>
                    <p className="text-sm text-gray-500">Healing Estimate: {result.healingPercentage}%</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase bg-${result.color}-100 text-${result.color}-700`}>
                    {result.color === 'green' ? 'Normal' : 'Attention'}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300 uppercase mb-2">Observations</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                      {result.concerns.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Recommendation</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{result.recommendation}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setImage(null)}
                    className="flex-1 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Scan Another
                  </button>
                  <button
                    onClick={handleSubmitToDoctor}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Upload className="w-5 h-5" />
                    Submit to Doctor
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
