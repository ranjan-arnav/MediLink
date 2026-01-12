import { NextRequest, NextResponse } from 'next/server'
import { useStore } from '@/lib/store'

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    // Mock authentication - in production, verify credentials against database
    const mockUsers = {
      patient: {
        id: '1',
        name: 'Demo Patient',
        email: 'patient@medilink.com',
        role: 'patient',
      },
      doctor: {
        id: '2',
        name: 'Dr. Sarah Smith',
        email: 'doctor@careconnect.com',
        role: 'doctor' as const,
      },
      police: {
        id: '3',
        name: 'Police Officer',
        email: 'police@careconnect.com',
        role: 'police' as const,
      },
    }

    const user = mockUsers[role as keyof typeof mockUsers]

    if (!user) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    return NextResponse.json({ user, success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
