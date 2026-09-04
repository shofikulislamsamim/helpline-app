import React from 'react';
import { Star, Award, CheckCircle2, ShieldCheck, ThumbsUp, Clock, TrendingUp } from 'lucide-react';
import { UserProfile } from '../../types';

interface RatingReputationSectionProps {
  profile: UserProfile;
}

export const RatingReputationSection: React.FC<RatingReputationSectionProps> = ({ profile }) => {
  const rating = profile.rating || 5.0;
  const reviewCount = profile.reviewCount || 0;
  const completedJobs = profile.completedJobsCount || 0;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>১৫. রেটিং, খ্যাতি ও পারফরম্যান্স (Rating & Reputation)</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          গ্রাহকদের মূল্যায়িত রেটিং, সফলভাবে সম্পন্ন করা কাজের সংখ্যা এবং প্ল্যাটফর্ম সুনাম।
        </p>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* Rating Score Card */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200/80">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center text-amber-600 shrink-0">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            <span className="text-xs font-black text-slate-900 mt-0.5">{rating.toFixed(1)}</span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs font-bold text-slate-900">
              {rating >= 4.5 ? 'অসাধারণ (Excellent)' : rating >= 4.0 ? 'খুব ভালো (Very Good)' : 'সন্তোষজনক'}
            </div>
            <div className="text-[11px] text-slate-500">
              মোট {reviewCount}টি কাস্টমার রিভিউ
            </div>
          </div>
        </div>

        {/* Completed Jobs Stats */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200/80">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-0.5">
            <div className="text-xl font-black text-slate-900">
              {completedJobs}+
            </div>
            <div className="text-xs font-bold text-slate-900">
              সফলভাবে সম্পন্ন কাজ
            </div>
            <div className="text-[11px] text-slate-500">
              যোগদান: {profile.joinedDate || '২০২৪'} সাল থেকে
            </div>
          </div>
        </div>

        {/* Reliability Badges */}
        <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>সময়মতো সেবা প্রদান</span>
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              ৯৮%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-1.5">
              <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
              <span>রেসপন্স রেট (Response)</span>
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              ১০০%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>প্ল্যাটফর্ম আস্থা স্তর</span>
            </span>
            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              উচ্চ (High Trust)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
