'use client'

import { Activity, Moon, Sun, Sunrise, Battery } from 'lucide-react'

export default function HealthPlanPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Activity className="h-8 w-8 text-teal-500" />
                        Health & Fitness Plan
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        A comprehensive daily routine optimized for your recovery and wellness.
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                <TimelineItem
                    icon={<Sunrise className="h-6 w-6 text-orange-500" />}
                    time="07:00 AM"
                    title="Morning Routine"
                    description="Hydration (500ml water) + 15 mins Light Stretching."
                    status="done"
                />
                <TimelineItem
                    icon={<Activity className="h-6 w-6 text-blue-500" />}
                    time="08:30 AM"
                    title="Low Intensity Cardio"
                    description="20 mins brisk walking. Keep heart rate below 110 bpm."
                    status="active"
                />
                <TimelineItem
                    icon={<Sun className="h-6 w-6 text-yellow-500" />}
                    time="01:00 PM"
                    title="Post-Lunch Mobility"
                    description="5 mins seated mobility exercises to improve circulation."
                    status="upcoming"
                />
                <TimelineItem
                    icon={<Battery className="h-6 w-6 text-green-500" />}
                    time="04:00 PM"
                    title="Energy Recharge"
                    description="Healthy snack + 10 mins mindfulness meditation."
                    status="upcoming"
                />
                <TimelineItem
                    icon={<Moon className="h-6 w-6 text-indigo-500" />}
                    time="09:30 PM"
                    title="Sleep Hygiene"
                    description="No screens. 10 mins reading. Temperature set to 68°F."
                    status="upcoming"
                />
            </div>
        </div>
    )
}

function TimelineItem({ icon, time, title, description, status }: any) {
    const isDone = status === 'done';
    const isActive = status === 'active';

    return (
        <div className={`relative pl-8 pb-8 border-l-2 last:border-0 ${isDone ? 'border-green-500' : isActive ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
            }`}>
            <div className={`absolute -left-[11px] top-0 w-6 h-6 rounded-full border-2 bg-white dark:bg-gray-900 flex items-center justify-center ${isDone ? 'border-green-500 text-green-500' : isActive ? 'border-blue-500 text-blue-500' : 'border-gray-300 dark:border-gray-600 text-gray-400'
                }`}>
                {isDone ? <div className="w-2.5 h-2.5 bg-green-500 rounded-full" /> : icon}
            </div>

            <div className={`p-4 rounded-xl border transition-all ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-md transform scale-[1.02]'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className={`font-bold ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                        {title}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
                        {time}
                    </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {description}
                </p>

                {isActive && (
                    <button className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        Mark as Complete
                    </button>
                )}
            </div>
        </div>
    )
}
