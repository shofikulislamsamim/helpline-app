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
import { useLanguage } from '../../context/LanguageContext';

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
  const { t, isBn, formatNumber } = useLanguage();
  const { userProfile, openAuthModal, currentUser } = useAuth();
  const { createHireRequest, adminSettings } = useHire();

  const [workType, setWorkType] = useState('');
  const [description, setDescription] = useState('');
  const [division, setDivision] = useState(userProfile.presentAddress?.division || (isBn ? 'ঢাকা' : 'Dhaka'));
  const [district, setDistrict] = useState(userProfile.presentAddress?.district || (isBn ? 'ঢাকা' : 'Dhaka'));
  const [upazila, setUpazila] = useState(userProfile.presentAddress?.upazila || '');
  const [areaRoad, setAreaRoad] = useState(userProfile.presentAddress?.areaRoad || '');
  const [fullAddress, setFullAddress] = useState(
    userProfile.presentAddress?.fullAddress || 
    `${userProfile.presentAddress?.areaRoad || ''}, ${userProfile.presentAddress?.upazila || ''}, ${userProfile.presentAddress?.district || ''}`.trim()
  );

  const tomorrowStr = new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0];
  const [preferredDate, setPreferredDate] = useState(tomorrowStr);
  const [preferredTime, setPreferredTime] = useState(isBn ? 'সকাল ১১:০০' : '11:00 AM');
  const [budget, setBudget] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<HireRequest | null>(null);

  if (!worker) return null;

  const isSelf = userProfile.userId === worker.userId;
  const isWorkerVerified = worker.verificationStatus === 'verified' || worker.verificationStatus === 'approved';
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
      setErrorMsg(isBn ? 'আপনি নিজেকে কাজের অনুরোধ পাঠাতে পারবেন না।' : 'You cannot send a hire request to yourself.');
      return;
    }

    if (adminSettings.requireVerificationForWork && !isWorkerVerified) {
      setErrorMsg(isBn 
        ? 'এই কর্মী এখনও ভেরিফাইড নন। প্ল্যাটফর্ম সুরক্ষা ও বিশ্বস্ততার জন্য শুধুমাত্র ভেরিফাইড কর্মীদের কাজের অনুরোধ পাঠানো যায়।' 
        : 'This worker is not verified yet. For safety, hire requests can only be sent to verified workers.');
      return;
    }

    if (!workType.trim()) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে কাজের ধরন উল্লেখ করুন (যেমন: সিলিং ফ্যান ফিটিং, এসি সার্ভিস)।' : 'Please specify the work type (e.g. Ceiling fan fitting, AC servicing).');
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে কাজের সমস্যা বিস্তারিত লিখুন (কমপক্ষে ১০ অক্ষর)।' : 'Please describe the problem in detail (at least 10 characters).');
      return;
    }

    if (!fullAddress.trim()) {
      setErrorMsg(isBn ? 'কাজের স্থান বা বাসার ঠিকানা পূরণ করুন।' : 'Please enter the work location or address.');
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

          <h2 className="text-lg font-bold text-white">{isBn ? 'কাজের অনুরোধ পাঠান (Hire Request)' : 'Send Hire Request'}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isBn ? 'কর্মীর সাথে সরাসরি কাজের বিবরণ ও মূল্য নির্ধারণের প্রাথমিক অনুরোধ' : 'Direct request with work details and preliminary pricing'}
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
                    {isBn ? '✓ যাচাইকৃত' : '✓ Verified'}
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                    {isBn ? 'অযাচাইকৃত' : 'Unverified'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-blue-300 truncate">
                {worker.mainProfession || worker.professions?.[0] || (isBn ? 'কারিগর' : 'Worker')}
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
              <h3 className="text-lg font-bold text-slate-900">{isBn ? 'অনুরোধ সফলভাবে পাঠানো হয়েছে!' : 'Request Sent Successfully!'}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {isBn ? 'আপনার কাজের অনুরোধ আইডি:' : 'Your hire request ID:'} <strong className="text-blue-600 font-mono text-sm">#{createdRequest.id}</strong>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 text-left space-y-1.5 max-w-md mx-auto">
              <p><strong>{isBn ? 'কাজের ধরন:' : 'Work Type:'}</strong> {createdRequest.workType}</p>
              <p><strong>{isBn ? 'স্থান:' : 'Location:'}</strong> {createdRequest.workLocation.fullAddress}</p>
              <p><strong>{isBn ? 'নির্ধারিত সময়:' : 'Scheduled Time:'}</strong> {createdRequest.preferredDate} ({createdRequest.preferredTime})</p>
              {createdRequest.budget && <p><strong>{isBn ? 'বাজেট:' : 'Budget:'}</strong> ৳{formatNumber(createdRequest.budget)}</p>}
            </div>

            <p className="text-xs text-slate-500">
              {isBn 
                ? 'কর্মী অনুরোধটি পর্যালোচনা করে খুব দ্রুত মূল্য কোটেশন (Quote) পাঠাবেন অথবা সরাসরি কল/চ্যাটে যোগাযোগ করবেন।'
                : 'The worker will review your request and send a quote or reach out via call/chat shortly.'}
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
                <span>{isBn ? 'অনুরোধের স্ট্যাটাস দেখুন' : 'View Request Status'}</span>
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
                <span>{isBn ? 'আপনি নিজের প্রোফাইল নির্বাচন করেছেন। অন্য কোনো যাচাইকৃত কর্মীকে নির্বাচন করুন।' : 'You have selected yourself. Please select another verified worker.'}</span>
              </div>
            )}

            {/* Verification warning */}
            {!isWorkerVerified && adminSettings.requireVerificationForWork && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">{isBn ? 'ভেরিফিকেশন প্রয়োজন' : 'Verification Required'}</strong>
                  {isBn 
                    ? 'এই কর্মী এখনও জাতীয় পরিচয়পত্র যাচাই সম্পন্ন করেননি। প্ল্যাটফর্ম সুরক্ষা ও কাজের মানের স্বার্থে শুধুমাত্র যাচাইকৃত কর্মীদের সাথে কাজের চুক্তি করা যায়।'
                    : 'This worker has not completed identity verification. For safety, requests can only be sent to verified workers.'}
                </div>
              </div>
            )}

            {/* Offline warning notice */}
            {!isWorkerOnline && (
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  <strong>{isBn ? 'কর্মী বর্তমানে অফলাইনে আছেন:' : 'Worker is currently offline:'}</strong>{' '}
                  {isBn 
                    ? 'আপনি অনুরোধ পাঠাতে পারেন, কর্মী অনলাইনে ফিরে ইনবক্সে দেখতে পাবেন এবং সাড়া দেবেন।'
                    : 'You can send the request; the worker will review it when back online.'}
                </span>
              </div>
            )}

            {/* Work Type */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isBn ? 'কাজের ধরন (Work Type)' : 'Work Type'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                placeholder={isBn ? 'যেমন: সিলিং ফ্যান ফিটিং, এসি গ্যাস রিফিল, বেসিন পাইপ লিকেজ...' : 'e.g. Ceiling fan fitting, AC gas refill, Basin pipe repair...'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white bg-slate-50"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isBn ? 'সমস্যার বিস্তারিত বিবরণ (Description)' : 'Problem Description'} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder={isBn ? 'কী কাজ করতে হবে এবং বর্তমানে কী সমস্যা হচ্ছে তা বিস্তারিত লিখুন...' : 'Describe what work needs to be done and specific details...'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white bg-slate-50 resize-none"
                required
              />
            </div>

            {/* Location & Address */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                {isBn ? 'কাজের লোকেশন / ঠিকানা (Work Location)' : 'Work Location / Address'} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500">{isBn ? 'বিভাগ' : 'Division'}</label>
                  <input
                    type="text"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">{isBn ? 'জেলা' : 'District'}</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500">{isBn ? 'উপজেলা / থানা' : 'Upazila / Thana'}</label>
                <input
                  type="text"
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  placeholder={isBn ? 'যেমন: মিরপুর ১০' : 'e.g. Mirpur 10'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">{isBn ? 'পূর্ণাঙ্গ ঠিকানা (বাড়ি, রোড, এলাকা)' : 'Full Address (House, Road, Area)'}</label>
                <input
                  type="text"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder={isBn ? 'যেমন: বাড়ি ১২, রোড ৪, ব্লক বি, মিরপুর ১০' : 'e.g. House 12, Road 4, Block B, Mirpur 10'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
                  required
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {isBn ? 'পছন্দসই তারিখ' : 'Preferred Date'} <span className="text-red-500">*</span>
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
                  {isBn ? 'পছন্দসই সময়' : 'Preferred Time'} <span className="text-red-500">*</span>
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50"
                >
                  <option value={isBn ? 'সকাল ০৯:০০ - ১১:০০' : '09:00 AM - 11:00 AM'}>{isBn ? 'সকাল ০৯:০০ - ১১:০০' : '09:00 AM - 11:00 AM'}</option>
                  <option value={isBn ? 'সকাল ১১:০০ - ০১:০০' : '11:00 AM - 01:00 PM'}>{isBn ? 'সকাল ১১:০০ - ০১:০০' : '11:00 AM - 01:00 PM'}</option>
                  <option value={isBn ? 'দুপুর ০২:০০ - ০৪:০০' : '02:00 PM - 04:00 PM'}>{isBn ? 'দুপুর ০২:০০ - ০৪:০০' : '02:00 PM - 04:00 PM'}</option>
                  <option value={isBn ? 'বিকাল ০৪:০০ - ০৬:০০' : '04:00 PM - 06:00 PM'}>{isBn ? 'বিকাল ০৪:০০ - ০৬:০০' : '04:00 PM - 06:00 PM'}</option>
                  <option value={isBn ? 'সন্ধ্যা ০৬:০০ - ০৮:০০' : '06:00 PM - 08:00 PM'}>{isBn ? 'সন্ধ্যা ০৬:০০ - ০৮:০০' : '06:00 PM - 08:00 PM'}</option>
                </select>
              </div>
            </div>

            {/* Expected Budget */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isBn ? 'আপনার বাজেট / প্রত্যাশিত মূল্য (৳ ঐচ্ছিক)' : 'Your Budget / Expected Price (৳ Optional)'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">৳</span>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={budget || ''}
                  onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder={isBn ? 'যেমন: ৮০০ (কর্মী পরে চূড়ান্ত কোটেশন দিতে পারবেন)' : 'e.g. 800 (Worker can provide final quote)'}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50"
                />
              </div>
            </div>

            {/* Special Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {isBn ? 'বিশেষ নির্দেশনা (ঐচ্ছিক)' : 'Special Instructions (Optional)'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isBn ? 'যেমন: মই ও টুলবক্স সাথে আনতে হবে' : 'e.g., Bring a ladder and toolbox'}
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
                {isBn ? 'বাতিল করুন' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isSelf || (!isWorkerVerified && adminSettings.requireVerificationForWork)}
                className="flex-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                {isSubmitting ? (
                  <span>{isBn ? 'পাঠানো হচ্ছে...' : 'Sending...'}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isBn ? 'কাজের অনুরোধ পাঠান' : 'Send Hire Request'}</span>
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
