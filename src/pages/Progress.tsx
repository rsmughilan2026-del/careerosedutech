import { Sparkles, TrendingUp, TrendingDown, CheckCircle2, MessageSquareText, Award, AlertTriangle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SKILL_LABELS, SKILL_ORDER, SKILL_COLORS, type SkillKey } from '../lib/types'
import { buildProgressInsight } from '../lib/insight'

export default function Progress() {
  const { state } = useApp()
  const history = state.progressHistory
  const current = history.length ? history[history.length - 1].readiness : 0
  const previous = history.length > 1 ? history[0].readiness : 0
  const delta = current - previous
  const tasksDone = state.roadmap.filter((t) => t.done).length
  const interviews = state.interviewHistory.length

  const ranked = [...SKILL_ORDER].sort((a, b) => state.skillScores[b] - state.skillScores[a])
  const strengths = ranked.slice(0, 2)
  const weaknesses = ranked.slice(-2).reverse()

  const insight = buildProgressInsight(history)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Progress</h1>
        <p className="text-sm text-ink-500">Track your placement readiness over time.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current Readiness" value={`${current}%`} icon={TrendingUp} tone="brand" sub={delta >= 0 ? `+${delta} since start` : `${delta} since start`} />
        <StatCard label="Previous Readiness" value={`${previous}%`} icon={TrendingDown} tone="ink" sub="Baseline week" />
        <StatCard label="Tasks Completed" value={`${tasksDone}`} icon={CheckCircle2} tone="accent" sub="Daily missions" />
        <StatCard label="Mock Interviews" value={`${interviews}`} icon={MessageSquareText} tone="amber" sub="Sessions done" />
      </div>

      {/* Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink-900">Readiness Trend</h2>
            <p className="text-sm text-ink-500">Weekly Placement Readiness Score.</p>
          </div>
          <span className="chip bg-accent-50 text-accent-700 ring-1 ring-accent-200">
            <TrendingUp className="h-3.5 w-3.5" /> {delta >= 0 ? `+${delta}` : delta} pts
          </span>
        </div>
        <ProgressChart history={history} />
      </div>

      {/* Skill improvement */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-ink-900">Skill Improvement</h2>
          <p className="text-sm text-ink-500">Current skill breakdown.</p>
          <div className="mt-5 space-y-4">
            {SKILL_ORDER.map((k) => (
              <SkillRow key={k} skill={k} value={state.skillScores[k]} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-accent-600" />
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
              <h3 className="font-semibold text-ink-900">Weaknesses</h3>
            </div>
            <div className="mt-4 space-y-2">
              {weaknesses.map((k) => (
                <div key={k} className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2">
                  <span className="text-sm font-medium text-rose-800">{SKILL_LABELS[k]}</span>
                  <span className="text-sm font-bold text-rose-700">{state.skillScores[k]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI progress insight */}
      <div className="card relative overflow-hidden p-6">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-brand-100/50 blur-3xl" aria-hidden />
        <div className="relative flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-ink-900">AI Progress Insight</h3>
            <p className="mt-2 text-sm text-ink-600 leading-relaxed">{insight}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, sub, tone }: { label: string; value: string; icon: React.ElementType; sub: string; tone: 'brand' | 'ink' | 'accent' | 'amber' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    ink: 'bg-ink-100 text-ink-600',
    accent: 'bg-accent-50 text-accent-600',
    amber: 'bg-amber-50 text-amber-600',
  }
  return (
    <div className="card p-5">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="mt-3 text-2xl font-bold text-ink-900">{value}</p>
      <p className="text-xs font-medium text-ink-500">{label}</p>
      <p className="mt-1 text-[11px] text-ink-400">{sub}</p>
    </div>
  )
}

function ProgressChart({ history }: { history: { week: string; readiness: number }[] }) {
  if (history.length === 0) {
    return <div className="flex h-48 items-center justify-center text-sm text-ink-400">No progress data yet.</div>
  }
  const max = 100
  const width = 600
  const height = 220
  const pad = { l: 36, r: 16, t: 16, b: 28 }
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b
  const stepX = history.length > 1 ? innerW / (history.length - 1) : 0
  const points = history.map((h, i) => ({
    x: pad.l + i * stepX,
    y: pad.t + innerH - (h.readiness / max) * innerH,
  }))
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${pad.t + innerH} L ${points[0].x} ${pad.t + innerH} Z`

  return (
    <div className="mt-4 overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[480px]" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f51f5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1f51f5" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1f51f5" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        {/* grid */}
        {[0, 25, 50, 75, 100].map((g) => {
          const y = pad.t + innerH - (g / max) * innerH
          return (
            <g key={g}>
              <line x1={pad.l} y1={y} x2={width - pad.r} y2={y} stroke="#e2e8f0" strokeWidth="1" />
              <text x={pad.l - 6} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8">{g}</text>
            </g>
          )
        })}
        {/* area */}
        <path d={areaD} fill="url(#chartArea)" />
        {/* line */}
        <path d={pathD} fill="none" stroke="url(#chartLine)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="#1f51f5" strokeWidth="2.5" />
            <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">{history[i].readiness}%</text>
            <text x={p.x} y={height - 8} textAnchor="middle" fontSize="10" fill="#64748b">{history[i].week}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function SkillRow({ skill, value }: { skill: SkillKey; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-ink-700">{SKILL_LABELS[skill]}</span>
        <span className="text-sm font-bold text-ink-900">{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
        <div className="h-full rounded-full animate-bar" style={{ width: `${value}%`, backgroundColor: SKILL_COLORS[skill] }} />
      </div>
    </div>
  )
}
