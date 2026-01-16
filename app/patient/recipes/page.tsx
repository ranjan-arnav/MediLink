'use client'

import { useState, useRef, useEffect } from 'react'
import { Utensils, Sparkles, Plus, Flame, Activity, X, Camera, Mic, Loader2, Apple, AlertCircle, ChefHat, Send } from 'lucide-react'
import { analyzeDietAction, generateDietPlanAction } from '@/app/actions/diet-analysis'
import { useStore, DietLog } from '@/lib/store'


import { format } from 'date-fns'

export default function DietAssistantPage() {
    const [activeTab, setActiveTab] = useState<'log' | 'history' | 'plan' | 'approved'>('log')
    const user = useStore(state => state.user)

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Apple className="h-10 w-10 text-green-500" />
                        Diet Assistant
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Track meals, analyze nutrition, and generate AI meal plans.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit overflow-x-auto">
                {['log', 'history', 'plan', 'approved'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-6 py-2 rounded-lg font-medium transition-all capitalize whitespace-nowrap ${activeTab === tab
                            ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                    >
                        {tab === 'plan' ? 'AI Meal Planner' : tab === 'log' ? 'Log Meal' : tab === 'history' ? 'History' : 'Today\'s Diet Plan'}
                    </button>
                ))}
            </div>

            {activeTab === 'log' && <DietLogger />}
            {activeTab === 'history' && <DietHistory />}
            {activeTab === 'plan' && <DietPlanGenerator />}
            {activeTab === 'approved' && <ApprovedDietPlan />}
        </div>
    )
}

