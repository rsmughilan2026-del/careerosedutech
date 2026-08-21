import { useApp } from '../context/AppContext'

export default function Profile() {
  const { state } = useApp()
  const a = state.assessment
  if (!a) {
    return (
      <div className="card p-8 text-center text-ink-500">
        No profile yet. Complete the assessment to see your profile here.
      </div>
    )
  }
  const rows = [
    { label: 'Name', value: a.profile.name },
    { label: 'College', value: a.profile.college },
    { label: 'Branch', value: a.profile.branch },
    { label: 'Year', value: a.profile.year },
    { label: 'CGPA', value: a.profile.cgpa },
    { label: 'Target Role', value: a.goal.targetRole },
    { label: 'Target Company', value: a.goal.targetCompany },
    { label: 'Placement Timeline', value: a.goal.timeline },
    { label: 'Prep Hours / Day', value: `${a.skills.hoursPerDay} hrs` },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Profile</h1>
        <p className="text-sm text-ink-500">Your student and career information.</p>
      </div>
      <div className="card overflow-hidden">
        <div className="flex items-center gap-4 border-b border-ink-100 bg-gradient-to-br from-brand-50 to-accent-50 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-bold text-white">
            {a.profile.name.charAt(0).toUpperCase() || 'S'}
          </div>
          <div>
            <p className="text-xl font-bold text-ink-900">{a.profile.name || 'Student'}</p>
            <p className="text-sm text-ink-500">{a.profile.branch} · {a.profile.year}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-ink-400">Readiness</p>
            <p className="text-2xl font-bold text-brand-600">{state.readiness}%</p>
          </div>
        </div>
        <dl className="divide-y divide-ink-100">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between px-6 py-4">
              <dt className="text-sm font-medium text-ink-500">{r.label}</dt>
              <dd className="text-sm font-semibold text-ink-900">{r.value || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
