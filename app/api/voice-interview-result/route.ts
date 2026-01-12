import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const resultFilePath = path.join(process.cwd(), 'interview-result.json')

export async function POST(request: Request) {
    try {
        const body = await request.json()
        // In a real app, this would trigger the analysis engine directly or push to a DB.
        // For this local sync, we'll write to a file that the frontend polls or we just verify it works.
        fs.writeFileSync(resultFilePath, JSON.stringify(body))

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 })
    }
}

export async function GET() {
    try {
        if (fs.existsSync(resultFilePath)) {
            const data = fs.readFileSync(resultFilePath, 'utf8')
            return NextResponse.json(JSON.parse(data))
        }
        return NextResponse.json(null)
    } catch {
        return NextResponse.json(null)
    }
}
