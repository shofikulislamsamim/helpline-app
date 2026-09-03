import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { HireRequest, UserComplaint } from '../../types';
import { useHire } from '../../context/HireContext';

interface JobComplaintModalProps {
  request: HireRequest | null;
  onClose: () => void;
  onSuccess?: (complaint: UserComplaint) => void;
}

export const JobComplaintModal: React.FC<JobComplaintModalProps> = ({
  request,
  onClose,
  onSuccess,
}) => {
  const { submitComplaint } = useHire();
  const [reason, setReason] = useState('কাজের মান অসন্তোষজনক');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedComplaint, setSubmittedComplaint] = useState<UserComplaint | null>(null);

  if (!request) return null;

  const complaintReasons = [
    'কাজের মান অসন্তোষজনক ও ত্রুটিপূর্ণ',
    'চুক্তিভঙ্গ বা অতিরিক্ত টাকা দাবি',
    'নির্ধারিত সময়ে কাজে আসেনি',
    'অসৌজন্যমূলক আচরণ বা দুর্ব্যবহার',
    'কাজে মালামালের ক্ষয়ক্ষতিসাধন',
    'অন্যান্য গুরুতর সমস্যা',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || details.trim().length < 10) {
      setErrorMsg('অনুগ্রহ করে সমস্যার বিস্তারিত বিবরণ লিখুন (কমপক্ষে ১০ অক্ষর)।');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const cmp = await submitComplaint(request.id, reason, details.trim());
      setSubmittedComplaint(cmp);
      if (onSuccess) onSuccess(cmp);
    } catch (err: any) {
      setErrorMsg(err.message || 'অভিযোগ জমা দিতে ব্যর্থ হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-red-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-200" />
            <h3 className="font-bold text-white text-base">অভিযোগ দাখিল করুন (Complaint)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedComplaint ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">অভিযোগ নথিভুক্ত হয়েছে!</h4>
              <p className="text-xs text-slate-500 mt-1">
                কমপ্লেইন্ট ট্র্যাকিং আইডি: <strong className="text-red-600 font-mono">{submittedComplaint.id}</strong>
              </p>
            </div>
            <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              HelpLine এর অ্যাডমিন ও কাস্টমার সাপোর্ট টিম বিষয়টি তদন্ত করে উভয় পক্ষের সাথে যোগাযোগ করবে।
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
            >
              ঠিক আছে
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800">
              <p>
                <strong>অনুরোধ:</strong> #{request.id} ({request.workType})
              </p>
              <p className="text-[11px] text-red-700 mt-0.5">
                অ্যাডমিন প্যানেল কর্তৃক অভিযোগটি সরাসরি যাচাই ও নিষ্পত্তি করা হবে।
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                অভিযোগের কারণ নির্বাচন করুন <span className="text-red-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500"
              >
                {complaintReasons.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                অভিযোগের বিস্তারিত প্রমাণ ও বিবরণ <span className="text-red-500">*</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="ঠিক কী ঘটেছে এবং কোন বিষয়ে সমাধান চান তা পরিষ্কারভাবে লিখুন..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 resize-none"
                required
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'জমা হচ্ছে...' : 'অভিযোগ দাখিল করুন'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
