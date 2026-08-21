import { Code, Calculator, Cpu, Mic, Users, ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PRACTICE = [
  {
    id: 'coding',
    icon: Code,
    title: 'Coding Practice',
    desc: 'Sharpen DSA with arrays, strings, hashing and two-pointer problems.',
    topics: ['Arrays & Two Pointers', 'Strings & Hashing', 'Binary Search', 'Linked Lists'],
    color: 'from-brand-500 to-brand-700',
    link: 'https://leetcode.com/problemset?difficulty=EASY',
  },
  {
    id: 'aptitude',
    icon: Calculator,
    title: 'Aptitude Practice',
    desc: 'Quant, logical reasoning and data interpretation drills.',
    topics: ['Quantitative', 'Logical Reasoning', 'Number Series', 'Time & Distance'],
    color: 'from-accent-500 to-accent-700',
    link: 'https://www.indiabix.com/',
  },
  {
    id: 'technical',
    icon: Cpu,
    title: 'Technical Core',
    desc: 'OOP, DBMS, OS and networking fundamentals for technical rounds.',
    topics: ['OOP Concepts', 'DBMS', 'Operating Systems', 'Computer Networks'],
    color: 'from-violet-500 to-purple-700',
    link: 'https://www.geeksforgeeks.org/',
  },
  {
    id: 'communication',
    icon: Mic,
    title: 'Communication',
    desc: 'Verbal fluency, resume storytelling and structured answers.',
    topics: ['Resume Storytelling', 'Verbal Fluency', 'Email Writing', 'Group Discussion'],
    color: 'from-amber-500 to-orange-600',
    link: '/interview',
  },
  {
    id: 'hr',
    icon: Users,
    title: 'HR Round',
    desc: 'Self-introduction, strengths, weaknesses and behavioural stories.',
    topics: ['Tell me about yourself', 'Strengths & Weaknesses', 'STAR Stories', 'Why this company'],
    color: 'from-rose-500 to-red-600',
    link: '/interview',
  },
]

export default function Practice() {
  const navigate = useNavigate()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Practice</h1>
        <p className="text-sm text-ink-500">Focused practice zones for every placement dimension.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRACTICE.map((p, i) => (
          <div key={p.id} className="card-hover group flex flex-col p-6 animate-fadeUp" style={{ animationDelay: `${i * 70}ms` }}>
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${p.color} text-white shadow-lg`}>
              <p.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink-900">{p.title}</h3>
            <p className="mt-1.5 text-sm text-ink-600">{p.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.topics.map((t) => (
                <span key={t} className="chip bg-ink-100 text-ink-600">{t}</span>
              ))}
            </div>
            <button
              onClick={() => {
                if (p.link.startsWith('/')) navigate(p.link)
                else window.open(p.link, '_blank', 'noopener')
              }}
              className="btn-secondary mt-5 w-full text-sm"
            >
              Start practice <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ))}

        {/* AI mock card */}
        <div className="card relative overflow-hidden p-6 animate-fadeUp" style={{ animationDelay: '350ms' }}>
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-brand-100/60 blur-3xl" aria-hidden />
          <div className="relative flex h-full flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink-900">AI Mock Interview</h3>
            <p className="mt-1.5 text-sm text-ink-600">Practice with instant AI-style feedback on communication, structure, relevance and confidence.</p>
            <button onClick={() => navigate('/interview')} className="btn-primary mt-5 w-full text-sm">
              Start mock interview <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
