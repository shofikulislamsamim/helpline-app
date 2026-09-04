import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  ShieldAlert, 
  Check, 
  MessageSquare, 
  ArrowRight 
} from 'lucide-react';
import { UserProfile, HireRequest } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useHire } from '../../context/HireContext';

interface HireRequestModalProps {
  worker: UserProfile | null;
  onClose: () => void;
  onSuccess: (request: HireRequest) => void;
}

export const HireRequestModal: React.FC<HireRequestModalProps> = ({
  worker,
  onClose,
  onSuccess,
}) => {
  const { userProfile, openAuthModal, currentUser } = useAuth();
  const { createHireRequest, adminSettings } = useHire();

  const [workType, setWorkType] = useState('');
  const [description, setDescription] = useState('');
  const [division, setDivision] = useState(userProfile.presentAddress.division || 'ঢাকা');
  const [district, setDistrict] = useState(userProfile.presentAddress.district || 'ঢাকা');
  const [upazila, setUpazila] = useState(userProfile.presentAddress.upazila || '');
  const [areaRoad, setAreaRoad] = useState(userProfile.presentAddress.areaRoad || '');
  const [fullAddress, setFullAddress] = useState(
    userProfile.presentAddress.fullAddress || 
    `${userProfile.presentAddress.areaRoad || ''}, ${userProfile.presentAddress.upazila || ''}, ${userProfile.presentAddress.district || ''}`.trim()
  );

  const tomorrowStr = new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0];
  const [preferredDate, setPreferredDate] = useState(tomorrowStr);
  const [preferredTime, setPreferredTime] = useState('সকাল ১১:০০');
  const [budget, setBudget] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<HireRequest | null>(null);

  if (!worker) return null;

  const isSelf = userProfile.userId === worker.userId;
  const isWorkerVerified = worker.verificationStatus === 'verified';
  const isWorkerOnline = worker.isOnline;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation checks
    if (!currentUser && userProfile.userId === 'user-demo-01' && false) {
      openAuthModal('login');
      return;
    }

    if (isSelf) {
      setErrorMsg('আপনি নিজেকে কাজের অনুরোধ পাঠাতে পারবেন না।');
      return;
    }

    if (adminSettings.requireVerificationForWork && !isWorkerVerified) {
      setErrorMsg('এই কর্মী এখনও ভেরিফাইড নন। প্ল্যাটফর্ম সুরক্ষা ও বিশ্বস্ততার জন্য শুধুমাত্র ভেরিফাইড কর্মীদের কাজের অনুরোধ পাঠানো যায়।');
      return;
    }

    if (!workType.trim()) {
      setErrorMsg('অনুগ্রহ করে কাজের ধরন উল্লেখ করুন (যেমন: সিলিং ফ্যান ফিটিং, এসি সার্ভিস)।');
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      setErrorMsg('অনুগ্রহ করে কাজের সমস্যা বিস্তারিত লিখুন (কমপক্ষে ১০ অক্ষর)।');
      return;
    }

    if (!fullAddress.trim()) {
      setErrorMsg('কাজের স্থান বা বাসার ঠিকানা পূরণ করুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      const req = await createHireRequest({
        workerId: worker.userId,
        workType: workType.trim(),
        description: description.trim(),
        workLocation: {
          division,
          district,
          upazila,
          areaRoad,
          fullAddress: fullAddress.trim(),
        },
        preferredDate,
        preferredTime,
        budget: budget ? Number(budget) : undefined,
        notes: notes.trim() || undefined,
      });
      setCreatedRequest(req);
    } catch (err: any) {
      setErrorMsg(err.message || 'কাজের অনুরোধ পাঠাতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold text-white">কাজের অনুরোধ পাঠান (Hire Request)</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            কর্মীর সাথে সরাসরি কাজের বিবরণ ও মূল্য নির্ধারণের প্রাথমিক অনুরোধ
          </p>

          {/* Worker summary chip */}
          <div className="mt-4 p-3 bg-slate-800/80 rounded-2xl flex items-center gap-3 border border-slate-700">
            <img
              src={
                worker.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  worker.fullName
                )}&background=0284c7&color=fff`
              }
              alt={worker.fullName}
              className="w-11 h-11 rounded-xl object-cover border border-slate-600"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-bold text-white text-xs sm:text-sm truncate">
                  {worker.fullName}
                </h4>
                {isWorkerVerified ? (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    ✓ যাচাইকৃত
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                    অযাচাইকৃত
                  </span>
                )}
              </div>
              <p className="text-[11px] text-blue-300 truncate">
                {worker.mainProfession || worker.professions[0] || 'কারিগর'}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isWorkerOnline
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {isWorkerOnline ? '🟢 Online' : '🔴 Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        {createdRequest ? (
          <div className="p-6 text-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">অনুরোধ সফলভাবে পাঠানো হয়েছে!</h3>
              <p className="text-xs text-slate-500 mt-1">
                আপনার কাজের অনুরোধ আইডি: <strong className="text-blue-600 font-mono text-sm">{createdRequest.id}</strong>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 text-left space-y-1.5 max-w-md mx-auto">
              <p><strong>কাজের ধরন:</strong> {createdRequest.workType}</p>
              <p><strong>স্থান:</strong> {createdRequest.workLocation.fullAddress}</p>
              <p><strong>নির্ধারিত সময়:</strong> {createdRequest.preferredDate} ({createdRequest.preferredTime})</p>
              {createdRequest.budget && <p><strong>বাজেট:</strong> ৳{createdRequest.budget}</p>}
            </div>

            <p className="text-xs text-slate-500">
              কর্মী অনুরোধটি পর্যালোচনা করে খুব দ্রুত মূল্য কোটেশন (Quote) পাঠাবেন অথবা সরাসরি কল/চ্যাটে যোগাযোগ করবেন।
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSuccess(createdRequest);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <span>অনুরোধের স্ট্যাটাস দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Self warning */}
            {isSelf && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>আপনি নিজের প্রোফাইল নির্বাচন করেছেন। অন্য কোনো যাচাইকৃত কর্মীকে নির্বাচন করুন।</span>
              </div>
            )}

            {/* Verification warning */}
            {!isWorkerVerified && adminSettings.requireVerificationForWork && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">ভেরিফিকেশন প্রয়োজন</strong>
                  এই কর্মী এখনও জাতীয় পরিচয়পত্র যাচাই সম্পন্ন করেননি। প্ল্যাটফর্ম সুরক্ষা ও কাজের মানের স্বার্থে শুধুমাত্র যাচাইকৃত কর্মীদের সাথে কাজের চুক্তি করা যায়।
                </div>
              </div>
            )}

            {/* Offline warning notice */}
            {!isWorkerOnline && (
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  <strong>কর্মী বর্তমানে অফলাইনে আছেন:</strong> আপনি অনুরোধ পাঠাতে পারেন, কর্মী অনলাইনে ফিরে ইনবক্সে দেখতে পাবেন এবং সাড়া দেবেন।
                </span>
              </div>
            )}

            {/* Work Type */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                কাজের ধরন (Work Type) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                placeholder="যেমন: সিলিং ফ্যান ফিটিং, এসি গ্যাস রিফিল, বেসিন পাইপ লিকেজ..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white bg-slate-50"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                সমস্যার বিস্তারিত বিবরণ (Description) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="কী কাজ করতে হবে এবং বর্তমানে কী সমস্যা হচ্ছে তা বিস্তারিত লিখুন..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white bg-slate-50 resize-none"
                required
              />
            </div>

            {/* Location & Address */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                কাজের লোকেশন / ঠিকানা (Work Location) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500">বিভাগ</label>
                  <input
                    type="text"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">জেলা</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500">উপজেলা / থানা</label>
                <input
                  type="text"
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  placeholder="যেমন: মিরপুর ১০"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">পূর্ণাঙ্গ ঠিকানা (বাড়ি, রোড, এলাকা)</label>
                <input
                  type="text"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="যেমন: বাড়ি ১২, রোড ৪, ব্লক বি, মিরপুর ১০"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
                  required
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  পছন্দসই তারিখ <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  পছন্দসই সময় <span className="text-red-500">*</span>
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50"
                >
                  <option value="সকাল ০৯:০০ - ১১:০০">সকাল ০৯:০০ - ১১:০০</option>
                  <option value="সকাল ১১:০০ - ০১:০০">সকাল ১১:০০ - ০১:০০</option>
                  <option value="দুপুর ০২:০০ - ০৪:০০">দুপুর ০২:০০ - ০৪:০০</option>
                  <option value="বিকাল ০৪:০০ - ০৬:০০">বিকাল ০৪:০০ - ০৬:০০</option>
                  <option value="সন্ধ্যা ০৬:০০ - ০৮:০০">সন্ধ্যা ০৬:০০ - ০৮:০০</option>
                </select>
              </div>
            </div>

            {/* Expected Budget */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                আপনার বাজেট / প্রত্যাশিত মূল্য (৳ ঐচ্ছিক)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">৳</span>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={budget || ''}
                  onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="যেমন: ৮০০ (কর্মী পরে চূড়ান্ত কোটেশন দিতে পারবেন)"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50"
                />
              </div>
            </div>

            {/* Special Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                বিশেষ নির্দেশনা (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="যেমন: মই ও টুলবক্স সাথে আনতে হবে"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isSelf || (!isWorkerVerified && adminSettings.requireVerificationForWork)}
                className="flex-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                {isSubmitting ? (
                  <span>পাঠানো হচ্ছে...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>কাজের অনুরোধ পাঠান</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
