import React, { useState, useEffect } from 'react';
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
  Filter,
  History,
  TrendingUp,
  Search,
  Eye,
  Calendar,
  MapPin,
  Coins,
  ThumbsUp,
  Award,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHire } from '../context/HireContext';
import { HireRequest } from '../types';
import { SendQuoteModal } from '../components/hire/SendQuoteModal';
import { DigitalJobRecordModal } from '../components/hire/DigitalJobRecordModal';
import { JobChatModal } from '../components/hire/JobChatModal';
import { RequestDetailsModal } from '../components/hire/RequestDetailsModal';
import { ActiveJobLiveTrackingMap } from '../components/work/ActiveJobLiveTrackingMap';
import { isPhysicalJob } from '../lib/trackingUtils';

interface WorkInboxPageProps {
  onNavigate?: (view: string) => void;
}

export const WorkInboxPage: React.FC<WorkInboxPageProps> = ({ onNavigate }) => {
  const { userProfile, toggleOnlineStatus } = useAuth();
  const { 
    hireRequests, 
    getWorkerStats, 
    getWorkerReviews,
    advanceJobStatus, 
    rejectRequest, 
    updateLiveTracking,
    activeRequestIdForDetails,
    setActiveRequestIdForDetails,
    adminSettings
  } = useHire();

  // Primary Structure Tabs:
  // Work / কাজ করতে চাই
  // ├── 📥 কাজের অনুরোধ
  // │   ├── 🔴 নতুন অনুরোধ
  // │   ├── 🟡 চলমান কাজ
  // │   ├── 🟢 সম্পন্ন কাজ
  // │   └── ⚪ বাতিল / Rejected
  // ├── 📋 কাজের ইতিহাস
  // └── 📊 Performance
  const [mainTab, setMainTab] = useState<'requests' | 'history' | 'performance'>('requests');
  const [requestSubTab, setRequestSubTab] = useState<'new' | 'active' | 'completed' | 'rejected'>('new');

  // Reject confirmation
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // History search query
  const [historySearch, setHistorySearch] = useState('');

  // Test mode switcher: show requests for current worker or all
  const [showAllWorkerRequests, setShowAllWorkerRequests] = useState(false);

  // Modals
  const [quoteRequest, setQuoteRequest] = useState<HireRequest | null>(null);
  const [recordRequest, setRecordRequest] = useState<HireRequest | null>(null);
  const [chatRequest, setChatRequest] = useState<HireRequest | null>(null);
  const [detailsModalRequest, setDetailsModalRequest] = useState<HireRequest | null>(null);

  const isVerified = userProfile.verificationStatus === 'verified' || userProfile.verificationStatus === 'approved';
  const isOnline = userProfile.isOnline;
  const stats = getWorkerStats(userProfile.userId);
  const reviews = getWorkerReviews(userProfile.userId);

  // Filter requests relevant to this worker (or demo technician 'worker-01-shafiq' or all in testing)
  const myWorkRequests = hireRequests.filter((r) => {
    if (showAllWorkerRequests) return true;
    if (r.workerId === userProfile.userId) return true;
    if (r.workerId === 'worker-01-shafiq') return true;
    // Fallback if current user has worker role and no workerId specified
    if (!r.workerId && userProfile.capabilities?.includes('worker')) return true;
    return false;
  });

  // Categorized requests for the 4 sub-tabs
  const newRequests = myWorkRequests.filter((r) => r.status === 'REQUESTED' || r.status === 'QUOTED');
  const activeRequests = myWorkRequests.filter((r) => ['ACCEPTED', 'ON_THE_WAY', 'WORK_STARTED'].includes(r.status));
  const completedRequests = myWorkRequests.filter((r) => r.status === 'WORK_COMPLETED');
  const rejectedRequests = myWorkRequests.filter((r) => ['CANCELLED', 'REJECTED', 'DISPUTED'].includes(r.status));

  // Auto-open request details if activeRequestIdForDetails is set
  useEffect(() => {
    if (activeRequestIdForDetails) {
      const found = hireRequests.find((r) => r.id === activeRequestIdForDetails);
      if (found) {
        setMainTab('requests');
        if (found.status === 'REQUESTED' || found.status === 'QUOTED') {
          setRequestSubTab('new');
        } else if (['ACCEPTED', 'ON_THE_WAY', 'WORK_STARTED'].includes(found.status)) {
          setRequestSubTab('active');
        } else if (found.status === 'WORK_COMPLETED') {
          setRequestSubTab('completed');
        } else {
          setRequestSubTab('rejected');
        }
        setDetailsModalRequest(found);
      }
    }
  }, [activeRequestIdForDetails, hireRequests]);

  const handleCloseDetailsModal = () => {
    setDetailsModalRequest(null);
    if (activeRequestIdForDetails) {
      setActiveRequestIdForDetails(null);
    }
  };

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

  // Currently displayed requests for the selected sub-tab
  const currentSubTabRequests = (() => {
    switch (requestSubTab) {
      case 'new': return newRequests;
      case 'active': return activeRequests;
      case 'completed': return completedRequests;
      case 'rejected': return rejectedRequests;
      default: return newRequests;
    }
  })();

  // Filtered completed jobs for History tab
  const filteredHistoryJobs = completedRequests.filter((r) => {
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.workType.toLowerCase().includes(q) ||
      r.workLocation.fullAddress.toLowerCase().includes(q)
    );
  });

  // Calculate total earnings from completed jobs
  const totalEarnings = completedRequests.reduce((sum, r) => {
    const price = r.agreedPrice || r.quote?.estimatedPrice || r.budget || 0;
    const receivable = r.serviceFeeBreakdown?.workerReceivable ?? Math.round(price * 0.95);
    return sum + receivable;
  }, 0);

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
                  userProfile.fullName || 'কারিগর'
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
                পেশা: {userProfile.mainProfession || userProfile.professions?.[0] || 'টেকনিশিয়ান'} • Work / কাজ করতে চাই
              </p>
            </div>
          </div>

          {/* Online / Offline Toggle & Test Mode Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 bg-slate-800/80 p-2 px-3.5 rounded-2xl border border-slate-700">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                  কাজের প্রাপ্যতা
                </span>
                <span className={`text-xs font-bold ${isOnline ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {isOnline ? '🟢 Online (অ্যাক্টিভ)' : '🔴 Offline'}
                </span>
              </div>
              <button
                type="button"
                id="btn-worker-toggle-online"
                onClick={toggleOnlineStatus}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  isOnline
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
                title="Online / Offline পরিবর্তন করুন"
              >
                <Power className="w-4 h-4" />
              </button>
            </div>

            {/* Subtle Tester Switcher: Switch between demo worker & all requests */}
            <button
              type="button"
              onClick={() => setShowAllWorkerRequests(!showAllWorkerRequests)}
              className="text-[11px] px-2.5 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 font-medium transition cursor-pointer"
              title="সকল অনুরোধ দেখতে টগল করুন"
            >
              {showAllWorkerRequests ? 'ভিউ: সকল অনুরোধ (All)' : 'ভিউ: আমার প্রোফাইল'}
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
      </div>

      {/* ========================================================================= */}
      {/* EXACT USER-REQUESTED ROOT STRUCTURE:                                     */}
      {/* Work / কাজ করতে চাই                                                       */}
      {/* ├── 📥 কাজের অনুরোধ                                                      */}
      {/* ├── 📋 কাজের ইতিহাস                                                      */}
      {/* └── 📊 Performance                                                       */}
      {/* ========================================================================= */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Main Tab 1: 📥 কাজের অনুরোধ */}
          <button
            id="tab-work-requests"
            type="button"
            onClick={() => setMainTab('requests')}
            className={`flex items-center gap-2.5 px-5 py-3.5 border-b-2 font-bold text-sm transition cursor-pointer whitespace-nowrap ${
              mainTab === 'requests'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>📥 কাজের অনুরোধ</span>
            {newRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-black animate-pulse shadow-xs">
                {newRequests.length}
              </span>
            )}
          </button>

          {/* Main Tab 2: 📋 কাজের ইতিহাস */}
          <button
            id="tab-work-history"
            type="button"
            onClick={() => setMainTab('history')}
            className={`flex items-center gap-2.5 px-5 py-3.5 border-b-2 font-bold text-sm transition cursor-pointer whitespace-nowrap ${
              mainTab === 'history'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>📋 কাজের ইতিহাস</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              {completedRequests.length}
            </span>
          </button>

          {/* Main Tab 3: 📊 Performance */}
          <button
            id="tab-work-performance"
            type="button"
            onClick={() => setMainTab('performance')}
            className={`flex items-center gap-2.5 px-5 py-3.5 border-b-2 font-bold text-sm transition cursor-pointer whitespace-nowrap ${
              mainTab === 'performance'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <span>📊 Performance</span>
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{stats.averageRating.toFixed(1)}</span>
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: 📥 কাজের অনুরোধ (Contains 4 Sub-Tabs)                              */}
      {/* ├── 🔴 নতুন অনুরোধ                                                       */}
      {/* ├── 🟡 চলমান কাজ                                                         */}
      {/* ├── 🟢 সম্পন্ন কাজ                                                        */}
      {/* └── ⚪ বাতিল / Rejected                                                  */}
      {/* ========================================================================= */}
      {mainTab === 'requests' && (
        <div className="space-y-5">
          {/* Sub-Navigation Tabs */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
            <div className="flex gap-2">
              {/* Sub-tab 1: 🔴 নতুন অনুরোধ */}
              <button
                id="subtab-new-requests"
                type="button"
                onClick={() => setRequestSubTab('new')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  requestSubTab === 'new'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>🔴 নতুন অনুরোধ</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  requestSubTab === 'new' ? 'bg-white text-red-600' : 'bg-red-100 text-red-700'
                }`}>
                  {newRequests.length}
                </span>
              </button>

              {/* Sub-tab 2: 🟡 চলমান কাজ */}
              <button
                id="subtab-active-jobs"
                type="button"
                onClick={() => setRequestSubTab('active')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  requestSubTab === 'active'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>🟡 চলমান কাজ</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  requestSubTab === 'active' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-800'
                }`}>
                  {activeRequests.length}
                </span>
              </button>

              {/* Sub-tab 3: 🟢 সম্পন্ন কাজ */}
              <button
                id="subtab-completed-jobs"
                type="button"
                onClick={() => setRequestSubTab('completed')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  requestSubTab === 'completed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>🟢 সম্পন্ন কাজ</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  requestSubTab === 'completed' ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {completedRequests.length}
                </span>
              </button>

              {/* Sub-tab 4: ⚪ বাতিল / Rejected */}
              <button
                id="subtab-rejected-jobs"
                type="button"
                onClick={() => setRequestSubTab('rejected')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  requestSubTab === 'rejected'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>⚪ বাতিল / Rejected</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  requestSubTab === 'rejected' ? 'bg-white text-slate-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {rejectedRequests.length}
                </span>
              </button>
            </div>

            <span className="text-xs font-bold text-slate-500 whitespace-nowrap hidden sm:inline">
              মোট: {currentSubTabRequests.length} টি
            </span>
          </div>

          {/* Sub-tab Content: Requests List */}
          {currentSubTabRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">
                {requestSubTab === 'new' && '🔴 কোনো নতুন কাজের অনুরোধ নেই'}
                {requestSubTab === 'active' && '🟡 বর্তমানে কোনো চলমান কাজ নেই'}
                {requestSubTab === 'completed' && '🟢 কোনো কাজ সম্পন্ন হয়নি'}
                {requestSubTab === 'rejected' && '⚪ কোনো বাতিলকৃত বা প্রত্যাখ্যাত অনুরোধ নেই'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {requestSubTab === 'new' && 'কাস্টমাররা আপনার প্রোফাইল থেকে কাজের অনুরোধ পাঠালে এখানে তাৎক্ষণিক স্থায়ীভাবে প্রদর্শিত হবে।'}
                {requestSubTab === 'active' && 'কোটেশন গ্রহণের পর কাজগুলো এখানে চলে আসবে।'}
                {requestSubTab === 'completed' && 'সফলভাবে সম্পন্ন হওয়া কাজগুলো এখানে এবং কাজের ইতিহাসে সংরক্ষিত থাকে।'}
                {requestSubTab === 'rejected' && 'বাতিল বা প্রত্যাখ্যাত অনুরোধসমূহ রেকর্ড হিসেবে এখানে সংরক্ষিত থাকে।'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentSubTabRequests.map((req) => {
                const isQuoted = req.status === 'QUOTED';
                const isRequested = req.status === 'REQUESTED';
                const isAccepted = req.status === 'ACCEPTED';
                const isOnTheWay = req.status === 'ON_THE_WAY';
                const isStarted = req.status === 'WORK_STARTED';
                const isCompleted = req.status === 'WORK_COMPLETED';

                return (
                  <div
                    key={req.id}
                    id={`request-card-${req.id}`}
                    className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5 transition hover:border-blue-300"
                  >
                    {/* Header: Request ID, Status badge, Timestamp */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700 text-xs sm:text-sm">
                          #{req.id}
                        </span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-xs text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                          {req.workType}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            isRequested
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : isQuoted
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : isAccepted
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : isOnTheWay
                              ? 'bg-purple-100 text-purple-800 border border-purple-200 animate-pulse'
                              : isStarted
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              : isCompleted
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {req.status === 'REQUESTED' && '🔴 নতুন অনুরোধ (Requested)'}
                          {req.status === 'QUOTED' && `🔵 কোটেশন দেওয়া হয়েছে (৳${req.quote?.estimatedPrice})`}
                          {req.status === 'ACCEPTED' && `🟡 গৃহীত (৳${req.agreedPrice})`}
                          {req.status === 'ON_THE_WAY' && '🟡 রওনা দিয়েছেন (On The Way)'}
                          {req.status === 'WORK_STARTED' && '🟡 কাজ চলছে (Started)'}
                          {req.status === 'WORK_COMPLETED' && '🟢 সম্পন্ন (Completed)'}
                          {req.status === 'CANCELLED' && '⚪ বাতিলকৃত'}
                          {req.status === 'REJECTED' && '⚪ প্রত্যাখ্যাত'}
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
                        <p className="text-slate-800 font-semibold truncate">{req.workLocation?.fullAddress}</p>
                        <p className="text-slate-600">তারিখ: {req.preferredDate} ({req.preferredTime})</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">পারিশ্রমিক / বাজেট</span>
                        <p className="text-base font-black text-blue-700 font-mono">
                          ৳{req.agreedPrice || req.quote?.estimatedPrice || req.budget || 'আলোচনা সাপেক্ষে'}
                        </p>
                        {req.budget && <p className="text-[10px] text-slate-500">বাজেট ছিল: ৳{req.budget}</p>}
                      </div>
                    </div>

                    {/* Problem Description */}
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                      <span className="font-bold text-slate-800 block mb-0.5">সমস্যার বিবরণ:</span>
                      <p className="text-slate-600">{req.description}</p>
                      {req.rejectionReason && (
                        <p className="text-rose-700 mt-1 font-semibold">❌ কারণ: {req.rejectionReason}</p>
                      )}
                    </div>

                    {/* Real-Time Live Tracking Map (Rule 11: Physical Local Jobs only) */}
                    {['ACCEPTED', 'ON_THE_WAY', 'WORK_STARTED'].includes(req.status) && isPhysicalJob(req) && (
                      <div className="mt-1">
                        <ActiveJobLiveTrackingMap
                          request={req}
                          perspective="worker"
                          isWorkerOnline={isOnline}
                          onUpdateTracking={(data) => updateLiveTracking(req.id, data)}
                          onToggleOnline={toggleOnlineStatus}
                        />
                      </div>
                    )}

                    {/* Digital / Freelance Job Notice (Rule 12: No GPS, Map, Route or ETA) */}
                    {['ACCEPTED', 'ON_THE_WAY', 'WORK_STARTED'].includes(req.status) && !isPhysicalJob(req) && (
                      <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/80 flex items-center justify-between gap-3 text-xs text-blue-900">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">💻</span>
                          <div>
                            <p className="font-bold text-slate-900">ডিজিটাল ফ্রিল্যান্সিং কাজ (রিমোট সার্ভিস)</p>
                            <p className="text-[11px] text-slate-600">এই কাজের জন্য GPS বা ম্যাপ ট্র্যাকিং প্রযোজ্য নয়। সকল ফাইল ও অগ্রগতি চ্যাট ও ওয়ার্ক স্লিপে পরিচালিত হবে।</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setRecordRequest(req)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shrink-0 cursor-pointer shadow-xs"
                        >
                          ডিজিটাল স্লিপ
                        </button>
                      </div>
                    )}

                    {/* Interactive Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDetailsModalRequest(req)}
                          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 text-xs font-bold transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>বিস্তারিত</span>
                        </button>
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
                          <span>স্লিপ</span>
                        </button>
                      </div>

                      {/* State Machine Transitions */}
                      <div className="flex items-center gap-2">
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
                              <span>মূল্য কোটেশন দিন</span>
                            </button>
                          </>
                        )}

                        {isQuoted && (
                          <span className="text-xs text-blue-700 bg-blue-50 py-1.5 px-3 rounded-xl font-semibold border border-blue-100">
                            কাস্টমারের সিদ্ধান্তের অপেক্ষায়...
                          </span>
                        )}

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

                        {isCompleted && (
                          <span className="text-xs text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-xl font-bold border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>কাজ সম্পন্ন</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: 📋 কাজের ইতিহাস (Work History & Earnings Archive)                  */}
      {/* ========================================================================= */}
      {mainTab === 'history' && (
        <div className="space-y-5">
          {/* Earnings & History Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">মোট সম্পন্ন কাজ</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {completedRequests.length} টি
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">সফলভাবে সমাধানকৃত</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">মোট অর্জিত আয় (Net)</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block font-mono">
                ৳{totalEarnings}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">প্ল্যাটফর্ম ফি বাদে প্রাপ্য আয়</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">গড় পারিশ্রমিক</span>
              <span className="text-2xl font-black text-blue-700 mt-1 block font-mono">
                ৳{completedRequests.length > 0 ? Math.round(totalEarnings / completedRequests.length) : 0}
              </span>
              <span className="text-[11px] text-blue-600 font-medium">প্রতি কাজে আনুমানিক গড় আয়</span>
            </div>
          </div>

          {/* Search Bar for History */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            <input
              type="text"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="কাজের আইডি, কাস্টমারের নাম, পেশা বা ঠিকানা লিখে খুঁজুন..."
              className="w-full text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />
            {historySearch && (
              <button
                type="button"
                onClick={() => setHistorySearch('')}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold mr-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Completed Jobs History List */}
          {filteredHistoryJobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <History className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">কোনো সম্পন্ন কাজের ইতিহাস পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                আপনি যখন নতুন কাজের অনুরোধ গ্রহণ করবেন এবং কাজ সম্পন্ন করবেন, তখন সকল ডিজিটাল রেকর্ড ও পারিশ্রমিকের হিসাব এখানে স্থায়ীভাবে সংরক্ষিত থাকবে।
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistoryJobs.map((job) => {
                const finalPrice = job.agreedPrice || job.quote?.estimatedPrice || job.budget || 500;
                const feeBreakdown = job.serviceFeeBreakdown;
                const netEarn = feeBreakdown?.workerReceivable ?? Math.round(finalPrice * 0.95);

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                          #{job.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ সম্পন্ন
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {job.workType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.completedAt ? new Date(job.completedAt).toLocaleDateString('bn-BD') : job.preferredDate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">কাস্টমার</span>
                        <p className="font-bold text-slate-800">{job.customerName}</p>
                        <p className="text-slate-500 font-mono">{job.customerPhone}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">কাজের স্থান</span>
                        <p className="text-slate-700 truncate">{job.workLocation?.fullAddress}</p>
                        <p className="text-slate-500 text-[11px]">{job.preferredDate}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">আর্থিক বিবরণ</span>
                        <p className="font-bold text-slate-900">
                          মোট চুক্তি: <span className="font-mono">৳{finalPrice}</span>
                        </p>
                        <p className="text-emerald-700 font-bold">
                          আপনার প্রাপ্য আয়: <span className="font-mono">৳{netEarn}</span>
                        </p>
                      </div>
                    </div>

                    {/* Customer review if rated */}
                    {job.customerRating && (
                      <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                          <span className="font-bold">কাস্টমার রেটিং: {job.customerRating} / 5</span>
                          {job.customerReview && (
                            <span className="text-slate-700 ml-2 italic">"{job.customerReview}"</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* History Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setDetailsModalRequest(job)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>কাজের বিবরণ</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecordRequest(job)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>ডিজিটাল জব স্লিপ</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: 📊 Performance (Worker Analytics, Rating & Feedback)             */}
      {/* ========================================================================= */}
      {mainTab === 'performance' && (
        <div className="space-y-6">
          {/* Main Scorecard */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">সার্বিক রেটিং</span>
              <div className="flex items-center justify-center gap-1.5 text-amber-500">
                <Star className="w-6 h-6 fill-amber-400" />
                <span className="text-3xl font-black text-slate-900">{stats.averageRating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-slate-500 block">মোট {stats.totalReviews} টি রিভিউ</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">কাজের সফলতার হার</span>
              <span className="text-3xl font-black text-emerald-600 block">{stats.completionRate}%</span>
              <span className="text-xs text-slate-500 block">উচ্চ মানের নির্ভরযোগ্যতা</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">অন-টাইম উপস্থিতি</span>
              <span className="text-3xl font-black text-blue-600 block">{stats.onTimeArrivalRate}%</span>
              <span className="text-xs text-slate-500 block">সময়নিষ্ঠ সেবা প্রদান</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">মোট সম্পন্ন কাজ</span>
              <span className="text-3xl font-black text-slate-900 block">{stats.completedJobs} টি</span>
              <span className="text-xs text-slate-500 block">মার্কেটপ্লেসে সফল কাজ</span>
            </div>
          </div>

          {/* Rating Distribution & Verification Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rating Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>রেটিং বিশ্লেষণ (Star Rating Breakdown)</span>
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { star: '৫ স্টার', pct: 85, count: Math.round(stats.totalReviews * 0.85) },
                  { star: '৪ স্টার', pct: 12, count: Math.round(stats.totalReviews * 0.12) },
                  { star: '৩ স্টার', pct: 3, count: Math.round(stats.totalReviews * 0.03) },
                  { star: '২ স্টার', pct: 0, count: 0 },
                  { star: '১ স্টার', pct: 0, count: 0 },
                ].map((row) => (
                  <div key={row.star} className="flex items-center gap-3">
                    <span className="w-14 text-slate-600 font-medium shrink-0">{row.star}</span>
                    <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono font-bold text-slate-700">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality & Trust Standards */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span>HelpLine স্ট্যান্ডার্ড ও বিশ্বাসযোগ্যতা</span>
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-800">জাতীয় পরিচয়পত্র যাচাই</span>
                  </div>
                  <span className={`font-bold ${isVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {isVerified ? '✓ সম্পন্ন' : 'যাচাই প্রয়োজন'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-slate-800">কাস্টমার সন্তুষ্টি স্কোর</span>
                  </div>
                  <span className="font-bold text-blue-700 font-mono">৯৮.৫%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-slate-800">প্ল্যাটফর্ম কমিশন গ্রেড</span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    {adminSettings.commissionRate}% স্ট্যান্ডার্ড
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews & Feedback */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-600" />
                <span>কাস্টমারদের মতামত ও রিভিউ ({reviews.length})</span>
              </h3>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                এখনো কোনো পাবলিক রিভিউ নেই। কাজ সম্পন্ন করার পর কাস্টমাররা রিভিউ দিলে এখানে দেখা যাবে।
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <div key={rev.id} className="py-3.5 space-y-1.5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {rev.customerName?.charAt(0) || 'ক'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 text-xs">{rev.customerName}</span>
                          <span className="text-[10px] text-slate-400 ml-2">
                            {new Date(rev.createdAt).toLocaleDateString('bn-BD')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 pl-9 font-medium leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
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
                className="flex-1 py-2 text-xs font-bold text-slate-600 rounded-xl border border-slate-200 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
              >
                প্রত্যাখ্যান করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {/* 1. Request Details Modal (Triggered by clicking notification or 'বিস্তারিত') */}
      {detailsModalRequest && (
        <RequestDetailsModal
          request={detailsModalRequest}
          onClose={handleCloseDetailsModal}
          onSendQuote={(req) => {
            setQuoteRequest(req);
          }}
          onReject={(reqId) => {
            setRejectingRequestId(reqId);
          }}
          onAdvanceStatus={handleAdvanceStatus}
          onOpenChat={(req) => {
            setChatRequest(req);
          }}
          onOpenDigitalRecord={(req) => {
            setRecordRequest(req);
          }}
        />
      )}

      {/* 2. Send Quote Modal */}
      {quoteRequest && (
        <SendQuoteModal
          request={quoteRequest}
          onClose={() => setQuoteRequest(null)}
        />
      )}

      {/* 3. Digital Job Record Slip Modal */}
      {recordRequest && (
        <DigitalJobRecordModal
          request={recordRequest}
          onClose={() => setRecordRequest(null)}
        />
      )}

      {/* 4. Chat Modal */}
      {chatRequest && (
        <JobChatModal
          request={chatRequest}
          onClose={() => setChatRequest(null)}
        />
      )}
    </div>
  );
};
