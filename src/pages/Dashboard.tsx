import { Link } from 'react-router-dom'
import { Sparkles, Target, Building2, ArrowRight, Map, MessageSquareText, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SKILL_LABELS, SKILL_ORDER, SKILL_COLORS, type SkillKey } from '../lib/types'
import { buildRecommendation } from '../lib/insight'
import { useCountUp } from '../lib/hooks'

export default function Dashboard() {
  const { state } = useApp()
  const a = state.assessment
  const recommendation = a ? buildRecommendation(a.skills) : 'Complete the assessment to get a personalized recommendation.'
  const tasksDone = state.roadmap.filter((t) => t.done).length
  const totalTasks = state.roadmap.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>
          <p className="text-sm text-ink-500">Your placement command center.</p>
        </div>
        <Link to="/roadmap" className="btn-primary self-start sm:self-auto">
          <Map className="h-4 w-4" /> View today's mission
        </Link>
      </div>

      {/* Top row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Readiness */}
        <div className="card relative overflow-hidden p-6 lg:col-span-1">
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-brand-100/60 blur-3xl" aria-hidden />
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Placement Readiness</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-6xl font-bold text-brand-600"><ReadinessNumber value={state.readiness} /></span>
            <span className="mb-2 text-2xl font-semibold text-ink-400">%</span>
          </div>
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 animate-bar" style={{ width: `${state.readiness}%` }} />
          </div>
          <p className="mt-3 text-xs text-ink-400">
            {tasksDone}/{totalTasks} daily missions completed
          </p>
        </div>

        {/* AI Recommendation */}
        <div className="card relative overflow-hidden p-6 lg:col-span-2">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-accent-100/50 blur-3xl" aria-hidden />
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <h2 className="text-lg font-semibold text-ink-900">AI Recommendation</h2>
          </div>
          <p className="mt-4 text-ink-700 leading-relaxed">{recommendation}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/roadmap" className="btn-secondary text-sm">
              Start today's mission <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/interview" className="btn-ghost text-sm">
              <MessageSquareText className="h-4 w-4" /> Practice interview
            </Link>
          </div>
        </div>
      </div>

      {/* Skill breakdown + Target */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-ink-900">Skill Breakdown</h2>
          <p className="text-sm text-ink-500">Your scores across the five placement dimensions.</p>
          <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {SKILL_ORDER.map((k) => (
              <MiniBar key={k} skill={k} value={state.skillScores[k]} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-2 text-ink-500">
              <Target className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Target Career</span>
            </div>
            <p className="mt-2 text-xl font-bold text-ink-900">{a?.goal.targetRole ?? '—'}</p>
            <div className="mt-4 flex items-center gap-2 text-ink-500">
              <Building2 className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Target Company</span>
            </div>
            <p className="mt-2 text-xl font-bold text-ink-900">{a?.goal.targetCompany ?? '—'}</p>
            <div className="mt-4 rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-500">
              Timeline: <span className="font-semibold text-ink-700">{a?.goal.timeline ?? '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickCard to="/roadmap" icon={Map} title="Today's Roadmap" desc={`${totalTasks} missions queued`} />
        <QuickCard to="/interview" icon={MessageSquareText} title="AI Mock Interview" desc={`${state.interviewHistory.length} completed`} />
        <QuickCard to="/progress" icon={TrendingUp} title="Progress" desc={`Current ${state.readiness}%`} />
      </div>
    </div>
  )
}

function ReadinessNumber({ value }: { value: number }) {
  const v = useCountUp(value, 1200)
  return <>{v}</>
}

function MiniBar({ skill, value }: { skill: SkillKey; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-ink-700">{SKILL_LABELS[skill]}</span>
        <span className="text-sm font-bold text-ink-900">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
        <div className="h-full rounded-full animate-bar" style={{ width: `${value}%`, backgroundColor: SKILL_COLORS[skill] }} />
      </div>
    </div>
  )
}

function QuickCard({ to, icon: Icon, title, desc }: { to: string; icon: React.ElementType; title: string; desc: string }) {
  return (
    <Link to={to} className="card-hover group flex items-center gap-4 p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink-900">{title}</p>
        <p className="truncate text-xs text-ink-500">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-ink-300 transition group-hover:text-brand-600 group-hover:translate-x-0.5" />
    </Link>
  )
}
