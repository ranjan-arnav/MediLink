'use server'

import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env["GITHUB_TOKEN"] || "";
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-5-mini";

export type SeverityLevel = 'mild' | 'moderate' | 'severe' | 'critical'

export interface analysisResult {
    severity: SeverityLevel
    title: string
    description: string
    action: string
    color: 'green' | 'yellow' | 'orange' | 'red'
}

export async function analyzeSymptomsAction(
    symptoms: string[],
    description: string,
    history: string,
    duration: string,
    painLevel: number
): Promise<analysisResult | null> {
    try {
        const client = ModelClient(
            endpoint,
            new AzureKeyCredential(token),
        );

        const prompt = `
      Act as an emergency medical triage AI. Analyze the following patient report:
      - Reported Symptoms: ${symptoms.join(', ')}
      - Duration: ${duration}
      - Pain Level: ${painLevel}/10
      - Patient Description: ${description}
      - Medical History: ${history}

      Determine the severity and recommended action.
      
      Respond ONLY with valid JSON in the following format:
      {
        "severity": "mild" | "moderate" | "severe" | "critical",
        "title": "Short headline (e.g., 'Seek Emergency Care')",
        "description": "2-3 sentences explaining the assessment directly to the patient.",
        "action": "Specific recommendation (e.g., 'Go to ER', 'Schedule Appointment', 'Home Care').",
        "color": "green" (mild) | "yellow" (moderate) | "orange" (severe) | "red" (critical)
      }
    `

        const response = await client.path("/chat/completions").post({
            body: {
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt }
                ],
                model: model,
                response_format: { type: 'json_object' }
            }
        });

        if (isUnexpected(response)) {
            throw response.body.error;
        }

        const content = response.body.choices[0].message.content;
        if (!content) return null;

        const result = JSON.parse(content) as analysisResult;
        return result;

    } catch (error) {
        console.error('GitHub Models Analysis Error:', error);
        return null;
    }
}
