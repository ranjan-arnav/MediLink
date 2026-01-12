'use client'

import { File, Download, Share2, Eye, Filter } from 'lucide-react'

export default function MedicalRecordsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <File className="h-8 w-8 text-blue-500" />
                        Medical Records
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Securely access your history, lab reports, and imaging.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Filter className="h-4 w-4" />
                    Filter view
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Record Name</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Provider</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                        <RecordRow
                            date="Jan 15, 2024"
                            name="Annual Blood Work Panel"
                            type="Lab Report"
                            provider="LabCorp"
                        />
                        <RecordRow
                            date="Jan 12, 2024"
                            name="Consultation Note - Cardiology"
                            type="Clinical Note"
                            provider="Dr. Sarah Smith"
                        />
                        <RecordRow
                            date="Dec 20, 2023"
                            name="Chest X-Ray AP View"
                            type="Imaging"
                            provider="City Imaging Center"
                        />
                        <RecordRow
                            date="Nov 05, 2023"
                            name="Vaccination Record - Influenza"
                            type="Immunization"
                            provider="Walgreens Clinic"
                        />
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function RecordRow({ date, name, type, provider }: any) {
    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{date}</td>
            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{name}</td>
            <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {type}
                </span>
            </td>
            <td className="px-6 py-4 text-gray-500">{provider}</td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500" title="View">
                        <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500" title="Download">
                        <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500" title="Share">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    )
}
