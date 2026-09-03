import React, { useState } from 'react';
import { X, Star, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { HireRequest } from '../../types';
import { useHire } from '../../context/HireContext';

interface RatingModalProps {
  request: HireRequest | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  request,
  onClose,
  onSuccess,
}) => {
  const { submitRating } = useHire();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 5) {
      setErrorMsg('অনুগ্রহ করে কর্মীর কাজ সম্পর্কে সংক্ষিপ্ত মতামত লিখুন (কমপক্ষে ৫ অক্ষর)।');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await submitRating(request.id, rating, comment.trim());
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'রেটিং সাবমিট করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels: Record<number, string> = {
    1: 'খুবই অসন্তোষজনক (Very Poor)',
    2: 'সন্তোষজনক নয় (Poor)',
    3: 'মোটামুটি ভালো (Average)',
    4: 'বেশ ভালো কাজ (Good)',
    5: 'অসাধারণ সেবা (Excellent)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">কাজের রেটিং ও রিভিউ দিন</h3>
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
          <div className="text-center py-2">
            <img
              src={
                request.workerAvatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  request.workerName
                )}&background=0284c7&color=fff`
              }
              alt={request.workerName}
              className="w-16 h-16 rounded-2xl mx-auto object-cover border-2 border-slate-200 mb-2"
            />
            <h4 className="font-bold text-slate-900 text-sm">{request.workerName}</h4>
            <p className="text-xs text-slate-500">{request.workerProfession} • {request.workType}</p>

            {/* Star selector */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="text-xs font-semibold text-amber-600 mt-2">
              {ratingLabels[hoverRating || rating]}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              আপনার বাস্তব অভিজ্ঞতা ও মূল্যায়ন <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="কাজের গুণমান, সময়ানুবর্তিতা এবং ব্যবহার কেমন ছিল লিখুন..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 resize-none"
              required
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
              <span>{isSubmitting ? 'জমা হচ্ছে...' : 'রিভিউ জমা দিন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
