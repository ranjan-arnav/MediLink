'use client'

import { useState } from 'react'
import { Dumbbell, Camera, Play, VideoOff, Maximize2 } from 'lucide-react'

export default function WorkoutTrainerPage() {
    const [isSessionActive, setIsSessionActive] = useState(false)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Dumbbell className="h-8 w-8 text-indigo-500" />
                        AI Workout Trainer
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Real-time form correction using advanced computer vision.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-4">
                    <div className={`relative aspect-video rounded-2xl overflow-hidden border-2 ${isSessionActive ? 'border-green-500' : 'border-gray-200 dark:border-gray-700'
                        } bg-black flex items-center justify-center`}>

                        {isSessionActive ? (
                            <>
                                <img
                                    src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2669&auto=format&fit=crop"
                                    alt="Workout Demo"
                                    className="w-full h-full object-cover opacity-80"
                                />
                                {/* Overlay Simulation */}
                                <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm font-mono animate-pulse">
                                            ● LIVE | 30FPS
                                        </div>
                                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                            Form: Perfect
                                        </div>
                                    </div>

                                    {/* Skeleton Points Simulation */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-dashed border-green-500/50 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                                    </div>

                                    <div className="flex justify-center">
                                        <h2 className="text-3xl font-black text-white drop-shadow-lg tracking-widest uppercase">
                                            Squats: 12/15
                                        </h2>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center space-y-4 p-6">
                                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Camera className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="text-white text-xl font-bold">Camera Access Required</h3>
                                <p className="text-gray-400 max-w-sm mx-auto">
                                    CareConnect uses your webcam to analyze body movements and prevent injury. Processing happens locally on your device.
                                </p>
                                <button
                                    onClick={() => setIsSessionActive(true)}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all flex items-center gap-2 mx-auto"
                                >
                                    <Play className="h-5 w-5 fill-current" /> Start Session
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 px-2">
                        <span>Powered by MediaPipe</span>
                        <span className="flex items-center gap-1"><VideoOff className="w-4 h-4" /> Privacy Mode: Enabled</span>
                    </div>
                </div>

                {/* Sidebar / Stats */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Current Workout</h3>
                        <div className="space-y-4">
                            <WorkoutStep number={1} title="Warmup: Jumping Jacks" duration="2 mins" status="done" />
                            <WorkoutStep number={2} title="Squats" duration="3 sets x 15" status="active" />
                            <WorkoutStep number={3} title="Pushups" duration="3 sets x 10" status="pending" />
                            <WorkoutStep number={4} title="Plank" duration="60 secs" status="pending" />
                        </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                        <h4 className="font-bold text-indigo-700 dark:text-indigo-400 mb-2 text-sm uppercase">Coach Tips</h4>
                        <p className="text-sm text-indigo-600 dark:text-indigo-300">
                            "Keep your back straight and knees behind your toes during the descent. Great job maintaining rhythm!"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function WorkoutStep({ number, title, duration, status }: any) {
    return (
        <div className={`flex items-center gap-3 p-3 rounded-lg ${status === 'active' ? 'bg-gray-100 dark:bg-gray-700' : 'opacity-70'
            }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${status === 'done' ? 'bg-green-100 text-green-600' : status === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                {number}
            </div>
            <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white text-sm">{title}</div>
                <div className="text-xs text-gray-500">{duration}</div>
            </div>
        </div>
    )
}
