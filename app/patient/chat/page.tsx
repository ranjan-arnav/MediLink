'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Send, Phone, Video, MoreVertical, Image as ImageIcon, Mic } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useUserStore } from '@/lib/userStore'
import { formatDistanceToNow } from 'date-fns'

const DEMO_DOCTOR = {
    id: 'doctor-1',
    name: 'Dr. John Smith',
    specialty: 'Senior Cardiologist',
    avatar: '👨‍⚕️',
    online: true
}

export default function PatientChatPage() {
    const user = useUserStore((state) => state.user)
    const messages = useStore((state) => state.messages)
    const sendMessage = useStore((state) => state.sendMessage)
    const clearMessages = useStore((state) => state.clearMessages)
    const [inputText, setInputText] = useState('')
    const [showMenu, setShowMenu] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Real-time sync
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'medilink-storage-v2') useStore.persist.rehydrate()
        }
        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    const currentMessages = useMemo(() =>
        messages.filter(m =>
            (m.senderId === user?.id && m.receiverId === DEMO_DOCTOR.id) ||
            (m.senderId === DEMO_DOCTOR.id && m.receiverId === user?.id)
        ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
        [messages, user?.id]
    )

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [currentMessages])

    const handleSend = () => {
        console.log('Sending message:', { inputText, user })
        if (!inputText.trim() || !user) {
            console.error('Send failed:', { text: inputText, user })
            return
        }
        sendMessage({
            senderId: user.id,
            receiverId: DEMO_DOCTOR.id,
            content: inputText,
            type: 'text'
        })
        setInputText('')
    }

    const handleOptionSend = (type: 'image' | 'voice' | 'video') => {
        if (!user) return alert('Please login to send messages')

        let content = ''
        switch (type) {
            case 'image': content = '📷 [Image Sent]'; break;
            case 'voice': content = '🎤 [Voice Message - 0:15]'; break;
            case 'video': content = '🎥 [Video Sent]'; break;
        }

        sendMessage({
            senderId: user.id,
            receiverId: DEMO_DOCTOR.id,
            content: content,
            type: type
        })
    }

    return (
        <div className="h-[calc(100vh-100px)] max-w-5xl mx-auto flex flex-col bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            {/* Header */}
            <div className="px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/20 rounded-full flex items-center justify-center text-3xl shadow-inner border border-white dark:border-gray-700">
                            {DEMO_DOCTOR.avatar}
                        </div>
                        {DEMO_DOCTOR.online && (
                            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full shadow-sm animate-pulse"></span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {DEMO_DOCTOR.name}
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold uppercase tracking-wider rounded-full">
                                Verified
                            </span>
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{DEMO_DOCTOR.specialty}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all duration-200 text-gray-500 hover:text-blue-600 dark:text-gray-400">
                        <Phone className="w-6 h-6" />
                    </button>
                    <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all duration-200 text-gray-500 hover:text-blue-600 dark:text-gray-400">
                        <Video className="w-6 h-6" />
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all duration-200 text-gray-500 dark:text-gray-400"
                        >
                            <MoreVertical className="w-6 h-6" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-14 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                                <button
                                    onClick={() => {
                                        if (confirm('Clear all chat history?')) {
                                            clearMessages()
                                            setShowMenu(false)
                                        }
                                    }}
                                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold transition-colors"
                                >
                                    Clear Conversation
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50 dark:bg-black/20 scroll-smooth">
                {currentMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-60">
                        <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                            <span className="text-5xl">👋</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Say Hello!</h3>
                        <p className="max-w-xs text-gray-500">Starts your secure, private consultation with Dr. Smith.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center">
                            <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full uppercase tracking-widest">
                                Today
                            </span>
                        </div>
                        {currentMessages.map((msg, idx) => {
                            const isMe = msg.senderId === user?.id
                            const showAvatar = !isMe && (idx === 0 || currentMessages[idx - 1].senderId !== msg.senderId)

                            return (
                                <div key={msg.id} className={`flex gap-4 ${isMe ? 'justify-end' : 'justify-start'} group`}>
                                    {!isMe && (
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg bg-blue-50 dark:bg-blue-900/20 shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                                            {DEMO_DOCTOR.avatar}
                                        </div>
                                    )}

                                    <div className={`max-w-[70%] space-y-1 ${isMe ? 'items-end flex flex-col' : 'items-start flex flex-col'}`}>
                                        <div className={`p-4 rounded-3xl shadow-sm relative text-[15px] leading-relaxed transition-all duration-200 hover:shadow-md ${isMe
                                            ? 'bg-blue-600 text-white rounded-br-md from-blue-600 to-blue-700 bg-gradient-to-br'
                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-md border border-gray-100 dark:border-gray-700'
                                            }`}>
                                            {msg.type === 'image' && (
                                                msg.content.startsWith('data:image') || msg.content.startsWith('http') ? (
                                                    <div className="mb-2 rounded-xl overflow-hidden">
                                                        <img src={msg.content} alt="Sent Image" className="max-w-full h-auto object-cover" />
                                                    </div>
                                                ) : (
                                                    <span className="text-sm italic opacity-80 block mb-1">Image: {msg.content}</span>
                                                )
                                            )}
                                            {msg.type === 'voice' && <span className="text-xs opacity-70 block mb-1">🎤 Voice Note</span>}
                                            {msg.type === 'video' && <span className="text-xs opacity-70 block mb-1">🎥 Video Clip</span>}

                                            {msg.type !== 'image' && (
                                                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                                                    __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>')
                                                }} />
                                            )}

                                            {msg.content.includes('Wound Analysis Report') && (
                                                <a href="/patient/post-op" className="mt-3 block w-full py-2 bg-white/20 hover:bg-white/30 text-center rounded-lg text-sm font-bold transition-colors">
                                                    View Full Report
                                                </a>
                                            )}
                                        </div>
                                        <span className={`text-[11px] font-medium text-gray-400 px-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                                            {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-4xl mx-auto flex items-end gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-3xl border border-gray-100 dark:border-gray-700 focus-within:ring-2 ring-blue-500/20 focus-within:border-blue-500/50 transition-all shadow-sm focus-within:shadow-lg focus-within:bg-white dark:focus-within:bg-gray-800">
                    <button
                        onClick={() => handleOptionSend('image')}
                        className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                        title="Send Image"
                    >
                        <ImageIcon className="w-6 h-6" />
                    </button>

                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 py-3 max-h-32 min-h-[48px] resize-none"
                        rows={1}
                    />

                    {inputText.trim() ? (
                        <button
                            onClick={handleSend}
                            className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200"
                        >
                            <Send className="w-5 h-5 translate-x-0.5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => handleOptionSend('voice')}
                            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                            title="Send Voice Note"
                        >
                            <Mic className="w-6 h-6" />
                        </button>
                    )}
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1.5">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        Encrypted end-to-end. Your health data is secure.
                    </p>
                </div>
            </div>
        </div>
    )
}
