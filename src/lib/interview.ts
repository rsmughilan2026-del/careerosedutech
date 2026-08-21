import type { AssessmentData, SkillKey } from './types'

export type InterviewMode = 'hr' | 'technical' | 'communication'

export interface InterviewQuestion {
  id: string
  prompt: string
  hint: string
  topic: string
  roles?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

export interface DimensionDef {
  key: string
  label: string
  color: string
}

export interface ModeConfig {
  id: InterviewMode
  label: string
  short: string
  icon: 'user' | 'code' | 'mic'
  desc: string
  dimensions: DimensionDef[]
  readinessImpact: SkillKey[]
  questions: InterviewQuestion[]
}

export interface EvalResult {
  scores: Record<string, number>
  feedback: string
  overall: number
}

export interface SessionResult {
  mode: InterviewMode
  dimensionAverages: Record<string, number>
  overall: number
  answered: number
}

// ---------------------------------------------------------------------------
// Question banks
// ---------------------------------------------------------------------------

function hrQuestions(company: string, role: string): InterviewQuestion[] {
  const c = company || 'our company'
  const r = role || 'this role'
  return [
    { id: 'hr-1', prompt: 'Tell me about yourself.', hint: 'Present → past → why this role. Keep it under 90 seconds.', topic: 'self introduction' },
    { id: 'hr-2', prompt: `Why do you want to join ${c}?`, hint: `Reference ${c}'s mission, a product, and how your skills align.`, topic: 'company motivation' },
    { id: 'hr-3', prompt: `Why do you want to be a ${r}?`, hint: 'Connect your interests, skills and long-term direction to the role.', topic: 'role motivation' },
    { id: 'hr-4', prompt: 'What are your greatest strengths and one weakness?', hint: 'Pick strengths relevant to the role. Frame weakness with a growth plan.', topic: 'self awareness' },
    { id: 'hr-5', prompt: 'Where do you see yourself in five years?', hint: 'Show ambition aligned with the company’s growth, not a vague wishlist.', topic: 'career goals' },
    { id: 'hr-6', prompt: 'Describe a time you worked in a team. What was your role?', hint: 'Use STAR: Situation, Task, Action, Result. Highlight collaboration.', topic: 'teamwork' },
    { id: 'hr-7', prompt: 'Tell me about a conflict you had with a teammate and how you handled it.', hint: 'Show empathy, communication, and a constructive resolution.', topic: 'conflict' },
    { id: 'hr-8', prompt: 'Describe a situation where you showed leadership.', hint: 'Leadership = initiative, not title. Show the impact you created.', topic: 'leadership' },
    { id: 'hr-9', prompt: `Why should we hire you for the ${r} position?`, hint: 'Match 2–3 of your strengths to what the role needs.', topic: 'fit' },
    { id: 'hr-10', prompt: 'What are your career goals and how does this role fit them?', hint: 'Connect the role to a clear, realistic growth path.', topic: 'career goals' },
  ]
}

function technicalQuestions(role: string, weakest: string[]): InterviewQuestion[] {
  const base: InterviewQuestion[] = [
    { id: 't-1', prompt: 'Explain the difference between an array and a linked list. When would you use each?', hint: 'Mention memory layout, access time, insertion cost.', topic: 'data structures', difficulty: 'beginner' },
    { id: 't-2', prompt: 'What is object-oriented programming? Explain polymorphism with an example.', hint: 'Define encapsulation, inheritance, polymorphism. Give a concrete code example.', topic: 'oop', difficulty: 'intermediate' },
    { id: 't-3', prompt: 'What is normalization in DBMS? Why is it used?', hint: 'Mention 1NF, 2NF, 3NF and reducing redundancy.', topic: 'dbms', difficulty: 'intermediate' },
    { id: 't-4', prompt: 'Explain the difference between a process and a thread.', hint: 'Memory space, context switching, concurrency.', topic: 'operating systems', difficulty: 'intermediate' },
    { id: 't-5', prompt: 'What is the OSI model? Name its layers.', hint: '7 layers: Physical to Application. Give a one-line purpose for each.', topic: 'networks', difficulty: 'beginner' },
    { id: 't-6', prompt: 'How would you reverse a linked list? Walk through your approach.', hint: 'Iterative: prev, curr, next pointers. Mention time/space complexity.', topic: 'dsa', difficulty: 'intermediate' },
    { id: 't-7', prompt: 'Explain time complexity and Big-O notation with one example.', hint: 'Define growth rate. Use O(n), O(log n) examples.', topic: 'dsa', difficulty: 'beginner' },
    { id: 't-8', prompt: 'What is a deadlock? How can it be prevented?', hint: 'Four conditions (mutual exclusion, hold & wait, no preemption, circular wait). Prevention strategies.', topic: 'operating systems', difficulty: 'advanced' },
    { id: 't-9', prompt: 'Describe a coding problem you solved recently. Explain your approach.', hint: 'Problem → brute force → optimization. Mention the data structure you chose.', topic: 'problem solving', difficulty: 'intermediate' },
    { id: 't-10', prompt: 'What data structure would you use to implement an autocomplete feature and why?', hint: 'Trie. Explain prefix lookup and efficiency.', topic: 'data structures', difficulty: 'advanced' },
  ]

  const roleSpecific: InterviewQuestion[] = []
  if (role === 'Data Analyst') {
    roleSpecific.push(
      { id: 't-da-1', prompt: 'What is the difference between SQL JOIN types? Explain with an example.', hint: 'INNER, LEFT, RIGHT, FULL. Mention when each is used.', topic: 'sql', difficulty: 'intermediate' },
      { id: 't-da-2', prompt: 'Explain the difference between supervised and unsupervised learning.', hint: 'Labeled vs unlabeled data. Give algorithm examples.', topic: 'ml', difficulty: 'intermediate' },
    )
  } else if (role === 'Embedded Engineer' || role === 'Electronics Engineer') {
    roleSpecific.push(
      { id: 't-em-1', prompt: 'What is the difference between a microcontroller and a microprocessor?', hint: 'Memory, I/O, cost, use cases.', topic: 'embedded', difficulty: 'beginner' },
      { id: 't-em-2', prompt: 'Explain how an interrupt works in an embedded system.', hint: 'ISR, priority, context save/restore.', topic: 'embedded', difficulty: 'intermediate' },
    )
  }

  let pool = [...base, ...roleSpecific]

  // If coding/technical is weak, lean toward beginner/intermediate
  if (weakest.includes('coding') || weakest.includes('technical')) {
    pool = pool.sort((a, b) => {
      const order = { beginner: 0, intermediate: 1, advanced: 2 }
      return order[a.difficulty ?? 'intermediate'] - order[b.difficulty ?? 'intermediate']
    })
  }
  return pool
}

function communicationQuestions(branch: string, role: string): InterviewQuestion[] {
  const b = branch || 'your branch'
  const r = role || 'your role'
  return [
    { id: 'c-1', prompt: 'Introduce yourself in under 60 seconds.', hint: 'Be concise: who you are, what you study, one strength, one goal.', topic: 'self introduction' },
    { id: 'c-2', prompt: 'Explain your final-year project to a non-technical person.', hint: 'Avoid jargon. Use an analogy. Keep it under 4 sentences.', topic: 'explaining project' },
    { id: 'c-3', prompt: 'Explain a technical concept you know well, as simply as possible.', hint: 'Pick one concept. Use an everyday analogy.', topic: 'explaining concept' },
    { id: 'c-4', prompt: 'You missed a deadline. How do you communicate this to your manager?', hint: 'Own it early, give a reason, propose a new timeline.', topic: 'situational' },
    { id: 'c-5', prompt: 'Describe your college in three sentences.', hint: 'Be specific and concise. Show you can summarize.', topic: 'concise' },
    { id: 'c-6', prompt: `Pitch yourself for the ${r} role in one minute.`, hint: 'One strength, one proof, one reason you fit.', topic: 'pitch' },
    { id: 'c-7', prompt: `Explain why you chose ${b}.`, hint: 'Personal reason + how it connects to your career.', topic: 'motivation' },
    { id: 'c-8', prompt: 'Summarize your last group project in 30 seconds.', hint: 'Goal, your contribution, outcome. No rambling.', topic: 'concise' },
    { id: 'c-9', prompt: 'Tell me about a topic you presented recently and what the audience learned.', hint: 'Clear topic, one key takeaway, how you engaged the audience.', topic: 'presentation' },
    { id: 'c-10', prompt: 'Convince me to hire you in exactly two sentences.', hint: 'Every word counts. Make it memorable and specific.', topic: 'concise pitch' },
  ]
}

// ---------------------------------------------------------------------------
// Mode configs
// ---------------------------------------------------------------------------

export function buildModes(assessment: AssessmentData | null): Record<InterviewMode, ModeConfig> {
  const role = assessment?.goal.targetRole ?? ''
  const company = assessment?.goal.targetCompany ?? ''
  const branch = assessment?.goal ? assessment.profile.branch : ''
  const skills = assessment?.skills
  const weakest: string[] = skills
    ? (Object.entries(skills) as [string, number][])
        .filter(([k]) => k !== 'hoursPerDay')
        .sort((a, b) => a[1] - b[1])
        .slice(0, 2)
        .map(([k]) => k)
    : []

  return {
    hr: {
      id: 'hr',
      label: 'HR Interview',
      short: 'HR',
      icon: 'user',
      desc: 'General HR, motivation and behavioral round.',
      dimensions: [
        { key: 'communication', label: 'Communication', color: '#f59e0b' },
        { key: 'confidence', label: 'Confidence', color: '#10b981' },
        { key: 'relevance', label: 'Relevance', color: '#1f51f5' },
        { key: 'structure', label: 'Structure', color: '#8b5cf6' },
        { key: 'professionalism', label: 'Professionalism', color: '#ef4444' },
      ],
      readinessImpact: ['interview', 'communication'],
      questions: hrQuestions(company, role),
    },
    technical: {
      id: 'technical',
      label: 'Technical Mock',
      short: 'Technical',
      icon: 'code',
      desc: 'Role-focused DSA, core CS and problem solving.',
      dimensions: [
        { key: 'technicalCorrectness', label: 'Technical Correctness', color: '#1f51f5' },
        { key: 'problemSolving', label: 'Problem Solving', color: '#10b981' },
        { key: 'depth', label: 'Depth of Understanding', color: '#8b5cf6' },
        { key: 'approach', label: 'Approach / Logic', color: '#f59e0b' },
        { key: 'communication', label: 'Communication', color: '#ef4444' },
      ],
      readinessImpact: ['technical', 'coding'],
      questions: technicalQuestions(role, weakest),
    },
    communication: {
      id: 'communication',
      label: 'Communication Practice',
      short: 'Communication',
      icon: 'mic',
      desc: 'Clarity, structure, vocabulary and conciseness.',
      dimensions: [
        { key: 'clarity', label: 'Clarity', color: '#1f51f5' },
        { key: 'structure', label: 'Structure', color: '#10b981' },
        { key: 'vocabulary', label: 'Vocabulary', color: '#8b5cf6' },
        { key: 'conciseness', label: 'Conciseness', color: '#f59e0b' },
        { key: 'confidence', label: 'Confidence', color: '#ef4444' },
      ],
      readinessImpact: ['communication'],
      questions: communicationQuestions(branch, role),
    },
  }
}

export const QUESTIONS_PER_SESSION = 5

// Deterministic shuffle so re-rolls vary but are stable within a session
export function pickQuestions(pool: InterviewQuestion[], n: number, seed: number): InterviewQuestion[] {
  const arr = [...pool]
  let m = arr.length
  let s = seed
  while (m > 0 && arr.length - m < n) {
    s = (s * 9301 + 49297) % 233280
    const idx = Math.floor((s / 233280) * m)
    m--
    ;[arr[m], arr[idx]] = [arr[idx], arr[m]]
  }
  return arr.slice(arr.length - n).reverse()
}

// ---------------------------------------------------------------------------
// Text analysis (shared)
// ---------------------------------------------------------------------------

interface Analysis {
  wordCount: number
  sentenceCount: number
  avgSentenceLength: number
  hasStructure: boolean
  structureMarkers: string[]
  hasNumbers: boolean
  hasExamples: boolean
  relevantTerms: string[]
  relevantTermCount: number
  technicalTerms: string[]
  vocabularyScore: number
  fillerCount: number
  uniqueRatio: number
}

const STRUCTURE_WORDS = ['first', 'second', 'third', 'then', 'after that', 'finally', 'currently', 'previously', 'because', 'so', 'which', 'where', 'while', 'however', 'therefore', 'for example', 'for instance', 'in addition', 'as a result', 'situation', 'task', 'action', 'result']

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally', 'stuff', 'things', 'kind of', 'sort of']

function analyzeText(text: string, topicKeywords: string[]): Analysis {
  const t = text.trim()
  const words = t.split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const lower = t.toLowerCase()
  const sentences = t.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const sentenceCount = Math.max(1, sentences.length)
  const avgSentenceLength = wordCount / sentenceCount

  const structureMarkers = STRUCTURE_WORDS.filter((w) => lower.includes(w))
  const hasStructure = structureMarkers.length >= 2

  const hasNumbers = /\b(\d+|one|two|three|first|second)\b/i.test(t)
  const hasExamples = /\b(example|instance|such as|e\.g\.|like when|once i|during)\b/i.test(t)

  const relevantTerms = topicKeywords.filter((k) => lower.includes(k.toLowerCase()))
  const relevantTermCount = relevantTerms.length

  const TECH = ['project', 'internship', 'dsa', 'algorithm', 'coding', 'python', 'java', 'c++', 'c', 'react', 'node', 'database', 'sql', 'oop', 'object', 'class', 'inheritance', 'polymorphism', 'encapsulation', 'system', 'embedded', 'circuit', 'signal', 'arduino', 'iot', 'ml', 'data', 'array', 'linked list', 'tree', 'graph', 'complexity', 'big-o', 'normalization', 'process', 'thread', 'deadlock', 'osi', 'network', 'trie', 'pointer', 'recursion', 'stack', 'queue', 'hash', 'sort', 'search']
  const technicalTerms = TECH.filter((k) => lower.includes(k))

  const uniqueWords = new Set(words.map((w) => w.toLowerCase()))
  const uniqueRatio = wordCount ? uniqueWords.size / wordCount : 0
  const longWords = words.filter((w) => w.length >= 7).length
  const vocabularyScore = wordCount ? Math.min(1, (longWords / wordCount) * 4 + uniqueRatio * 0.5) : 0

  const fillerCount = FILLER_WORDS.filter((f) => lower.includes(f)).length

  return {
    wordCount,
    sentenceCount,
    avgSentenceLength,
    hasStructure,
    structureMarkers,
    hasNumbers,
    hasExamples,
    relevantTerms,
    relevantTermCount,
    technicalTerms,
    vocabularyScore,
    fillerCount,
    uniqueRatio,
  }
}

// Per-topic keyword sets used for relevance scoring
const TOPIC_KEYWORDS: Record<string, string[]> = {
  'self introduction': ['name', 'student', 'studying', 'college', 'passionate', 'interested', 'skills', 'experience'],
  'company motivation': ['company', 'mission', 'product', 'values', 'culture', 'innovation', 'impact', 'grow'],
  'role motivation': ['role', 'engineer', 'developer', 'analyst', 'build', 'solve', 'create', 'learn', 'impact'],
  'self awareness': ['strength', 'weakness', 'improve', 'learn', 'feedback', 'area', 'growth'],
  'career goals': ['goal', 'career', 'grow', 'lead', 'impact', 'learn', 'future', 'aim'],
  teamwork: ['team', 'collaborate', 'together', 'role', 'contribution', 'communicate', 'shared'],
  conflict: ['conflict', 'disagree', 'understand', 'listen', 'resolve', 'perspective', 'calm'],
  leadership: ['lead', 'initiative', 'motivate', 'decision', 'responsibility', 'guide', 'organize'],
  fit: ['skill', 'strength', 'role', 'value', 'contribute', 'fit', 'experience'],
  'data structures': ['array', 'linked list', 'memory', 'index', 'access', 'insert', 'pointer'],
  oop: ['class', 'object', 'inheritance', 'polymorphism', 'encapsulation', 'method', 'instance'],
  dbms: ['normalization', 'table', 'redundancy', 'relation', 'key', 'integrity', '1nf', '2nf'],
  'operating systems': ['process', 'thread', 'memory', 'scheduling', 'context', 'cpu', 'deadlock'],
  networks: ['osi', 'layer', 'physical', 'application', 'protocol', 'packet', 'transport'],
  dsa: ['complexity', 'pointer', 'iterate', 'recursive', 'traverse', 'node', 'time', 'space'],
  'problem solving': ['problem', 'approach', 'optimize', 'brute', 'efficient', 'solution', 'test'],
  sql: ['join', 'inner', 'left', 'right', 'query', 'table', 'key'],
  ml: ['supervised', 'unsupervised', 'labeled', 'data', 'algorithm', 'training', 'model'],
  embedded: ['microcontroller', 'microprocessor', 'interrupt', 'isr', 'gpio', 'register', 'firmware'],
  'explaining project': ['project', 'goal', 'built', 'used', 'result', 'team', 'learned'],
  'explaining concept': ['concept', 'means', 'simply', 'analogy', 'like', 'example', 'basically'],
  situational: ['manager', 'deadline', 'communicate', 'reason', 'plan', 'honest', 'update'],
  concise: ['short', 'specific', 'summarize', 'brief', 'clear'],
  pitch: ['strength', 'proof', 'fit', 'role', 'value', 'hire'],
  motivation: ['chose', 'because', 'interest', 'passion', 'connect', 'career'],
  presentation: ['presented', 'audience', 'topic', 'learned', 'explained', 'slides', 'key'],
  'concise pitch': ['hire', 'value', 'strength', 'fit', 'unique'],
}

function keywordsFor(topic: string): string[] {
  return TOPIC_KEYWORDS[topic] ?? [topic]
}

// ---------------------------------------------------------------------------
// Scoring primitives (0..1)
// ---------------------------------------------------------------------------

function lengthFactor(wordCount: number): number {
  if (wordCount < 5) return 0.05
  if (wordCount < 15) return 0.25
  if (wordCount < 30) return 0.5
  if (wordCount < 60) return 0.75
  if (wordCount < 120) return 1
  return 0.9 // too long is slightly penalized
}

function relevanceFactor(a: Analysis, topic: string): number {
  const kws = keywordsFor(topic)
  const max = Math.max(3, kws.length)
  return Math.min(1, a.relevantTermCount / Math.min(max, 4))
}

function structureFactor(a: Analysis): number {
  let s = 0
  if (a.hasStructure) s += 0.5
  if (a.sentenceCount >= 3) s += 0.3
  if (a.hasExamples) s += 0.2
  return Math.min(1, s)
}

function confidenceFactor(a: Analysis, hasRelevance: boolean): number {
  let s = 0.4
  if (a.wordCount >= 40) s += 0.25
  if (a.hasStructure) s += 0.15
  if (hasRelevance) s += 0.15
  if (a.fillerCount > 0) s -= 0.1 * a.fillerCount
  return Math.max(0.1, Math.min(1, s))
}

function vocabularyFactor(a: Analysis): number {
  return Math.min(1, 0.4 + a.vocabularyScore * 0.6 + a.uniqueRatio * 0.3)
}

function concisenessFactor(a: Analysis): number {
  // rewards clear, not-too-long answers with enough substance
  if (a.wordCount < 10) return 0.2
  if (a.wordCount > 150) return 0.6
  const sweet = 1 - Math.abs(a.wordCount - 45) / 90
  return Math.max(0.3, Math.min(1, sweet))
}

function technicalFactor(a: Analysis): number {
  let s = 0.25
  if (a.technicalTerms.length >= 1) s += 0.3
  if (a.technicalTerms.length >= 3) s += 0.2
  if (a.hasExamples) s += 0.15
  if (a.hasNumbers) s += 0.1
  return Math.min(1, s)
}

function professionalismFactor(a: Analysis, filler: number): number {
  let s = 0.6
  if (filler > 0) s -= 0.15 * filler
  if (a.wordCount >= 30) s += 0.2
  if (a.hasStructure) s += 0.15
  // crude slang/profanity penalty
  if (/\b(salary|money|cash|dude|bro|yeah|gonna|wanna|dunno)\b/i.test(a as unknown as string)) s -= 0.15
  return Math.max(0.2, Math.min(1, s))
}

const clamp = (n: number) => Math.max(20, Math.min(98, Math.round(n)))
const toScore = (f: number) => clamp(35 + f * 60)

// ---------------------------------------------------------------------------
// Per-mode evaluation
// ---------------------------------------------------------------------------

export function evaluateAnswer(
  answer: string,
  question: InterviewQuestion,
  mode: InterviewMode,
  context: { company?: string; role?: string } = {},
): EvalResult {
  const text = answer.trim()
  const a = analyzeText(text, keywordsFor(question.topic))
  const lf = lengthFactor(a.wordCount)
  const rf = relevanceFactor(a, question.topic)
  const sf = structureFactor(a)
  const cf = confidenceFactor(a, rf > 0)
  const vf = vocabularyFactor(a)
  const xf = concisenessFactor(a)
  const tf = technicalFactor(a)

  const scores: Record<string, number> = {}
  const issues: string[] = []
  const positives: string[] = []

  // Very short or irrelevant → strong penalty across the board
  const veryShort = a.wordCount < 8
  const irrelevant = rf === 0 && a.wordCount < 25

  if (mode === 'hr') {
    scores.communication = toScore(lf * 0.5 + vf * 0.3 + sf * 0.2)
    scores.confidence = toScore(cf)
    scores.relevance = toScore(rf * 0.7 + lf * 0.3)
    scores.structure = toScore(sf * 0.7 + (a.sentenceCount >= 3 ? 0.2 : 0) + lf * 0.1)
    scores.professionalism = toScore(professionalismFactor(a, a.fillerCount))
  } else if (mode === 'technical') {
    scores.technicalCorrectness = toScore(tf * 0.6 + rf * 0.3 + lf * 0.1)
    scores.problemSolving = toScore((tf * 0.4 + rf * 0.3 + (a.hasExamples ? 0.2 : 0) + lf * 0.1))
    scores.depth = toScore(a.technicalTerms.length >= 3 ? 0.6 : tf * 0.5 + lf * 0.3 + (a.hasNumbers ? 0.1 : 0))
    scores.approach = toScore(sf * 0.4 + tf * 0.3 + lf * 0.3)
    scores.communication = toScore(vf * 0.4 + sf * 0.3 + lf * 0.3)
  } else {
    scores.clarity = toScore(vf * 0.4 + lf * 0.3 + (a.avgSentenceLength <= 18 ? 0.3 : 0.1))
    scores.structure = toScore(sf * 0.7 + (a.sentenceCount >= 2 ? 0.2 : 0) + lf * 0.1)
    scores.vocabulary = toScore(vf)
    scores.conciseness = toScore(xf)
    scores.confidence = toScore(cf)
  }

  // Apply blanket penalties for very short / irrelevant answers
  if (veryShort) {
    Object.keys(scores).forEach((k) => {
      scores[k] = clamp(scores[k] - 25)
    })
  }
  if (irrelevant) {
    Object.keys(scores).forEach((k) => {
      scores[k] = clamp(scores[k] - 15)
    })
  }

  // Build feedback
  if (veryShort) {
    issues.push('the answer is far too short — an interviewer expects at least 3–4 sentences')
  } else if (a.wordCount < 25) {
    issues.push('add more substance — aim for 40–80 words so the answer has depth')
  }
  if (rf === 0) {
    issues.push(`it does not clearly address the topic ("${question.topic}") — include words and ideas related to the question`)
  } else if (rf < 0.4) {
    issues.push('the connection to the question is weak — make the relevance explicit')
  }
  if (!a.hasStructure && a.wordCount >= 15) {
    issues.push('there is no clear structure — use signposts like "first", "then", "finally" or the STAR framework')
  }
  if (a.fillerCount > 0) {
    issues.push(`remove filler words (${a.fillerCount} found) — they reduce polish`)
  }
  if (mode === 'technical' && a.technicalTerms.length === 0 && a.wordCount >= 15) {
    issues.push('no technical terms were used — name the specific concepts, data structures or trade-offs')
  }
  // Specific company/role connection check
  if (question.topic === 'company motivation' && context.company) {
    if (!text.toLowerCase().includes(context.company.toLowerCase())) {
      issues.push(`you never mentioned ${context.company} by name — reference something specific about the company`)
    }
  }
  if (question.topic === 'role motivation' && context.role) {
    if (!text.toLowerCase().includes(context.role.toLowerCase().split(' ')[0])) {
      issues.push(`connect your answer explicitly to the ${context.role} role`)
    }
  }
  if (/\b(salary|money|cash|pay|for getting)\b/i.test(text)) {
    issues.push('framing the answer around salary/money signals weak motivation — focus on contribution and growth')
  }

  if (a.wordCount >= 40) positives.push('good length')
  if (a.hasStructure) positives.push('clear structure')
  if (rf >= 0.5) positives.push('strong relevance to the question')
  if (mode === 'technical' && a.technicalTerms.length >= 3) positives.push('solid use of technical terminology')
  if (a.hasExamples) positives.push('good use of an example')

  const overall = Math.round(Object.values(scores).reduce((s, v) => s + v, 0) / Object.keys(scores).length)

  let feedback = ''
  if (overall >= 80) {
    feedback = 'Strong answer. '
  } else if (overall >= 65) {
    feedback = 'Decent answer with room to improve. '
  } else if (overall >= 45) {
    feedback = 'This answer needs work. '
  } else {
    feedback = 'This answer is too weak for a real interview. '
  }

  if (positives.length) feedback += `What works: ${positives.join(', ')}. `
  if (issues.length) feedback += `What to fix: ${issues.join('; ')}.`
  else feedback += 'No major issues — keep this quality.'

  return { scores, feedback, overall }
}

export function summarizeSession(results: EvalResult[], mode: InterviewMode): SessionResult {
  if (results.length === 0) {
    return { mode, dimensionAverages: {}, overall: 0, answered: 0 }
  }
  const dimSums: Record<string, number> = {}
  results.forEach((r) => {
    Object.entries(r.scores).forEach(([k, v]) => {
      dimSums[k] = (dimSums[k] ?? 0) + v
    })
  })
  const dimensionAverages: Record<string, number> = {}
  Object.keys(dimSums).forEach((k) => {
    dimensionAverages[k] = Math.round(dimSums[k] / results.length)
  })
  const overall = Math.round(Object.values(dimensionAverages).reduce((s, v) => s + v, 0) / Object.keys(dimensionAverages).length)
  return { mode, dimensionAverages, overall, answered: results.length }
}
