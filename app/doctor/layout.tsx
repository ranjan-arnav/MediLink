'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { useStore } from '@/lib/store'

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
    const user = useStore((state) => state.user)

    return (
        <DashboardLayout role="doctor" userName={user?.name || 'Dr. Sarah Smith'} userRole="Doctor">
            {children}
        </DashboardLayout>
    )
}