function DietLogger() {
    const [input, setInput] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [result, setResult] = useState<any | null>(null)
    const addDietLog = useStore(state => state.addDietLog)
    const user = useStore(state => state.user)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const startListening = () => {
        if ('webkitSpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition
            const recognition = new SpeechRecognition()
            recognition.continuous = false
            recognition.interimResults = false

            recognition.onstart = () => setIsListening(true)
            recognition.onend = () => setIsListening(false)
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript
                setInput(prev => prev ? `${prev} ${transcript}` : transcript)
            }
            recognition.start()
        } else {
            alert("Voice input not supported in this browser.")
        }
    }

    const handleCameraClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            // Simulate Analysis
            setIsAnalyzing(true)
            setTimeout(() => {
                setInput("Detected: Grilled Salmon with Asparagus (approx. 200g)")
                setIsAnalyzing(false)
            }, 1500)
        }
    }

    const handleAnalyze = async () => {
        if (!input.trim()) return
        setIsAnalyzing(true)
        setResult(null)

        const analysis = await analyzeDietAction(input)
        setResult(analysis)
        setIsAnalyzing(false)
    }

    const handleSave = () => {
        if (!result || !user) return

        addDietLog({
            userId: user.id,
            mealType: 'Lunch', // Default for demo
            foodItem: result.foodItem,
            calories: result.calories,
            protein: result.protein,
            carbs: result.carbs,
            fats: result.fats,
            healthScore: result.healthScore,
            analysis: result.analysis,
            imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
        })

        setInput('')
        setResult(null)
        alert("Meal logged successfully!")
    }

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Input Section */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">What did you eat?</h2>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none text-lg h-32 resize-none text-gray-900 dark:text-white placeholder:text-gray-400"
                        placeholder="e.g. A grilled chicken sandwich and a small salad..."
                    />

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={startListening}
                            className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-600 dark:text-gray-300'}`}
                        >
                            <Mic className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleCameraClick}
                            className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            <Camera className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !input}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Analyze Meal
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Tips Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800">
                    <div className="flex gap-3">
                        <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
                        <div>
                            <h3 className="font-bold text-blue-900 dark:text-blue-200">Doctor's Note</h3>
                            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                                Remember to track your sodium intake today. Try to keep it under 2000mg as per your recovery plan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Result Section */}
            <div className="space-y-6">
                {result ? (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-green-100 dark:border-green-900 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-green-600 p-6 text-white">
                            <h3 className="text-2xl font-bold">{result.foodItem}</h3>
                            <div className="flex items-center gap-2 mt-2 opacity-90">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                                    {result.healthScore} Choice
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <NutrientBox label="Calories" value={result.calories} unit="kcal" icon={<Flame className="w-5 h-5 text-orange-500" />} />
                                <NutrientBox label="Protein" value={result.protein} unit="" icon={<Activity className="w-5 h-5 text-blue-500" />} />
                                <NutrientBox label="Carbs" value={result.carbs} unit="" icon={<Utensils className="w-5 h-5 text-yellow-500" />} />
                                <NutrientBox label="Fats" value={result.fats} unit="" icon={<Activity className="w-5 h-5 text-purple-500" />} />
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl mb-6">
                                <h4 className="font-bold mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Sparkles className="w-4 h-4 text-purple-500" />
                                    AI Analysis
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                    {result.analysis}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setResult(null)}
                                    className="flex-1 py-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                                >
                                    Save to Log
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl min-h-[400px]">
                        <Utensils className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">Enter a meal to see the analysis</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function DietPlanGenerator() {
    const [isLoading, setIsLoading] = useState(false)
    const [generatedPlan, setGeneratedPlan] = useState<any>(null)
    const [selections, setSelections] = useState<{ breakfast: any, lunch: any, dinner: any }>({
        breakfast: null,
        lunch: null,
        dinner: null
    })

    const [preferences, setPreferences] = useState({
        diet: 'Balanced',
        cuisine: '',
        fridge: ''
    })

    const addDietPlan = useStore(state => state.addDietPlan)
    const user = useStore(state => state.user)

    const handleSendToDoctor = () => {
        if (!user) {
            alert("Please log in to send plans.")
            return
        }
        addDietPlan({
            userId: user.id,
            userName: user.name,
            meals: selections
        })
        setGeneratedPlan(null)
        alert("Plan sent to Doctor for approval!")
    }

    const handleGenerate = async () => {
        setIsLoading(true)
        setSelections({ breakfast: null, lunch: null, dinner: null })
        try {
            const plan = await generateDietPlanAction({
                diet: preferences.diet,
                cuisine: preferences.cuisine || 'Any',
                fridge: preferences.fridge || 'Any'
            })
            setGeneratedPlan(plan)
        } catch (e) {
            console.error(e)
            alert("Failed to generate plan. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelect = (category: 'breakfast' | 'lunch' | 'dinner', meal: any) => {
        setSelections(prev => ({ ...prev, [category]: meal }))
    }

    const isComplete = selections.breakfast && selections.lunch && selections.dinner

    if (generatedPlan) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 animate-in fade-in">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose Your Menu</h2>
                    <p className="text-gray-500">
                        Select one option for each meal to finalize your plan.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Breakfast Column */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm">Breakfast</span>
                        </h3>
                        {generatedPlan.breakfast?.map((meal: any, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect('breakfast', meal)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selections.breakfast === meal
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-200 dark:ring-green-800'
                                    : 'border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800'
                                    }`}
                            >
                                <div className="font-bold text-gray-900 dark:text-white mb-1">{meal.title}</div>
                                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{meal.description}</p>
                                <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                                    <span>🔥 {meal.calories} kcal</span>
                                    <span>💪 {meal.protein}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Lunch Column */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">Lunch</span>
                        </h3>
                        {generatedPlan.lunch?.map((meal: any, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect('lunch', meal)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selections.lunch === meal
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-200 dark:ring-green-800'
                                    : 'border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800'
                                    }`}
                            >
                                <div className="font-bold text-gray-900 dark:text-white mb-1">{meal.title}</div>
                                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{meal.description}</p>
                                <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                                    <span>🔥 {meal.calories} kcal</span>
                                    <span>💪 {meal.protein}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Dinner Column */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm">Dinner</span>
                        </h3>
                        {generatedPlan.dinner?.map((meal: any, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect('dinner', meal)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selections.dinner === meal
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-200 dark:ring-green-800'
                                    : 'border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800'
                                    }`}
                            >
                                <div className="font-bold text-gray-900 dark:text-white mb-1">{meal.title}</div>
                                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{meal.description}</p>
                                <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                                    <span>🔥 {meal.calories} kcal</span>
                                    <span>💪 {meal.protein}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-8">
                    <button onClick={() => setGeneratedPlan(null)} className="px-6 py-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium">
                        Start Over
                    </button>
                    <button
                        disabled={!isComplete}
                        onClick={handleSendToDoctor}
                        className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all"
                    >
                        <Send className="w-5 h-5" />
                        {isComplete ? 'Confirm & Send to Doctor' : 'Select 3 Meals'}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <ChefHat className="w-8 h-8 text-orange-500" />
                AI Meal Planner
            </h2>

            <div className="space-y-6">
                <div>
                    <label className="block font-medium mb-3 text-gray-700 dark:text-gray-200">Dietary Preference</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['Balanced', 'Keto', 'Vegan', 'Paleo', 'Vegetarian', 'Gluten-Free'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => setPreferences(p => ({ ...p, diet: opt }))}
                                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${preferences.diet === opt
                                    ? 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-green-500 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block font-medium mb-3 text-gray-700 dark:text-gray-200">Preferred Cuisine (Optional)</label>
                    <input
                        type="text"
                        value={preferences.cuisine}
                        onChange={(e) => setPreferences(p => ({ ...p, cuisine: e.target.value }))}
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
                        placeholder="e.g. Indian, Chinese, Italian, Mexican..."
                    />
                </div>

                <div>
                    <label className="block font-medium mb-3 text-gray-700 dark:text-gray-200">What's in your fridge? (Optional)</label>
                    <textarea
                        value={preferences.fridge}
                        onChange={(e) => setPreferences(p => ({ ...p, fridge: e.target.value }))}
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none h-24 text-gray-900 dark:text-white placeholder:text-gray-400"
                        placeholder="e.g. Chicken breast, spinach, tomatoes, eggs..."
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                    {isLoading ? 'Generating Personal Plan...' : 'Generate 1-Day Plan'}
                </button>
            </div>
        </div>
    )
}



function DietHistory() {
    const dietLogs = useStore(state => state.dietLogs)
    const user = useStore(state => state.user)

    // Filter for current user
    const userLogs = dietLogs.filter(log => log.userId === user?.id)

    if (userLogs.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                <Utensils className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">No meals logged yet.</p>
                <button className="mt-4 text-green-600 font-medium hover:underline">Log your first meal</button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {userLogs.map((log) => (
                <div key={log.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-hover hover:shadow-md">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative">
                        {log.imageUrl ? (
                            <img src={log.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                <Utensils className="w-8 h-8" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{log.foodItem}</h3>
                                <p className="text-sm text-gray-500">{format(new Date(log.timestamp), 'h:mm a')} • {log.mealType}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${log.healthScore === 'Healthy' ? 'bg-green-100 text-green-700' :
                                log.healthScore === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                {log.healthScore}
                            </span>
                        </div>
                        <div className="mt-2 flex gap-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                            <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500" /> {log.calories} kcal</span>
                            <span className="flex items-center gap-1"><Activity className="w-4 h-4 text-blue-500" /> {log.protein} pro</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}




function ApprovedDietPlan() {
    const dietPlans = useStore(state => state.dietPlans) || []
    const user = useStore(state => state.user)

    const approvedPlan = dietPlans.find(plan => plan.userId === user?.id && plan.status === 'approved')

    if (!approvedPlan) {
        return (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in">
                <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Plan</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    You haven't been assigned a diet plan yet, or your request is still pending approval.
                </p>
                <div className="flex justify-center gap-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase">
                        Pending Reviews: {dietPlans.filter(p => p.userId === user?.id && p.status === 'pending').length}
                    </span>
                </div>
            </div>
        )
    }

    const { meals } = approvedPlan

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2 opacity-90">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-wider text-sm">Active Plan</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Today's Menu</h2>
                    <p className="opacity-90">Approved by Dr. {user?.name ? 'Smith' : 'Reviewer'}</p>
                </div>
                <Utensils className="absolute -bottom-8 -right-8 w-64 h-64 text-white opacity-10 rotate-12" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { label: 'Breakfast', data: meals.breakfast, color: 'orange' },
                    { label: 'Lunch', data: meals.lunch, color: 'blue' },
                    { label: 'Dinner', data: meals.dinner, color: 'purple' }
                ].map((meal, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow relative group">
                        <div className={`absolute top-4 right-4 px-2 py-1 rounded text-xs font-bold uppercase bg-${meal.color}-100 text-${meal.color}-700`}>
                            {meal.label}
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-${meal.color}-100 dark:bg-${meal.color}-900/30 flex items-center justify-center mb-4 text-${meal.color}-600 dark:text-${meal.color}-400`}>
                            <Utensils className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                            {meal.data.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">
                            {meal.data.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                            <span className="flex items-center gap-1">
                                <Flame className="w-3 h-3" /> {meal.data.calories} kcal
                            </span>
                            <span className="flex items-center gap-1">
                                <Activity className="w-3 h-3" /> {meal.data.protein}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function NutrientBox({ label, value, unit, icon }: any) {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-1 text-gray-500 text-xs font-bold uppercase tracking-wider">
                {icon} {label}
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
                {value} <span className="text-sm font-normal text-gray-400">{unit}</span>
            </div>
        </div>
    )
}
