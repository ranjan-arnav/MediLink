'use client'

import { useState } from 'react'
import { File, Download, Share2, Eye, Filter, X, AlertCircle, CheckCircle } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function MedicalRecordsPage() {
    const records = useStore((state) => state.medicalRecords)
    const [selectedRecord, setSelectedRecord] = useState<any>(null)

    const severityColors = {
        mild: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        severe: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
        critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }

    const typeColors = {
        'Voice Consultation': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        'Lab Report': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        'Clinical Note': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
        'Imaging': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
        'Immunization': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <File className="h-8 w-8 text-blue-500" />
                        Medical Records
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Securely access your history, lab reports, and AI consultations.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Filter className="h-4 w-4" />
                    Filter view
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {records.length === 0 ? (
                    <div className="p-12 text-center">
                        <File className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Records Yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            Complete a Voice Consultation through Symptom Screening to generate your first AI health report.
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Record Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Severity</th>
                                <th className="px-6 py-4">Provider</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                            {records.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                        {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{record.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", typeColors[record.type] || 'bg-gray-100 text-gray-800')}>
                                            {record.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase", severityColors[record.severity])}>
                                            {record.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{record.provider}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedRecord(record)}
                                                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View Report
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* View Report Modal */}
            {selectedRecord && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start bg-gray-50 dark:bg-gray-900">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedRecord.name}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(selectedRecord.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Severity Badge */}
                            <div className="flex items-center gap-3">
                                <span className={cn("px-3 py-1 rounded-full text-sm font-bold uppercase", severityColors[selectedRecord.severity])}>
                                    {selectedRecord.severity} Severity
                                </span>
                                <span className={cn("px-3 py-1 rounded-full text-sm font-medium", typeColors[selectedRecord.type] || 'bg-gray-100 text-gray-800')}>
                                    {selectedRecord.type}
                                </span>
                            </div>

                            {/* Summary */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Summary</h3>
                                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{selectedRecord.summary}</p>
                            </div>

                            {/* Recommendations */}
                            {selectedRecord.recommendations && selectedRecord.recommendations.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Recommendations</h3>
                                    <ul className="space-y-2">
                                        {selectedRecord.recommendations.map((rec: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-gray-800 dark:text-gray-200">
                                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Raw Answers (collapsible) */}
                            {selectedRecord.rawAnswers && selectedRecord.rawAnswers.length > 0 && (
                                <details className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                                    <summary className="font-medium text-gray-600 dark:text-gray-400 cursor-pointer">View Original Responses</summary>
                                    <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        {selectedRecord.rawAnswers.map((ans: string, i: number) => (
                                            <li key={i} className="pl-4 border-l-2 border-gray-300 dark:border-gray-700">"{ans}"</li>
                                        ))}
                                    </ul>
                                </details>
                            )}

                            {/* Provider */}
                            <div className="text-sm text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
                                Provider: <span className="font-medium">{selectedRecord.provider}</span>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end bg-gray-50 dark:bg-gray-900">
                            <button className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                                <Download className="w-4 h-4" /> Download
                            </button>
                            <button className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                                <Share2 className="w-4 h-4" /> Share
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
