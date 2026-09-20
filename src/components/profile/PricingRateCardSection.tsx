import React, { useEffect, useState } from 'react';
import { CreditCard, Edit3, DollarSign, Clock, Calendar } from 'lucide-react';
import { PricingRateCard } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface PricingRateCardSectionProps {
  pricing?: PricingRateCard;
  onChange?: (newPricing: PricingRateCard) => void;
  readOnly?: boolean;
}

const parseRate = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
};

export const PricingRateCardSection: React.FC<PricingRateCardSectionProps> = ({
  pricing,
  onChange,
  readOnly = false,
}) => {
  const { isBn, t, formatCurrency } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [hourlyRate, setHourlyRate] = useState<string>(pricing?.hourlyRate?.toString() || '');
  const [dailyRate, setDailyRate] = useState<string>(pricing?.dailyRate?.toString() || '');
  const [visitFee, setVisitFee] = useState<string>(pricing?.visitFee?.toString() || '');
  const [isNegotiable, setIsNegotiable] = useState<boolean>(pricing?.isNegotiable ?? true);
  const [rateDescription, setRateDescription] = useState<string>(pricing?.rateDescription || '');
  const [rateError, setRateError] = useState('');

  useEffect(() => {
    if (isEditing) return;
    setHourlyRate(pricing?.hourlyRate?.toString() || '');
    setDailyRate(pricing?.dailyRate?.toString() || '');
    setVisitFee(pricing?.visitFee?.toString() || '');
    setIsNegotiable(pricing?.isNegotiable ?? true);
    setRateDescription(pricing?.rateDescription || '');
  }, [pricing, isEditing]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onChange) return;

    const hourly = parseRate(hourlyRate);
    const daily = parseRate(dailyRate);
    const visit = parseRate(visitFee);

    const hasInvalidInput =
      (hourlyRate.trim() && hourly === undefined) ||
      (dailyRate.trim() && daily === undefined) ||
      (visitFee.trim() && visit === undefined);

    if (hasInvalidInput) {
      setRateError(
        isBn
          ? 'রেট অবশ্যই ০ বা তার বেশি হতে হবে। ভুল মান থাকলে সেভ করা যাবে না।'
          : 'Rates must be 0 or greater. Invalid values cannot be saved.'
      );
      return;
    }

    setRateError('');

    onChange({
      hourlyRate: hourly,
      dailyRate: daily,
      visitFee: visit,
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
            <span>{isBn ? 'মূল্য ও রেট চার্ট' : 'Pricing & Rate Card'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBn
              ? 'ঘণ্টা, দিন বা ভিজিট অনুযায়ী আপনার সাধারণ রেট দিন। দরদাম সাপেক্ষে হলে রেট ফাঁকা রাখা যাবে।'
              : 'Set hourly, daily, or visit rates. Leave numeric rates blank if the final price is negotiable.'}
          </p>
        </div>

        {!readOnly && !isEditing && (
          <button
            type="button"
            onClick={() => {
              setRateError('');
              setIsEditing(true);
            }}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isBn ? 'রেট সেট করুন' : 'Set Rates'}</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-slate-50 p-4 rounded-2xl border border-emerald-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                labelBn: 'ঘণ্টাভিত্তিক রেট (৳/ঘণ্টা)',
                labelEn: 'Hourly Rate (৳/hr)',
                value: hourlyRate,
                setValue: setHourlyRate,
                placeholderBn: 'যেমন: ৩৫০',
                placeholderEn: 'e.g. 350',
              },
              {
                labelBn: 'দৈনিক রেট (৳/দিন)',
                labelEn: 'Daily Rate (৳/day)',
                value: dailyRate,
                setValue: setDailyRate,
                placeholderBn: 'যেমন: ১২০০',
                placeholderEn: 'e.g. 1200',
              },
              {
                labelBn: 'ভিজিট / পরিদর্শন ফি (৳)',
                labelEn: 'Visit / Inspection Fee (৳)',
                value: visitFee,
                setValue: setVisitFee,
                placeholderBn: 'যেমন: ২০০',
                placeholderEn: 'e.g. 200',
              },
            ].map((field) => (
              <div key={field.labelEn}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? field.labelBn : field.labelEn}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">৳</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={field.value}
                    onChange={(e) => {
                      field.setValue(e.target.value);
                      setRateError('');
                    }}
                    placeholder={isBn ? field.placeholderBn : field.placeholderEn}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            ))}

            <div className="sm:col-span-3 flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="isNegotiableInput"
                checked={isNegotiable}
                onChange={(e) => setIsNegotiable(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="isNegotiableInput" className="text-xs text-slate-800 font-medium cursor-pointer">
                <strong>{isBn ? 'মূল্য আলোচনা সাপেক্ষে: ' : 'Negotiable Rate: '}</strong>
                {isBn
                  ? 'ফাইনাল মূল্য কাজের পরিধি অনুযায়ী আলোচনা করে ঠিক হবে।'
                  : 'The final price can be agreed based on the work scope.'}
              </label>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'রেটের নোট / শর্তাবলি' : 'Rate notes / terms'}
              </label>
              <textarea
                rows={2}
                maxLength={300}
                value={rateDescription}
                onChange={(e) => setRateDescription(e.target.value)}
                placeholder={isBn ? 'যেমন: জরুরি কাজের জন্য অতিরিক্ত চার্জ হতে পারে। পার্টসের মূল্য আলাদা।' : 'e.g. Emergency work may have an extra charge. Parts are separate.'}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {rateError && (
            <p role="alert" className="text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {rateError}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setRateError('');
                setIsEditing(false);
              }}
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
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{isBn ? 'ঘণ্টাভিত্তিক রেট' : 'Hourly Rate'}</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {pricing?.hourlyRate !== undefined
                  ? `${formatCurrency(pricing.hourlyRate)} /${isBn ? 'ঘণ্টা' : 'hr'}`
                  : (isBn ? 'নির্ধারিত নেই' : 'Not set')}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? 'দৈনিক রেট' : 'Daily Rate'}</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {pricing?.dailyRate !== undefined
                  ? `${formatCurrency(pricing.dailyRate)} /${isBn ? 'দিন' : 'day'}`
                  : (isBn ? 'নির্ধারিত নেই' : 'Not set')}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                <span>{isBn ? 'ভিজিট / পরিদর্শন ফি' : 'Visit / Inspection Fee'}</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {pricing?.visitFee !== undefined
                  ? formatCurrency(pricing.visitFee)
                  : (isBn ? 'নির্ধারিত নেই' : 'Not set')}
              </div>
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
                  ? (isBn ? '✓ আলোচনা সাপেক্ষে' : '✓ Negotiable')
                  : (isBn ? 'ফিক্সড রেট' : 'Fixed Rate')}
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
