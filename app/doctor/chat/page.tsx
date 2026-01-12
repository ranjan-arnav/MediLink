'use client'

import { Search, Phone, Video, MoreHorizontal, Send, Paperclip, Mic } from 'lucide-react'

export default function DoctorChatPage() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-[calc(100vh-8rem)] overflow-hidden flex animate-in fade-in duration-500">
            {/* Sidebar List */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <ChatItem
                        name="Alice Freeman"
                        message="Thank you, doctor. I'll take..."
                        time="10:30 AM"
                        count={2}
                        active={true}
                        image="https://images.unsplash.com/photo-1554151228-14d9def656ec?w=100&q=80"
                    />
                    <ChatItem
                        name="Robert Fox"
                        message="The pain is subsiding."
                        time="Yesterday"
                        count={0}
                        image="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80"
                    />
                    <ChatItem
                        name="Leslie Alexander"
                        message="Can we reschedule?"
                        time="Yesterday"
                        count={0}
                        image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                    />
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <img src="https://images.unsplash.com/photo-1554151228-14d9def656ec?w=100&q=80" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white leading-tight">Alice Freeman</h3>
                            <p className="text-xs text-green-500 flex items-center gap-1">● Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 transition-colors">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 transition-colors">
                            <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900/30">
                    <Message
                        side="left"
                        text="Hi Dr. Smith, I've been feeling a bit dizzy after taking the new medication."
                        time="10:25 AM"
                    />
                    <Message
                        side="right"
                        text="Hello Alice. That can be a common side effect. Did you take it with food?"
                        time="10:28 AM"
                    />
                    <Message
                        side="left"
                        text="No, I took it on an empty stomach."
                        time="10:29 AM"
                    />
                    <Message
                        side="right"
                        text="Please try taking it after a meal. If dizziness persists for more than 2 days, let me know immediately."
                        time="10:30 AM"
                    />
                    <Message
                        side="left"
                        text="Thank you, doctor. I'll take it with lunch today."
                        time="10:31 AM"
                    />
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-2 rounded-2xl border border-transparent focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-all">
                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl text-gray-500 transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-gray-900 dark:text-white placeholder-gray-500"
                        />
                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl text-gray-500 transition-colors">
                            <Mic className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-colors">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ChatItem({ name, message, time, count, active, image }: any) {
    return (
        <div className={`flex gap-3 p-4 cursor-pointer transition-colors ${active ? 'bg-white dark:bg-gray-800 border-l-4 border-l-blue-500 shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 border-l-4 border-l-transparent'
            }`}>
            <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-bold text-sm truncate ${active ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>{name}</h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 truncate">{message}</p>
                    {count > 0 && (
                        <span className="w-5 h-5 bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm ml-2 shrink-0">
                            {count}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

function Message({ side, text, time }: any) {
    const isMe = side === 'right';
    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${isMe
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
                }`}>
                <p className="text-sm leading-relaxed">{text}</p>
                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>{time}</p>
            </div>
        </div>
    )
}
