import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useCountUp } from '../lib/hooks'
import { SKILL_LABELS, SKILL_ORDER, SKILL_COLORS, type SkillKey } from '../lib/types'
import { buildInsight } from '../lib/insight'
import { Logo } from './Landing'

export default function AssessmentResult() {
  const { state } = useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2600)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <LoadingScreen />

  if (!state.assessment) {
    navigate('/assessment')
    return null
  }

  const { insight, strengths, priorities } = buildInsight(state.assessment.skills)

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Logo />
          <span className="text-xs font-medium text-ink-400">Assessment Result</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="text-center animate-fadeUp">
          <span className="chip bg-accent-50 text-accent-700 ring-1 ring-accent-200">
            <Sparkles className="h-3.5 w-3.5" /> AI Analysis Complete
          </span>
          <h1 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">Placement Readiness</h1>
        </div>

        {/* Score ring */}
        <div className="mt-10 flex flex-col items-center animate-scaleIn">
          <ScoreRing value={state.readiness} />
          <p className="mt-4 text-sm text-ink-500">
            {state.readiness >= 75 ? 'Placement ready — maintain your edge.' : state.readiness >= 50 ? 'On track — focused practice will close the gap.' : 'Early stage — your roadmap will accelerate growth.'}
          </p>
        </div>

        {/* Skill breakdown */}
        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <div className="card p-6 lg:col-span-3">
            <h2 className="text-lg font-semibold text-ink-900">Skill Breakdown</h2>
            <p className="text-sm text-ink-500">How you scored across the five placement dimensions.</p>
            <div className="mt-6 space-y-4">
              {SKILL_ORDER.map((k, i) => (
                <SkillBar key={k} skill={k} value={state.skillScores[k]} delay={i * 120} />
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent-600" />
                <h3 className="font-semibold text-ink-900">Strengths</h3>
              </div>
              <div className="mt-4 space-y-2">
                {strengths.map((k) => (
                  <div key={k} className="flex items-center justify-between rounded-lg bg-accent-50 px-3 py-2">
                    <span className="text-sm font-medium text-accent-800">{SKILL_LABELS[k]}</span>
                    <span className="text-sm font-bold text-accent-700">{state.skillScores[k]}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                <h3 className="font-semibold text-ink-900">Priority Areas</h3>
              </div>
              <div className="mt-4 space-y-2">
                {priorities.map((k) => (
                  <div key={k} className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2">
                    <span className="text-sm font-medium text-rose-800">{SKILL_LABELS[k]}</span>
                    <span className="text-sm font-bold text-rose-700">{state.skillScores[k]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="mt-6 card relative overflow-hidden p-6 sm:p-8 animate-fadeUp">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-brand-100/60 blur-3xl" aria-hidden />
          <div className="relative flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink-900">AI Career Insight</h3>
              <p className="mt-2 text-ink-700 leading-relaxed">{insight}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button onClick={() => navigate('/roadmap')} className="btn-primary w-full sm:w-auto">
            Generate My Career Roadmap <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary w-full sm:w-auto">
            <CheckCircle2 className="h-4 w-4" /> Go to Dashboard
          </button>
        </div>
      </main>
    </div>
  )
}

function ScoreRing({ value }: { value: number }) {
  const v = useCountUp(value, 1400)
  const r = 90
  const c = 2 * Math.PI * r
  const offset = c - (v / 100) * c
  return (
    <div className="relative h-56 w-56">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={r} fill="none" stroke="#e2e8f0" strokeWidth="14" />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f51f5" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-6xl font-bold text-ink-900">{v}<span className="text-2xl text-ink-400">%</span></span>
        <span className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-400">Ready</span>
      </div>
    </div>
  )
}

function SkillBar({ skill, value, delay }: { skill: SkillKey; value: number; delay: number }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(value), delay + 200)
    return () => clearTimeout(t)
  }, [value, delay])
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-ink-700">{SKILL_LABELS[skill]}</span>
        <span className="text-sm font-bold text-ink-900">{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
        <div className="h-full rounded-full animate-bar" style={{ width: `${w}%`, backgroundColor: SKILL_COLORS[skill] }} />
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-50">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 rounded-full border-4 border-ink-100" />
        <div className="absolute inset-0 animate-spinSlow rounded-full border-4 border-transparent border-t-brand-600" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-7 w-7 text-brand-600 animate-pulseSoft" />
        </div>
      </div>
      <p className="mt-6 text-lg font-semibold text-ink-800">AI is analyzing your career profile...</p>
      <p className="mt-1 text-sm text-ink-400">Scoring 5 dimensions and generating insight</p>
    </div>
  )
}
