import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import ModelClient from '@azure-rest/ai-inference'
import { AzureKeyCredential } from '@azure/core-auth'

const resultFilePath = path.join(process.cwd(), 'interview-result.json')
const endpoint = "https://models.inference.ai.azure.com"

export async function POST(request: Request) {
    try {
        // Read interview answers
        if (!fs.existsSync(resultFilePath)) {
            return NextResponse.json({ error: 'No interview data found' }, { status: 404 })
        }

        const data = JSON.parse(fs.readFileSync(resultFilePath, 'utf8'))
        const answers = data.answers || []

        if (answers.length === 0) {
            return NextResponse.json({ error: 'No answers to analyze' }, { status: 400 })
        }

        // Build prompt from answers
        const questions = [
            "Main symptoms",
            "Duration of symptoms",
            "Pain severity (1-10)",
            "Medical history"
        ]

        const patientReport = answers.map((a: string, i: number) =>
            `${questions[i] || 'Additional info'}: ${a}`
        ).join('\n')

        // Call AI for analysis
        const client = ModelClient(endpoint, new AzureKeyCredential(process.env.GITHUB_TOKEN || ''))

        const response = await client.path("/chat/completions").post({
            body: {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are a medical AI assistant. Analyze the patient's symptoms and provide:
1. A brief diagnosis title (e.g., "Possible Upper Respiratory Infection")
2. A 2-3 sentence summary of findings
3. Severity level: mild, moderate, severe, or critical
4. 2-3 specific recommendations

Respond in this exact JSON format:
{
  "title": "...",
  "summary": "...",
  "severity": "mild|moderate|severe|critical",
  "recommendations": ["...", "..."]
}`
                    },
                    {
                        role: "user",
                        content: `Patient Voice Interview Results:\n${patientReport}`
                    }
                ],
                temperature: 0.3,
                max_tokens: 500
            }
        })

        if (response.status !== "200") {
            throw new Error("AI request failed")
        }

        const aiResponse = response.body.choices?.[0]?.message?.content || ''

        // Parse AI response
        let analysis
        try {
            // Extract JSON from response (might have markdown code blocks)
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
            analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null
        } catch {
            analysis = {
                title: "Symptom Report",
                summary: aiResponse,
                severity: "moderate",
                recommendations: ["Consult with a healthcare provider"]
            }
        }

        // Create medical record object
        const record = {
            date: new Date().toISOString(),
            name: analysis.title || "Voice Consultation Report",
            type: "Voice Consultation",
            provider: "MediLink AI",
            summary: analysis.summary || "Analysis completed",
            severity: analysis.severity || "moderate",
            recommendations: analysis.recommendations || [],
            rawAnswers: answers
        }

        // Clear the interview file
        fs.writeFileSync(resultFilePath, JSON.stringify({}))

        // Save analysis result for desktop to poll
        const analysisResultPath = path.join(process.cwd(), 'analysis-result.json')
        fs.writeFileSync(analysisResultPath, JSON.stringify({
            completed: true,
            record,
            timestamp: Date.now()
        }))

        return NextResponse.json({
            success: true,
            record,
            speakableReport: `Based on your symptoms, I have identified: ${analysis.title}. ${analysis.summary}. My recommendations are: ${analysis.recommendations?.join('. ')}. This report has been saved to your medical records.`
        })

    } catch (error) {
        console.error('Analysis error:', error)
        return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
    }
}
