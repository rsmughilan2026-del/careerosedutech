import type { SkillKey, AssessmentData } from './types'
import { SKILL_LABELS } from './types'

export function buildInsight(skills: AssessmentData['skills']): {
  insight: string
  strengths: SkillKey[]
  priorities: SkillKey[]
} {
  const ranked = ([...SKILL_KEYS] as SkillKey[]).sort((a, b) => skills[b] - skills[a])
  const strengths = ranked.slice(0, 2)
  const priorities = ranked.slice(-2).reverse()

  const strongestLabel = SKILL_LABELS[strengths[0]]
  const lowLabels = priorities.map((k) => SKILL_LABELS[k]).join(' and ')

  const insight = `Your strongest area is ${strongestLabel}. Your biggest improvement opportunities are ${lowLabels}. CareerOS recommends prioritizing ${priorities[0] === 'coding' ? 'DSA practice' : SKILL_LABELS[priorities[0]].toLowerCase() + ' fundamentals'} and mock interviews.`

  return { insight, strengths, priorities }
}

const SKILL_KEYS: SkillKey[] = ['coding', 'aptitude', 'technical', 'communication', 'interview']

export function buildRecommendation(skills: AssessmentData['skills']): string {
  const ranked = ([...SKILL_KEYS] as SkillKey[]).sort((a, b) => skills[a] - skills[b])
  const lowest = ranked[0]
  const second = ranked[1]
  const map: Record<SkillKey, string> = {
    coding: 'DSA fundamentals and daily problem solving',
    aptitude: 'quantitative aptitude and logical reasoning drills',
    technical: 'core technical concepts (OOP, DBMS, OS)',
    communication: 'verbal fluency and structured storytelling',
    interview: 'mock interviews and self-introduction practice',
  }
  return `Your biggest current gap is ${SKILL_LABELS[lowest].toLowerCase()}. Spend the next 7 days improving ${map[lowest]} while maintaining your ${SKILL_LABELS[second].toLowerCase()} strength.`
}

export function buildProgressInsight(history: { week: string; readiness: number }[]): string {
  if (history.length < 2) return 'Keep completing your daily missions to see your improvement trend.'
  const first = history[0].readiness
  const last = history[history.length - 1].readiness
  const delta = last - first
  if (delta <= 0) return 'Your readiness is holding steady. Increase your daily mission completion to accelerate growth.'
  return `You improved by ${delta} percentage points since you started. Keep your consistency — your next milestone is ${Math.min(100, last + 8)}% readiness.`
}
