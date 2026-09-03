import React from 'react';
import { 
  CheckCircle2, 
  Star, 
  MapPin, 
  Briefcase, 
  Clock, 
  ShieldCheck, 
  PhoneCall, 
  Eye, 
  Send,
  Navigation
} from 'lucide-react';
import { UserProfile } from '../../types';
import { getWorkerDistanceResult, CustomerLocationQuery } from '../../lib/geoDistance';

interface WorkerCardProps {
  worker: UserProfile;
  customerLocation?: CustomerLocationQuery;
  onViewProfile: (worker: UserProfile) => void;
  onHireRequest: (worker: UserProfile) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  customerLocation,
  onViewProfile,
  onHireRequest,
}) => {
  const isOnline = worker.isOnline;
  const isVerified = worker.verificationStatus === 'verified' || worker.verificationStatus === 'approved';
  const mainProf = worker.mainProfession || worker.professions?.[0] || 'দক্ষ কারিগর';
  const experienceYears = worker.experiences?.[0]?.years || 3;
  const topSkills = (worker.skills || []).slice(0, 3);
  const rating = worker.rating || 5.0;
  const reviewCount = worker.reviewCount || 0;
  const completedJobs = worker.completedJobsCount || 0;

  // Calculate real distance & matching hierarchy
  const distanceResult = getWorkerDistanceResult(worker, customerLocation);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Info: Avatar, Verification, Online status */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <img
              src={
                worker.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  worker.fullName
                )}&background=0284c7&color=fff`
              }
              alt={worker.fullName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white shadow-xs"
            />
            {/* Online Indicator */}
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
              title={isOnline ? '🟢 Available Now' : '🔴 Currently Offline'}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate group-hover:text-blue-600 transition">
                {worker.fullName}
              </h3>
              {isVerified && (
                <span
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold shrink-0"
                  title="এনআইডি ও পরিচয়পত্র যাচাইকৃত"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>যাচাইকৃত</span>
                </span>
              )}
            </div>

            {/* Profession */}
            <p className="text-xs font-semibold text-blue-700 mt-0.5 truncate flex items-center gap-1">
              <Briefcase className="w-3 h-3 shrink-0" />
              <span>{mainProf}</span>
            </p>

            {/* Rating & Completed Jobs */}
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-600 flex-wrap">
              <div className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-slate-800">{rating.toFixed(1)}</span>
                <span className="text-slate-600 font-normal">({reviewCount})</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 text-xs">
                <strong>{completedJobs}</strong>টি কাজ সম্পন্ন
              </span>
            </div>
          </div>
        </div>

        {/* Experience & Location */}
        <div className="grid grid-cols-2 gap-2 mt-3.5 py-2.5 px-3 bg-slate-50 rounded-xl text-xs text-slate-600">
          <div className="flex items-center gap-1.5 truncate">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{experienceYears} বছরের অভিজ্ঞতা</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {worker.presentAddress?.upazila || worker.serviceAreas?.[0] || 'ঢাকা'}
            </span>
          </div>
        </div>

        {/* Distance & Proximity Indicator */}
        {distanceResult && (
          <div className="mt-2 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 text-[11px]">
            <div className="flex items-center gap-1.5 truncate">
              {distanceResult.matchType === 'live_gps' ? (
                <>
                  <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-blue-700 font-bold truncate">
                    {distanceResult.formattedDistance} দূরে
                  </span>
                  <span className="text-slate-400 text-[10px] hidden sm:inline">(লাইভ জিপিএস)</span>
                </>
              ) : distanceResult.matchType === 'upazila_match' ? (
                <>
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-emerald-700 font-semibold truncate">{distanceResult.matchLabelBn}</span>
                </>
              ) : distanceResult.matchType === 'service_area_match' ? (
                <>
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="text-slate-700 truncate">{distanceResult.matchLabelBn}</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-500 truncate">{distanceResult.matchLabelBn}</span>
                </>
              )}
            </div>
            {distanceResult.matchType === 'live_gps' && isOnline && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded shrink-0">
                লাইভ
              </span>
            )}
          </div>
        )}

        {/* Skills Chips */}
        {topSkills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {topSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium truncate max-w-[200px]"
              >
                {skill.split('(')[0].trim()}
              </span>
            ))}
          </div>
        )}

        {/* Service Areas */}
        {worker.serviceAreas && worker.serviceAreas.length > 0 && (
          <p className="text-[11px] text-slate-600 mt-2.5 truncate">
            <strong className="text-slate-600 font-semibold">কাজের এলাকা:</strong>{' '}
            {worker.serviceAreas.slice(0, 3).join(', ')}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onViewProfile(worker)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Profile দেখুন</span>
        </button>

        <button
          type="button"
          onClick={() => onHireRequest(worker)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
            isOnline
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-slate-800 hover:bg-slate-900 text-white'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>কাজের অনুরোধ</span>
        </button>
      </div>
    </div>
  );
};
