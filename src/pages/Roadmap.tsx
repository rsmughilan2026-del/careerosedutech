import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, CheckCircle2, Circle, Clock, Flag, Sparkles, ArrowRight, MessageSquareText } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { RoadmapTask } from '../lib/types'

const PRIORITY_STYLE: Record<RoadmapTask['priority'], { badge: string; dot: string }> = {
  High: { badge: 'bg-rose-50 text-rose-700 ring-rose-200', dot: 'bg-rose-500' },
  Medium: { badge: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-500' },
  Low: { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
}

export default function Roadmap() {
  const { state, toggleTask } = useApp()
  const navigate = useNavigate()
  const tasks = state.roadmap
  const totalMinutes = useMemo(() => tasks.reduce((s, t) => s + t.minutes, 0), [tasks])
  const doneCount = tasks.filter((t) => t.done).length
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Today's Career Mission</h1>
          <p className="text-sm text-ink-500">A focused plan targeting your weakest skills.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="card px-4 py-2 text-center">
            <p className="text-xs text-ink-400">Prep time</p>
            <p className="text-lg font-bold text-ink-900">{totalMinutes} min</p>
          </div>
          <div className="card px-4 py-2 text-center">
            <p className="text-xs text-ink-400">Done</p>
            <p className="text-lg font-bold text-brand-600">{doneCount}/{tasks.length}</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card p-4">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-ink-500">
          <span>Today's progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {tasks.length === 0 && (
          <div className="card p-8 text-center text-ink-500">
            <p>Complete the assessment to generate your roadmap.</p>
            <button onClick={() => navigate('/assessment')} className="btn-primary mt-4">Start Assessment</button>
          </div>
        )}
        {tasks.map((task, i) => {
          const ps = PRIORITY_STYLE[task.priority]
          return (
            <div
              key={task.id}
              className={`card flex items-center gap-4 p-5 transition-all animate-fadeUp ${task.done ? 'opacity-70' : ''}`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
                  task.done ? 'bg-accent-500 text-white' : 'bg-ink-100 text-ink-300 hover:bg-ink-200'
                }`}
                aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
              >
                {task.done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`chip ring-1 ${ps.badge}`}>
                    <Flag className="h-3 w-3" /> {task.priority} Priority
                  </span>
                  <span className={`text-sm font-semibold ${task.done ? 'line-through text-ink-400' : 'text-ink-900'}`}>
                    {task.title}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-ink-500">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {task.minutes} min</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (task.skill === 'interview') navigate('/interview')
                  else navigate('/practice')
                }}
                className="btn-secondary shrink-0 text-xs"
                disabled={task.done}
              >
                <Play className="h-3.5 w-3.5" /> Start
              </button>
            </div>
          )
        })}
      </div>

      {/* Why this plan */}
      <div className="card relative overflow-hidden p-6">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-brand-100/50 blur-3xl" aria-hidden />
        <div className="relative flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-ink-900">Why this plan?</h3>
            <p className="mt-2 text-sm text-ink-600 leading-relaxed">
              CareerOS prioritizes these tasks because they target your current weakest areas. Completing them raises your Placement Readiness Score fastest. Missions refresh as your skills improve.
            </p>
          </div>
        </div>
      </div>

      {progress === 100 && (
        <div className="card border-accent-200 bg-accent-50 p-5 text-center animate-scaleIn">
          <p className="font-semibold text-accent-800">All missions complete. Great work today!</p>
          <button onClick={() => navigate('/interview')} className="btn-primary mt-3">
            <MessageSquareText className="h-4 w-4" /> Try a mock interview <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
