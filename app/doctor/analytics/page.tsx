'use client'

import { TrendingUp, Users, Calendar, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function DoctorAnalyticsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Practice Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400">Key performance indicators for your clinic.</p>
                </div>
                <div className="flex gap-2">
                    <select className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500">
                        <option>This Month</option>
                        <option>Last Quarter</option>
                        <option>Year to Date</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Patients"
                    value="1,284"
                    change="+12%"
                    trend="up"
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Appointments"
                    value="432"
                    change="+5%"
                    trend="up"
                    icon={Calendar}
                    color="purple"
                />
                <StatCard
                    title="Avg. Wait Time"
                    value="14m"
                    change="-2m"
                    trend="down" // down is good for wait time, but visually we handle green/red
                    goodTrend={true}
                    icon={Activity}
                    color="orange"
                />
                <StatCard
                    title="Revenue Est."
                    value="$42.5k"
                    change="+8.1%"
                    trend="up"
                    icon={DollarSign}
                    color="green"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Chart Placeholder */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-gray-900 dark:text-white">Patient Visits Trend</h3>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4 px-2">
                        <Bar height="40%" label="Mon" />
                        <Bar height="65%" label="Tue" />
                        <Bar height="55%" label="Wed" />
                        <Bar height="80%" label="Thu" active />
                        <Bar height="60%" label="Fri" />
                        <Bar height="35%" label="Sat" />
                        <Bar height="20%" label="Sun" />
                    </div>
                </div>

                {/* Side Circle Chart Placeholder */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6">Patient Demographics</h3>
                    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-[12px] border-blue-500 opacity-20"></div>
                        <div className="absolute inset-0 rounded-full border-[12px] border-blue-500 border-l-transparent border-b-transparent rotate-45"></div>
                        <div className="text-center">
                            <span className="block text-3xl font-bold text-gray-900 dark:text-white">58%</span>
                            <span className="text-xs text-gray-500">Female</span>
                        </div>
                    </div>
                    <div className="mt-8 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                <span className="text-gray-600 dark:text-gray-300">Female</span>
                            </div>
                            <span className="font-bold">58%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-blue-200 dark:bg-blue-900 rounded-full"></span>
                                <span className="text-gray-600 dark:text-gray-300">Male</span>
                            </div>
                            <span className="font-bold">42%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, change, trend, goodTrend, icon: Icon, color }: any) {
    const isPositive = trend === 'up';
    const isGood = goodTrend === undefined ? isPositive : goodTrend;
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
        purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
        orange: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
        green: 'text-green-600 bg-green-100 dark:bg-green-900/20',
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${isGood ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {change}
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
            </div>
        </div>
    )
}

function Bar({ height, label, active }: any) {
    return (
        <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg relative h-full overflow-hidden">
                <div
                    style={{ height }}
                    className={`absolute bottom-0 left-0 right-0 w-full rounded-t-lg transition-all duration-500 ${active ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-blue-300 dark:bg-blue-900 group-hover:bg-blue-400'
                        }`}
                ></div>
            </div>
            <span className={`text-xs font-medium ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>{label}</span>
        </div>
    )
}
