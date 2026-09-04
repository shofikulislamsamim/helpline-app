import React from 'react';
import { Lock, Eye, EyeOff, Shield, Smartphone, MapPin, Radio, Check } from 'lucide-react';
import { PrivacySettings } from '../../types';

interface PrivacySettingsSectionProps {
  settings?: PrivacySettings;
  onChange?: (newSettings: PrivacySettings) => void;
  readOnly?: boolean;
}

const DEFAULT_PRIVACY: PrivacySettings = {
  phoneVisibility: 'public',
  addressVisibility: 'area_only',
  showLiveLocation: true,
  showOnlineStatus: true,
};

export const PrivacySettingsSection: React.FC<PrivacySettingsSectionProps> = ({
  settings = DEFAULT_PRIVACY,
  onChange,
  readOnly = false,
}) => {
  const current = { ...DEFAULT_PRIVACY, ...settings };

  const handleUpdate = (partial: Partial<PrivacySettings>) => {
    if (!onChange || readOnly) return;
    onChange({ ...current, ...partial });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-purple-600" />
          <span>১৬. ব্যক্তিগত তথ্যের গোপনীয়তা নিয়ন্ত্রণ (Privacy Settings)</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          আপনার ফোন নম্বর, ঠিকানা এবং লাইভ লোকেশন কারা দেখতে পাবে তা আপনি নিজেই নিয়ন্ত্রণ করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phone Visibility Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Smartphone className="w-4 h-4 text-blue-600" />
            <span>মোবাইল নম্বরের দৃশ্যমানতা</span>
          </div>

          <div className="space-y-1.5">
            {[
              {
                id: 'public',
                label: 'সবার জন্য উন্মুক্ত (Public)',
                desc: 'প্রোফাইলে নম্বর দৃশ্যমান থাকবে, সরাসরি কল পেতে সুবিধা',
              },
              {
                id: 'hirers_only',
                label: 'শুধুমাত্র বুকিংকারী / ক্লায়েন্ট (Hirers Only)',
                desc: 'রিকোয়েস্ট গ্রহণ করার পর কেবল নম্বর দেখা যাবে',
              },
              {
                id: 'hidden',
                label: 'সম্পূর্ণ গোপন রাখুন (Hidden)',
                desc: 'নম্বর লুকানো থাকবে, যোগাযোগের জন্য ইন-অ্যাপ চ্যাট প্রযোজ্য',
              },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition select-none ${
                  current.phoneVisibility === opt.id
                    ? 'bg-blue-50/70 border-blue-300'
                    : 'bg-white border-slate-200 hover:bg-slate-100/60'
                } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <input
                  type="radio"
                  name="phoneVisibility"
                  disabled={readOnly}
                  checked={current.phoneVisibility === opt.id}
                  onChange={() => handleUpdate({ phoneVisibility: opt.id as any })}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">{opt.label}</span>
                  <span className="text-[11px] text-slate-500">{opt.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Address Visibility Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>ঠিকানার বিস্তারিত স্তর</span>
          </div>

          <div className="space-y-1.5">
            {[
              {
                id: 'area_only',
                label: 'শুধুমাত্র এলাকা ও থানা (Area & Upazila)',
                desc: 'উদা: মিরপুর-১০, ঢাকা (নিরাপদ ও সুপারিশকৃত)',
              },
              {
                id: 'city_only',
                label: 'শুধুমাত্র জেলা/শহর (City Only)',
                desc: 'উদা: ঢাকা, বরিশাল (সর্বোচ্চ গোপনীয়তা)',
              },
              {
                id: 'full',
                label: 'সম্পূর্ণ বিস্তারিত ঠিকানা (Full Address)',
                desc: 'বাড়ি ও রোড নম্বরসহ বিস্তারিত প্রকাশ',
              },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition select-none ${
                  current.addressVisibility === opt.id
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-white border-slate-200 hover:bg-slate-100/60'
                } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <input
                  type="radio"
                  name="addressVisibility"
                  disabled={readOnly}
                  checked={current.addressVisibility === opt.id}
                  onChange={() => handleUpdate({ addressVisibility: opt.id as any })}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">{opt.label}</span>
                  <span className="text-[11px] text-slate-500">{opt.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Live Location Toggle */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Radio className="w-4 h-4 text-blue-600" />
              <span>লাইভ জিপিএস লোকেশন শেয়ার</span>
            </div>
            <p className="text-[11px] text-slate-500">
              নিকটবর্তী ৫-১৫ কিমি এর মধ্যে কাস্টমাররা যেন আপনাকে খুঁজে পান
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              disabled={readOnly}
              checked={current.showLiveLocation}
              onChange={(e) => handleUpdate({ showLiveLocation: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Online Status Toggle */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>অনলাইন কাজের প্রাপ্যতা প্রদর্শন</span>
            </div>
            <p className="text-[11px] text-slate-500">
              প্রোফাইলে 🟢 বা 🔴 স্ট্যাটাস ব্যাজ দেখানো হবে
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              disabled={readOnly}
              checked={current.showOnlineStatus}
              onChange={(e) => handleUpdate({ showOnlineStatus: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
