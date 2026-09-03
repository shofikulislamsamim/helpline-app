import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Radio, Power } from 'lucide-react';

interface StatusToggleProps {
  compact?: boolean;
}

export const StatusToggle: React.FC<StatusToggleProps> = ({ compact = false }) => {
  const { userProfile, toggleOnlineStatus } = useAuth();
  const isOnline = userProfile.isOnline;

  if (compact) {
    return (
      <button
        id="btn-compact-status-toggle"
        onClick={toggleOnlineStatus}
        title={isOnline ? 'আমি এখন কাজের জন্য Available' : 'আমি এখন কাজের জন্য Available নই'}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
          isOnline
            ? 'bg-green-50 text-green-700 border-green-200 shadow-xs hover:bg-green-100'
            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-400'
          }`}
        />
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isOnline ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {isOnline ? <Radio className="w-5 h-5 animate-pulse" /> : <Power className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm sm:text-base">
                কাজের প্রাপ্যতা (Availability Status):
              </span>
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                  isOnline
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {isOnline ? '● Online (অ্যাক্টিভ)' : 'Offline'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium mt-1 text-slate-600">
              {isOnline
                ? '“আমি এখন কাজের জন্য Available”'
                : '“আমি এখন কাজের জন্য Available নই”'}
            </p>
          </div>
        </div>

        <button
          id="btn-main-status-toggle"
          onClick={toggleOnlineStatus}
          className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all shrink-0 cursor-pointer shadow-xs ${
            isOnline
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isOnline ? 'Offline মোডে যান' : 'Online হন'}
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-2.5 border-t border-slate-100 pt-2">
        * GPS ও লোকেশন ট্র্যাকিং এর ভিত্তি প্রস্তুত রয়েছে। পরবর্তী ধাপে লাইভ ওয়ার্কার সার্চ চালু হবে।
      </p>
    </div>
  );
};
