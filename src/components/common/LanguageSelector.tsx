import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'card' | 'compact' | 'toggle';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'card',
  className = '',
}) => {
  const { language, setLanguage, t, isBn } = useLanguage();

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 shadow-2xs ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage('bn')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
            isBn
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="বাংলা নির্বাচন করুন"
        >
          <span>বাংলা</span>
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
            !isBn
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Switch to English"
        >
          <span>English</span>
        </button>
      </div>
    );
  }

  if (variant === 'toggle') {
    return (
      <button
        type="button"
        onClick={() => setLanguage(isBn ? 'en' : 'bn')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
          isBn
            ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
        } ${className}`}
        title={isBn ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
      >
        <Globe className="w-3.5 h-3.5 text-blue-600" />
        <span>{isBn ? 'EN (English)' : 'বাংলা'}</span>
      </button>
    );
  }

  // Default 'card' variant for Settings / Profile / Account
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>{isBn ? 'ভাষা / Language' : 'Language / ভাষা'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBn
              ? 'HelpLine অ্যাপের ভাষা নির্বাচন করুন (বাংলা বা English)'
              : 'Select HelpLine app interface language (Bengali or English)'}
          </p>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
          {isBn ? 'বাংলা মোড' : 'English Mode'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Bengali Option */}
        <button
          type="button"
          id="btn-lang-bn"
          onClick={() => setLanguage('bn')}
          className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition cursor-pointer ${
            isBn
              ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 text-blue-900'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🇧🇩</span>
            <div>
              <p className="text-sm font-bold leading-tight">বাংলা</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isBn ? 'সম্পূর্ণ বাংলা ইন্টারফেস (ডিফল্ট)' : 'Full Bengali Interface (Default)'}
              </p>
            </div>
          </div>
          {isBn && (
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
        </button>

        {/* English Option */}
        <button
          type="button"
          id="btn-lang-en"
          onClick={() => setLanguage('en')}
          className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition cursor-pointer ${
            !isBn
              ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 text-blue-900'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🌐</span>
            <div>
              <p className="text-sm font-bold leading-tight">English</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isBn ? 'পুরো অ্যাপ English-এ দেখুন' : 'Full English Interface'}
              </p>
            </div>
          </div>
          {!isBn && (
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
