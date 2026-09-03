import React, { useState } from 'react';
import { MapPin, Navigation, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LocationPermissionCard: React.FC = () => {
  const { userProfile, updateLiveLocation } = useAuth();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setMsg('আপনার ব্রাউজার বা ডিভাইসে জিপিএস লোকেশন সমর্থিত নয়।');
      return;
    }

    setLoading(true);
    setMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        await updateLiveLocation({ latitude, longitude, accuracy });
        setLoading(false);
        setMsg('আপনার লাইভ অবস্থান সফলভাবে আপডেট করা হয়েছে।');
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setMsg('লোকেশন পারমিশন প্রত্যাখ্যান করা হয়েছে। ব্রাউজার সেটিং থেকে অনুমতি দিন।');
        } else {
          setMsg('অবস্থান শনাক্ত করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const hasLocation = userProfile.currentLocation?.latitude && userProfile.currentLocation?.longitude;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Navigation className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">
              রিয়েল-টাইম লাইভ লোকেশন (Live GPS Location)
            </h4>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500">
            নিকটবর্তী গ্রাহক বা টেকনিশিয়ানদের সাথে দ্রুত সংযোগে সহায়তা করে।
          </p>
        </div>

        <button
          type="button"
          onClick={handleGetLocation}
          disabled={loading}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{loading ? 'শনাক্ত হচ্ছে...' : '📍 আমার বর্তমান অবস্থান ব্যবহার করুন'}</span>
        </button>
      </div>

      {msg && (
        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Location Status details */}
      <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${hasLocation ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          <span>
            {hasLocation ? (
              <span>
                অবস্থান সংরক্ষিত: <strong className="text-slate-800">{userProfile.currentLocation?.latitude?.toFixed(4)}, {userProfile.currentLocation?.longitude?.toFixed(4)}</strong>
              </span>
            ) : (
              <span>কোনো লাইভ অবস্থান এখনও সংরক্ষিত হয়নি</span>
            )}
          </span>
        </div>

        <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
          বর্তমান ঠিকানা ও লাইভ অবস্থান সম্পূর্ণ পৃথক
        </span>
      </div>

      {/* Privacy Notice */}
      <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong>গোপনীয়তা সুরক্ষা:</strong> আপনি অফলাইনে থাকলে বা অনুমতি না দিলে কোনো সাধারণ ব্যবহারকারীকে আপনার অবস্থান প্রকাশ করা হয় না।
        </p>
      </div>
    </div>
  );
};
