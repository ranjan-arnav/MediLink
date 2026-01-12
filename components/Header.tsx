'use client'

import { Sun, Moon, Globe, Activity } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20 overflow-hidden">
          <img src="/logo.png" alt="MediLink Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">MediLink</span>
          <span className="block text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wider">HEALTH OS</span>
        </div>
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
      </div>
    </header>
  )
}
