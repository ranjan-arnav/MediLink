'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Plus, Clock, Heart, UtensilsCrossed,
  ScanSearch, Dumbbell, Activity, Calendar, MapPin,
  FileText, Pill, FileCheck, Target, LogOut, Users,
  MessageSquare, BarChart3, X, Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'

interface SidebarProps {
  role: 'patient' | 'doctor' | 'police'
  userName: string
  userRole: string
  isOpen?: boolean
  onClose?: () => void
}

const patientMenuItems = [
  { href: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patient/symptom-screening', label: 'Symptom Screening', icon: Plus },
  { href: '/patient/med-reminder', label: 'Med-Reminder', icon: Clock },
  { href: '/patient/post-op', label: 'Post-Op Follow-up', icon: Heart },
  { href: '/patient/recipes', label: 'Diet Assistant', icon: UtensilsCrossed },
  { href: '/patient/diagnosys', label: 'Scan Analysis', icon: ScanSearch },
  { href: '/patient/health-plan', label: 'Health & Fitness Plan', icon: Dumbbell },
  { href: '/patient/workout', label: 'Workout Trainer', icon: Activity },
  { href: '/patient/appointments', label: 'Appointment', icon: Calendar },
  { href: '/patient/hospitals', label: 'Nearby Hospital', icon: MapPin },
  { href: '/patient/ai-prescriptions', label: 'AI Prescription', icon: FileText },
  { href: '/patient/prescriptions', label: 'Prescription', icon: Pill },
  { href: '/patient/records', label: 'Medical Record', icon: FileCheck },
  { href: '/patient/goals', label: 'Goal', icon: Target },
]

const doctorMenuItems = [
  { href: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctor/patients', label: 'Patient', icon: Users },
  { href: '/doctor/appointments', label: 'Appointment', icon: Calendar },
  { href: '/doctor/chat', label: 'Chat', icon: MessageSquare },
  { href: '/doctor/reports', label: 'Report', icon: FileText },
  { href: '/doctor/analytics', label: 'Analytic', icon: BarChart3 },
]

const policeMenuItems = [
  { href: '/police/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/police/alert-history', label: 'Alert History', icon: FileText },
]

export function Sidebar({ role, userName, userRole, isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useStore((state) => state.logout)

  const menuItems = role === 'patient'
    ? patientMenuItems
    : role === 'doctor'
      ? doctorMenuItems
      : policeMenuItems

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const handleLogout = () => {
    logout()
    router.push('/role-select')
  }

  const handleLinkClick = () => {
    // Close sidebar on mobile when link is clicked
    if (onClose) onClose()
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
              {getInitials(userName)}
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{userName}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">{userRole}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 px-4 py-4 lg:py-3 rounded-xl lg:rounded-lg mb-2 transition-colors touch-manipulation',
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600'
                )}
              >
                <Icon className="w-6 h-6 lg:w-5 lg:h-5 shrink-0" />
                <span className="font-medium text-base lg:text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-4 lg:py-3 rounded-xl lg:rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 transition-colors touch-manipulation"
          >
            <LogOut className="w-6 h-6 lg:w-5 lg:h-5" />
            <span className="font-medium text-base lg:text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}
