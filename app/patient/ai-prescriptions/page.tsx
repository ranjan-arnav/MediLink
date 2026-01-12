'use client'

import { Pill, Sparkles, AlertTriangle, CheckCircle, Info } from 'lucide-react'

export default function AIPrescriptionsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                    AI Suggested Prescriptions
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Based on your recent symptom screening ID #8821. <br />
                    <span className="font-semibold text-red-500">Note: These are AI suggestions and require doctor approval.</span>
                </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Analysis Summary</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                            Patient reported severe headache, photosensitivity, and mild nausea. Symptoms align 92% with <strong>Migraine</strong>.
                        </p>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-white dark:bg-gray-800 text-xs font-mono rounded text-gray-500 border border-gray-200 dark:border-gray-700">ICD-10: G43.909</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">Suggested Medications</h2>

                <SuggestionCard
                    name="Sumatriptan"
                    dosage="50mg"
                    frequency="1 tablet at onset"
                    confidence="High Match"
                    type="Rx Required"
                />
                <SuggestionCard
                    name="Ibuprofen"
                    dosage="400mg"
                    frequency="Every 4-6 hours as needed"
                    confidence="Supportive"
                    type="OTC"
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="px-5 py-2.5 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    Dismiss
                </button>
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2">
                    Request Doctor Review <CheckCircle className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

function SuggestionCard({ name, dosage, frequency, confidence, type }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-500">
                    <Pill className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {name}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${type === 'OTC' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'
                            }`}>
                            {type}
                        </span>
                    </h3>
                    <p className="text-sm text-gray-500">{dosage} • {frequency}</p>
                </div>
            </div>

            <div className="text-right">
                <span className="block text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10 px-2 py-1 rounded mb-1">
                    {confidence}
                </span>
                <button className="text-xs text-blue-600 hover:underline flex items-center justify-end gap-1">
                    <Info className="w-3 h-3" /> interaction check
                </button>
            </div>
        </div>
    )
}
