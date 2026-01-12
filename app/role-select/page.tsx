'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Activity, User, UserCheck, Shield, ChevronRight } from 'lucide-react'
import { Header } from '@/components/Header'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'

type Role = 'patient' | 'doctor' | 'police'

export default function RoleSelectPage() {
  const [selectedRole, setSelectedRole] = useState<Role>('patient')
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)

  const handleContinue = () => {
    // Set user based on role
    const mockUsers = {
      patient: {
        id: '1',
        name: 'Demo Patient',
        email: 'patient@medilink.com',
        role: 'patient' as const,
      },
      doctor: {
        id: '2',
        name: 'Demo Doctor',
        email: 'doctor@medilink.com',
        role: 'doctor' as const,
      },
      police: {
        id: '3',
        name: 'Demo Police',
        email: 'police@medilink.com',
        role: 'police' as const,
      },
    }

    setUser(mockUsers[selectedRole])
    router.push(`/${selectedRole}/dashboard`)
  }

  const roles = [
    {
      id: 'patient' as Role,
      name: 'I am a Patient',
      description: 'Access your health records and consult doctors.',
      icon: User,
      color: 'teal'
    },
    {
      id: 'doctor' as Role,
      name: 'I am a Doctor',
      description: 'Manage patients and appointments.',
      icon: UserCheck,
      color: 'blue'
    },
    {
      id: 'police' as Role,
      name: 'I am Police',
      description: 'Emergency response and alert history.',
      icon: Shield,
      color: 'indigo'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          {/* Logo Section */}
          <div className="text-center mb-16">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-teal-500/20 mb-6 overflow-hidden p-2">
              <img src="/logo.png" alt="MediLink Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to <span className="text-teal-600 dark:text-teal-400">MediLink</span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Select your role to access the health operating system
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {roles.map((role) => {
              const Icon = role.icon
              const isSelected = selectedRole === role.id

              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    'group relative p-8 rounded-3xl border-2 text-left transition-all duration-300 hover:shadow-2xl',
                    isSelected
                      ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/10 shadow-xl scale-105 ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-slate-950'
                      : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-800'
                  )}
                >
                  <div className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors',
                    isSelected ? 'bg-teal-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30 group-hover:text-teal-600 dark:group-hover:text-teal-400'
                  )}>
                    <Icon className="w-8 h-8" />
                  </div>

                  <h3 className={cn(
                    'text-2xl font-bold mb-2',
                    isSelected ? 'text-teal-900 dark:text-teal-100' : 'text-gray-900 dark:text-white'
                  )}>
                    {role.name}
                  </h3>

                  <p className={cn(
                    'text-base leading-relaxed',
                    isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-gray-500 dark:text-gray-400'
                  )}>
                    {role.description}
                  </p>

                  {/* Checkmark Indicator */}
                  <div className={cn(
                    'absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                    isSelected
                      ? 'border-teal-500 bg-teal-500 text-white scale-100 opacity-100'
                      : 'border-gray-200 dark:border-slate-700 scale-90 opacity-0'
                  )}>
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Enter Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              className="group relative px-12 py-5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-2xl hover:shadow-teal-500/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span>Enter Portal</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
