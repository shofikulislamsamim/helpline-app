import React from 'react';
import { CheckCircle, AlertTriangle, ChevronRight, Sparkles } from 'lucide-react';
import { calculateProfileCompletion } from '../../lib/profileHelpers';
import { UserProfile } from '../../types';

interface ProfileCompletionBannerProps {
  profile: UserProfile;
  onOpenSetup: () => void;
}

export const ProfileCompletionBanner: React.FC<ProfileCompletionBannerProps> = ({
  profile,
  onOpenSetup,
}) => {
  const { percentage, missingItems, isComplete } = calculateProfileCompletion(profile);

  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 shadow-xs border border-blue-800 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-700/60 rounded-lg text-blue-200">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm sm:text-base text-white">
              প্রোফাইল সম্পূর্ণতা: <span className="text-emerald-400 font-extrabold">{percentage}% সম্পন্ন</span>
            </h3>
          </div>

          <p className="text-xs text-blue-200 max-w-xl">
            {isComplete
              ? 'আপনার প্রোফাইল প্রায় সম্পূর্ণ! সম্পূর্ণ প্রোফাইল ক্রেতা ও নিয়োগকারীদের কাছে বেশি প্রাধান্য পায়।'
              : 'একটি সম্পূর্ণ প্রোফাইল আপনাকে দ্রুত কাজ পেতে ও অন্যান্য সেবাগ্রহীতাদের আস্থা অর্জনে সহায়তা করে।'}
          </p>

          {/* Progress Bar */}
          <div className="w-full max-w-md bg-blue-950/70 h-2.5 rounded-full overflow-hidden border border-blue-700/50 mt-2">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                percentage >= 80 ? 'bg-emerald-400' : percentage >= 50 ? 'bg-amber-400' : 'bg-blue-400'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <button
          onClick={onOpenSetup}
          className="shrink-0 px-4 py-2.5 bg-white hover:bg-blue-50 text-blue-900 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
        >
          <span>{isComplete ? 'প্রোফাইল আপডেট করুন' : 'বাকি তথ্য পূরণ করুন'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Missing items pill checklist if any */}
      {missingItems.length > 0 && (
        <div className="mt-4 pt-3 border-t border-blue-800/80">
          <p className="text-[11px] font-semibold text-blue-300 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>যেসব তথ্য বাকি আছে:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {missingItems.slice(0, 4).map((item) => (
              <span
                key={item.id}
                onClick={onOpenSetup}
                className="px-2.5 py-1 bg-blue-800/60 hover:bg-blue-800 text-blue-100 rounded-lg text-[11px] font-medium border border-blue-700/60 cursor-pointer transition flex items-center gap-1"
              >
                <span>+</span>
                <span>{item.labelBn}</span>
              </span>
            ))}
            {missingItems.length > 4 && (
              <span className="text-[11px] text-blue-300 self-center">
                + আরও {missingItems.length - 4}টি বাকি
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
