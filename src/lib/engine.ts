import type { SkillKey, RoadmapTask, AppState, AssessmentData } from './types'
import { SKILL_ORDER } from './types'

const STORAGE_KEY = 'careeros:v1'

const DEFAULT_SKILL_SCORES = {
  coding: 48,
  aptitude: 65,
  technical: 55,
  communication: 60,
  interview: 42,
}

const SKILL_LABEL_MAP: Record<SkillKey, string> = {
  coding: 'Coding',
  aptitude: 'Aptitude',
  technical: 'Technical',
  communication: 'Communication',
  interview: 'Interview',
}

const TOPIC_BANK: Record<SkillKey, string[]> = {
  coding: ['Arrays & Two Pointers', 'DSA — Strings & Hashing', 'Linked Lists Basics', 'Binary Search Practice', 'Recursion & Backtracking'],
  aptitude: ['Quantitative Practice', 'Logical Reasoning', 'Number Series', 'Time, Speed & Distance', 'Data Interpretation'],
  technical: ['OOP Concepts', 'DBMS Fundamentals', 'Operating Systems Basics', 'Computer Networks', 'Core ECE / CN Revision'],
  communication: ['Resume Storytelling', 'Verbal Fluency Drills', 'Group Discussion Prep', 'Email & Summary Writing'],
  interview: ['AI Mock Interview', 'HR Self Introduction', 'Behavioural STAR Stories', 'Reverse Question Prep'],
}

const DEMO_ASSESSMENT: AssessmentData = {
  profile: {
    name: 'Aarav Sharma',
    college: 'Vellore Institute of Technology',
    branch: 'Electronics & Communication',
    year: '3rd Year',
    cgpa: '8.4',
  },
  goal: {
    targetRole: 'Software Engineer',
    targetCompany: 'Zoho',
    timeline: '6 months',
  },
  skills: {
    coding: 5,
    aptitude: 8,
    technical: 6,
    communication: 7,
    interview: 4,
    hoursPerDay: 3,
  },
}

export const DEMO_STATE: AppState = {
  hasAssessment: true,
  assessment: DEMO_ASSESSMENT,
  readiness: computeReadiness(DEMO_ASSESSMENT.skills),
  skillScores: DEFAULT_SKILL_SCORES,
  roadmap: generateRoadmap(DEMO_ASSESSMENT.skills),
  interviewHistory: [],
  progressHistory: [
    { week: 'Week 1', readiness: 48 },
    { week: 'Week 2', readiness: 55 },
    { week: 'Week 3', readiness: 61 },
    { week: 'Current', readiness: 64 },
  ],
  lastUpdated: Date.now(),
}

export function computeReadiness(skills: AssessmentData['skills']): number {
  const weights: Record<SkillKey, number> = {
    coding: 0.28,
    aptitude: 0.2,
    technical: 0.22,
    communication: 0.15,
    interview: 0.15,
  }
  let total = 0
  SKILL_ORDER.forEach((k) => {
    total += (skills[k] / 10) * weights[k]
  })
  return Math.round(total * 100)
}

export function deriveSkillScores(skills: AssessmentData['skills']): Record<SkillKey, number> {
  const result = {} as Record<SkillKey, number>
  SKILL_ORDER.forEach((k) => {
    result[k] = Math.round((skills[k] / 10) * 100)
  })
  return result
}

export function generateRoadmap(skills: AssessmentData['skills']): RoadmapTask[] {
  const ranked = [...SKILL_ORDER].sort((a, b) => skills[a] - skills[b])
  const weakest = ranked.slice(0, 2)
  const middle = ranked.slice(2, 3)
  const tasks: RoadmapTask[] = []

  const pick = (arr: string[], seed: number) => arr[seed % arr.length]

  weakest.forEach((skill, i) => {
    tasks.push({
      id: `task-${skill}-${i}`,
      skill,
      title: `${SKILL_LABEL_MAP[skill]} — ${pick(TOPIC_BANK[skill], i)}`,
      topic: pick(TOPIC_BANK[skill], i),
      minutes: skill === 'interview' ? 15 : 30,
      priority: 'High',
      done: false,
    })
  })

  if (middle[0]) {
    tasks.push({
      id: `task-${middle[0]}-m`,
      skill: middle[0],
      title: `${SKILL_LABEL_MAP[middle[0]]} — ${pick(TOPIC_BANK[middle[0]], 2)}`,
      topic: pick(TOPIC_BANK[middle[0]], 2),
      minutes: 15,
      priority: 'Medium',
      done: false,
    })
  }

  tasks.push({
    id: 'task-interview-practice',
    skill: 'interview',
    title: 'AI Mock Interview — 15 min',
    topic: 'HR Self Introduction',
    minutes: 15,
    priority: 'High',
    done: false,
  })

  return tasks
}

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AppState
  } catch {
    return null
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function makeInitialDemoState(): AppState {
  return { ...DEMO_STATE, lastUpdated: Date.now() }
}
