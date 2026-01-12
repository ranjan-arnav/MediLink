import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const analysisResultPath = path.join(process.cwd(), 'analysis-result.json')

export async function GET() {
    try {
        if (fs.existsSync(analysisResultPath)) {
            const data = fs.readFileSync(analysisResultPath, 'utf8')
            const result = JSON.parse(data)

            // Only return if recent (within last 5 minutes)
            if (result.completed && result.timestamp && Date.now() - result.timestamp < 300000) {
                return NextResponse.json(result)
            }
        }
        return NextResponse.json({ completed: false })
    } catch {
        return NextResponse.json({ completed: false })
    }
}

export async function DELETE() {
    try {
        if (fs.existsSync(analysisResultPath)) {
            fs.writeFileSync(analysisResultPath, JSON.stringify({ completed: false }))
        }
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ success: false })
    }
}
