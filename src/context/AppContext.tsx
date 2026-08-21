import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppState, AssessmentData, RoadmapTask, InterviewAttempt, SkillKey, InterviewMode, SessionResult } from '../lib/types'
import {
  computeReadiness,
  deriveSkillScores,
  generateRoadmap,
  loadState,
  saveState,
  clearState,
  DEMO_STATE,
} from '../lib/engine'

interface ContextValue {
  state: AppState
  submitAssessment: (data: AssessmentData) => void
  toggleTask: (id: string) => void
  addInterviewAttempt: (attempt: InterviewAttempt) => void
  completeSession: (result: SessionResult) => void
  resetAll: () => void
  loadDemo: () => void
  getSkillScore: (k: SkillKey) => number
}

const AppContext = createContext<ContextValue | null>(null)

function freshState(data: AssessmentData): AppState {
  return {
    hasAssessment: true,
    assessment: data,
    readiness: computeReadiness(data.skills),
    skillScores: deriveSkillScores(data.skills),
    roadmap: generateRoadmap(data.skills),
    interviewHistory: [],
    progressHistory: seedProgress(computeReadiness(data.skills)),
    lastUpdated: Date.now(),
  }
}

function seedProgress(current: number): { week: string; readiness: number }[] {
  const w1 = Math.max(30, current - 18)
  const w2 = Math.max(35, current - 10)
  const w3 = Math.max(40, current - 4)
  return [
    { week: 'Week 1', readiness: w1 },
    { week: 'Week 2', readiness: w2 },
    { week: 'Week 3', readiness: w3 },
    { week: 'Current', readiness: current },
  ]
}

// How each interview mode maps to readiness skill dimensions
const MODE_IMPACT: Record<InterviewMode, SkillKey[]> = {
  hr: ['interview', 'communication'],
  technical: ['technical', 'coding'],
  communication: ['communication'],
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = loadState()
    return saved ?? { ...DEMO_STATE }
  })

  useEffect(() => {
    saveState(state)
  }, [state])

  const value = useMemo<ContextValue>(
    () => ({
      state,
      submitAssessment: (data) => {
        setState(freshState(data))
      },
      toggleTask: (id) => {
        setState((s) => {
          const roadmap: RoadmapTask[] = s.roadmap.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
          const completed = roadmap.filter((t) => t.done).length
          const total = roadmap.length
          const boost = Math.round((completed / Math.max(1, total)) * 6)
          const baseReadiness = s.assessment ? computeReadiness(s.assessment.skills) : s.readiness
          const readiness = Math.min(100, baseReadiness + boost)
          const history = [...s.progressHistory]
          history[history.length - 1] = { week: 'Current', readiness }
          return { ...s, roadmap, readiness, progressHistory: history, lastUpdated: Date.now() }
        })
      },
      addInterviewAttempt: (attempt) => {
        setState((s) => {
          // Best-effort live update of the interview skill dimension per attempt
          const dims = MODE_IMPACT[attempt.mode] ?? ['interview']
          const skillScores = { ...s.skillScores }
          dims.forEach((d) => {
            skillScores[d] = Math.max(skillScores[d], attempt.overall)
          })
          return {
            ...s,
            interviewHistory: [...s.interviewHistory, attempt],
            skillScores,
            lastUpdated: Date.now(),
          }
        })
      },
      completeSession: (result) => {
        setState((s) => {
          const dims = MODE_IMPACT[result.mode] ?? ['interview']
          const skillScores = { ...s.skillScores }
          dims.forEach((d) => {
            // Blend session average into the stored skill score (weighted toward improvement)
            skillScores[d] = Math.round(Math.max(skillScores[d] * 0.5 + result.overall * 0.5, Math.min(100, skillScores[d] + 4)))
          })
          // Recompute overall readiness from the (possibly improved) skill scores
          const readiness = Math.round(
            (skillScores.coding * 0.28 +
              skillScores.aptitude * 0.2 +
              skillScores.technical * 0.22 +
              skillScores.communication * 0.15 +
              skillScores.interview * 0.15),
          )
          const history = [...s.progressHistory]
          history[history.length - 1] = { week: 'Current', readiness }
          return { ...s, skillScores, readiness, progressHistory: history, lastUpdated: Date.now() }
        })
      },
      resetAll: () => {
        clearState()
        setState({
          hasAssessment: false,
          assessment: null,
          readiness: 0,
          skillScores: { coding: 0, aptitude: 0, technical: 0, communication: 0, interview: 0 },
          roadmap: [],
          interviewHistory: [],
          progressHistory: [],
          lastUpdated: Date.now(),
        })
      },
      loadDemo: () => {
        setState({ ...DEMO_STATE, lastUpdated: Date.now() })
      },
      getSkillScore: (k) => state.skillScores[k],
    }),
    [state],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): ContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
