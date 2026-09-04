import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppSettingsProvider } from './context/AppSettingsContext';
import { HireProvider, useHire } from './context/HireContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { AuthModal } from './components/auth/AuthModal';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { MessagesPage } from './pages/MessagesPage';
import { ActivityPage } from './pages/ActivityPage';
import { ProfilePage } from './pages/ProfilePage';
import { VerificationPage } from './pages/VerificationPage';
import { ModuleViewPage } from './pages/ModuleViewPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AdminPage } from './pages/AdminPage';
import { HirePage } from './pages/HirePage';
import { WorkInboxPage } from './pages/WorkInboxPage';
import { ModuleId } from './types';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeModule, setActiveModule] = useState<ModuleId>('hire');
  const { userProfile, isAuthModalOpen, closeAuthModal } = useAuth();
  const { hireRequests } = useHire();

  const newRequestsCount = hireRequests.filter(
    (r) =>
      (r.workerId === userProfile.userId || r.workerId === 'worker-01-shafiq' || (!r.workerId && userProfile.capabilities?.includes('worker'))) &&
      (r.status === 'REQUESTED' || r.status === 'QUOTED')
  ).length;

  const handleSelectModule = (moduleId: ModuleId) => {
    setActiveModule(moduleId);
    setCurrentView(`module_${moduleId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated full-screen admin experience
  if (currentView === 'admin') {
    return <AdminPage onBackToApp={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Top Navbar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation for Desktop (High Density Theme) */}
        <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col shrink-0 border-r border-slate-800 select-none">
          <div className="p-5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-3">
              Main Modules
            </p>
            <nav className="space-y-1">
              <button
                id="sidebar-nav-home"
                onClick={() => handleNavigate('home')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${
                  currentView === 'home'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="text-base">🏠</span>
                <span>হোম (Home)</span>
              </button>
              <button
                id="sidebar-nav-hire"
                onClick={() => handleSelectModule('hire')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${
                  currentView === 'module_hire' || currentView === 'hire'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="text-base">🔧</span>
                <span>কাজের মানুষ (Hire)</span>
              </button>
              <button
                id="sidebar-nav-work"
                onClick={() => handleSelectModule('work')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${
                  currentView === 'module_work' || currentView === 'work_inbox'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">👷</span>
                  <span>Work / কাজ করতে চাই</span>
                </div>
                {newRequestsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse">
                    {newRequestsCount}
                  </span>
                )}
              </button>
              <button
                id="sidebar-nav-search"
                onClick={() => handleNavigate('search')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${
                  currentView === 'search'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="text-base">🔍</span>
                <span>সার্চ (Search)</span>
              </button>
              <button
                id="sidebar-nav-messages"
                onClick={() => handleNavigate('messages')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${
                  currentView === 'messages'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="text-base">💬</span>
                <span>মেসেজ (Messages)</span>
              </button>
              <button
                id="sidebar-nav-activity"
                onClick={() => handleNavigate('activity')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${
                  currentView === 'activity'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="text-base">📑</span>
                <span>হিস্টোরি (Activity)</span>
              </button>
              <button
                id="sidebar-nav-profile"
                onClick={() => handleNavigate('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="text-base">👤</span>
                <span>প্রোফাইল (Profile)</span>
              </button>
              <button
                id="sidebar-nav-verification"
                onClick={() => handleNavigate('verification')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${
                  currentView === 'verification'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="text-base">🛡️</span>
                <span>ভেরিফিকেশন কেন্দ্র</span>
              </button>
              <button
                id="sidebar-nav-policies"
                onClick={() => handleNavigate('policies')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${
                  currentView === 'policies'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="text-base">📜</span>
                <span>শর্তাবলী ও পলিসি</span>
              </button>
            </nav>
          </div>

          <div className="p-5 mt-auto border-t border-slate-800">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2.5">
              Admin Access
            </p>
            <button
              id="sidebar-nav-admin"
              onClick={() => handleNavigate('admin')}
              className="w-full flex items-center gap-2.5 px-3 py-2 border border-slate-700 rounded-lg hover:bg-slate-800 text-slate-300 text-xs font-medium cursor-pointer transition"
            >
              <span>⚙️</span>
              <span>এডমিন ড্যাশবোর্ড</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {currentView === 'home' && (
              <HomePage onSelectModule={handleSelectModule} onNavigate={handleNavigate} />
            )}

            {currentView.startsWith('module_') && (
              <ModuleViewPage
                moduleId={activeModule}
                onBack={() => setCurrentView('home')}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'hire' && (
              <HirePage onBack={() => setCurrentView('home')} onNavigate={handleNavigate} />
            )}
            {currentView === 'work_inbox' && (
              <WorkInboxPage onNavigate={handleNavigate} />
            )}

            {currentView === 'search' && <SearchPage onNavigate={handleNavigate} />}
            {currentView === 'messages' && <MessagesPage onNavigate={handleNavigate} />}
            {currentView === 'activity' && <ActivityPage onNavigate={handleNavigate} />}
            {currentView === 'profile' && <ProfilePage onNavigate={handleNavigate} />}
            {currentView === 'verification' && (
              <VerificationPage
                onBack={() => handleNavigate('profile')}
                onNavigate={handleNavigate}
              />
            )}
            {currentView === 'policies' && <PoliciesPage onBack={() => setCurrentView('home')} />}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 mt-auto">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">HelpLine BD</span>
                <span>— Core Platform Foundation</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleNavigate('policies')}
                  className="hover:text-blue-600 transition cursor-pointer"
                >
                  ব্যবহারের শর্তাবলী ও নিরাপত্তা নীতি
                </button>
                <span>•</span>
                <button
                  onClick={() => handleNavigate('admin')}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Admin Dashboard
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav currentView={currentView} onNavigate={handleNavigate} />

      {/* Global Auth Modal for Login & Registration */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppSettingsProvider>
        <HireProvider>
          <MainApp />
        </HireProvider>
      </AppSettingsProvider>
    </AuthProvider>
  );
}
