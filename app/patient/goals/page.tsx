'use client'

import { Target, Trophy, TrendingUp, Plus } from 'lucide-react'

export default function HealthGoalsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Target className="h-8 w-8 text-red-500" />
                        Health Goals
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Track your progress towards a healthier lifestyle.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg shadow-md transition-all">
                    <Plus className="h-5 w-5" />
                    Add Goal
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <GoalCard
                    title="Weight Loss"
                    current={150}
                    target={145}
                    unit="lbs"
                    deadline="Feb 28, 2024"
                    progress={65}
                    color="blue"
                />
                <GoalCard
                    title="Daily Steps"
                    current={6500}
                    target={10000}
                    unit="steps"
                    deadline="Daily"
                    progress={65}
                    color="green"
                />
                <GoalCard
                    title="Water Intake"
                    current={1200}
                    target={2500}
                    unit="ml"
                    deadline="Daily"
                    progress={48}
                    color="cyan"
                />
                <GoalCard
                    title="Sleep Duration"
                    current={6.5}
                    target={8}
                    unit="hours"
                    deadline="Daily"
                    progress={81}
                    color="purple"
                />
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 text-white flex items-center justify-between shadow-lg">
                <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Trophy className="w-8 h-8" />
                        Streak Master!
                    </h2>
                    <p className="opacity-90">You've hit your step goal for 7 days in a row.</p>
                </div>
                <div className="text-4xl font-black opacity-20 transform -rotate-12">
                    7 DAYS
                </div>
            </div>
        </div>
    )
}

function GoalCard({ title, current, target, unit, deadline, progress, color }: any) {
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        cyan: 'bg-cyan-500',
        purple: 'bg-purple-500'
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{title}</h3>
                    <p className="text-sm text-gray-500">Target: {target} {unit} by {deadline}</p>
                </div>
                <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-900`}>
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
            </div>

            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-300">
                            {progress}%
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-300">
                            {current} / {target} {unit}
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2.5 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                    <div style={{ width: `${progress}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${colorClasses[color] || 'bg-blue-500'}`}></div>
                </div>
            </div>
        </div>
    )
}
