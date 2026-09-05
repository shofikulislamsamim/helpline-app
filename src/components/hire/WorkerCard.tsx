import React from 'react';
import { 
  CheckCircle2, 
  Star, 
  MapPin, 
  Briefcase, 
  Clock, 
  Eye, 
  Send,
  Navigation,
  Sparkles,
  Layers,
  Tag
} from 'lucide-react';
import { UserProfile } from '../../types';
import { getWorkerDistanceResult, CustomerLocationQuery } from '../../lib/geoDistance';
import { isWorkerInServiceType, getSafeWorkerLocationDisplay } from '../../lib/hireSearchEngine';

interface WorkerCardProps {
  worker: UserProfile;
  serviceType?: 'physical' | 'digital';
  customerLocation?: CustomerLocationQuery;
  locationMode?: 'live' | 'area';
  onViewProfile: (worker: UserProfile) => void;
  onHireRequest: (worker: UserProfile) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  serviceType,
  customerLocation,
  locationMode = 'live',
  onViewProfile,
  onHireRequest,
}) => {
  const isOnline = worker.isOnline;
  const isVerified = worker.verificationStatus === 'verified' || worker.verificationStatus === 'approved';
  const mainProf = worker.mainProfession || worker.professions?.[0] || 'দক্ষ কারিগর';
  const experienceYears = worker.experiences?.[0]?.years || 2;
  const topSkills = (worker.skills || []).slice(0, 4);
  const rating = worker.rating || 5.0;
  const reviewCount = worker.reviewCount || 0;
  const completedJobs = worker.completedJobsCount || 0;

  // Determine effective service mode
  const isDigital = serviceType === 'digital' || (serviceType === undefined && isWorkerInServiceType(worker, 'digital'));

  // Calculate distance only for physical services
  const distanceResult = !isDigital ? getWorkerDistanceResult(worker, customerLocation) : null;
  const safeLocation = getSafeWorkerLocationDisplay(worker, isDigital ? 'digital' : 'physical');

  // Rate Card or Starting Price display
  const priceDisplay = worker.pricing?.rateDescription || 
    (worker.pricing?.hourlyRate ? `৳${worker.pricing.hourlyRate}/ঘণ্টা` : null) ||
    (worker.pricing?.dailyRate ? `৳${worker.pricing.dailyRate}/দিন` : null) ||
    (worker.pricing?.visitFee ? `ভিজিট ফি: ৳${worker.pricing.visitFee}` : null);

  const hasPortfolio = isDigital && worker.portfolio && worker.portfolio.length > 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 hover:border-blue-300 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Service Type Tag & Status Bar */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            {isDigital ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200/70 text-[11px] font-bold">
                <span>💻</span>
                <span>ডিজিটাল সেবা</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/70 text-[11px] font-bold">
                <span>📍</span>
                <span>লোকাল সেবা</span>
              </span>
            )}

            {isVerified && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold"
                title="HelpLine এনআইডি ও প্রোফাইল যাচাইকৃত"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>যাচাইকৃত</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className={`text-[11px] font-bold ${isOnline ? 'text-emerald-700' : 'text-slate-500'}`}>
              {isOnline ? 'Available Now' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Worker Info: Avatar & Main Credentials */}
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
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate group-hover:text-blue-600 transition">
              {worker.fullName}
            </h3>

            {/* Profession */}
            <p className="text-xs font-semibold text-blue-700 mt-0.5 truncate flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span>{mainProf}</span>
            </p>

            {/* Rating & Completed Jobs */}
            <div className="flex items-center gap-2.5 mt-1 text-xs text-slate-600 flex-wrap">
              <div className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-slate-800">{rating.toFixed(1)}</span>
                <span className="text-slate-500 font-normal">({reviewCount})</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 text-xs font-medium">
                <strong>{completedJobs}</strong>টি কাজ সম্পন্ন
              </span>
            </div>
          </div>
        </div>

        {/* Experience & Location/Delivery Grid */}
        <div className="grid grid-cols-2 gap-2 mt-3.5 py-2 px-3 bg-slate-50/80 rounded-xl text-xs text-slate-600 border border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{experienceYears} বছরের অভিজ্ঞতা</span>
          </div>

          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate" title={safeLocation}>
              {safeLocation}
            </span>
          </div>
        </div>

        {/* Physical Services Proximity / Distance (Strictly HIDDEN for Digital Services) */}
        {!isDigital && (
          <div className="mt-2 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-blue-50/50 border border-blue-100 text-[11px]">
            <div className="flex items-center gap-1.5 truncate">
              {locationMode === 'live' && distanceResult?.matchType === 'live_gps' && isOnline ? (
                <>
                  <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-blue-800 font-bold truncate">
                    {distanceResult.formattedDistance} দূরে
                  </span>
                  <span className="text-blue-600 text-[10px] hidden sm:inline">(লাইভ জিপিএস)</span>
                </>
              ) : locationMode === 'area' ? (
                <>
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-slate-800 font-medium truncate">
                    {worker.serviceAreas && worker.serviceAreas.length > 0
                      ? `সার্ভিস এরিয়া: ${worker.serviceAreas.slice(0, 2).join(', ')}`
                      : `এলাকা: ${safeLocation}`}
                  </span>
                </>
              ) : distanceResult?.matchType === 'upazila_match' ? (
                <>
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-emerald-800 font-semibold truncate">{distanceResult.matchLabelBn}</span>
                </>
              ) : distanceResult?.matchType === 'service_area_match' ? (
                <>
                  <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="text-slate-800 truncate">{distanceResult.matchLabelBn}</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="text-slate-700 truncate">{distanceResult?.matchLabelBn || safeLocation}</span>
                </>
              )}
            </div>
            {locationMode === 'live' && distanceResult?.matchType === 'live_gps' && isOnline ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded shrink-0">
                লাইভ অবস্থান
              </span>
            ) : locationMode === 'area' ? (
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded shrink-0">
                এলাকা মিল
              </span>
            ) : null}
          </div>
        )}

        {/* Digital Services Highlights: Portfolio & Rate Card */}
        {isDigital && (
          <div className="mt-2.5 flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-violet-50/60 border border-violet-100 text-[11px] text-violet-900">
            <div className="flex items-center gap-1.5 truncate">
              {hasPortfolio ? (
                <>
                  <Layers className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                  <span className="font-bold text-violet-800 truncate">
                    🎨 {worker.portfolio!.length}টি পোর্টফোলিও প্রজেক্ট
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                  <span className="font-semibold text-violet-800 truncate">
                    অনলাইন / রিমোট ডেলিভারি
                  </span>
                </>
              )}
            </div>
            <span className="text-[10px] text-violet-700 font-medium shrink-0">
              সারা দেশ থেকে কাজ দেওয়া যাবে
            </span>
          </div>
        )}

        {/* Pricing & Rate info if available */}
        {priceDisplay && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-700">
            <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-bold text-emerald-700 truncate">{priceDisplay}</span>
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

        {/* Service Area for Physical */}
        {!isDigital && worker.serviceAreas && worker.serviceAreas.length > 0 && (
          <p className="text-[11px] text-slate-500 mt-2 truncate">
            <strong className="text-slate-600 font-semibold">কাজের এলাকা:</strong>{' '}
            {worker.serviceAreas.slice(0, 3).join(', ')}
          </p>
        )}
      </div>

      {/* Action Buttons: [View Profile / প্রোফাইল দেখুন] */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onViewProfile(worker)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-slate-600" />
          <span>প্রোফাইল দেখুন (View Profile)</span>
        </button>

        <button
          type="button"
          onClick={() => onHireRequest(worker)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
            isOnline
              ? isDigital 
                ? 'bg-violet-600 hover:bg-violet-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-slate-800 hover:bg-slate-900 text-white'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isDigital ? 'অর্ডার / অনুরোধ' : 'কাজের অনুরোধ'}</span>
        </button>
      </div>
    </div>
  );
};
