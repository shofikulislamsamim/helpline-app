import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Star, 
  PhoneCall, 
  MessageSquare, 
  Send, 
  ShieldAlert, 
  ChevronRight, 
  X, 
  Filter, 
  User, 
  Briefcase 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHire } from '../context/HireContext';
import { HireRequest } from '../types';
import { DigitalJobRecordModal } from '../components/hire/DigitalJobRecordModal';
import { RatingModal } from '../components/hire/RatingModal';
import { JobComplaintModal } from '../components/hire/JobComplaintModal';
import { JobChatModal } from '../components/hire/JobChatModal';
import { SendQuoteModal } from '../components/hire/SendQuoteModal';

interface ActivityPageProps {
  onNavigate: (view: string) => void;
}

export const ActivityPage: React.FC<ActivityPageProps> = ({ onNavigate }) => {
  const { userProfile } = useAuth();
  const { 
    hireRequests, 
    acceptQuote, 
    cancelRequest, 
    advanceJobStatus 
  } = useHire();

  const [perspective, setPerspective] = useState<'customer' | 'worker'>('customer');
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'completed' | 'canceled'>('all');

  // Modals state
  const [recordRequest, setRecordRequest] = useState<HireRequest | null>(null);
  const [ratingRequest, setRatingRequest] = useState<HireRequest | null>(null);
  const [complaintRequest, setComplaintRequest] = useState<HireRequest | null>(null);
  const [chatRequest, setChatRequest] = useState<HireRequest | null>(null);
  const [quoteRequest, setQuoteRequest] = useState<HireRequest | null>(null);

  const [cancellingRequestId, setCancellingRequestId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  // Requests filtered by perspective
  const requestsForPerspective = hireRequests.filter((r) => {
    if (perspective === 'customer') {
      return r.customerId === userProfile.userId || r.customerId === 'user-demo-01';
    } else {
      return r.workerId === userProfile.userId || r.workerId === 'worker-01-shafiq';
    }
  });

  const filteredRequests = requestsForPerspective.filter((r) => {
    if (activeTab === 'ongoing') {
      return ['REQUESTED', 'QUOTED', 'ACCEPTED', 'ON_THE_WAY', 'WORK_STARTED'].includes(r.status);
    }
    if (activeTab === 'completed') {
      return r.status === 'WORK_COMPLETED';
    }
    if (activeTab === 'canceled') {
      return ['CANCELLED', 'REJECTED', 'DISPUTED'].includes(r.status);
    }
    return true;
  });

  const handleAccept = async (requestId: string) => {
    try {
      await acceptQuote(requestId);
    } catch (err: any) {
      alert(err.message || 'কোটেশন গ্রহণ করতে ব্যর্থ হয়েছে।');
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancellingRequestId) return;
    try {
      await cancelRequest(cancellingRequestId, cancellationReason || 'গ্রাহক বাতিল করেছেন', perspective);
      setCancellingRequestId(null);
      setCancellationReason('');
    } catch (err: any) {
      alert(err.message || 'অনুরোধ বাতিল করা যায়নি।');
    }
  };

  const handleAdvance = async (requestId: string, nextStatus: 'ON_THE_WAY' | 'WORK_STARTED' | 'WORK_COMPLETED') => {
    try {
      await advanceJobStatus(requestId, nextStatus);
    } catch (err: any) {
      alert(err.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Perspective Switcher */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">কার্যক্রম ও কাজের লগ (Activity & Work)</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              আপনার সমস্ত হায়ারিং রিকোয়েস্ট, কোটেশন ও চলমান কাজের হিস্ট্রি
            </p>
          </div>

          {/* Perspective Toggle Buttons */}
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setPerspective('customer')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                perspective === 'customer'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>গ্রাহক হিসেবে (Customer)</span>
            </button>
            <button
              type="button"
              onClick={() => setPerspective('worker')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                perspective === 'worker'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>কর্মী হিসেবে (Worker)</span>
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 border-t border-slate-100 pt-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'সবগুলো (All)' },
            { id: 'ongoing', label: 'চলমান ও অপেক্ষমান (Active)' },
            { id: 'completed', label: 'সম্পন্ন (Completed)' },
            { id: 'canceled', label: 'বাতিলকৃত (Cancelled)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">কোনো কার্যক্রম পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {perspective === 'customer'
              ? 'আপনি এখনও কোনো কাজের অনুরোধ পাঠাননি। কারিগর খুঁজতে হায়ার সেকশনে যান।'
              : 'আপনার কাছে কোনো কাজের অনুরোধ আসেনি।'}
          </p>
          {perspective === 'customer' && (
            <button
              type="button"
              onClick={() => onNavigate('module_hire')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              কাজের মানুষ খুঁজুন
            </button>
          )}
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
            const isDisputed = req.status === 'DISPUTED';

            const otherName = perspective === 'customer' ? req.workerName : req.customerName;
            const otherPhone = perspective === 'customer' ? req.workerPhone : req.customerPhone;
            const otherRole = perspective === 'customer' ? req.workerProfession : 'গ্রাহক';

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-700 text-xs sm:text-sm">
                      #{req.id}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-slate-800">
                      {req.workType}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      isRequested
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : isQuoted
                        ? 'bg-blue-100 text-blue-800 border border-blue-200 animate-pulse'
                        : isAccepted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : isOnTheWay
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : isStarted
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isDisputed
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isRequested && 'অনুরোধ পাঠানো হয়েছে (Waiting for Quote)'}
                    {isQuoted && `কোটেশন প্রাপ্তি: ৳${req.quote?.estimatedPrice}`}
                    {isAccepted && `চুক্তি সম্পন্ন: ৳${req.agreedPrice}`}
                    {isOnTheWay && 'কর্মী রওনা দিয়েছেন (On The Way)'}
                    {isStarted && 'কাজ চলছে (In Progress)'}
                    {isCompleted && 'কাজ সম্পন্ন (Completed)'}
                    {req.status === 'CANCELLED' && 'বাতিলকৃত'}
                    {req.status === 'REJECTED' && 'কর্মী প্রত্যাখ্যান করেছেন'}
                    {isDisputed && 'অভিযোগ দাখিলকৃত (Under Review)'}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {perspective === 'customer' ? 'নিযুক্ত কর্মী' : 'নিয়োগকারী গ্রাহক'}
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{otherName}</p>
                    <p className="text-blue-700 font-semibold">{otherRole}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">ঠিকানা ও শিডিউল</span>
                    <p className="text-slate-800 truncate font-semibold">{req.workLocation.fullAddress}</p>
                    <p className="text-slate-600">{req.preferredDate} ({req.preferredTime})</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">মূল্য / পারিশ্রমিক</span>
                    <p className="text-base font-black text-blue-700 font-mono">
                      ৳{req.agreedPrice || req.quote?.estimatedPrice || req.budget || '—'}
                    </p>
                    {req.quote?.quoteNote && (
                      <p className="text-[10px] text-slate-500 italic truncate">
                        "{req.quote.quoteNote}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-1">
                  <p><strong>বিবরণ:</strong> {req.description}</p>
                  {req.notes && <p className="text-blue-700">নোট: {req.notes}</p>}
                </div>

                {/* Review summary if rated */}
                {req.ratingSubmitted && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="font-bold text-amber-900">রেটিং প্রদানকৃত: {req.ratingValue} / ৫</span>
                      {req.ratingComment && (
                        <span className="text-amber-800 italic ml-2">"{req.ratingComment}"</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Interactive Action Bar */}
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
                      href={`tel:${otherPhone}`}
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
                      <span>জব রেকর্ড</span>
                    </button>
                  </div>

                  {/* Contextual Actions */}
                  <div className="flex items-center gap-2">
                    {/* CUSTOMER PERSPECTIVE ACTIONS */}
                    {perspective === 'customer' && (
                      <>
                        {/* If Quoted: Accept Quote or Cancel */}
                        {isQuoted && (
                          <>
                            <button
                              type="button"
                              onClick={() => setCancellingRequestId(req.id)}
                              className="py-1.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
                            >
                              বাতিল
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAccept(req.id)}
                              className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>কোটেশন গ্রহণ করুন (৳{req.quote?.estimatedPrice})</span>
                            </button>
                          </>
                        )}

                        {/* If Requested: Cancel option */}
                        {isRequested && (
                          <button
                            type="button"
                            onClick={() => setCancellingRequestId(req.id)}
                            className="py-1.5 px-3 rounded-xl border border-slate-200 text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
                          >
                            অনুরোধ বাতিল
                          </button>
                        )}

                        {/* If Work Completed: Rate or Complaint */}
                        {isCompleted && (
                          <>
                            {!req.ratingSubmitted ? (
                              <button
                                type="button"
                                onClick={() => setRatingRequest(req)}
                                className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                              >
                                <Star className="w-3.5 h-3.5 fill-white" />
                                <span>রেটিং ও রিভিউ দিন</span>
                              </button>
                            ) : (
                              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>রিভিউ সম্পন্ন</span>
                              </span>
                            )}

                            {!req.complaintId && (
                              <button
                                type="button"
                                onClick={() => setComplaintRequest(req)}
                                className="py-1.5 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
                              >
                                অভিযোগ করুন
                              </button>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {/* WORKER PERSPECTIVE ACTIONS */}
                    {perspective === 'worker' && (
                      <>
                        {isRequested && (
                          <button
                            type="button"
                            onClick={() => setQuoteRequest(req)}
                            className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>কোটেশন দিন</span>
                          </button>
                        )}

                        {isAccepted && (
                          <button
                            type="button"
                            onClick={() => handleAdvance(req.id, 'ON_THE_WAY')}
                            className="py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                          >
                            রওনা দিয়েছি
                          </button>
                        )}

                        {isOnTheWay && (
                          <button
                            type="button"
                            onClick={() => handleAdvance(req.id, 'WORK_STARTED')}
                            className="py-1.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                          >
                            কাজ শুরু হয়েছে
                          </button>
                        )}

                        {isStarted && (
                          <button
                            type="button"
                            onClick={() => handleAdvance(req.id, 'WORK_COMPLETED')}
                            className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                          >
                            কাজ সম্পন্ন
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 shadow-xl space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">অনুরোধটি বাতিল করবেন?</h4>
            <p className="text-xs text-slate-500">বাতিলের কারণ উল্লেখ করুন:</p>
            <input
              type="text"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="যেমন: সমস্যার সমাধান হয়ে গেছে / সময় মেলাতে পারছি না..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
            />
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingRequestId(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 rounded-xl border border-slate-200"
              >
                ফিরে যান
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl"
              >
                বাতিল নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {recordRequest && (
        <DigitalJobRecordModal
          request={recordRequest}
          onClose={() => setRecordRequest(null)}
        />
      )}

      {ratingRequest && (
        <RatingModal
          request={ratingRequest}
          onClose={() => setRatingRequest(null)}
        />
      )}

      {complaintRequest && (
        <JobComplaintModal
          request={complaintRequest}
          onClose={() => setComplaintRequest(null)}
        />
      )}

      {chatRequest && (
        <JobChatModal
          request={chatRequest}
          onClose={() => setChatRequest(null)}
        />
      )}

      {quoteRequest && (
        <SendQuoteModal
          request={quoteRequest}
          onClose={() => setQuoteRequest(null)}
        />
      )}
    </div>
  );
};
