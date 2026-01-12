'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { useStore } from '@/lib/store'

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    const user = useStore((state) => state.user)

    return (
        <DashboardLayout role="patient" userName={user?.name || 'Demo Patient'} userRole="Patient">
            {children}
        </DashboardLayout>
    )
}
