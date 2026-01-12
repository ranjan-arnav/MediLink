'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { useStore } from '@/lib/store'

export default function PoliceLayout({ children }: { children: React.ReactNode }) {
    const user = useStore((state) => state.user)

    return (
        <DashboardLayout role="police" userName={user?.name || 'Officer'} userRole="Police">
            {children}
        </DashboardLayout>
    )
}
