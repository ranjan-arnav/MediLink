'use client'

import { Calendar as CalendarIcon, Clock, Video, MapPin, User, ChevronRight, Check, X } from 'lucide-react'

export default function DoctorAppointmentsPage() {
    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6 animate-in fade-in duration-500">
            {/* Schedule List */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Schedule</h1>
                        <p className="text-gray-500 dark:text-gray-400">Today, Jan 12, 2024</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" /> Add Slot
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    <TimeSlot time="09:00 AM" />
                    <AppointmentCard
                        time="09:30 AM"
                        duration="30 min"
                        patient="Alice Freeman"
                        type="Video Consultation"
                        status="upcoming"
                        image="https://images.unsplash.com/photo-1554151228-14d9def656ec?w=100&q=80"
                    />
                    <TimeSlot time="10:00 AM" />
                    <AppointmentCard
                        time="10:30 AM"
                        duration="45 min"
                        patient="Robert Fox"
                        type="In-Person Checkup"
                        status="confirmed"
                        image="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80"
                    />
                    <TimeSlot time="11:15 AM" />
                    <TimeSlot time="12:00 PM" label="Lunch Break" />
                    <AppointmentCard
                        time="01:00 PM"
                        duration="30 min"
                        patient="Leslie Alexander"
                        type="Video Consultation"
                        status="pending"
                        image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                    />
                </div>
            </div>

            {/* Quick Review / Calendar Widget Side */}
            <div className="w-80 hidden xl:flex flex-col gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Calendar</h3>
                    <div className="w-full aspect-square bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-400 border border-dashed border-gray-200 dark:border-gray-700">
                        Mini Calendar Component
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-xl text-white">
                    <h3 className="font-bold text-lg mb-2">Next Up</h3>
                    <div className="flex items-center gap-3 mb-4">
                        <img src="https://images.unsplash.com/photo-1554151228-14d9def656ec?w=100&q=80" className="w-12 h-12 rounded-full border-2 border-white/30" />
                        <div>
                            <p className="font-bold">Alice Freeman</p>
                            <p className="text-blue-100 text-sm">Video Call • 09:30 AM</p>
                        </div>
                    </div>
                    <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                        <Video className="w-4 h-4" /> Join Call
                    </button>
                </div>
            </div>
        </div>
    )
}

function TimeSlot({ time, label }: any) {
    return (
        <div className="flex items-center gap-4 py-2 opacity-50">
            <span className="text-sm font-medium text-gray-500 w-16">{time}</span>
            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
            {label && <span className="text-sm text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{label}</span>}
        </div>
    )
}

function AppointmentCard({ time, duration, patient, type, status, image }: any) {
    const isVideo = type.includes('Video');

    return (
        <div className="flex gap-4 group">
            <div className="w-16 pt-2 text-right">
                <span className="block text-sm font-bold text-gray-900 dark:text-white">{time}</span>
                <span className="block text-xs text-gray-500">{duration}</span>
            </div>

            <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-2xl border-l-4 border-l-blue-500 border-y border-r border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src={image} alt={patient} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{patient}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            {isVideo ? <Video className="w-3.5 h-3.5 text-purple-500" /> : <MapPin className="w-3.5 h-3.5 text-orange-500" />}
                            {type}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {status === 'pending' && (
                        <>
                            <button className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 rounded-lg transition-colors" title="Confirm">
                                <Check className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors" title="Decline">
                                <X className="w-5 h-5" />
                            </button>
                        </>
                    )}
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
