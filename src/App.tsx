import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getContext } from '@microsoft/power-apps/app'

// Page imports
import ScanPage from './app/scan/page'
import AuditHistoryPage from './app/audit-history/page'

function AppContent() {
  return (
    <div className="w-full h-full">
      <Routes>
        <Route path="/" element={<Navigate to="/app/scan" replace />} />
        <Route path="/app/scan" element={<ScanPage />} />
        <Route path="/app/audit-history" element={<AuditHistoryPage />} />
      </Routes>
    </div>
  )
}

function App() {
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/shadcn.jpg",
  })

  useEffect(() => {
    const loadUserContext = async () => {
      try {
        // Only try to load context in Power Apps environment
        if (window.location.host.includes('powerapps.com')) {
          const ctx = await getContext()

          // Get user's basic information
          const fullName = ctx.user.fullName
          const userEmail = ctx.user.userPrincipalName

          if (fullName && userEmail) {
            setUserData({
              name: fullName,
              email: userEmail,
              avatar: "/avatars/shadcn.jpg",
            })
          }
        }
      } catch (error) {
        console.error("Error loading user context:", error)
      }
    }

    loadUserContext()
  }, [])

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
