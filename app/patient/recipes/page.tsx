'use client'

import { useState } from 'react'
import { Utensils, ChefHat, Clock, Flame, ChevronRight, Sparkles } from 'lucide-react'

export default function DietAssistantPage() {
    const [activeTab, setActiveTab] = useState<'plan' | 'recipes'>('plan')

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Utensils className="h-8 w-8 text-green-500" />
                        Diet Assistant
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Personalized meal plans and healthy recipes tailored to your vitals.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                    <Sparkles className="h-5 w-5" />
                    Generate AI Plan
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800">
                <button
                    onClick={() => setActiveTab('plan')}
                    className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'plan'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    Daily Plan
                    {activeTab === 'plan' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('recipes')}
                    className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'recipes'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    Recipe Library
                    {activeTab === 'recipes' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 rounded-t-full" />
                    )}
                </button>
            </div>

            {activeTab === 'plan' ? <DailyPlanView /> : <RecipeLibraryView />}
        </div>
    )
}

function DailyPlanView() {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            <MealCard
                type="Breakfast"
                time="08:00 AM"
                title="Oatmeal with Berries"
                calories={350}
                protein="12g"
                image="https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80"
            />
            <MealCard
                type="Lunch"
                time="01:00 PM"
                title="Grilled Chicken Salad"
                calories={450}
                protein="40g"
                image="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
            />
            <MealCard
                type="Dinner"
                time="07:30 PM"
                title="Baked Salmon & Asparagus"
                calories={500}
                protein="35g"
                image="https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=800&q=80"
            />
        </div>
    )
}

function RecipeLibraryView() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for recipe list */}
            <div className="col-span-full p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <ChefHat className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recipe Library Empty</h3>
                <p className="text-gray-500 dark:text-gray-400">Generate a diet plan to populate tailored recipes.</p>
            </div>
        </div>
    )
}

function MealCard({
    type,
    time,
    title,
    calories,
    protein,
    image,
}: {
    type: string
    time: string
    title: string
    calories: number
    protein: string
    image: string
}) {
    return (
        <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-2 py-1 rounded">
                    {type} • {time}
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-500 transition-colors">
                    {title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span>{calories} kcal</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Utensils className="h-4 w-4 text-blue-500" />
                        <span>{protein} pro</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
