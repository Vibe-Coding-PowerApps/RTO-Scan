
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { getContext } from '@microsoft/power-apps/app';
import { BottomNav } from './components/bottom-nav';

const HomePage = lazy(() => import('./app/home/page'));
const ScanQRPage = lazy(() => import('./app/scan/page'));
const HistoryPage = lazy(() => import('./app/history/page'));
const FloorMapPage = lazy(() => import('./app/floormap/page'));
const SchedulePage = lazy(() => import('./app/schedule/page'));

function App() {
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/shadcn.jpg",
  });

  useEffect(() => {
    const loadUserContext = async () => {
      try {
        if (window.location.host.includes('powerapps.com')) {
          const ctx = await getContext();
          const fullName = ctx.user.fullName;
          const userEmail = ctx.user.userPrincipalName;
          if (fullName && userEmail) {
            setUserData({
              name: fullName,
              email: userEmail,
              avatar: "/avatars/shadcn.jpg",
            });
          }
        }
      } catch (error) {
        console.error("Error loading user context:", error);
      }
    };
    loadUserContext();
  }, []);

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/scan" element={<ScanQRPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/floormap" element={<FloorMapPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
