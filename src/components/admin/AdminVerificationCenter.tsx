import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Eye, 
  Lock, 
  UserCheck, 
  FileText, 
  AlertTriangle,
  Calendar,
  Phone,
  MapPin,
  Car,
  History,
  AlertCircle,
  X
} from 'lucide-react';
import { 
  VerificationRequest, 
  VerificationStatus, 
  IdentityDocumentType, 
  AdminRoleType,
  VerificationAuditLog 
} from '../../types';
import { 
  getVerificationStatusInfo, 
  getDocumentTypeInfo, 
  maskDocumentNumber, 
  REJECTION_REASONS 
} from '../../lib/verificationHelpers';

interface AdminVerificationCenterProps {
  requests: VerificationRequest[];
  auditLogs: VerificationAuditLog[];
  currentAdminRole: AdminRoleType;
  onRoleChange: (role: AdminRoleType) => void;
  onApproveRequest: (requestId: string, adminNotes?: string) => Promise<void>;
  onRejectRequest: (requestId: string, reason: string, feedback?: string) => Promise<void>;
  onRequestReverification: (requestId: string, feedback: string) => Promise<void>;
  onSetUnderReview: (requestId: string) => Promise<void>;
}

export const AdminVerificationCenter: React.FC<AdminVerificationCenterProps> = ({
  requests = [],
  auditLogs = [],
  currentAdminRole,
  onRoleChange,
  onApproveRequest,
  onRejectRequest,
  onRequestReverification,
  onSetUnderReview
}) => {
  const safeRequests = requests || [];
  const safeAuditLogs = auditLogs || [];

  const [activeTab, setActiveTab] = useState<'requests' | 'audit_logs'>('requests');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [docTypeFilter, setDocTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Request for Detail Modal
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [activeImagePreview, setActiveImagePreview] = useState<string | null>(null);

  // Review Action Dialogs
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'reverify' | null>(null);
  const [selectedRejectReason, setSelectedRejectReason] = useState<string>(REJECTION_REASONS[0]);
  const [customFeedback, setCustomFeedback] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Authorized Admin check
  const isAuthorizedToReview = 
    currentAdminRole === 'super_admin' || currentAdminRole === 'verification_admin';

  // KPI Calculations
  const stats = useMemo(() => {
    const total = safeRequests.length;
    const pending = safeRequests.filter((r) => r.status === 'pending').length;
    const underReview = safeRequests.filter((r) => r.status === 'under_review').length;
    const approved = safeRequests.filter((r) => r.status === 'approved' || r.status === 'verified').length;
    const rejected = safeRequests.filter((r) => r.status === 'rejected').length;
    const reverify = safeRequests.filter((r) => r.status === 'reverification_required').length;
    return { total, pending, underReview, approved, rejected, reverify };
  }, [safeRequests]);

  // Filtered Requests
  const filteredRequests = useMemo(() => {
    return safeRequests.filter((r) => {
      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'approved' && (r.status === 'approved' || r.status === 'verified')) {
          // match
        } else if (r.status !== statusFilter) {
          return false;
        }
      }

      // Document type filter
      if (docTypeFilter !== 'all' && r.documentType !== docTypeFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = r.userName?.toLowerCase().includes(q);
        const matchPhone = r.userPhone?.toLowerCase().includes(q);
        const matchId = r.id?.toLowerCase().includes(q);
        const matchDocNum = r.documentNumber?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchId && !matchDocNum) {
          return false;
        }
      }

      return true;
    });
  }, [requests, statusFilter, docTypeFilter, searchQuery]);

  const handleExecuteApprove = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    try {
      await onApproveRequest(selectedRequest.id, customFeedback);
      setReviewAction(null);
      setSelectedRequest(null);
    } catch (err: any) {
      alert(err.message || 'Error approving request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteReject = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    try {
      await onRejectRequest(selectedRequest.id, selectedRejectReason, customFeedback);
      setReviewAction(null);
      setSelectedRequest(null);
    } catch (err: any) {
      alert(err.message || 'Error rejecting request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteReverify = async () => {
    if (!selectedRequest) return;
    if (!customFeedback.trim()) {
      alert('পুনরায় যাচাইয়ের জন্য স্পষ্ট দিকনির্দেশনা (Feedback) প্রদান করুন।');
      return;
    }
    setIsProcessing(true);
    try {
      await onRequestReverification(selectedRequest.id, customFeedback);
      setReviewAction(null);
      setSelectedRequest(null);
    } catch (err: any) {
      alert(err.message || 'Error requesting re-verification');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Role Permission Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-600 text-white rounded-xl font-bold shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  ভেরিফিকেশন কেন্দ্র (Admin Verification Center)
                </h2>
                <p className="text-xs text-slate-500">
                  জাতীয় পরিচয়পত্র, ড্রাইভিং লাইসেন্স ও জন্ম নিবন্ধন যাচাইকরণ ও অনুমোদন ড্যাশবোর্ড
                </p>
              </div>
            </div>
          </div>

          {/* Admin Role Switcher for Testing / Security Demo */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 pl-1">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>ভূমিকা (Role):</span>
            </span>
            <div className="flex items-center gap-1 text-xs">
              {(
                [
                  { id: 'super_admin', label: 'Super Admin', desc: 'ফুল অ্যাক্সেস' },
                  { id: 'verification_admin', label: 'Verification Admin', desc: 'যাচাই ও অনুমোদন' },
                  { id: 'moderator', label: 'Moderator', desc: 'রিড-অনলি (ডকুমেন্ট গোপন)' },
                  { id: 'support_admin', label: 'Support Admin', desc: 'রিড-অনলি (সীমাবদ্ধ)' },
                ] as const
              ).map((role) => (
                <button
                  key={role.id}
                  onClick={() => onRoleChange(role.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    currentAdminRole === role.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                  title={role.desc}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security / RBAC Banner */}
        {!isAuthorizedToReview && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>দৃষ্টি আকর্ষণ:</strong> বর্তমান ভূমিকা (<strong>{currentAdminRole}</strong>)-এ সংবেদনশীল জাতীয় পরিচয়পত্র বা নথি দেখার অধিকার নেই। সম্পূর্ণ নথি দেখতে ও অনুমোদন করতে অনুগ্রহ করে <strong>Super Admin</strong> অথবা <strong>Verification Admin</strong> নির্বাচন করুন।
            </span>
          </div>
        )}
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div 
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl border transition cursor-pointer bg-white ${
            statusFilter === 'all' ? 'ring-2 ring-blue-500 border-blue-400' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">সর্বমোট</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">সব আবেদন</div>
        </div>

        <div 
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-xl border transition cursor-pointer bg-white ${
            statusFilter === 'pending' ? 'ring-2 ring-amber-500 border-amber-400' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">অপেক্ষমান</div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">{stats.pending}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Pending Review</div>
        </div>

        <div 
          onClick={() => setStatusFilter('under_review')}
          className={`p-4 rounded-xl border transition cursor-pointer bg-white ${
            statusFilter === 'under_review' ? 'ring-2 ring-blue-500 border-blue-400' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">পর্যালোচনাধীন</div>
          <div className="text-xl sm:text-2xl font-black text-blue-600 mt-1">{stats.underReview}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Under Review</div>
        </div>

        <div 
          onClick={() => setStatusFilter('approved')}
          className={`p-4 rounded-xl border transition cursor-pointer bg-white ${
            statusFilter === 'approved' ? 'ring-2 ring-emerald-500 border-emerald-400' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">অনুমোদিত</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{stats.approved}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Verified Profile</div>
        </div>

        <div 
          onClick={() => setStatusFilter('rejected')}
          className={`p-4 rounded-xl border transition cursor-pointer bg-white ${
            statusFilter === 'rejected' ? 'ring-2 ring-rose-500 border-rose-400' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">প্রত্যাখ্যাত</div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 mt-1">{stats.rejected}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Rejected</div>
        </div>

        <div 
          onClick={() => setStatusFilter('reverification_required')}
          className={`p-4 rounded-xl border transition cursor-pointer bg-white ${
            statusFilter === 'reverification_required' ? 'ring-2 ring-purple-500 border-purple-400' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">পুনরায় যাচাই</div>
          <div className="text-xl sm:text-2xl font-black text-purple-600 mt-1">{stats.reverify}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Re-verification</div>
        </div>
      </div>

      {/* Main Tabs: Requests vs Audit Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'requests'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              আবেদন তালিকা ({filteredRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('audit_logs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'audit_logs'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>অডিট লগ (Audit Trail)</span>
            </button>
          </div>

          {activeTab === 'requests' && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Document Type Filter */}
              <select
                value={docTypeFilter}
                onChange={(e) => setDocTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">সব নথি ধরন</option>
                <option value="nid">এনআইডি (NID)</option>
                <option value="driving_license">ড্রাইভিং লাইসেন্স</option>
                <option value="birth_registration">জন্ম নিবন্ধন</option>
                <option value="passport">পাসপোর্ট</option>
              </select>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="নাম, ফোন বা আইডি..."
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 sm:w-56"
                />
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: Requests Table */}
        {activeTab === 'requests' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">ব্যবহারকারী (User)</th>
                  <th className="py-3 px-3">রিকোয়েস্ট আইডি</th>
                  <th className="py-3 px-3">নথির ধরন</th>
                  <th className="py-3 px-3">দাখিলের তারিখ</th>
                  <th className="py-3 px-3">স্ট্যাটাস</th>
                  <th className="py-3 px-3">পর্যালোচক</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      কোনো ভেরিফিকেশন আবেদন পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => {
                    const statusInfo = getVerificationStatusInfo(req.status);
                    const docInfo = getDocumentTypeInfo(req.documentType);
                    return (
                      <tr key={req.id} className="hover:bg-slate-50 transition">
                        {/* User Profile */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            {req.userAvatar ? (
                              <img
                                src={req.userAvatar}
                                alt={req.userName}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                                {req.userName ? req.userName.charAt(0) : 'U'}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-slate-900">{req.userName}</p>
                              <p className="text-[10px] text-slate-500">{req.userPhone}</p>
                            </div>
                          </div>
                        </td>

                        {/* Request ID */}
                        <td className="py-3 px-3 font-mono font-semibold text-slate-600">
                          {req.id}
                        </td>

                        {/* Document Type */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span>{docInfo.icon}</span>
                            <span className="font-medium text-slate-800">{docInfo.shortBn}</span>
                          </div>
                        </td>

                        {/* Submitted Date */}
                        <td className="py-3 px-3 text-[11px] text-slate-500">
                          {new Date(req.submittedAt).toLocaleDateString('bn-BD')}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${statusInfo.badgeBg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                            <span>{statusInfo.labelBn}</span>
                          </span>
                        </td>

                        {/* Reviewer */}
                        <td className="py-3 px-3 text-[11px] text-slate-500">
                          {req.reviewedBy?.adminName || '—'}
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setCustomFeedback(req.adminFeedback || '');
                              if (req.rejectionReason) {
                                setSelectedRejectReason(req.rejectionReason);
                              }
                            }}
                            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1 ml-auto cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>যাচাই ও রিভিউ</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Audit Logs */}
        {activeTab === 'audit_logs' && (
          <div className="divide-y divide-slate-100">
            {safeAuditLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                কোনো অডিট লগ রেকর্ড পাওয়া যায়নি।
              </div>
            ) : (
              safeAuditLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-50 transition flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        log.action === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : log.action === 'REVERIFICATION_REQUESTED'
                          ? 'bg-purple-100 text-purple-800'
                          : log.action === 'UNDER_REVIEW'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {log.action}
                      </span>
                      <span className="font-mono text-slate-500">#{log.verificationRequestId}</span>
                      <span className="font-semibold text-slate-900">
                        কর্তৃক: {log.performedBy.name} ({log.performedBy.role})
                      </span>
                    </div>
                    {log.reason && (
                      <p className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200">
                        {log.reason}
                      </p>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0">
                    {new Date(log.timestamp).toLocaleDateString('bn-BD')} {new Date(log.timestamp).toLocaleTimeString('bn-BD')}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Verification Detail Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-100 text-blue-700 rounded-xl font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    ভেরিফিকেশন রিভিউ — {selectedRequest.id}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    দাখিলের সময়: {new Date(selectedRequest.submittedAt).toLocaleDateString('bn-BD')} {new Date(selectedRequest.submittedAt).toLocaleTimeString('bn-BD')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 flex-1">
              {/* Role restriction banner if not authorized */}
              {!isAuthorizedToReview && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                  <Lock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">সংবেদনশীল নথি সুরক্ষা (Restricted Access):</strong>
                    আপনার বর্তমান ভূমিকা (<strong>{currentAdminRole}</strong>)-এর কারণে গোপনীয় তথ্য ও নথির ছবি প্রদর্শন লক করা হয়েছে। অনুমোদন দিতে উপরের ভূমিকা পরিবর্তন করে Super Admin অথবা Verification Admin বেছে নিন।
                  </div>
                </div>
              )}

              {/* User Overview Section */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {selectedRequest.userAvatar ? (
                      <img
                        src={selectedRequest.userAvatar}
                        alt={selectedRequest.userName}
                        className="w-12 h-12 rounded-full object-cover border border-slate-300"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                        {selectedRequest.userName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900">{selectedRequest.userName}</p>
                      <p className="text-slate-500 font-mono">{selectedRequest.userPhone}</p>
                    </div>
                  </div>
                  {selectedRequest.userAddress && (
                    <p className="text-slate-600 flex items-center gap-1.5 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{selectedRequest.userAddress}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l sm:border-slate-200 sm:pl-4 pt-3 sm:pt-0">
                  <p className="text-slate-500 text-[11px]">নির্বাচিত রোল ও পেশা:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRequest.userCapabilities?.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                        {c}
                      </span>
                    ))}
                    {selectedRequest.userProfessions?.map((p, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {p}
                      </span>
                    ))}
                  </div>
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">বর্তমান স্ট্যাটাস:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getVerificationStatusInfo(selectedRequest.status).badgeBg}`}>
                      {getVerificationStatusInfo(selectedRequest.status).labelBn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submitted Document Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>দাখিলকৃত নথির বিবরণ (Submitted Information)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[11px]">নথির ধরন:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                      {getDocumentTypeInfo(selectedRequest.documentType).icon}{' '}
                      {getDocumentTypeInfo(selectedRequest.documentType).nameBn}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">ডকুমেন্ট নম্বর:</span>
                    <span className="font-bold font-mono text-slate-900 text-sm mt-0.5 block">
                      {isAuthorizedToReview 
                        ? selectedRequest.documentNumber 
                        : maskDocumentNumber(selectedRequest.documentNumber)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">নথির পুরো নাম:</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">
                      {selectedRequest.submittedInformation.fullName}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">জন্ম তারিখ:</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">
                      {selectedRequest.submittedInformation.dateOfBirth}
                    </span>
                  </div>

                  {selectedRequest.submittedInformation.fatherOrSpouseName && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">পিতা / স্বামীর নাম:</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">
                        {selectedRequest.submittedInformation.fatherOrSpouseName}
                      </span>
                    </div>
                  )}

                  {selectedRequest.submittedInformation.bloodGroup && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">রক্তের গ্রুপ:</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">
                        {selectedRequest.submittedInformation.bloodGroup}
                      </span>
                    </div>
                  )}

                  {selectedRequest.submittedInformation.licenseType && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">লাইসেন্সের ক্যাটাগরি:</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">
                        {selectedRequest.submittedInformation.licenseType === 'professional' ? 'পেশাদার (Professional)' : 'অপেশাদার (Non-Professional)'}
                      </span>
                    </div>
                  )}

                  {selectedRequest.submittedInformation.expiryDate && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">মেয়াদোত্তীর্ণের তারিখ:</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">
                        {selectedRequest.submittedInformation.expiryDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Images / Previews */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>দাখিলকৃত নথির স্পষ্ট ছবি ও স্ক্যান (Document Images)</span>
                </h4>

                {!isAuthorizedToReview ? (
                  <div className="p-8 bg-slate-100 rounded-xl border border-dashed border-slate-300 text-center space-y-2">
                    <Lock className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">
                      সংবেদনশীল নথির ছবি সুরক্ষিত অবস্থায় লুকানো রয়েছে
                    </p>
                    <p className="text-[11px] text-slate-400">
                      শুধুমাত্র Super Admin ও Verification Admin নথির কপি দেখতে পারবেন।
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Front / Single document */}
                    {(selectedRequest.documentFiles.frontUrl || selectedRequest.documentFiles.docUrl) && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-slate-700 block">
                          সামনের অংশ / প্রধান পাতা
                        </span>
                        <div 
                          onClick={() => setActiveImagePreview(selectedRequest.documentFiles.frontUrl || selectedRequest.documentFiles.docUrl || null)}
                          className="h-48 rounded-xl overflow-hidden border border-slate-300 bg-slate-900 relative group cursor-pointer flex items-center justify-center"
                        >
                          <img
                            src={selectedRequest.documentFiles.frontUrl || selectedRequest.documentFiles.docUrl}
                            alt="Front Document"
                            className="max-h-full max-w-full object-contain"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                            <Eye className="w-4 h-4" />
                            <span>বড় করে দেখতে ক্লিক করুন</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Back document */}
                    {selectedRequest.documentFiles.backUrl && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-slate-700 block">
                          পেছনের অংশ
                        </span>
                        <div 
                          onClick={() => setActiveImagePreview(selectedRequest.documentFiles.backUrl || null)}
                          className="h-48 rounded-xl overflow-hidden border border-slate-300 bg-slate-900 relative group cursor-pointer flex items-center justify-center"
                        >
                          <img
                            src={selectedRequest.documentFiles.backUrl}
                            alt="Back Document"
                            className="max-h-full max-w-full object-contain"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                            <Eye className="w-4 h-4" />
                            <span>বড় করে দেখতে ক্লিক করুন</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Review Decision Forms (Approve / Reject / Re-verify) */}
              {isAuthorizedToReview && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    অ্যাডমিন সিদ্ধান্ত ও অ্যাকশন (Admin Decision)
                  </h4>

                  {/* Under Review Button */}
                  {selectedRequest.status === 'pending' && (
                    <button
                      onClick={async () => {
                        await onSetUnderReview(selectedRequest.id);
                        setSelectedRequest({ ...selectedRequest, status: 'under_review' });
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>🔍 "পর্যালোচনা চলছে (Under Review)" হিসেবে চিহ্নিত করুন</span>
                    </button>
                  )}

                  {/* Reject / Re-verify options */}
                  {reviewAction === 'reject' && (
                    <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-900">প্রত্যাখ্যানের কারণ নির্বাচন করুন:</span>
                        <button
                          onClick={() => setReviewAction(null)}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          বাতিল
                        </button>
                      </div>

                      <select
                        value={selectedRejectReason}
                        onChange={(e) => setSelectedRejectReason(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-rose-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        {REJECTION_REASONS.map((r, i) => (
                          <option key={i} value={r}>{r}</option>
                        ))}
                      </select>

                      <textarea
                        value={customFeedback}
                        onChange={(e) => setCustomFeedback(e.target.value)}
                        placeholder="ব্যবহারকারীর জন্য অতিরিক্ত দিকনির্দেশনা (ঐচ্ছিক)..."
                        rows={2}
                        className="w-full p-2.5 rounded-lg border border-rose-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />

                      <button
                        onClick={handleExecuteReject}
                        disabled={isProcessing}
                        className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
                      >
                        {isProcessing ? 'প্রসেসিং হচ্ছে...' : 'প্রত্যাখ্যান নিশ্চিত করুন (Confirm Reject)'}
                      </button>
                    </div>
                  )}

                  {reviewAction === 'reverify' && (
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-900">পুনরায় যাচাইয়ের কারণ ও নির্দেশনা লিখুন:</span>
                        <button
                          onClick={() => setReviewAction(null)}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          বাতিল
                        </button>
                      </div>

                      <textarea
                        value={customFeedback}
                        onChange={(e) => setCustomFeedback(e.target.value)}
                        placeholder="যেমন: অনুগ্রহ করে আলোতে পরিষ্কারভাবে এনআইডির পেছনের অংশের স্পষ্ট ছবি পুনরায় আপলোড করুন।"
                        rows={3}
                        className="w-full p-2.5 rounded-lg border border-purple-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />

                      <button
                        onClick={handleExecuteReverify}
                        disabled={isProcessing}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
                      >
                        {isProcessing ? 'প্রসেসিং হচ্ছে...' : 'পুনরায় যাচাইয়ের নির্দেশ পাঠান'}
                      </button>
                    </div>
                  )}

                  {reviewAction === 'approve' && (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900">
                          আপনি কি নিশ্চিত যে এই আবেদনটি অনুমোদন (Approve) করতে চান?
                        </span>
                        <button
                          onClick={() => setReviewAction(null)}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          বাতিল
                        </button>
                      </div>

                      <p className="text-xs text-emerald-800 leading-relaxed">
                        অনুমোদন দিলে ব্যবহারকারীর প্রোফাইলে "✓ যাচাইকৃত প্রোফাইল" সক্রিয় হবে। নথিটি ড্রাইভিং লাইসেন্স হলে চালক ও রাইডার সক্ষমতাও উন্মুক্ত হবে।
                      </p>

                      <button
                        onClick={handleExecuteApprove}
                        disabled={isProcessing}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
                      >
                        {isProcessing ? 'অনুমোদন হচ্ছে...' : 'হ্যাঁ, অনুমোদন করুন (Confirm Approve)'}
                      </button>
                    </div>
                  )}

                  {/* Primary Decision Action Buttons */}
                  {!reviewAction && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => setReviewAction('approve')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>অনুমোদন করুন (Approve)</span>
                      </button>

                      <button
                        onClick={() => setReviewAction('reverify')}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>পুনরায় যাচাই প্রয়োজন (Re-verify)</span>
                      </button>

                      <button
                        onClick={() => setReviewAction('reject')}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>প্রত্যাখ্যান করুন (Reject)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Audit Ref: {selectedRequest.id} • v{selectedRequest.verificationVersion}
              </span>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Preview Modal */}
      {activeImagePreview && (
        <div 
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setActiveImagePreview(null)}
        >
          <div className="max-w-4xl max-h-[90vh] overflow-auto relative">
            <button
              onClick={() => setActiveImagePreview(null)}
              className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full hover:bg-black transition"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeImagePreview}
              alt="Zoomed Document"
              className="max-h-[85vh] w-auto object-contain rounded-xl border border-slate-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};
