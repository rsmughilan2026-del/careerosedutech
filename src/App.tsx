import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Landing from './pages/Landing'
import Assessment from './pages/Assessment'
import AssessmentResult from './pages/AssessmentResult'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import Practice from './pages/Practice'
import Interview from './pages/Interview'
import Progress from './pages/Progress'
import Profile from './pages/Profile'
import type { ReactNode } from 'react'

function RequireAssessment({ children }: { children: ReactNode }) {
  const { state } = useApp()
  if (!state.hasAssessment || !state.assessment) {
    return <Navigate to="/assessment" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/assessment-result" element={<AssessmentResult />} />
        <Route
          element={
            <RequireAssessment>
              <DashboardLayout />
            </RequireAssessment>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  )
}
