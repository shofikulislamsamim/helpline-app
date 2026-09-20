import React from 'react';
import { 
  X, 
  PhoneCall, 
  MessageSquare, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  Send, 
  CheckCircle2, 
  Truck, 
  PlayCircle, 
  CheckCheck, 
  AlertCircle,
  ShieldCheck,
  Coins
} from 'lucide-react';
import { HireRequest } from '../../types';
import { calculateServiceFee } from '../../lib/commissionData';
import { useHire } from '../../context/HireContext';
import { LiveJobMap } from './LiveJobMap';

interface RequestDetailsModalProps {
  request: HireRequest | null;
  onClose: () => void;
  onSendQuote: (request: HireRequest) => void;
  onReject: (requestId: string) => void;
  onAdvanceStatus: (requestId: string, status: 'ON_THE_WAY' | 'WORK_STARTED' | 'WORK_COMPLETED') => void;
  onOpenChat: (request: HireRequest) => void;
  onOpenDigitalRecord: (request: HireRequest) => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  request,
  onClose,
  onSendQuote,
  onReject,
  onAdvanceStatus,
  onOpenChat,
  onOpenDigitalRecord,
}) => {
  const { commissionSettings } = useHire();

  if (!request) return null;

  const basePrice = request.agreedPrice || request.quote?.estimatedPrice || request.budget || 500;
  const feeBreakdown = request.serviceFeeBreakdown || calculateServiceFee(basePrice, commissionSettings);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">🔴 নতুন অনুরোধ</span>;
      case 'QUOTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">🔵 কোটেশন অপেক্ষমান</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">🟡 কাজ গৃহীত</span>;
      case 'ON_THE_WAY':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 animate-pulse">🟡 কর্মী রওনা দিয়েছেন</span>;
      case 'WORK_STARTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">🟡 কাজ চলমান</span>;
      case 'WORK_COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">🟢 কাজ সম্পন্ন</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">⚪ বাতিল</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">⚪ প্রত্যাখ্যাত</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm">
              📋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">অনুরোধের বিবরণ #{request.id}</h3>
              </div>
              <p className="text-xs text-slate-400">{request.workType} • তারিখ: {request.preferredDate}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status and Action banner */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">বর্তমান অবস্থা</span>
              <div className="mt-1">{getStatusBadge(request.status)}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">পারিশ্রমিক / বাজেট</span>
              <span className="text-lg font-black text-blue-700 font-mono">
                ৳{request.agreedPrice || request.quote?.estimatedPrice || request.budget || 'আলোচনা সাপেক্ষে'}
              </span>
            </div>
          </div>

          {/* Customer Information Card */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">কাস্টমারের তথ্য</h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  {request.customerName?.charAt(0) || 'ক'}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">{request.customerName}</h5>
                  <p className="text-xs text-slate-500 font-mono">{request.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${request.customerPhone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>সরাসরি কল</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenChat(request);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>চ্যাট করুন</span>
                </button>
              </div>
            </div>

            {/* Location & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">কাজের ঠিকানা:</span>
                  <span>{request.workLocation?.fullAddress}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">সময়সূচী:</span>
                  <span>{request.preferredDate} ({request.preferredTime})</span>
                </div>
              </div>
            </div>
          </div>

          {(request.status === 'ON_THE_WAY' || request.status === 'WORK_STARTED') && (
            <LiveJobMap request={request} compact />
          )}

          {/* Problem Details */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">কাজের বিবরণ ও সমস্যা</h4>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {request.description}
            </p>
            {request.notes && (
              <p className="text-xs text-blue-700 bg-blue-50 p-2 rounded-xl border border-blue-100">
                📌 কাস্টমার নোট: {request.notes}
              </p>
            )}
            {request.rejectionReason && (
              <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-xl border border-rose-100">
                ❌ বাতিলের কারণ: {request.rejectionReason}
              </p>
            )}
          </div>

          {/* Service Fee Calculation Preview */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>প্ল্যাটফর্ম পারিশ্রমিক হিসাব (স্বচ্ছ মডেল)</span>
              </span>
              <span className="text-[11px] font-semibold text-amber-800">
                কমিশন হার: {feeBreakdown.commissionRate}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-white p-2 rounded-xl border border-amber-100">
                <span className="text-[10px] text-slate-400 block font-bold">মোট চুক্তি</span>
                <span className="text-xs font-black text-slate-900 font-mono">৳{feeBreakdown.agreedPrice}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-amber-100">
                <span className="text-[10px] text-slate-400 block font-bold">প্ল্যাটফর্ম ফি</span>
                <span className="text-xs font-black text-rose-600 font-mono">৳{feeBreakdown.platformFee}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-amber-100">
                <span className="text-[10px] text-slate-400 block font-bold">আপনার প্রাপ্য</span>
                <span className="text-xs font-black text-emerald-700 font-mono">৳{feeBreakdown.workerReceivable}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenDigitalRecord(request);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>ডিজিটাল রেকর্ড স্লিপ</span>
          </button>

          <div className="flex items-center gap-2">
            {request.status === 'REQUESTED' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onReject(request.id);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                >
                  প্রত্যাখ্যান
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSendQuote(request);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>কোটেশন পাঠান</span>
                </button>
              </>
            )}

            {request.status === 'QUOTED' && (
              <span className="text-xs text-blue-700 bg-blue-50 py-2 px-3 rounded-xl font-bold border border-blue-200">
                কোটেশন পাঠানো হয়েছে (কাস্টমারের উত্তরের অপেক্ষায়)
              </span>
            )}

            {request.status === 'ACCEPTED' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAdvanceStatus(request.id, 'ON_THE_WAY');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>রওনা দিয়েছি (On The Way)</span>
              </button>
            )}

            {request.status === 'ON_THE_WAY' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAdvanceStatus(request.id, 'WORK_STARTED');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>কাজ শুরু করেছি (Start Work)</span>
              </button>
            )}

            {request.status === 'WORK_STARTED' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAdvanceStatus(request.id, 'WORK_COMPLETED');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>কাজ সম্পন্ন হয়েছে (Complete)</span>
              </button>
            )}

            {request.status === 'WORK_COMPLETED' && (
              <span className="text-xs text-emerald-700 bg-emerald-50 py-2 px-3 rounded-xl font-bold border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>কাজ সম্পন্ন হয়েছে</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
