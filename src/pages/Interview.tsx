import { useMemo, useState } from 'react'
import { MessageSquareText, User, Code, Mic, Send, Sparkles, ArrowRight, RotateCcw, Lightbulb, CheckCircle2, Trophy } from 'lucide-react'
import { useApp } from '../context/AppContext'
import {
  buildModes,
  pickQuestions,
  evaluateAnswer,
  summarizeSession,
  QUESTIONS_PER_SESSION,
  type InterviewMode,
  type ModeConfig,
  type EvalResult,
  type InterviewQuestion,
} from '../lib/interview'
import type { InterviewAttempt, SessionResult } from '../lib/types'

const ICONS = { user: User, code: Code, mic: Mic } as const

interface SessionState {
  questions: InterviewQuestion[]
  index: number
  answers: string[]
  results: EvalResult[]
  current: EvalResult | null
  submitting: boolean
  finished: SessionResult | null
}

function emptySession(): SessionState {
  return { questions: [], index: 0, answers: [], results: [], current: null, submitting: false, finished: null }
}

export default function Interview() {
  const { state, addInterviewAttempt, completeSession } = useApp()
  const modes = useMemo(() => buildModes(state.assessment), [state.assessment])
  const [activeMode, setActiveMode] = useState<InterviewMode>('hr')
  const [sessions, setSessions] = useState<Record<InterviewMode, SessionState>>({
    hr: emptySession(),
    technical: emptySession(),
    communication: emptySession(),
  })

  const session = sessions[activeMode]
  const modeConfig: ModeConfig = modes[activeMode]

  const startSession = (mode: InterviewMode) => {
    const seed = Date.now() % 100000
    const questions = pickQuestions(modes[mode].questions, QUESTIONS_PER_SESSION, seed)
    setSessions((prev) => ({ ...prev, [mode]: { ...emptySession(), questions } }))
  }

  const switchMode = (mode: InterviewMode) => {
    setActiveMode(mode)
    if (sessions[mode].questions.length === 0) {
      const seed = (Date.now() + mode.charCodeAt(0)) % 100000
      const questions = pickQuestions(modes[mode].questions, QUESTIONS_PER_SESSION, seed)
      setSessions((prev) => ({ ...prev, [mode]: { ...emptySession(), questions } }))
    }
  }

  const handleSubmit = () => {
    if (!session.questions.length) return
    const q = session.questions[session.index]
    const answer = session.answers[session.index] ?? ''
    if (!answer.trim()) return
    setSessions((prev) => ({ ...prev, [activeMode]: { ...prev[activeMode], submitting: true } }))
    setTimeout(() => {
      const ctx = {
        company: state.assessment?.goal.targetCompany,
        role: state.assessment?.goal.targetRole,
      }
      const result = evaluateAnswer(answer, q, activeMode, ctx)
      const attempt: InterviewAttempt = {
        questionId: q.id,
        questionPrompt: q.prompt,
        mode: activeMode,
        answer,
        scores: result.scores,
        feedback: result.feedback,
        overall: result.overall,
        timestamp: Date.now(),
      }
      addInterviewAttempt(attempt)
      setSessions((prev) => {
        const s = prev[activeMode]
        const results = [...s.results, result]
        return { ...prev, [activeMode]: { ...s, results, current: result, submitting: false } }
      })
    }, 1400)
  }

  const handleNext = () => {
    setSessions((prev) => {
      const s = prev[activeMode]
      const nextIndex = s.index + 1
      if (nextIndex >= s.questions.length) {
        // Session finished
        const summary = summarizeSession(s.results, activeMode)
        completeSession(summary)
        return { ...prev, [activeMode]: { ...s, finished: summary } }
      }
      return { ...prev, [activeMode]: { ...s, index: nextIndex, current: null } }
    })
  }

  const handleRestart = () => {
    startSession(activeMode)
  }

  const setAnswer = (text: string) => {
    setSessions((prev) => {
      const s = prev[activeMode]
      const answers = [...s.answers]
      answers[s.index] = text
      return { ...prev, [activeMode]: { ...s, answers } }
    })
  }

  const currentAnswer = session.answers[session.index] ?? ''
  const question = session.questions[session.index]
  const modeHistory = state.interviewHistory.filter((h) => h.mode === activeMode).slice(-5).reverse()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">AI Interviewer</h1>
        <p className="text-sm text-ink-500">Practice like you're already in the interview room. Three independent modes.</p>
      </div>

      {/* Mode selector */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(Object.keys(modes) as InterviewMode[]).map((id) => {
          const m = modes[id]
          const Icon = ICONS[m.icon]
          const active = activeMode === id
          const count = sessions[id].results.length
          return (
            <button
              key={id}
              onClick={() => switchMode(id)}
              className={`card relative p-5 text-left transition-all ${active ? 'ring-2 ring-brand-500' : 'hover:-translate-y-0.5 hover:shadow-cardLg'}`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600'}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 font-semibold text-ink-900">{m.label}</p>
              <p className="mt-1 text-xs text-ink-500">{m.desc}</p>
              {count > 0 && !sessions[id].finished && (
                <span className="absolute right-3 top-3 chip bg-accent-50 text-accent-700">{count} done</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Session finished summary */}
      {session.finished ? (
        <SessionSummary
          modeConfig={modeConfig}
          result={session.finished}
          onRestart={handleRestart}
          onSwitchMode={switchMode}
          modes={modes}
        />
      ) : session.questions.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <MessageSquareText className="h-7 w-7" />
          </div>
          <p className="mt-4 font-semibold text-ink-900">{modeConfig.label} — Ready when you are</p>
          <p className="mt-1 text-sm text-ink-500">{QUESTIONS_PER_SESSION} questions picked from a bank of {modeConfig.questions.length}. Each answer is scored independently.</p>
          <button onClick={() => startSession(activeMode)} className="btn-primary mt-5">
            Start {modeConfig.label} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Question + answer */}
          <div className="card p-6 lg:col-span-3">
            <div className="flex items-center justify-between">
              <span className="chip bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <MessageSquareText className="h-3.5 w-3.5" /> {modeConfig.label} · Question {session.index + 1} of {session.questions.length}
              </span>
              <button onClick={handleRestart} className="text-xs font-medium text-ink-400 hover:text-ink-700 inline-flex items-center gap-1">
                <RotateCcw className="h-3.5 w-3.5" /> Restart
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-ink-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Interviewer asks</p>
              <p className="mt-2 text-lg font-semibold text-ink-900">"{question.prompt}"</p>
              {question.difficulty && (
                <span className="mt-2 inline-block chip bg-ink-200/70 text-ink-600 capitalize">{question.difficulty}</span>
              )}
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                <Lightbulb className="h-4 w-4 shrink-0" />
                <span>{question.hint}</span>
              </div>
            </div>

            <div className="mt-5">
              <label className="label">Your answer</label>
              <textarea
                className="input min-h-[160px] resize-y"
                placeholder="Type your answer as you would speak it..."
                value={currentAnswer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={!!session.current || session.submitting}
              />
              <div className="mt-1 flex items-center justify-between text-xs text-ink-400">
                <span>{currentAnswer.trim().split(/\s+/).filter(Boolean).length} words</span>
                <span>{currentAnswer.length} chars</span>
              </div>
            </div>

            {!session.current ? (
              <button onClick={handleSubmit} disabled={!currentAnswer.trim() || session.submitting} className="btn-primary mt-4 w-full">
                {session.submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spinSlow rounded-full border-2 border-white border-t-transparent" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Submit Answer
                  </>
                )}
              </button>
            ) : session.index + 1 < session.questions.length ? (
              <button onClick={handleNext} className="btn-primary mt-4 w-full">
                Next Question <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={handleNext} className="btn-primary mt-4 w-full">
                <Trophy className="h-4 w-4" /> Finish & see results
              </button>
            )}
          </div>

          {/* Evaluation panel */}
          <div className="lg:col-span-2">
            {session.current ? (
              <div className="card p-6 animate-scaleIn">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-600" />
                  <h3 className="font-semibold text-ink-900">AI Evaluation</h3>
                  <span className="ml-auto text-sm font-bold text-ink-900">{session.current.overall}%</span>
                </div>
                <div className="mt-5 space-y-4">
                  {modeConfig.dimensions.map((d) => (
                    <EvalBar key={d.key} label={d.label} value={session.current!.scores[d.key] ?? 0} color={d.color} />
                  ))}
                </div>
                <div className="mt-5 rounded-xl bg-brand-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">AI Feedback</p>
                  <p className="mt-2 text-sm text-ink-700 leading-relaxed">{session.current.feedback}</p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-ink-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-500" />
                  Progress: {session.results.length} of {session.questions.length} answered
                </div>
              </div>
            ) : (
              <div className="card flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
                  <Sparkles className="h-7 w-7" />
                </div>
                <p className="mt-4 font-medium text-ink-700">Your evaluation will appear here</p>
                <p className="mt-1 text-xs text-ink-400">
                  Scored on {modeConfig.dimensions.length} dimensions: {modeConfig.dimensions.map((d) => d.label).join(', ')}.
                </p>
              </div>
            )}

            {/* This-mode history */}
            {modeHistory.length > 0 && (
              <div className="card mt-4 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{modeConfig.label} history</p>
                <div className="mt-3 space-y-2">
                  {modeHistory.map((h, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-ink-50 px-3 py-2 text-xs">
                      <span className="truncate text-ink-600">{h.questionPrompt.slice(0, 34)}...</span>
                      <span className="font-semibold text-ink-900">{h.overall}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SessionSummary({
  modeConfig,
  result,
  onRestart,
  onSwitchMode,
  modes,
}: {
  modeConfig: ModeConfig
  result: SessionResult
  onRestart: () => void
  onSwitchMode: (m: InterviewMode) => void
  modes: Record<InterviewMode, ModeConfig>
}) {
  return (
    <div className="card relative overflow-hidden p-6 sm:p-8 animate-scaleIn">
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-brand-100/50 blur-3xl" aria-hidden />
      <div className="relative">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-accent-600" />
          <h2 className="text-xl font-bold text-ink-900">{modeConfig.label} — Session Complete</h2>
        </div>
        <p className="mt-1 text-sm text-ink-500">{result.answered} questions answered.</p>

        {/* Overall */}
        <div className="mt-6 flex items-end gap-3">
          <span className="text-5xl font-bold text-brand-600">{result.overall}</span>
          <span className="mb-1 text-xl font-semibold text-ink-400">%</span>
          <span className="ml-2 mb-1 text-sm text-ink-500">overall interview score</span>
        </div>

        {/* Dimension averages */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {modeConfig.dimensions.map((d) => (
            <EvalBar key={d.key} label={d.label} value={result.dimensionAverages[d.key] ?? 0} color={d.color} />
          ))}
        </div>

        {/* Readiness impact */}
        <div className="mt-6 rounded-xl bg-accent-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">Readiness updated</p>
          <p className="mt-1 text-sm text-ink-700">
            Your {modeConfig.readinessImpact.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' and ')} readiness score has been updated based on this session.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={onRestart} className="btn-primary">
            <RotateCcw className="h-4 w-4" /> Retry {modeConfig.label}
          </button>
          {(Object.keys(modes) as InterviewMode[])
            .filter((m) => m !== modeConfig.id)
            .map((m) => (
              <button key={m} onClick={() => onSwitchMode(m)} className="btn-secondary">
                Try {modes[m].label} <ArrowRight className="h-4 w-4" />
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}

function EvalBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-ink-700">{label}</span>
        <span className="text-sm font-bold text-ink-900">{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
        <div className="h-full rounded-full animate-bar" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}
