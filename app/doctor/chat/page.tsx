'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Search, Phone, Video, MoreHorizontal, Send, Image as ImageIcon, Mic, MessageSquare, Clock } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useUserStore } from '@/lib/userStore'
import { formatDistanceToNow } from 'date-fns'

export default function DoctorChatPage() {
    const user = useUserStore((state) => state.user)
    const messages = useStore((state) => state.messages)
    const sendMessage = useStore((state) => state.sendMessage)
    const clearMessages = useStore((state) => state.clearMessages)
    const patients = useStore((state) => state.patients)

    // State for selected conversation
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
    const [inputText, setInputText] = useState('')
    const [showMenu, setShowMenu] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Real-time sync across tabs
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'medilink-storage-v2') useStore.persist.rehydrate()
        }
        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    // 1. Get List of Conversations
    const chatStats = useMemo(() => {
        if (!user) return {}
        const stats: Record<string, { lastMessage: any, unread: number }> = {}
        const partners = new Set<string>()

        // Scan all messages to find conversations involving this doctor
        messages.forEach(m => {
            if (m.senderId === user.id) partners.add(m.receiverId)
            if (m.receiverId === user.id) partners.add(m.senderId)
        })

        partners.forEach(partnerId => {
            const conversation = messages.filter(m =>
                (m.senderId === user.id && m.receiverId === partnerId) ||
                (m.senderId === partnerId && m.receiverId === user.id)
            ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // desc

            if (conversation.length > 0) {
                stats[partnerId] = {
                    lastMessage: conversation[0],
                    unread: conversation.filter(m => m.receiverId === user.id && !m.read).length
                }
            }
        })
        return stats
    }, [messages, user])

    const activeChats = useMemo(() => {
        return Object.keys(chatStats).sort((a, b) =>
            new Date(chatStats[b].lastMessage.timestamp).getTime() - new Date(chatStats[a].lastMessage.timestamp).getTime()
        )
    }, [chatStats])

    // Get Active Conversation Messages
    const currentMessages = useMemo(() => {
        if (!selectedPatientId || !user) return []
        return messages.filter(m =>
            (m.senderId === user.id && m.receiverId === selectedPatientId) ||
            (m.senderId === selectedPatientId && m.receiverId === user.id)
        ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    }, [messages, user, selectedPatientId])

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [currentMessages, selectedPatientId])

    const handleSend = () => {
        if (!inputText.trim() || !user || !selectedPatientId) return

        sendMessage({
            senderId: user.id,
            receiverId: selectedPatientId,
            content: inputText,
            type: 'text'
        })
        setInputText('')
    }

    const handleOptionSend = (type: 'image' | 'voice' | 'video') => {
        if (!user || !selectedPatientId) return

        let content = ''
        switch (type) {
            case 'image': content = '📷 [Medical Image Sent]'; break;
            case 'voice': content = '🎤 [Voice Note - 0:15]'; break;
            case 'video': content = '🎥 [Video Consult Link]'; break;
        }

        sendMessage({
            senderId: user.id,
            receiverId: selectedPatientId,
            content: content,
            type: type
        })
    }

    // Helper to get patient details
    const getPatientDetails = (id: string) => {
        const found = patients.find(p => p.id === id)
        if (found) return found

        // Demo Fallback
        if (id === '1') return { name: 'Demo Patient', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=patient-1` }

        return {
            name: `Patient ${id}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`
        }
    }

    const activePatient = selectedPatientId ? getPatientDetails(selectedPatientId) : null

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 h-[calc(100vh-8rem)] overflow-hidden flex animate-in fade-in duration-500">
            {/* Sidebar List */}
            <div className="w-80 border-r border-gray-100 dark:border-gray-800 flex flex-col bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Messages</h2>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-none shadow-sm rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                    {activeChats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 opacity-60">
                            <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                            <p className="font-medium">No active chats</p>
                        </div>
                    ) : (
                        activeChats.map(patientId => {
                            const details = getPatientDetails(patientId)
                            const stat = chatStats[patientId]
                            const isActive = selectedPatientId === patientId

                            return (
                                <div
                                    key={patientId}
                                    onClick={() => setSelectedPatientId(patientId)}
                                    className={`flex gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 group ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'hover:bg-white hover:shadow-md dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <div className="relative shrink-0">
                                        <img src={details.avatar} alt={details.name} className={`w-12 h-12 rounded-full object-cover bg-gray-100 dark:bg-gray-800 ${isActive ? 'ring-2 ring-white/30' : ''}`} />
                                        <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 rounded-full ${isActive ? 'bg-green-400 border-blue-600' : 'bg-green-500 border-white dark:border-gray-900'}`}></span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h4 className={`font-bold text-sm truncate ${isActive ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                                {details.name}
                                            </h4>
                                            <span className={`text-[10px] font-medium ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                                                {formatDistanceToNow(new Date(stat.lastMessage.timestamp), { addSuffix: false })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className={`text-xs truncate max-w-[120px] ${isActive ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {stat.lastMessage.content}
                                            </p>
                                            {stat.unread > 0 && (
                                                <span className={`w-5 h-5 text-[10px] font-bold flex items-center justify-center rounded-full ml-2 shrink-0 ${isActive
                                                    ? 'bg-white text-blue-600'
                                                    : 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                                                    }`}>
                                                    {stat.unread}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {selectedPatientId ? (
                <div className="flex-1 flex flex-col bg-slate-50 dark:bg-black/20 relative">
                    {/* Header */}
                    <div className="px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <img src={activePatient?.avatar} className="w-12 h-12 rounded-full object-cover bg-gray-100 dark:bg-gray-800 shadow-sm" />
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{activePatient?.name}</h3>
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    Online for consultation
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 transition-colors">
                                <Phone className="w-5 h-5" />
                            </button>
                            <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 transition-colors">
                                <Video className="w-5 h-5" />
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 transition-colors"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                {showMenu && (
                                    <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
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

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
                        {currentMessages.map((msg, idx) => {
                            const isMe = msg.senderId === user?.id
                            const showAvatar = !isMe && (idx === 0 || currentMessages[idx - 1].senderId !== msg.senderId)

                            return (
                                <div key={msg.id} className={`flex gap-4 ${isMe ? 'justify-end' : 'justify-start'} group`}>
                                    {!isMe && (
                                        <div className={`w-8 h-8 mt-1 rounded-full flex items-center justify-center overflow-hidden shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                                            <img src={activePatient?.avatar} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className={`max-w-[65%] space-y-1 ${isMe ? 'items-end flex flex-col' : 'items-start flex flex-col'}`}>
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
                                                <a href="/doctor/dashboard" className="mt-3 block w-full py-2 bg-white/20 hover:bg-white/30 text-center rounded-lg text-sm font-bold transition-colors">
                                                    View Patient Report
                                                </a>
                                            )}
                                        </div>
                                        <span className={`text-[10px] font-medium text-gray-400 px-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-end gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-3xl border border-gray-100 dark:border-gray-700 focus-within:ring-2 ring-blue-500/20 focus-within:border-blue-500/50 transition-all shadow-sm focus-within:shadow-lg focus-within:bg-white dark:focus-within:bg-gray-800">
                            <button
                                onClick={() => handleOptionSend('image')}
                                className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
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
                                placeholder="Type a message..."
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
                                >
                                    <Mic className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-slate-50 dark:bg-gray-900 p-8">
                    <div className="w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <MessageSquare className="w-16 h-16 text-blue-200 dark:text-blue-800" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back, Doctor</h2>
                    <p className="text-gray-500 text-center max-w-sm leading-relaxed">Select a conversation from the sidebar to continue your consultations or view patient inquiries.</p>
                </div>
            )}
        </div>
    )
}
