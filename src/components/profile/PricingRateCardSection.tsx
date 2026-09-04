import React, { useState } from 'react';
import { CreditCard, Edit3, Check, DollarSign, Clock, Calendar, HelpCircle, CheckCircle } from 'lucide-react';
import { PricingRateCard } from '../../types';

interface PricingRateCardSectionProps {
  pricing?: PricingRateCard;
  onChange?: (newPricing: PricingRateCard) => void;
  readOnly?: boolean;
}

export const PricingRateCardSection: React.FC<PricingRateCardSectionProps> = ({
  pricing,
  onChange,
  readOnly = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hourlyRate, setHourlyRate] = useState<string>(pricing?.hourlyRate?.toString() || '');
  const [dailyRate, setDailyRate] = useState<string>(pricing?.dailyRate?.toString() || '');
  const [visitFee, setVisitFee] = useState<string>(pricing?.visitFee?.toString() || '');
  const [isNegotiable, setIsNegotiable] = useState<boolean>(pricing?.isNegotiable ?? true);
  const [rateDescription, setRateDescription] = useState<string>(pricing?.rateDescription || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onChange) return;

    onChange({
      hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
      dailyRate: dailyRate ? Number(dailyRate) : undefined,
      visitFee: visitFee ? Number(visitFee) : undefined,
      isNegotiable,
      rateDescription: rateDescription.trim() || undefined,
    });

    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>১৩. সেবার মূল্য ও রেট চার্ট (Pricing & Rate Card)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            আপনার কাজের সাধারণ রেট, দৈনিক মজুরি ও ভিজিট ফি স্পষ্ট থাকলে গ্রাহকরা সহজেই কাজ দিতে পারেন।
          </p>
        </div>

        {!readOnly && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>রেট চার্ট পরিবর্তন করুন</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-slate-50 p-4 rounded-2xl border border-emerald-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ঘণ্টাভিত্তিক ফি (৳/ঘণ্টা)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  min="0"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="উদা: ৩৫০"
                  className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                দৈনিক মজুরি (৳/দিন)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  min="0"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(e.target.value)}
                  placeholder="উদা: ১২০০"
                  className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ভিজিট / পরিদর্শন ফি (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  min="0"
                  value={visitFee}
                  onChange={(e) => setVisitFee(e.target.value)}
                  placeholder="উদা: ২০০"
                  className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="sm:col-span-3 flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="isNegotiableInput"
                checked={isNegotiable}
                onChange={(e) => setIsNegotiable(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="isNegotiableInput" className="text-xs text-slate-800 font-medium cursor-pointer">
                <strong>মূল্য আলোচনা সাপেক্ষে (Negotiable):</strong> কাজের পরিধি ও পার্টসের ওপর ভিত্তি করে মোট দরদাম গ্রাহকের সাথে আলোচনার মাধ্যমে ঠিক হবে।
              </label>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                মূল্য নির্ধারণ সংক্রান্ত বিশেষ নোট বা শর্তাবলি
              </label>
              <textarea
                rows={2}
                value={rateDescription}
                onChange={(e) => setRateDescription(e.target.value)}
                placeholder="উদা: জরুরি কাজের জন্য অতিরিক্ত চার্জ প্রযোজ্য হতে পারে। পার্টসের মূল্য কাজের খরচের বাইরে।"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              রেট সেভ করুন
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Hourly Rate */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>ঘণ্টাভিত্তিক রেট</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {pricing?.hourlyRate ? `৳${pricing.hourlyRate} /ঘণ্টা` : 'নির্ধারিত নেই'}
              </div>
              <span className="text-[10px] text-slate-400">ছোটখাটো কাজের জন্য</span>
            </div>

            {/* Daily Rate */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>দৈনিক মজুরি</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {pricing?.dailyRate ? `৳${pricing.dailyRate} /দিন` : 'নির্ধারিত নেই'}
              </div>
              <span className="text-[10px] text-slate-400">পুরো দিনের কাজের জন্য</span>
            </div>

            {/* Visit Fee */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                <span>ভিজিট / পরিদর্শন ফি</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {pricing?.visitFee ? `৳${pricing.visitFee}` : 'নির্ধারিত নেই'}
              </div>
              <span className="text-[10px] text-slate-400">বাসায় এসে সমস্যা দেখার ফি</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/70 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">দরদাম ব্যবস্থা:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  pricing?.isNegotiable ?? true
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                }`}
              >
                {pricing?.isNegotiable ?? true ? '✓ আলোচনা সাপেক্ষে (Negotiable)' : 'ফিক্সড রেট (Fixed)'}
              </span>
            </div>

            {pricing?.rateDescription && (
              <p className="text-[11px] text-slate-500 max-w-md">
                💡 {pricing.rateDescription}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
