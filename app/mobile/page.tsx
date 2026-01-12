'use client'

import { useState, useEffect, useRef } from 'react'
import { Phone, PhoneOff, Wifi, Mic, MicOff, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type CallData = {
    type: 'announcement' | 'interview'
    text?: string
    questions?: string[]
    contextId?: string
}

export default function MobileReceiverPage() {
    const [hasInteraction, setHasInteraction] = useState(false)
    const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected' | 'interviewing'>('idle')
    const [callData, setCallData] = useState<CallData>({ type: 'announcement' })
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const questionIndexRef = useRef(0)
    const [isListening, setIsListening] = useState(false)
    const [debugLog, setDebugLog] = useState<string[]>([])

    // Refs
    const audioContextRef = useRef<AudioContext | null>(null)
    const oscillatorRef = useRef<OscillatorNode | null>(null)
    const recognitionRef = useRef<any>(null)
    const synthRef = useRef<SpeechSynthesis | null>(null)

    const addLog = (msg: string) => {
        setDebugLog(prev => [msg, ...prev].slice(0, 4))
        console.log(msg)
    }

    // Ringtone Logic (Same as before)
    const startRinging = () => {
        if (!audioContextRef.current) return
        try {
            const ctx = audioContextRef.current
            const osc1 = ctx.createOscillator()
            const osc2 = ctx.createOscillator()
            const gain = ctx.createGain()
            const lfo = ctx.createOscillator()
            const lfoGain = ctx.createGain()

            osc1.frequency.value = 840
            osc2.frequency.value = 1020
            lfo.frequency.value = 20
            lfo.connect(lfoGain.gain)
            osc1.connect(gain)
            osc2.connect(gain)

            const playCycle = () => {
                if (audioContextRef.current?.state === 'closed') return
                const now = ctx.currentTime
                gain.connect(ctx.destination)
                gain.gain.setValueAtTime(0, now)
                gain.gain.linearRampToValueAtTime(0.5, now + 0.1)
                gain.gain.setValueAtTime(0.5, now + 2)
                gain.gain.linearRampToValueAtTime(0, now + 2.1)
            }

            osc1.start()
            osc2.start()
            playCycle()
            const loop = setInterval(playCycle, 4000)

            oscillatorRef.current = osc1
            // @ts-ignore
            oscillatorRef.current.extras = [osc2, gain, loop]
        } catch (e) { }
    }

    const stopRinging = () => {
        if (oscillatorRef.current) {
            oscillatorRef.current.stop()
            // @ts-ignore
            const extras = oscillatorRef.current.extras
            if (extras) {
                extras[0].stop()
                clearInterval(extras[2])
            }
            oscillatorRef.current = null
        }
    }

    // Initialization
    const enableAudio = async () => {
        try {
            // Audio Context
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext
            audioContextRef.current = new AudioContext()
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume()
            }

            // Synth
            if (typeof window !== 'undefined') {
                synthRef.current = window.speechSynthesis
            }

            // *** EXPLICIT MIC PERMISSION REQUEST ***
            addLog("Requesting Mic Permission...")
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                // We got permission! Stop the stream immediately (we just needed permission)
                stream.getTracks().forEach(track => track.stop())
                addLog("Mic Permission GRANTED")
            } catch (micErr) {
                addLog("Mic Permission DENIED: " + micErr)
                alert("Microphone access was denied. Please allow microphone access in your browser settings to use voice features.")
            }

            // Recognition Setup (now that mic is allowed)
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                // @ts-ignore
                const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
                recognitionRef.current = new SpeechRecognition()
                recognitionRef.current.continuous = false
                recognitionRef.current.interimResults = false
                recognitionRef.current.lang = 'en-US'
                addLog("Speech Engine Ready")
            } else {
                addLog("WARNING: Voice Input NOT supported on this browser.")
            }

            // Feedback
            speak("System Ready")
            setHasInteraction(true)
        } catch (e) {
            addLog("Init Error: " + e)
        }
    }

    // Speech Helper
    const speak = (text: string, onEnd?: () => void) => {
        if (!synthRef.current) return
        synthRef.current.cancel()

        const u = new SpeechSynthesisUtterance(text)
        const voices = synthRef.current.getVoices()
        const preferred = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha"))
        if (preferred) u.voice = preferred

        // Crucial: Add delay references to prevent garbage collection bugs in some browsers
        // @ts-ignore
        window.utterance = u

        u.onend = () => {
            if (onEnd) setTimeout(onEnd, 200) // Small buffer
        }

        synthRef.current.speak(u)
    }

    // Poll
    useEffect(() => {
        if (!hasInteraction) return
        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/call-state')
                const json = await res.json()
                if (json.status === 'ringing' && callStatus === 'idle') {
                    setCallStatus('ringing')
                    setCallData(json.data)
                    startRinging()
                } else if (json.status === 'idle' && callStatus !== 'idle') {
                    resetCall()
                }
            } catch (e) { }
        }, 1000)
        return () => clearInterval(interval)
    }, [hasInteraction, callStatus])

    const resetCall = () => {
        stopRinging()
        if (synthRef.current) synthRef.current.cancel()
        if (recognitionRef.current) try { recognitionRef.current.stop() } catch { }
        setCallStatus('idle')
        setIsListening(false)
        setCurrentQuestionIndex(0)
        questionIndexRef.current = 0
    }

    // Interaction Flow
    const handleAnswer = () => {
        stopRinging()
        setCallStatus('connected')

        if (callData.type === 'interview') {
            setCallStatus('interviewing')
            setTimeout(() => askQuestion(0), 1000)
        } else {
            speak(callData.text || "No message", () => {
                setTimeout(hangup, 2000)
            })
        }
    }

    const askQuestion = (index: number) => {
        if (!callData.questions || index >= callData.questions.length) {
            finishInterview()
            return
        }
        const q = callData.questions[index]
        addLog(`AI: ${q}`)
        speak(q, () => {
            // Auto-start listening?
            // Better: Wait for user to tap "Reply" to avoid cutting them off
            // Or Auto-start
            startListening()
        })
    }

    const startListening = () => {
        if (!recognitionRef.current) {
            addLog("Mic not supported. Tap Skip.")
            return
        }

        try {
            setIsListening(true)
            recognitionRef.current.start()
            addLog("Listening... Speak now.")

            recognitionRef.current.onresult = (e: any) => {
                const text = e.results[0][0].transcript
                addLog(`You: ${text}`)
                saveAnswer(text)
            }

            recognitionRef.current.onerror = (e: any) => {
                addLog("Mic Error/No Speech.")
                setIsListening(false)
            }

            recognitionRef.current.onend = () => {
                // If we didn't get a result, we stop listening. 
                // The user might need to tap again.
                if (isListening) setIsListening(false)
            }

        } catch (e) {
            addLog("Recog Start Fail")
            setIsListening(false)
        }
    }

    const saveAnswer = (text: string) => {
        // Send partial or store?
        // simple store in state not persistent here for brevity, assuming we send all at end
        // BUT for robustness, let's just push everything to server or accumulate
        // Here: Send directly to `voice-interview-result` as a partial update? 
        // Nah, just accumulate locally? But React state in async...
        // Let's just move to next question

        postAnswer(text)
        setIsListening(false)

        // Use ref to avoid stale closure issues
        const next = questionIndexRef.current + 1
        questionIndexRef.current = next
        setCurrentQuestionIndex(next)

        speak("Okay.", () => askQuestion(next))
    }

    const postAnswer = async (text: string) => {
        // This is a hacky way to append answers on server
        // Ideally we send 'index' and 'answer'
        // For now, let's just fetch current, append, save. 
        // Or simpler: We just fire-and-forget to a new endpoint component? 
        // Let's assume the server blindly appends whatever we send to the list

        // Actually, let's just keep it simple. If it works, it works.
        // We'll reconstruct the full list at the end? 
        // Mobile state might be fragile. 
        // Let's send { contextId: ..., answers: [text] } and let server append? 
        // The server code overwrites. 

        // REWRITE: fetch existing, append, save.
        try {
            const res = await fetch('/api/voice-interview-result')
            const existing = await res.json()
            const prev = existing?.answers || []

            await fetch('/api/voice-interview-result', {
                method: 'POST',
                body: JSON.stringify({
                    contextId: callData.contextId,
                    answers: [...prev, text]
                })
            })
        } catch { }
    }

    const finishInterview = async () => {
        speak("Thank you. I am now analyzing your symptoms.", async () => {
            addLog("Analyzing...")

            try {
                // Call the analysis API
                const res = await fetch('/api/analyze-interview', { method: 'POST' })
                const data = await res.json()

                if (data.success && data.speakableReport) {
                    addLog("Report Ready!")
                    // Speak the full report to the patient
                    speak(data.speakableReport, () => {
                        addLog("Report Complete")
                        setTimeout(hangup, 2000)
                    })
                } else {
                    speak("I apologize, I could not complete the analysis. Please try again later.", () => {
                        hangup()
                    })
                }
            } catch (e) {
                addLog("Analysis Error")
                speak("There was an error analyzing your symptoms. Your responses have been saved.", () => {
                    hangup()
                })
            }
        })
    }

    const hangup = async () => {
        resetCall()
        try {
            await fetch('/api/call-state', {
                method: 'POST',
                body: JSON.stringify({ status: 'idle', data: {} })
            })
        } catch { }
    }

    // --- RENDER ---

    if (!hasInteraction) {
        return (
            <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
                <button
                    onClick={enableAudio}
                    className="w-48 h-48 bg-blue-600 rounded-full flex flex-col items-center justify-center animate-pulse shadow-[0_0_50px_rgba(37,99,235,0.5)] active:scale-95 transition-all"
                >
                    <Wifi className="w-20 h-20" />
                    <span className="mt-4 font-bold text-2xl tracking-widest">CONNECT</span>
                </button>
                <p className="mt-8 text-gray-400 max-w-xs">
                    Tap to initialize Secure Medical Line.
                    <br /><span className="text-xs text-gray-600">Allows Audio & Microphone Access</span>
                </p>
            </div>
        )
    }

    return (
        <div className={cn(
            "h-screen w-screen flex flex-col relative overflow-hidden transition-colors duration-700",
            callStatus === 'idle' ? "bg-gray-950" : "bg-black"
        )}>
            {/* Status Bar */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20 pointer-events-none">
                <div className="flex items-center gap-2 text-xs font-mono text-green-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    SECURE_LINK_ACTIVE
                </div>
                <div className="text-[10px] text-gray-600 max-w-[150px] text-right">
                    {debugLog.map((l, i) => <div key={i} className="truncate">{l}</div>)}
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-6">

                {callStatus === 'idle' && (
                    <div className="flex flex-col items-center opacity-40">
                        <div className="w-40 h-40 rounded-full border border-gray-800 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                            <div className="w-32 h-32 rounded-full border border-gray-800 border-t-gray-600" />
                        </div>
                    </div>
                )}

                {callStatus === 'ringing' && (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <div className="w-32 h-32 rounded-full bg-gray-800 mb-8 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
                            <Phone className="w-12 h-12 text-white fill-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">MediLink AI</h1>
                        <p className="text-blue-400 text-lg animate-pulse">Incoming Video Call...</p>
                    </div>
                )}

                {callStatus === 'interviewing' && (
                    <div className="w-full max-w-md flex flex-col items-center">
                        <div className="mb-12 text-center">
                            <h2 className="text-gray-400 text-sm font-mono mb-4">QUESTION {currentQuestionIndex + 1}</h2>
                            <p className="text-2xl font-medium text-white leading-relaxed">
                                "{callData.questions?.[currentQuestionIndex]}"
                            </p>
                        </div>

                        {/* Interaction Button */}
                        <button
                            onClick={isListening ? () => { } : startListening}
                            disabled={isListening}
                            className={cn(
                                "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl",
                                isListening
                                    ? "bg-red-600 scale-110 shadow-[0_0_60px_rgba(220,38,38,0.6)]"
                                    : "bg-blue-600 hover:bg-blue-500 active:scale-95"
                            )}
                        >
                            {isListening ? (
                                <Mic className="w-12 h-12 text-white animate-pulse" />
                            ) : (
                                <MicOff className="w-12 h-12 text-white/80" />
                            )}
                        </button>

                        <p className="mt-8 text-sm font-medium tracking-widest text-gray-500 uppercase">
                            {isListening ? "Listening..." : "Tap to Reply"}
                        </p>
                    </div>
                )}

                {callStatus === 'connected' && !callData.questions && (
                    <div className="text-center px-6">
                        <Volume2 className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                        <p className="text-xl text-white">"{callData.text}"</p>
                    </div>
                )}

            </div>

            {/* Bottom Actions */}
            <div className="h-32 w-full flex items-center justify-center relative z-20">
                {callStatus === 'ringing' && (
                    <div className="flex gap-16">
                        <button onClick={hangup} className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 border border-red-500/30">
                                <PhoneOff className="w-6 h-6" />
                            </div>
                        </button>
                        <button onClick={handleAnswer} className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                                <Phone className="w-6 h-6 fill-white" />
                            </div>
                        </button>
                    </div>
                )}

                {(callStatus === 'connected' || callStatus === 'interviewing') && (
                    <button
                        onClick={hangup}
                        className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
                    >
                        <PhoneOff className="w-6 h-6" />
                    </button>
                )}
            </div>
        </div>
    )
}
