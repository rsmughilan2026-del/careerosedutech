import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Map, Dumbbell, MessageSquareText, TrendingUp, User, Brain, Menu, X, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/assessment', label: 'Career Assessment', icon: ClipboardList },
  { to: '/roadmap', label: 'My Roadmap', icon: Map },
  { to: '/practice', label: 'Practice', icon: Dumbbell },
  { to: '/interview', label: 'AI Interview', icon: MessageSquareText },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function DashboardLayout() {
  const { state, resetAll } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ink-50 lg:flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-ink-100 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-ink-100 px-5">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 font-display">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Brain className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-ink-900">CareerOS</span>
          </button>
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X className="h-5 w-5 text-ink-500" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-100'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute inset-x-0 bottom-0 border-t border-ink-100 p-4">
          <div className="card p-4">
            <p className="text-xs font-medium text-ink-400">Placement Readiness</p>
            <div className="mt-1 flex items-end gap-1">
              <span className="text-2xl font-bold text-brand-600">{state.readiness}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${state.readiness}%` }} />
            </div>
          </div>
          <button
            onClick={() => {
              resetAll()
              navigate('/assessment')
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-ink-500 hover:bg-ink-50 hover:text-ink-800"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset & re-assess
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 z-40 bg-ink-900/30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-100 bg-white/80 px-5 backdrop-blur-xl lg:px-8">
          <button onClick={() => setOpen(true)} className="lg:hidden">
            <Menu className="h-6 w-6 text-ink-700" />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-ink-900">
              {state.assessment?.profile.name ? `Hi, ${state.assessment.profile.name.split(' ')[0]}` : 'Welcome'}
            </p>
            <p className="text-xs text-ink-400">
              {state.assessment?.goal.targetRole ?? '—'} · {state.assessment?.goal.targetCompany ?? '—'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="chip bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Brain className="h-3.5 w-3.5" /> CareerOS
            </span>
          </div>
        </header>

        <main className="flex-1 px-5 py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
