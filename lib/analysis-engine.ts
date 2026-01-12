export type SeverityLevel = 'mild' | 'moderate' | 'severe' | 'critical'

export interface AnalysisResult {
    severity: SeverityLevel
    title: string
    description: string
    action: string
    color: 'green' | 'yellow' | 'orange' | 'red'
}

const CRITICAL_KEYWORDS = [
    'chest pain',
    'difficulty breathing',
    'unconscious',
    'severe bleeding',
    'stroke',
    'heart attack',
    'blue lips',
    'severe burn',
    'seizure'
]

const SEVERE_KEYWORDS = [
    'high fever',
    'severe headache',
    'abdominal pain',
    'confusion',
    'vision loss',
    'broken bone',
    'dehydration'
]

const MODERATE_KEYWORDS = [
    'fever',
    'cough',
    'sore throat',
    'vomiting',
    'diarrhea',
    'rash',
    'earache',
    'migraine'
]

export function analyzeSymptoms(symptoms: string[], description: string = ''): AnalysisResult {
    const allText = [...symptoms, description].join(' ').toLowerCase()

    // 1. Critical Checks
    if (CRITICAL_KEYWORDS.some(keyword => allText.includes(keyword))) {
        return {
            severity: 'critical',
            title: 'SEEK EMERGENCY CARE IMMEDIATELY',
            description: 'Your reported symptoms indicate a potentially life-threatening condition.',
            action: 'Call Emergency Services (911) or go to the nearest ER immediately.',
            color: 'red'
        }
    }

    // 2. Severe Checks
    if (SEVERE_KEYWORDS.some(keyword => allText.includes(keyword))) {
        return {
            severity: 'severe',
            title: 'Urgent Medical Attention Needed',
            description: 'Your symptoms suggest a serious condition that requires prompt medical evaluation.',
            action: 'Visit an Urgent Care center or contact your doctor immediately.',
            color: 'orange'
        }
    }

    // 3. Moderate Checks
    if (MODERATE_KEYWORDS.some(keyword => allText.includes(keyword)) || symptoms.length > 3) {
        return {
            severity: 'moderate',
            title: 'Medical Consultation Recommended',
            description: 'Your symptoms are concerning but likely not immediately life-threatening.',
            action: 'Schedule an appointment with your doctor within 24 hours.',
            color: 'yellow'
        }
    }

    // 4. Default / Mild
    return {
        severity: 'mild',
        title: 'Self-Care & Monitoring',
        description: 'Your symptoms appear mild and may be improved with home care.',
        action: 'Rest, hydrate, and monitor your symptoms. Consult a doctor if they worsen.',
        color: 'green'
    }
}
