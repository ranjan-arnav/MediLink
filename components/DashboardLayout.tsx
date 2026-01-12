'use client'

import { Sun, Moon, Globe } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { useTheme } from '@/components/ThemeProvider'
import { NotificationsDropdown } from './NotificationsDropdown'

interface DashboardLayoutProps {
  children: React.ReactNode
  role: 'patient' | 'doctor' | 'police'
  userName: string
  userRole: string
}

export function DashboardLayout({ children, role, userName, userRole }: DashboardLayoutProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950">
      <Sidebar role={role} userName={userName} userRole={userRole} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logo.png" alt="MediLink Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">MediLink</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600">
              <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">English</span>
            </div>
            <NotificationsDropdown />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
