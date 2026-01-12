'use client'

import { Pill, Download, Search, RefreshCw } from 'lucide-react'

export default function PrescriptionsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Pill className="h-8 w-8 text-teal-500" />
                        My Prescriptions
                    </h1>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search meds..."
                            className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                    <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Active Medications</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <PrescriptionCard
                            name="Amoxicillin"
                            dose="500mg"
                            instructions="Take 1 capsule every 8 hours"
                            doctor="Dr. Sarah Smith"
                            refills={2}
                            active={true}
                        />
                        <PrescriptionCard
                            name="Lisinopril"
                            dose="10mg"
                            instructions="Take 1 tablet daily in the morning"
                            doctor="Dr. James Wilson"
                            refills={5}
                            active={true}
                        />
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Archived / Past</h2>
                    <div className="grid md:grid-cols-2 gap-4 opacity-75 grayscale-[0.5]">
                        <PrescriptionCard
                            name="Azithromycin"
                            dose="250mg"
                            instructions="Take 2 tablets first day, then 1 daily"
                            doctor="Dr. Sarah Smith"
                            refills={0}
                            active={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function PrescriptionCard({ name, dose, instructions, doctor, refills, active }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                        }`}>
                        <Pill className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{name} <span className="text-sm font-normal text-gray-500 ml-1">{dose}</span></h3>
                        <p className="text-xs text-gray-500">Prescribed by {doctor}</p>
                    </div>
                </div>
                {active && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded">
                        Active
                    </span>
                )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 mb-4 font-medium">
                "{instructions}"
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className={`${refills > 0 ? 'text-blue-600' : 'text-red-500 font-medium'}`}>
                    Refills left: {refills}
                </span>
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <Download className="w-4 h-4" /> Download Label
                </button>
            </div>
        </div>
    )
}
