import React, { useState } from 'react';
import { Search, MapPin, PhoneCall, ShieldAlert, ChevronRight, CheckCircle2, AlertTriangle, ArrowRight, HardHat } from 'lucide-react';
import { ServiceCards } from '../components/home/ServiceCards';
import { StatusToggle } from '../components/common/StatusToggle';
import { ModuleId } from '../types';
import { useAuth } from '../context/AuthContext';
import { useAppSettings } from '../context/AppSettingsContext';
import { useHire } from '../context/HireContext';
import { i18n } from '../lib/i18n';

interface HomePageProps {
  onSelectModule: (moduleId: ModuleId) => void;
  onNavigate: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectModule, onNavigate }) => {
  const { userProfile } = useAuth();
  const { settings } = useAppSettings();
  const { hireRequests } = useHire();
  const [searchQuery, setSearchQuery] = useState('');

  // Count new hire requests relevant to the worker/demo worker
  const newRequestsCount = hireRequests.filter(
    (r) =>
      (r.workerId === userProfile.userId || r.workerId === 'worker-01-shafiq') &&
      (r.status === 'REQUESTED' || r.status === 'QUOTED')
  ).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('search');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Search & Location Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              বর্তমান লোকেশন: <span className="text-slate-900 font-bold">{userProfile.presentAddress?.division || 'ঢাকা'}, {userProfile.presentAddress?.district || 'ঢাকা'} ({userProfile.presentAddress?.upazila || 'বাংলাদেশ'})</span>
            </span>
          </div>
          <button
            id="btn-home-change-location"
            onClick={() => onNavigate('profile')}
            className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>ঠিকানা পরিবর্তন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Global Search Input */}
        <form onSubmit={handleSearchSubmit} className="mt-3 relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              id="input-global-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={i18n.home.searchPlaceholder}
              className="w-full pl-11 pr-24 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            <button
              type="submit"
              id="btn-search-submit"
              className="absolute right-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Hero Question Prompt Section */}
      <div className="text-center py-4 sm:py-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>HelpLine বাংলাদেশ • অল-ইন-ওয়ান প্ল্যাটফর্ম</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight mb-2">
          {i18n.home.questionPrompt}
        </h2>

        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          আপনার পছন্দের সার্ভিসটি বেছে নিন এবং এগিয়ে যান
        </p>
      </div>

      {/* User Availability Status Quick Card */}
      <StatusToggle />

      {/* Worker New Requests Shortcut (Requirement 4) */}
      {newRequestsCount > 0 && (
        <div 
          id="home-new-work-requests-shortcut"
          className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-600/40 shadow-md"
        >
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-xl bg-blue-600/90 flex items-center justify-center text-white shrink-0 relative shadow-xs">
              <HardHat className="w-6 h-6 text-yellow-400" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 border-2 border-slate-900 rounded-full text-[11px] font-black flex items-center justify-center animate-pulse">
                {newRequestsCount}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  📥 নতুন কাজের অনুরোধ ({newRequestsCount})
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-red-500/90 text-white text-[10px] font-black uppercase tracking-wider">
                  New
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                কাস্টমার আপনার কাজের জন্য অনুরোধ পাঠিয়েছেন। এখনই ইনবক্সে চেক করে কোটেশন দিন।
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-home-view-work-inbox"
            onClick={() => onNavigate('work_inbox')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs shrink-0"
          >
            <span>ইনবক্স খুলুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 6 Primary Service Cards Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">প্রধান সেবাসমূহ</h2>
            <p className="text-xs text-slate-500">আপনার প্রয়োজনীয় সার্ভিসটি বেছে নিন</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full">
            ৬টি মডিউল
          </span>
        </div>

        <ServiceCards onSelectModule={onSelectModule} />
      </section>

      {/* Quick Stats Footer (High Density) */}
      <div className="bg-blue-50 rounded-2xl p-4 sm:p-5 flex items-center justify-around border border-blue-100 text-center shadow-xs">
        <div>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Wallet Balance</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-0.5">৳০.০০</p>
        </div>
        <div className="h-9 w-px bg-blue-200"></div>
        <div>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Active Orders</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-0.5">০</p>
        </div>
        <div className="h-9 w-px bg-blue-200"></div>
        <div>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">HelpLine Status</p>
          <p className="text-xs sm:text-sm font-bold text-green-700 bg-green-100 border border-green-200 px-3 py-1 rounded-full mt-1 inline-flex items-center gap-1">
            <span>VERIFIED</span>
            <span>✅</span>
          </p>
        </div>
      </div>

      {/* Core Platform Disclaimer & Safety Notice */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">{i18n.home.safetyTitle}</h3>
            <span className="text-[11px] px-2 py-0.5 rounded bg-amber-200/70 text-amber-900 font-semibold">
              প্ল্যাটফর্ম নির্দেশিকা
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {i18n.home.safetyDisclaimer}
          </p>
          <div className="pt-1">
            <button
              onClick={() => onNavigate('policies')}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>সকল নীতিমালা ও নিরাপত্তা শর্ত পড়ুন</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Hotline Support Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              যেকোনো প্রয়োজনে HelpLine কল সেন্টার
            </h4>
            <p className="text-xs text-slate-500">
              সকাল ৮টা থেকে রাত ১১টা পর্যন্ত সরাসরি কাস্টমার সাপোর্ট
            </p>
          </div>
        </div>

        <a
          id="btn-home-call-hotline"
          href={`tel:${settings.hotlineNumber.replace(/[^0-9+]/g, '')}`}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-xs"
        >
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          <span>Call: {settings.hotlineNumber}</span>
        </a>
      </div>
    </div>
  );
};
