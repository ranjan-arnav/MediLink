'use client'

import { useState } from 'react'
import { Scan, Upload, AlertCircle, CheckCircle, FileImage, Loader2 } from 'lucide-react'

export default function ScanAnalysisPage() {
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<null | 'normal' | 'issue'>(null)

    const handleSimulateAnalysis = () => {
        setIsAnalyzing(true)
        setTimeout(() => {
            setIsAnalyzing(false)
            setResult('issue')
        }, 3000)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                    <Scan className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Scan Analysis</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                    Upload X-rays, MRIs, or CT scans for instant preliminary AI interpretation and anomaly detection.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Upload Zone */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                        <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Click to upload or drag & drop
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Supported formats: DICOM, JPG, PNG (Max 50MB)
                    </p>
                    <button
                        onClick={handleSimulateAnalysis}
                        disabled={isAnalyzing}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAnalyzing ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing...
                            </span>
                        ) : (
                            'Analyze Demo Image'
                        )}
                    </button>
                </div>

                {/* Results Panel */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        Analysis Results
                    </h3>

                    {!result && !isAnalyzing && (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
                            <FileImage className="h-12 w-12 mb-3 opacity-50" />
                            <p>No scan uploaded yet</p>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse">
                                Scanning for anomalies...
                            </p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className={`p-4 rounded-xl ${result === 'issue'
                                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800'
                                    : 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800'
                                }`}>
                                <div className="flex items-start gap-3">
                                    {result === 'issue' ? (
                                        <AlertCircle className="h-6 w-6 text-red-600 shrink-0" />
                                    ) : (
                                        <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
                                    )}
                                    <div>
                                        <h4 className={`font-bold ${result === 'issue' ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'
                                            }`}>
                                            {result === 'issue' ? 'Potential Anomaly Detected' : 'No Anomalies Found'}
                                        </h4>
                                        <p className={`text-sm mt-1 ${result === 'issue' ? 'text-red-600 dark:text-red-300' : 'text-green-600 dark:text-green-300'
                                            }`}>
                                            Confidence: 94.2% • Based on chest_xray_v2 model
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">
                                    Findings
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <span className="block mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                        <span>Irregular opacity observed in upper right lobe (Zone 2).</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="block mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                        <span>Mild pleural thickening suggested.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button className="w-full py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity">
                                    Download Full Report PDF
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
