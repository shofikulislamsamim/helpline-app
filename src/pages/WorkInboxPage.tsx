import React, { useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Star, 
  Send, 
  PhoneCall, 
  MessageSquare, 
  FileText, 
  AlertTriangle, 
  Truck, 
  PlayCircle, 
  CheckCheck, 
  XCircle, 
  ShieldAlert, 
  ShieldCheck, 
  Power, 
  ChevronRight, 
  Filter 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHire } from '../context/HireContext';
import { HireRequest } from '../types';
import { SendQuoteModal } from '../components/hire/SendQuoteModal';
import { DigitalJobRecordModal } from '../components/hire/DigitalJobRecordModal';
import { JobChatModal } from '../components/hire/JobChatModal';

interface WorkInboxPageProps {
  onNavigate?: (view: string) => void;
}

export const WorkInboxPage: React.FC<WorkInboxPageProps> = ({ onNavigate }) => {
  const { userProfile, toggleOnlineStatus } = useAuth();
  const { 
    hireRequests, 
    getWorkerStats, 
    advanceJobStatus, 
    rejectRequest, 
    acceptQuote, 
    cancelRequest 
  } = useHire();

  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'active' | 'completed' | 'cancelled'>('all');
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Modals
  const [quoteRequest, setQuoteRequest] = useState<HireRequest | null>(null);
  const [recordRequest, setRecordRequest] = useState<HireRequest | null>(null);
  const [chatRequest, setChatRequest] = useState<HireRequest | null>(null);

  const isVerified = userProfile.verificationStatus === 'verified';
  const isOnline = userProfile.isOnline;
  const stats = getWorkerStats(userProfile.userId);

  // In requests, show all requests assigned to this worker (or demo seed requests so user can test the worker experience)
  const myWorkRequests = hireRequests.filter(
    (r) => r.workerId === userProfile.userId || r.workerId === 'worker-01-shafiq'
  );

  const filteredRequests = myWorkRequests.filter((r) => {
    if (activeFilter === 'new') return r.status === 'REQUESTED' || r.status === 'QUOTED';
    if (activeFilter === 'active') return ['ACCEPTED', 'ON_THE_WAY', 'WORK_STARTED'].includes(r.status);
    if (activeFilter === 'completed') return r.status === 'WORK_COMPLETED';
    if (activeFilter === 'cancelled') return ['CANCELLED', 'REJECTED', 'DISPUTED'].includes(r.status);
    return true;
  });

  const handleAdvanceStatus = async (requestId: string, nextStatus: 'ON_THE_WAY' | 'WORK_STARTED' | 'WORK_COMPLETED') => {
    try {
      await advanceJobStatus(requestId, nextStatus);
    } catch (err: any) {
      alert(err.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingRequestId) return;
    try {
      await rejectRequest(rejectingRequestId, rejectReason || 'কর্মী এই মুহূর্তে ব্যস্ত আছেন');
      setRejectingRequestId(null);
      setRejectReason('');
    } catch (err: any) {
      alert(err.message || 'অনুরোধ প্রত্যাখ্যান করা যায়নি।');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Worker Profile Status */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={
                userProfile.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userProfile.fullName
                )}&background=0284c7&color=fff`
              }
              alt={userProfile.fullName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-slate-700"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  {userProfile.fullName}
                </h1>
                {isVerified ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold">
                    ✓ ভেরিফাইড কারিগর
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">
                    অযাচাইকৃত (যাচাই প্রয়োজন)
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-300 mt-0.5">
                পেশা: {userProfile.mainProfession || userProfile.professions[0] || 'টেকনিশিয়ান'} • কর্মী ওয়ার্কস্পেস
              </p>
            </div>
          </div>

          {/* Online / Offline Toggle */}
          <div className="flex items-center gap-3 bg-slate-800/80 p-2.5 px-4 rounded-2xl border border-slate-700">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                কাজের জন্য প্রস্তুত?
              </span>
              <span className={`text-xs font-bold ${isOnline ? 'text-emerald-400' : 'text-slate-300'}`}>
                {isOnline ? '🟢 Available Now' : '🔴 Currently Offline'}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleOnlineStatus}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isOnline
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
              title="Online / Offline টগল করুন"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Unverified Alert */}
        {!isVerified && (
          <div className="mt-4 p-3 bg-amber-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                মার্কেটপ্লেসে সক্রিয় কাজের অনুরোধ পেতে আপনার জাতীয় পরিচয়পত্র বা ড্রাইভিং লাইসেন্স জমা দিন।
              </span>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('verification')}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                যাচাই করুন
              </button>
            )}
          </div>
        )}

        {/* Real Performance Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 text-center">
            <span className="text-lg font-bold text-white block">
              {stats.completedJobs}
            </span>
            <span className="text-[11px] text-slate-400">সম্পন্ন কাজ</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 text-center">
            <span className="text-lg font-bold text-amber-400 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{stats.averageRating.toFixed(1)}</span>
            </span>
            <span className="text-[11px] text-slate-400">গড় রেটিং ({stats.totalReviews})</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 text-center">
            <span className="text-lg font-bold text-emerald-400 block">
              {stats.completionRate}%
            </span>
            <span className="text-[11px] text-slate-400">সফলতার হার</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 text-center">
            <span className="text-lg font-bold text-blue-400 block">
              {myWorkRequests.filter((r) => r.status === 'REQUESTED').length}
            </span>
            <span className="text-[11px] text-slate-400">নতুন রিকোয়েস্ট</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200">
        <div className="flex gap-1.5">
          {[
            { id: 'all', label: 'সব কাজ' },
            { id: 'new', label: 'নতুন রিকোয়েস্ট' },
            { id: 'active', label: 'চলমান কাজ' },
            { id: 'completed', label: 'সম্পন্ন' },
            { id: 'cancelled', label: 'বাতিল' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
          {filteredRequests.length} টি অনুরোধ
        </span>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">এই ট্যাবে কোনো কাজের অনুরোধ নেই</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            কাস্টমাররা কাজের অনুরোধ পাঠালে এখানে তাৎক্ষণিক নোটিফিকেশন দেখতে পাবেন।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const isQuoted = req.status === 'QUOTED';
            const isRequested = req.status === 'REQUESTED';
            const isAccepted = req.status === 'ACCEPTED';
            const isOnTheWay = req.status === 'ON_THE_WAY';
            const isStarted = req.status === 'WORK_STARTED';
            const isCompleted = req.status === 'WORK_COMPLETED';

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5"
              >
                {/* Header: Request ID, Status badge, Timestamp */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-700 text-xs sm:text-sm">
                      #{req.id}
                    </span>
                    <span className="text-[11px] text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {req.workType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        isRequested
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : isQuoted
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : isAccepted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isOnTheWay
                          ? 'bg-purple-100 text-purple-800 border border-purple-200 animate-pulse'
                          : isStarted
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {req.status === 'REQUESTED' && 'নতুন অনুরোধ (Requested)'}
                      {req.status === 'QUOTED' && `কোটেশন দেওয়া হয়েছে (৳${req.quote?.estimatedPrice})`}
                      {req.status === 'ACCEPTED' && `গৃহীত (৳${req.agreedPrice})`}
                      {req.status === 'ON_THE_WAY' && 'রওনা দিয়েছেন (On The Way)'}
                      {req.status === 'WORK_STARTED' && 'কাজ চলছে (Started)'}
                      {req.status === 'WORK_COMPLETED' && 'সম্পন্ন (Completed)'}
                      {req.status === 'CANCELLED' && 'বাতিলকৃত'}
                      {req.status === 'REJECTED' && 'প্রত্যাখ্যাত'}
                      {req.status === 'DISPUTED' && 'অভিযোগাধীন'}
                    </span>
                  </div>
                </div>

                {/* Body Details: Customer, Address, Description */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">কাস্টমার</span>
                    <p className="font-bold text-slate-900 text-sm">{req.customerName}</p>
                    <p className="text-slate-600">ফোন: <span className="font-mono">{req.customerPhone}</span></p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">কাজের স্থান ও সময়</span>
                    <p className="text-slate-800 font-semibold truncate">{req.workLocation.fullAddress}</p>
                    <p className="text-slate-600">তারিখ: {req.preferredDate} ({req.preferredTime})</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">পারিশ্রমিক / কোটেশন</span>
                    <p className="text-base font-black text-blue-700 font-mono">
                      ৳{req.agreedPrice || req.quote?.estimatedPrice || req.budget || 'আলোচনা সাপেক্ষে'}
                    </p>
                    {req.budget && <p className="text-[10px] text-slate-500">বাজেট ছিল: ৳{req.budget}</p>}
                  </div>
                </div>

                {/* Problem Description */}
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                  <span className="font-bold text-slate-800 block mb-0.5">সমস্যার বিস্তারিত:</span>
                  <p className="text-slate-600">{req.description}</p>
                  {req.notes && <p className="text-blue-700 mt-1">নোট: {req.notes}</p>}
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChatRequest(req)}
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>চ্যাট</span>
                    </button>
                    <a
                      href={`tel:${req.customerPhone}`}
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                      <span>কল</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setRecordRequest(req)}
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>ডিজিটাল রেকর্ড</span>
                    </button>
                  </div>

                  {/* Worker State Machine Transitions */}
                  <div className="flex items-center gap-2">
                    {/* 1. If Requested: Quote or Reject */}
                    {isRequested && (
                      <>
                        <button
                          type="button"
                          onClick={() => setRejectingRequestId(req.id)}
                          className="py-1.5 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
                        >
                          প্রত্যাখ্যান
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuoteRequest(req)}
                          className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>মূল্য কোটেশন দিন (Send Quote)</span>
                        </button>
                      </>
                    )}

                    {/* 2. If Quoted: Waiting for customer */}
                    {isQuoted && (
                      <span className="text-xs text-blue-700 bg-blue-50 py-1.5 px-3 rounded-xl font-semibold border border-blue-100">
                        কাস্টমারের সিদ্ধান্তের অপেক্ষায়...
                      </span>
                    )}

                    {/* 3. If Accepted: On The Way button */}
                    {isAccepted && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus(req.id, 'ON_THE_WAY')}
                        className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>রওনা দিয়েছি (On The Way)</span>
                      </button>
                    )}

                    {/* 4. If On The Way: Work Started button */}
                    {isOnTheWay && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus(req.id, 'WORK_STARTED')}
                        className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>কাজ শুরু করেছি (Start Work)</span>
                      </button>
                    )}

                    {/* 5. If Work Started: Work Completed button */}
                    {isStarted && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus(req.id, 'WORK_COMPLETED')}
                        className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>কাজ সম্পন্ন হয়েছে (Complete)</span>
                      </button>
                    )}

                    {/* 6. Completed */}
                    {isCompleted && (
                      <span className="text-xs text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-xl font-bold border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>কাজ সফলভাবে সম্পন্ন</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Reason Confirmation Modal */}
      {rejectingRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 shadow-xl space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">অনুরোধটি প্রত্যাখ্যান করবেন?</h4>
            <p className="text-xs text-slate-500">কারণ উল্লেখ করুন (কাস্টমারকে জানানো হবে):</p>
            <input
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="যেমন: এই তারিখে অন্য কাজ আছে..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
            />
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingRequestId(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 rounded-xl border border-slate-200"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl"
              >
                প্রত্যাখ্যান করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {quoteRequest && (
        <SendQuoteModal
          request={quoteRequest}
          onClose={() => setQuoteRequest(null)}
        />
      )}

      {recordRequest && (
        <DigitalJobRecordModal
          request={recordRequest}
          onClose={() => setRecordRequest(null)}
        />
      )}

      {chatRequest && (
        <JobChatModal
          request={chatRequest}
          onClose={() => setChatRequest(null)}
        />
      )}
    </div>
  );
};
