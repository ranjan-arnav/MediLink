'use client'

import { FileText, Download, Share2, Calendar, ChevronDown } from 'lucide-react'

export default function DoctorReportsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Clinical Reports</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage and generate patient documents.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">Last 30 Days</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium">
                        <FileText className="w-4 h-4" /> Generate New Report
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <ReportCard
                    title="Monthly Patient Summary"
                    date="Jan 01 - Jan 31, 2024"
                    type="Auto-Generated"
                    size="2.4 MB"
                    color="blue"
                />
                <ReportCard
                    title="Prescription Audit Log"
                    date="Q4 2023"
                    type="Compliance"
                    size="4.1 MB"
                    color="purple"
                />
                <ReportCard
                    title="Telemedicine Usage Stats"
                    date="Dec 2023"
                    type="Analytics"
                    size="1.8 MB"
                    color="green"
                />
                <ReportCard
                    title="Patient Satisfaction Survey"
                    date="2023 Annual"
                    type="Survey"
                    size="8.5 MB"
                    color="orange"
                />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white">Recent Patient Reports</h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    <PatientReportRow patient="John Doe" report="Post-Op Discharge Summary" date="2 hours ago" />
                    <PatientReportRow patient="Alice Freeman" report="Lab Result Analysis" date="Yesterday" />
                    <PatientReportRow patient="Sarah Johnson" report="Referral Letter - Cardiology" date="Jan 10, 2024" />
                </div>
            </div>
        </div>
    )
}

function ReportCard({ title, date, type, size, color }: any) {
    const colorClasses = {
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        green: 'bg-green-500',
        orange: 'bg-orange-500'
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${colorClasses[color]} shadow-lg shadow-${color}-500/20`}>
                    <FileText className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                        <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{date}</p>

            <div className="flex items-center gap-3 text-xs font-medium">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">{type}</span>
                <span className="text-gray-400">{size}</span>
            </div>
        </div>
    )
}

function PatientReportRow({ patient, report, date }: any) {
    return (
        <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold">
                    {patient.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{report}</h4>
                    <p className="text-xs text-gray-500">for {patient}</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">{date}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    )
}
