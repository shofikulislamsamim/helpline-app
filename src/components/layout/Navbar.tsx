import React from 'react';
import { PhoneCall, ShieldCheck, MapPin, UserCheck, ShieldAlert, LogIn, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import { StatusToggle } from '../common/StatusToggle';
import { NotificationDropdown } from './NotificationDropdown';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { currentUser, userProfile, isAdmin, setIsAdmin, openAuthModal, logout } = useAuth();
  const { settings } = useAppSettings();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top emergency hotline bar */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="truncate">
              HelpLine অল-ইন-ওয়ান লোকাল মার্কেটপ্লেস (বাংলাদেশ)
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-slate-300">
            <a
              href={`tel:${settings.hotlineNumber.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
            >
              <PhoneCall className="w-3 h-3" />
              <span>হটলাইন: {settings.hotlineNumber}</span>
            </a>
            <button
              onClick={() => onNavigate('policies')}
              className="hover:text-white transition hidden sm:inline"
            >
              নিরাপত্তা নীতি
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            id="nav-brand-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-xs group-hover:bg-blue-700 transition">
              H
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                  HelpLine <span className="text-blue-600 font-normal">হেল্পলাইন</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  BD
                </span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold hidden sm:block">
                Core Platform Foundation
              </p>
            </div>
          </button>

          {/* Location badge */}
          <button
            id="nav-location-selector"
            onClick={() => onNavigate('profile')}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition cursor-pointer"
            title="বর্তমান ঠিকানা পরিবর্তন করতে প্রোফাইলে যান"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span className="truncate max-w-[140px]">{userProfile.presentAddress?.division || 'ঢাকা'} ({userProfile.presentAddress?.district || 'ঢাকা'})</span>
          </button>
        </div>

        {/* Center Search Bar (Header integration for high density screens) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              onClick={() => onNavigate('search')}
              readOnly
              placeholder="সার্চ করুন (Search HelpLine...)"
              className="w-full bg-slate-100 hover:bg-slate-200/70 border-none rounded-full py-1.5 pl-9 pr-4 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition"
            />
          </div>
        </div>

        {/* Right controls: Online/Offline indicator, Admin button, User profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Online/Offline Quick Status Indicator */}
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
              {userProfile.fullName || 'মোঃ আব্দুর রহমান'}
            </p>
            <p className={`text-[11px] font-bold ${userProfile.isOnline ? 'text-green-600' : 'text-slate-400'}`}>
              ● {userProfile.isOnline ? 'Online (অ্যাক্টিভ)' : 'Offline'}
            </p>
          </div>

          <StatusToggle compact />

          {/* Admin Switcher / Badge */}
          <button
            id="btn-nav-admin"
            onClick={() => {
              if (!isAdmin) setIsAdmin(true);
              onNavigate('admin');
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              currentView === 'admin'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
            title="Admin Dashboard"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Notification Dropdown */}
          <NotificationDropdown onNavigate={onNavigate} />

          {/* User profile / Login */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                id="btn-nav-profile"
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-blue-500 transition cursor-pointer"
                title="প্রোফাইল দেখুন"
              >
                {userProfile.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.fullName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-300"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs">
                    {userProfile.fullName ? userProfile.fullName.charAt(0) : '👤'}
                  </div>
                )}
              </button>
              <button
                onClick={logout}
                title="লগআউট"
                className="p-1.5 text-slate-400 hover:text-slate-700 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="btn-nav-login"
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন</span>
              </button>
              <button
                id="btn-nav-register"
                onClick={() => openAuthModal('register')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <span>নিবন্ধন</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
