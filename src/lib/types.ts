export type SkillKey = 'coding' | 'aptitude' | 'technical' | 'communication' | 'interview'

export const SKILL_LABELS: Record<SkillKey, string> = {
  coding: 'Coding',
  aptitude: 'Aptitude',
  technical: 'Technical',
  communication: 'Communication',
  interview: 'Interview',
}

export const SKILL_ORDER: SkillKey[] = ['coding', 'aptitude', 'technical', 'communication', 'interview']

export const SKILL_COLORS: Record<SkillKey, string> = {
  coding: '#1f51f5',
  aptitude: '#10b981',
  technical: '#8b5cf6',
  communication: '#f59e0b',
  interview: '#ef4444',
}

export interface Profile {
  name: string
  college: string
  branch: string
  year: string
  cgpa: string
}

export interface CareerGoal {
  targetRole: string
  targetCompany: string
  timeline: string
}

export interface Skills {
  coding: number
  aptitude: number
  technical: number
  communication: number
  interview: number
  hoursPerDay: number
}

export interface AssessmentData {
  profile: Profile
  goal: CareerGoal
  skills: Skills
}

export type InterviewMode = 'hr' | 'technical' | 'communication'

export interface InterviewAttempt {
  questionId: string
  questionPrompt: string
  mode: InterviewMode
  answer: string
  scores: Record<string, number>
  feedback: string
  overall: number
  timestamp: number
}

export interface SessionResult {
  mode: InterviewMode
  dimensionAverages: Record<string, number>
  overall: number
  answered: number
}

export interface ProgressSnapshot {
  week: string
  readiness: number
}

export interface RoadmapTask {
  id: string
  skill: SkillKey | 'interview'
  title: string
  topic: string
  minutes: number
  priority: 'High' | 'Medium' | 'Low'
  done: boolean
}

export interface AppState {
  hasAssessment: boolean
  assessment: AssessmentData | null
  readiness: number
  skillScores: Record<SkillKey, number>
  roadmap: RoadmapTask[]
  interviewHistory: InterviewAttempt[]
  progressHistory: ProgressSnapshot[]
  lastUpdated: number
}
