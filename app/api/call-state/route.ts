import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const stateFilePath = path.join(process.cwd(), 'call-state.json')

export async function GET() {
    try {
        const data = fs.readFileSync(stateFilePath, 'utf8')
        return NextResponse.json(JSON.parse(data))
    } catch (error) {
        return NextResponse.json({ status: 'idle', message: '' })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        fs.writeFileSync(stateFilePath, JSON.stringify(body))
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
