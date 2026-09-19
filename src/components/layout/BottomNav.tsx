import React from 'react';
import { Home, Search, MessageSquare, Clock, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'search', label: t.nav.search, icon: Search },
    { id: 'messages', label: t.nav.messages, icon: MessageSquare },
    { id: 'activity', label: t.nav.activity, icon: Clock },
    { id: 'profile', label: t.nav.profile, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-bottom-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-16 py-1 cursor-pointer transition-colors ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700 font-medium'
              }`}
            >
              <div
                className={`p-0.5 rounded-full transition-transform ${
                  isActive ? 'scale-105 text-blue-600' : 'text-slate-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] leading-tight tracking-tight mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
