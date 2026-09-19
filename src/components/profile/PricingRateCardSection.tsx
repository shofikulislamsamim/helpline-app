import React, { useState } from 'react';
import { CreditCard, Edit3, DollarSign, Clock, Calendar } from 'lucide-react';
import { PricingRateCard } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

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
  const { isBn, t, formatNumber, formatCurrency } = useLanguage();
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
            <span>{isBn ? '১৩. সেবার মূল্য ও রেট চার্ট (Pricing & Rate Card)' : '13. Pricing & Rate Card'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBn 
              ? 'আপনার কাজের সাধারণ রেট, দৈনিক মজুরি ও ভিজিট ফি স্পষ্ট থাকলে গ্রাহকরা সহজেই কাজ দিতে পারেন।' 
              : 'Clear standard rates, daily wages, and visit fees help customers easily hire your services.'}
          </p>
        </div>

        {!readOnly && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isBn ? 'রেট চার্ট পরিবর্তন করুন' : 'Edit Rate Card'}</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-slate-50 p-4 rounded-2xl border border-emerald-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'ঘণ্টাভিত্তিক ফি (৳/ঘণ্টা)' : 'Hourly Rate (৳/hr)'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  min="0"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder={isBn ? 'উদা: ৩৫০' : 'e.g. 350'}
                  className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'দৈনিক মজুরি (৳/দিন)' : 'Daily Rate (৳/day)'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  min="0"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(e.target.value)}
                  placeholder={isBn ? 'উদা: ১২০০' : 'e.g. 1200'}
                  className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'ভিজিট / পরিদর্শন ফি (৳)' : 'Visit / Inspection Fee (৳)'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  min="0"
                  value={visitFee}
                  onChange={(e) => setVisitFee(e.target.value)}
                  placeholder={isBn ? 'উদা: ২০০' : 'e.g. 200'}
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
                <strong>{isBn ? 'মূল্য আলোচনা সাপেক্ষে (Negotiable): ' : 'Negotiable Rate: '}</strong>
                {isBn 
                  ? 'কাজের পরিধি ও পার্টসের ওপর ভিত্তি করে মোট দরদাম গ্রাহকের সাথে আলোচনার মাধ্যমে ঠিক হবে।' 
                  : 'Final amount will be agreed upon with the customer depending on work scope and parts.'}
              </label>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'মূল্য নির্ধারণ সংক্রান্ত বিশেষ নোট বা শর্তাবলি' : 'Rate card notes or terms'}
              </label>
              <textarea
                rows={2}
                value={rateDescription}
                onChange={(e) => setRateDescription(e.target.value)}
                placeholder={isBn ? 'উদা: জরুরি কাজের জন্য অতিরিক্ত চার্জ প্রযোজ্য হতে পারে। পার্টসের মূল্য কাজের খরচের বাইরে।' : 'e.g. Extra charge for emergency requests. Parts cost excluded.'}
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
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              {isBn ? 'রেট সেভ করুন' : 'Save Rates'}
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
                <span>{isBn ? 'ঘণ্টাভিত্তিক রেট' : 'Hourly Rate'}</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {pricing?.hourlyRate 
                  ? `${formatCurrency(pricing.hourlyRate)} /${isBn ? 'ঘণ্টা' : 'hr'}` 
                  : (isBn ? 'নির্ধারিত নেই' : 'Not set')}
              </div>
              <span className="text-[10px] text-slate-400">
                {isBn ? 'ছোটখাটো কাজের জন্য' : 'For smaller tasks'}
              </span>
            </div>

            {/* Daily Rate */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? 'দৈনিক মজুরি' : 'Daily Rate'}</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {pricing?.dailyRate 
                  ? `${formatCurrency(pricing.dailyRate)} /${isBn ? 'দিন' : 'day'}` 
                  : (isBn ? 'নির্ধারিত নেই' : 'Not set')}
              </div>
              <span className="text-[10px] text-slate-400">
                {isBn ? 'পুরো দিনের কাজের জন্য' : 'For full day work'}
              </span>
            </div>

            {/* Visit Fee */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                <span>{isBn ? 'ভিজিট / পরিদর্শন ফি' : 'Visit / Inspection Fee'}</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {pricing?.visitFee 
                  ? formatCurrency(pricing.visitFee) 
                  : (isBn ? 'নির্ধারিত নেই' : 'Not set')}
              </div>
              <span className="text-[10px] text-slate-400">
                {isBn ? 'বাসায় এসে সমস্যা দেখার ফি' : 'On-site inspection fee'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/70 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">
                {isBn ? 'দরদাম ব্যবস্থা:' : 'Pricing Model:'}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  pricing?.isNegotiable ?? true
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                }`}
              >
                {pricing?.isNegotiable ?? true 
                  ? (isBn ? '✓ আলোচনা সাপেক্ষে (Negotiable)' : '✓ Negotiable') 
                  : (isBn ? 'ফিক্সড রেট (Fixed)' : 'Fixed Rate')}
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
