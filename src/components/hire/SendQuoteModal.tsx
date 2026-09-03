import React, { useState } from 'react';
import { X, Send, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { HireRequest } from '../../types';
import { useHire } from '../../context/HireContext';

interface SendQuoteModalProps {
  request: HireRequest | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SendQuoteModal: React.FC<SendQuoteModalProps> = ({
  request,
  onClose,
  onSuccess,
}) => {
  const { sendQuote } = useHire();
  const [estimatedPrice, setEstimatedPrice] = useState<number>(request?.budget || 500);
  const [quoteNote, setQuoteNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estimatedPrice || estimatedPrice <= 0) {
      setErrorMsg('সঠিক আনুমানিক মূল্য উল্লেখ করুন।');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await sendQuote(request.id, Number(estimatedPrice), quoteNote.trim());
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'কোটেশন পাঠাতে ব্যর্থ হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">মূল্য কোটেশন পাঠান (Send Quote)</h3>
            <p className="text-xs text-slate-400">অনুরোধ #{request.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <p><strong>কাজের ধরন:</strong> {request.workType}</p>
            <p><strong>কাস্টমার:</strong> {request.customerName}</p>
            <p><strong>স্থান:</strong> {request.workLocation.fullAddress}</p>
            {request.budget && (
              <p><strong>কাস্টমারের বাজেট:</strong> ৳{request.budget}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              আপনার আনুমানিক পারিশ্রমিক (৳) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-bold text-slate-500 text-sm">৳</span>
              <input
                type="number"
                min="100"
                step="50"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(Number(e.target.value))}
                placeholder="যেমন: ৮০০"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              কোটেশনের বিবরণ / পার্টসের শর্ত (ঐচ্ছিক)
            </label>
            <textarea
              value={quoteNote}
              onChange={(e) => setQuoteNote(e.target.value)}
              rows={2}
              placeholder="যেমন: কাজের আনুমানিক সময় ২ ঘণ্টা, নতুন যন্ত্রাংশের খরচ আলাদা বহন করতে হবে..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
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
              className="flex-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'পাঠানো হচ্ছে...' : 'কোটেশন পাঠান'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
