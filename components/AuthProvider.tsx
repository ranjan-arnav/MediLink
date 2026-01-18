'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/userStore'
import { useStore } from '@/lib/store'

const publicRoutes = ['/', '/role-select']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    // Skip if on public route
    if (publicRoutes.includes(pathname)) {
      return
    }

    // Only redirect if user is not logged in
    if (!user) {
      // Only redirect if not already on role-select to prevent loops
      if (pathname !== '/role-select') {
        router.replace('/role-select')
      }
    }
  }, [user]) // Only depend on user, not pathname

  return <>{children}</>
}
