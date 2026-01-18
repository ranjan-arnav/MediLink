import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from './store'

interface UserState {
    user: User | null
    setUser: (user: User | null) => void
    logout: () => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'medilink-session',
            storage: createJSONStorage(() => sessionStorage), // Tab-specific storage
        }
    )
)
