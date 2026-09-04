import React from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  FileCheck2, 
  Briefcase,
  Coins,
  Receipt,
  Info,
  BadgeAlert
} from 'lucide-react';
import { HireRequest } from '../../types';
import { calculateServiceFee } from '../../lib/commissionData';
import { useHire } from '../../context/HireContext';

interface DigitalJobRecordModalProps {
  request: HireRequest | null;
  onClose: () => void;
}

export const DigitalJobRecordModal: React.FC<DigitalJobRecordModalProps> = ({
  request,
  onClose,
}) => {
  const { commissionSettings } = useHire();

  if (!request) return null;

  const basePrice = request.agreedPrice || request.quote?.estimatedPrice || request.budget || 0;
  const breakdown = request.serviceFeeBreakdown || (basePrice > 0 ? calculateServiceFee(basePrice, commissionSettings) : null);

  const handlePrint = () => {
    window.print();
  };

  const getStatusBn = (status: string) => {
    switch (status) {
      case 'REQUESTED': return 'অনুরোধ পাঠানো হয়েছে (Requested)';
      case 'QUOTED': return 'কোটেশন প্রদানকৃত (Quoted)';
      case 'ACCEPTED': return 'চুক্তি নিশ্চিতকৃত (Accepted)';
      case 'ON_THE_WAY': return 'কর্মী রওনা দিয়েছেন (On The Way)';
      case 'WORK_STARTED': return 'কাজ চলমান (Work Started)';
      case 'WORK_COMPLETED': return 'সফলভাবে সম্পন্ন (Completed)';
      case 'CANCELLED': return 'বাতিলকৃত (Cancelled)';
      case 'REJECTED': return 'প্রত্যাখ্যাত (Rejected)';
      case 'DISPUTED': return 'অভিযোগাধীন (Disputed)';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 print:shadow-none print:border-none print:m-0">
        {/* Header bar (no-print on close, print button) */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">ডিজিটাল জব রেকর্ড (Digital Job Record)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট / সেভ</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Job Certificate / Record Document */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800">
          {/* Document Title & Watermark header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  HL
                </span>
                <span className="text-xl font-black tracking-tight text-slate-900">HelpLine BD</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                বাংলাদেশ ডিজিটাল সার্ভিসেস প্ল্যাটফর্ম • অফিশিয়াল জব রেকর্ড
              </p>
            </div>
            <div className="sm:text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Job Record ID
              </span>
              <span className="text-base font-black text-blue-700 font-mono">
                {request.id}
              </span>
              <div className="mt-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {getStatusBn(request.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Parties Involved Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                গ্রাহক / নিয়োগকারী (Customer)
              </span>
              <p className="text-sm font-bold text-slate-900">{request.customerName}</p>
              <p className="text-slate-600">ফোন: <span className="font-mono">{request.customerPhone}</span></p>
              <p className="text-slate-600">ঠিকানা: {request.workLocation.fullAddress}</p>
            </div>

            {/* Worker */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                দক্ষ কারিগর / কর্মী (Service Provider)
              </span>
              <p className="text-sm font-bold text-slate-900">{request.workerName}</p>
              <p className="text-blue-700 font-semibold">{request.workerProfession}</p>
              <p className="text-slate-600">ফোন: <span className="font-mono">{request.workerPhone}</span></p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>HelpLine Verified Worker</span>
              </span>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              কাজের বিবরণ ও শর্তাবলী (Job Specifications)
            </h4>
            <div className="p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-700">কাজের ধরন:</span>
                <span className="font-bold text-slate-900">{request.workType}</span>
              </div>
              <div className="border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-700 block mb-1">সমস্যার বিস্তারিত:</span>
                <p className="text-slate-600 leading-relaxed">{request.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-2">
                <div>
                  <span className="text-slate-500">নির্ধারিত তারিখ:</span>
                  <p className="font-semibold text-slate-800">{request.preferredDate}</p>
                </div>
                <div>
                  <span className="text-slate-500">নির্ধারিত সময়:</span>
                  <p className="font-semibold text-slate-800">{request.preferredTime}</p>
                </div>
              </div>
              {request.notes && (
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-slate-500">বিশেষ নির্দেশনা:</span>
                  <p className="text-slate-700">{request.notes}</p>
                </div>
              )}
              <div className="flex justify-between items-center pt-1 text-sm font-bold">
                <span className="text-slate-800">চুক্তিভিত্তিক কাজের মূল্য (Agreed Job Price):</span>
                <span className="text-lg font-black text-blue-700 font-mono">
                  ৳{basePrice > 0 ? basePrice : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown & Service Fee (Preparatory) */}
          {breakdown && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-blue-600" />
                  <span>সার্ভিস ফি ও কমিশন হিসাব (Financial Breakdown)</span>
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {breakdown.isEnabled ? 'ফি সক্রিয়' : 'ফি মওকুফ (০%)'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-slate-700">
                    <span>গ্রাহকের সম্মত কাজের মূল্য (Agreed Price):</span>
                    <span className="font-bold text-slate-900 font-mono">৳{breakdown.agreedPrice}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 pl-3 border-l-2 border-slate-200">
                    <span>শতকরা কমিশন ({breakdown.commissionPercentage}%):</span>
                    <span className="font-medium text-slate-800 font-mono">৳{breakdown.percentageFee}</span>
                  </div>

                  {breakdown.fixedFee > 0 && (
                    <div className="flex justify-between items-center text-slate-600 pl-3 border-l-2 border-slate-200">
                      <span>ফিক্সড সার্ভিস চার্জ:</span>
                      <span className="font-medium text-slate-800 font-mono">৳{breakdown.fixedFee}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-blue-700 font-semibold pt-1 border-t border-slate-200/60">
                    <span>মোট প্ল্যাটফর্ম সার্ভিস ফি:</span>
                    <span className="font-bold font-mono">৳{breakdown.totalServiceFee}</span>
                  </div>

                  <div className="flex justify-between items-center text-emerald-700 font-semibold pt-1 border-t border-slate-200/60">
                    <span>কারিগর প্রাপ্য নীট অর্থ (Worker Net Receivable):</span>
                    <span className="font-bold text-emerald-800 font-mono text-sm">৳{breakdown.workerReceivableAmount}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-900 font-black pt-2 border-t-2 border-slate-300 text-sm">
                    <span>গ্রাহকের মোট প্রদেয় (Total Customer Payable):</span>
                    <span className="font-black text-blue-800 font-mono text-base">৳{breakdown.customerTotalPayable}</span>
                  </div>
                </div>

                {/* Preparatory Notice */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-[11px] text-amber-800">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">প্রস্তুতিমূলক হিসাব বিজ্ঞপ্তি (Preparation Phase):</span>
                    <p className="mt-0.5 text-amber-700 leading-normal">
                      {breakdown.preparatoryNotice || 'এটি একটি প্রস্তুতিমূলক ফি হিসাব (Preparatory Calculation)। বর্তমানে কোনো পেমেন্ট গেটওয়ে বা সরাসরি অর্থ কর্তন কার্যকর করা হয়নি। গ্রাহক সরাসরি কারিগরকে কাজ শেষে চুক্তি অনুযায়ী অর্থ পরিশোধ করবেন।'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lifecycle Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              কাজের সময়রেখা (Audit Timeline)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">অনুরোধের সময়</span>
                <span className="font-semibold text-slate-800 text-[11px]">
                  {request.createdAt ? new Date(request.createdAt).toLocaleDateString('bn-BD') : '—'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">কোটেশন প্রদান</span>
                <span className="font-semibold text-slate-800 text-[11px]">
                  {request.quotedAt ? new Date(request.quotedAt).toLocaleDateString('bn-BD') : '—'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">চুক্তি সম্পন্ন</span>
                <span className="font-semibold text-slate-800 text-[11px]">
                  {request.acceptedAt ? new Date(request.acceptedAt).toLocaleDateString('bn-BD') : '—'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">কাজ সম্পন্ন</span>
                <span className="font-semibold text-slate-800 text-[11px]">
                  {request.completedAt ? new Date(request.completedAt).toLocaleDateString('bn-BD') : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Review if submitted */}
          {request.ratingSubmitted && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">গ্রাহকের রেটিং ও মূল্যায়ন</span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  {Array.from({ length: request.ratingValue || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span>({request.ratingValue} / ৫)</span>
                </div>
              </div>
              {request.ratingComment && (
                <p className="text-amber-800 italic">"{request.ratingComment}"</p>
              )}
            </div>
          )}

          {/* Security & Disclaimer Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-slate-400 text-center sm:text-left">
            <span>HelpLine Digital Platform Authenticated Record</span>
            <span>helplinebd.com • সাপোর্ট: ০9612-435777</span>
          </div>
        </div>

        {/* Close footer button for modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
