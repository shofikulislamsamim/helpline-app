import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Briefcase, 
  Clock, 
  PhoneCall, 
  Send, 
  ShieldCheck, 
  Award, 
  FileText, 
  Image as ImageIcon, 
  AlertCircle,
  Navigation
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useHire } from '../../context/HireContext';
import { getWorkerDistanceResult, CustomerLocationQuery } from '../../lib/geoDistance';
import { isWorkerInServiceType, getSafeWorkerLocationDisplay } from '../../lib/hireSearchEngine';

interface WorkerProfileModalProps {
  worker: UserProfile | null;
  customerLocation?: CustomerLocationQuery;
  onClose: () => void;
  onHireRequest: (worker: UserProfile) => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({
  worker,
  customerLocation,
  onClose,
  onHireRequest,
}) => {
  const { getWorkerStats, getWorkerReviews } = useHire();
  const [showCallDialog, setShowCallDialog] = useState(false);

  if (!worker) return null;

  const isOnline = worker.isOnline;
  const isVerified = worker.verificationStatus === 'verified' || worker.verificationStatus === 'approved';
  const mainProf = worker.mainProfession || worker.professions?.[0] || 'দক্ষ কারিগর';
  const stats = getWorkerStats(worker.userId);
  const reviews = getWorkerReviews(worker.userId);
  const isDigital = isWorkerInServiceType(worker, 'digital');

  const distanceResult = !isDigital && worker ? getWorkerDistanceResult(worker, customerLocation) : null;
  const safeLocation = getSafeWorkerLocationDisplay(worker, isDigital ? 'digital' : 'physical');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative">
              <img
                src={
                  worker.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    worker.fullName
                  )}&background=0284c7&color=fff`
                }
                alt={worker.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-white/80 shadow-md"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 ${
                  isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white">{worker.fullName}</h2>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>যাচাইকৃত কারিগর</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-semibold">
                    <span>ভেরিফিকেশন অপেক্ষমান</span>
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-blue-200 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                <Briefcase className="w-4 h-4 text-blue-300" />
                <span>{mainProf}</span>
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-slate-300 flex-wrap">
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{stats.averageRating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({stats.totalReviews} রিভিউ)</span>
                </span>
                <span>•</span>
                <span>
                  <strong>{stats.completedJobs}</strong>টি কাজ সম্পন্ন
                </span>
                <span>•</span>
                <span className={isOnline ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {isOnline ? '🟢 Available Now' : '🔴 Currently Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Bio */}
          {worker.bio && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                পরিচিতি ও অভিজ্ঞতা
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {worker.bio}
              </p>
            </div>
          )}

          {/* Performance Card */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <span className="text-lg sm:text-xl font-bold text-slate-900">
                {stats.completedJobs}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">সম্পন্ন কাজ</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <span className="text-lg sm:text-xl font-bold text-amber-600 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{stats.averageRating.toFixed(1)}</span>
              </span>
              <p className="text-xs text-slate-500 mt-0.5">গড় রেটিং</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <span className="text-lg sm:text-xl font-bold text-emerald-600">
                {stats.completionRate}%
              </span>
              <p className="text-xs text-slate-500 mt-0.5">সফলতার হার</p>
            </div>
          </div>

          {/* Skills */}
          {worker.skills && worker.skills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                দক্ষতা ও সার্ভিসসমূহ (Skills)
              </h4>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-100 text-xs font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pricing & Rate Card */}
          {worker.pricing && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                রেট ও মজুরি বিবরণী (Pricing & Rates)
              </h4>
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs space-y-1.5">
                {worker.pricing.rateDescription && (
                  <p className="font-bold text-emerald-900 text-sm">{worker.pricing.rateDescription}</p>
                )}
                <div className="flex flex-wrap gap-4 text-emerald-800">
                  {worker.pricing.hourlyRate && <span>⏱️ ঘণ্টা প্রতি: ৳{worker.pricing.hourlyRate}</span>}
                  {worker.pricing.dailyRate && <span>📅 দৈনিক রেট: ৳{worker.pricing.dailyRate}</span>}
                  {worker.pricing.visitFee && <span>🚗 প্রাথমিক ভিজিট ফি: ৳{worker.pricing.visitFee}</span>}
                  {worker.pricing.isNegotiable && (
                    <span className="font-semibold text-emerald-700">✓ কাজের পরিধি অনুযায়ী আলোচনা সাপেক্ষ</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Showcase (For Digital and Skilled Workers) */}
          {worker.portfolio && worker.portfolio.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>পূর্ববর্তী কাজের পোর্টফোলিও ({worker.portfolio.length})</span>
                <span className="text-[11px] text-violet-700 font-bold">Portfolio Gallery</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {worker.portfolio.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-36 object-cover bg-slate-100"
                      />
                    )}
                    <div className="p-3 space-y-1">
                      <h5 className="font-bold text-slate-800 text-xs">{item.title}</h5>
                      {item.description && (
                        <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Areas & Location Display */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {isDigital ? 'সেবা প্রদান পদ্ধতি ও অবস্থান' : 'সার্ভিস এলাকা ও বর্তমান অবস্থান'}
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              {isDigital ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-violet-800 font-bold">
                    <span className="text-base">💻</span>
                    <span>ডিজিটাল / ফ্রিল্যান্স সেবা (সারা বাংলাদেশ থেকে রিমোট অর্ডার প্রযোজ্য)</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    অনলাইনে চ্যাট ও ফাইল আদান-প্রদানের মাধ্যমে কাজ সম্পন্ন করা হবে। কোনো ফিজিক্যাল যাতায়াত বা দূরত্বের প্রয়োজন নেই।
                  </p>
                  <p className="text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
                    <strong>প্রফেশনালের এলাকা:</strong> {safeLocation}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      <strong>কর্মীর এলাকা:</strong> {safeLocation}
                    </span>
                  </div>
                  {worker.serviceAreas && worker.serviceAreas.length > 0 && (
                    <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60">
                      <span className="font-semibold text-slate-800 shrink-0">কাজের আওতাভুক্ত এলাকা:</span>
                      <span className="text-slate-600">{worker.serviceAreas.join(', ')}</span>
                    </div>
                  )}
                  {distanceResult && (
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 bg-blue-50/50 -mx-3.5 -mb-3.5 p-3 rounded-b-xl">
                      <div className="flex items-center gap-1.5">
                        {distanceResult.matchType === 'live_gps' && isOnline ? (
                          <>
                            <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="text-blue-800 font-bold">
                              আপনার অবস্থান থেকে দূরত্ব: {distanceResult.formattedDistance}
                            </span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-emerald-800 font-semibold">
                              অবস্থান মিল: {distanceResult.matchLabelBn}
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-500">
                        {distanceResult.matchType === 'live_gps' && isOnline ? 'লাইভ জিপিএস স্থানাঙ্ক ভিত্তিক' : 'এলাকা/উপজেলা ভিত্তিক মিল'}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Work History */}
          {worker.workHistories && worker.workHistories.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                পূর্ববর্তী কাজের ইতিহাস (Work History)
              </h4>
              <div className="space-y-2.5">
                {worker.workHistories.map((wh) => (
                  <div
                    key={wh.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white space-y-1 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-800">{wh.position}</span>
                      <span className="text-[11px] text-slate-500">
                        {wh.startDate} - {wh.endDate}
                      </span>
                    </div>
                    <p className="text-slate-600">{wh.company} • {wh.location}</p>
                    {wh.jobDetails && <p className="text-slate-500 text-[11px]">{wh.jobDetails}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                গ্রাহকদের রিভিউ ({reviews.length})
              </h4>
              <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{stats.averageRating.toFixed(1)} / ৫.০</span>
              </span>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center bg-slate-50 rounded-xl border border-slate-100">
                এই কর্মীর জন্য এখনও কোনো রিভিউ যোগ হয়নি।
              </p>
            ) : (
              <div className="space-y-2.5">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{rev.reviewerName}</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 text-xs italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy & Safety Warning */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2 text-xs text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              <strong>নিরাপত্তা ও গোপনীয়তা সুরক্ষা:</strong> এই প্রোফাইলটি HelpLine প্ল্যাটফর্মে যাচাইকৃত। সুরক্ষার স্বার্থে কর্মীর এনআইডি নম্বর ও ব্যক্তিগত লাইভ জিপিএস গোপন রাখা হয়েছে।
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => setShowCallDialog(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-blue-600" />
            <span>সরাসরি কল (Call)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onHireRequest(worker);
            }}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span>কাজের অনুরোধ পাঠান (Hire Request)</span>
          </button>
        </div>

        {/* Phone Call Safe Dialog */}
        {showCallDialog && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 shadow-xl space-y-4 text-center animate-scaleUp">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{worker.fullName}</h3>
                <p className="text-xs text-slate-500">{mainProf}</p>
                <p className="text-lg font-bold text-blue-600 mt-2 font-mono">{worker.phoneNumber}</p>
              </div>
              <p className="text-[11px] text-slate-500">
                HelpLine নিরাপদ কলিং। কাজের ধরন ও আনুমানিক বাজেট নিয়ে ফোনে আলোচনা করুন।
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCallDialog(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  বন্ধ করুন
                </button>
                <a
                  href={`tel:${worker.phoneNumber}`}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>এখনই কল করুন</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
