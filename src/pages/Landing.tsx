import { Link } from 'react-router-dom'
import { Brain, Zap, MessageSquareText, Gauge } from 'lucide-react'

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Career Assessment',
    desc: 'A smart multi-step assessment that scores your coding, aptitude, technical, communication and interview readiness in minutes.',
    color: 'from-brand-500 to-brand-700',
  },
  {
    icon: Zap,
    title: 'Personalized Roadmap',
    desc: 'Get a daily mission of high-impact tasks generated from your weakest skills — no guesswork, just the next right step.',
    color: 'from-accent-500 to-accent-700',
  },
  {
    icon: MessageSquareText,
    title: 'AI Mock Interview',
    desc: 'Practice HR, technical and behavioral rounds with instant AI-style feedback on structure, confidence and relevance.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Gauge,
    title: 'Placement Readiness Score',
    desc: 'One clear number that tells you where you stand today — and tracks your improvement week over week.',
    color: 'from-rose-500 to-red-600',
  },
]

const STEPS = [
  { n: '01', label: 'Assess', desc: 'Profile, goals and a 1–10 skill self-rating.' },
  { n: '02', label: 'Understand', desc: 'AI insight into strengths and priority gaps.' },
  { n: '03', label: 'Recommend', desc: 'A personalized daily roadmap of missions.' },
  { n: '04', label: 'Practice', desc: 'Mock interviews with instant evaluation.' },
  { n: '05', label: 'Evaluate', desc: 'Scored feedback across four dimensions.' },
  { n: '06', label: 'Improve', desc: 'Progress tracking that compounds weekly.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-ink-600 md:flex">
            <a href="#features" className="hover:text-brand-700">Features</a>
            <a href="#how" className="hover:text-brand-700">How it works</a>
            <a href="#stats" className="hover:text-brand-700">Why CareerOS</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="btn-ghost hidden sm:inline-flex">Dashboard</Link>
            <Link to="/assessment" className="btn-primary">Start Assessment</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" aria-hidden />
        <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-accent-200/40 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip bg-brand-50 text-brand-700 ring-1 ring-brand-200 animate-fadeUp">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulseSoft" />
              AI-powered Placement Operating System
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] text-ink-900 animate-fadeUp sm:text-6xl" style={{ animationDelay: '60ms' }}>
              Your AI-powered career <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 bg-clip-text text-transparent">operating system.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-600 animate-fadeUp" style={{ animationDelay: '120ms' }}>
              Know where you stand. Know what to learn next. Become placement ready with a personalized career journey — from assessment to mock interview to measurable progress.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fadeUp" style={{ animationDelay: '180ms' }}>
              <Link to="/assessment" className="btn-primary w-full sm:w-auto">
                Start Career Assessment
              </Link>
              <Link to="/dashboard" className="btn-secondary w-full sm:w-auto">
                Explore Dashboard
              </Link>
            </div>
            <p className="mt-4 text-xs text-ink-400 animate-fadeUp" style={{ animationDelay: '240ms' }}>
              No sign-up. Your progress stays on your device.
            </p>
          </div>

          {/* Hero preview card */}
          <div className="mx-auto mt-16 max-w-5xl animate-scaleIn" style={{ animationDelay: '300ms' }}>
            <div className="card overflow-hidden p-0">
              <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50/60 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-medium text-ink-400">careeros.app/dashboard</span>
              </div>
              <div className="grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
                <div className="sm:col-span-1">
                  <div className="card p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Placement Readiness</p>
                    <div className="mt-3 flex items-end gap-2">
                      <span className="text-5xl font-bold text-brand-600">64</span>
                      <span className="mb-1 text-lg font-semibold text-ink-400">%</span>
                    </div>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-ink-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 animate-bar" style={{ width: '64%' }} />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="card p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Skill Breakdown</p>
                    <div className="mt-4 space-y-3">
                      {[
                        { l: 'Coding', v: 48, c: 'bg-brand-500' },
                        { l: 'Aptitude', v: 78, c: 'bg-accent-500' },
                        { l: 'Technical', v: 62, c: 'bg-violet-500' },
                        { l: 'Communication', v: 70, c: 'bg-amber-500' },
                        { l: 'Interview', v: 45, c: 'bg-rose-500' },
                      ].map((s) => (
                        <div key={s.l}>
                          <div className="mb-1 flex justify-between text-xs font-medium text-ink-600">
                            <span>{s.l}</span>
                            <span>{s.v}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
                            <div className={`h-full rounded-full ${s.c} animate-bar`} style={{ width: `${s.v}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Everything in one place</p>
          <h2 className="mt-3 text-3xl font-bold text-ink-900 sm:text-4xl">The placement journey, unified.</h2>
          <p className="mt-4 text-ink-600">
            Students currently juggle disconnected platforms for aptitude, coding, technical learning, communication and interviews. CareerOS brings the entire journey into one intelligent system.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card-hover group p-6 animate-fadeUp" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-lg`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink-900">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-ink-100 bg-ink-50/60">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">How it works</p>
            <h2 className="mt-3 text-3xl font-bold text-ink-900 sm:text-4xl">Assess → Understand → Recommend → Practice → Evaluate → Improve</h2>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className="card relative p-6 animate-fadeUp" style={{ animationDelay: `${i * 70}ms` }}>
                <span className="text-xs font-bold text-brand-500">{s.n}</span>
                <h3 className="mt-2 text-lg font-semibold text-ink-900">{s.label}</h3>
                <p className="mt-1 text-sm text-ink-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / CTA */}
      <section id="stats" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="card relative overflow-hidden p-10 sm:p-14">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" aria-hidden />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent-200/40 blur-3xl" aria-hidden />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-ink-900 sm:text-4xl">Ready to find out where you stand?</h2>
              <p className="mt-4 text-ink-600">
                Take the 3-minute assessment and get your Placement Readiness Score, a personalized roadmap and an AI mock interview — all in one place.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/assessment" className="btn-primary">Start Career Assessment</Link>
                <Link to="/dashboard" className="btn-secondary">Explore Dashboard</Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { v: '6', l: 'Core stages' },
                { v: '5', l: 'Skill dimensions' },
                { v: '1', l: 'Clear next step' },
              ].map((s) => (
                <div key={s.l} className="card p-5 text-center">
                  <div className="text-3xl font-bold text-brand-600">{s.v}</div>
                  <div className="mt-1 text-xs font-medium text-ink-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
          <Logo />
          <p className="text-xs text-ink-400">Built for the placement journey. Hackathon MVP.</p>
        </div>
      </footer>
    </div>
  )
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-glow">
        <Brain className="h-5 w-5" />
      </span>
      <span className="text-lg font-bold tracking-tight text-ink-900">CareerOS</span>
    </Link>
  )
}
