import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, User, Target, SlidersHorizontal, Sparkles, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { AssessmentData, Profile, CareerGoal, Skills } from '../lib/types'
import { Logo } from './Landing'

const STEPS = ['Profile', 'Career Goal', 'Skills', 'Analysis'] as const
const TARGET_ROLES = ['Software Engineer', 'Embedded Engineer', 'Electronics Engineer', 'Data Analyst']
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year']
const TIMELINES = ['3 months', '6 months', '9 months', '1 year']

const SKILL_FIELDS: { key: keyof Omit<Skills, 'hoursPerDay'>; label: string; desc: string }[] = [
  { key: 'coding', label: 'Coding', desc: 'DSA, problem solving, languages' },
  { key: 'aptitude', label: 'Aptitude', desc: 'Quant, logical, reasoning' },
  { key: 'technical', label: 'Technical Knowledge', desc: 'Core CS / ECE subjects' },
  { key: 'communication', label: 'Communication', desc: 'Verbal, written fluency' },
  { key: 'interview', label: 'Interview Skills', desc: 'Confidence, structure' },
]

export default function Assessment() {
  const { submitAssessment } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<Profile>({ name: '', college: '', branch: '', year: '', cgpa: '' })
  const [goal, setGoal] = useState<CareerGoal>({ targetRole: '', targetCompany: '', timeline: '' })
  const [skills, setSkills] = useState<Skills>({
    coding: 5,
    aptitude: 5,
    technical: 5,
    communication: 5,
    interview: 5,
    hoursPerDay: 3,
  })

  const canNext = () => {
    if (step === 0) return profile.name && profile.college && profile.branch && profile.year && profile.cgpa
    if (step === 1) return goal.targetRole && goal.targetCompany && goal.timeline
    return true
  }

  const next = () => {
    if (step < 2) setStep((s) => s + 1)
    else handleAnalyze()
  }

  const handleAnalyze = () => {
    const data: AssessmentData = { profile, goal, skills }
    submitAssessment(data)
    navigate('/assessment-result')
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <Logo />
          <button onClick={() => navigate('/')} className="btn-ghost text-sm">
            <ArrowLeft className="h-4 w-4" /> Back home
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                      i < step
                        ? 'bg-brand-600 text-white'
                        : i === step
                          ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                          : 'bg-ink-100 text-ink-400'
                    }`}
                  >
                    {i < step ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${i <= step ? 'text-ink-800' : 'text-ink-400'}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`mx-2 h-0.5 flex-1 rounded-full transition-all duration-500 ${i < step ? 'bg-brand-500' : 'bg-ink-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 sm:p-8 animate-fadeUp" key={step}>
          {step === 0 && <StepProfile profile={profile} setProfile={setProfile} />}
          {step === 1 && <StepGoal goal={goal} setGoal={setGoal} />}
          {step === 2 && <StepSkills skills={skills} setSkills={setSkills} />}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="btn-ghost disabled:opacity-0"
            disabled={step === 0}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button onClick={next} disabled={!canNext()} className="btn-primary">
            {step === 2 ? (
              <>
                <Sparkles className="h-4 w-4" /> Analyze My Career
              </>
            ) : (
              <>
                Continue <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  )
}

function StepHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="mb-7 flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-ink-900">{title}</h2>
        <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>
      </div>
    </div>
  )
}

function StepProfile({ profile, setProfile }: { profile: Profile; setProfile: (p: Profile) => void }) {
  return (
    <div>
      <StepHeader icon={User} title="Tell us about you" subtitle="Step 1 — Your student profile" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" className="sm:col-span-2">
          <input className="input" placeholder="e.g. Aarav Sharma" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        </Field>
        <Field label="College" className="sm:col-span-2">
          <input className="input" placeholder="e.g. Vellore Institute of Technology" value={profile.college} onChange={(e) => setProfile({ ...profile, college: e.target.value })} />
        </Field>
        <Field label="Branch">
          <input className="input" placeholder="e.g. Electronics & Communication" value={profile.branch} onChange={(e) => setProfile({ ...profile, branch: e.target.value })} />
        </Field>
        <Field label="Year">
          <Select value={profile.year} onChange={(v) => setProfile({ ...profile, year: v })} options={YEARS} placeholder="Select year" />
        </Field>
        <Field label="CGPA">
          <input className="input" placeholder="e.g. 8.4" inputMode="decimal" value={profile.cgpa} onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })} />
        </Field>
      </div>
    </div>
  )
}

function StepGoal({ goal, setGoal }: { goal: CareerGoal; setGoal: (g: CareerGoal) => void }) {
  return (
    <div>
      <StepHeader icon={Target} title="Your career goal" subtitle="Step 2 — What are you aiming for?" />
      <div className="space-y-6">
        <div>
          <label className="label">Target Role</label>
          <div className="grid gap-3 sm:grid-cols-2">
            {TARGET_ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setGoal({ ...goal, targetRole: r })}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                  goal.targetRole === r
                    ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-200'
                    : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300'
                }`}
              >
                {r}
                {goal.targetRole === r && <Check className="h-4 w-4 text-brand-600" />}
              </button>
            ))}
          </div>
        </div>
        <Field label="Target Company">
          <input className="input" placeholder="e.g. Zoho, TCS, Texas Instruments" value={goal.targetCompany} onChange={(e) => setGoal({ ...goal, targetCompany: e.target.value })} />
        </Field>
        <div>
          <label className="label">Placement Timeline</label>
          <div className="flex flex-wrap gap-3">
            {TIMELINES.map((t) => (
              <button
                key={t}
                onClick={() => setGoal({ ...goal, timeline: t })}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  goal.timeline === t ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StepSkills({ skills, setSkills }: { skills: Skills; setSkills: (s: Skills) => void }) {
  return (
    <div>
      <StepHeader icon={SlidersHorizontal} title="Rate your skills" subtitle="Step 3 — Be honest. This powers your roadmap." />
      <div className="space-y-5">
        {SKILL_FIELDS.map((f) => (
          <SkillSlider
            key={f.key}
            label={f.label}
            desc={f.desc}
            value={skills[f.key]}
            onChange={(v) => setSkills({ ...skills, [f.key]: v })}
          />
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-gradient-to-br from-brand-50 to-accent-50 p-5 ring-1 ring-brand-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-900">Hours you can prepare per day</p>
            <p className="text-xs text-ink-500">Used to size your daily mission.</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-brand-600">{skills.hoursPerDay}</span>
            <span className="ml-1 text-sm font-medium text-ink-500">hrs</span>
          </div>
        </div>
        <input
          type="range"
          min={1}
          max={8}
          value={skills.hoursPerDay}
          onChange={(e) => setSkills({ ...skills, hoursPerDay: Number(e.target.value) })}
          className="mt-4 w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-400">
          <span>1 hr</span>
          <span>8 hrs</span>
        </div>
      </div>
    </div>
  )
}

function SkillSlider({ label, desc, value, onChange }: { label: string; desc: string; value: number; onChange: (v: number) => void }) {
  const color = value <= 3 ? 'text-rose-600' : value <= 6 ? 'text-amber-600' : 'text-accent-600'
  return (
    <div className="rounded-xl border border-ink-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink-900">{label}</p>
          <p className="text-xs text-ink-400">{desc}</p>
        </div>
        <div className={`text-2xl font-bold ${color}`}>{value}<span className="text-sm text-ink-300">/10</span></div>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-brand-600"
      />
      <div className="mt-1 flex justify-between text-[10px] font-medium text-ink-300">
        <span>Beginner</span>
        <span>Intermediate</span>
        <span>Expert</span>
      </div>
    </div>
  )
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <select className="input appearance-none" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  )
}
