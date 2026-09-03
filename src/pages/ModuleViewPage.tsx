import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Wrench, 
  HardHat, 
  Briefcase, 
  Car, 
  PackageCheck, 
  ShoppingBag, 
  Search, 
  SlidersHorizontal,
  Info,
  CheckCircle2
} from 'lucide-react';
import { ModuleId } from '../types';
import { i18n } from '../lib/i18n';
import { EmptyState } from '../components/common/EmptyState';
import { HirePage } from './HirePage';
import { WorkInboxPage } from './WorkInboxPage';

interface ModuleViewPageProps {
  moduleId: ModuleId;
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export const ModuleViewPage: React.FC<ModuleViewPageProps> = ({ moduleId, onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  // STEP 4: Live Marketplace implementation for HIRE & WORK modules
  if (moduleId === 'hire') {
    return <HirePage onBack={onBack} onNavigate={onNavigate} />;
  }

  if (moduleId === 'work') {
    return <WorkInboxPage onNavigate={onNavigate} />;
  }

  const moduleData = {
    hire: {
      title: i18n.modules.hire.title,
      subtitle: i18n.modules.hire.subtitle,
      description: i18n.modules.hire.description,
      icon: Wrench,
      accent: 'emerald',
      categories: ['সবগুলো', 'ইলেকট্রিশিয়ান', 'প্লাম্বার', 'এসি সার্ভিস', 'রং মিস্ত্রি', 'ছুটা বুয়া', 'গ্যাস টেকনিশিয়ান'],
      futureCapabilities: [
        'নিকটবর্তী ভেরিফাইড মিস্ত্রি ও কাজের মানুষের তালিকা',
        'ম্যাপে লাইভ অবস্থান ও রেটিং পর্যালোচনা',
        'সরাসরি কল ও ইন-অ্যাপ মেসেজ সুবিধা',
        'কাজের রেট ও কাস্টমার রিভিউ দেখে হায়ার করা',
      ],
    },
    work: {
      title: i18n.modules.work.title,
      subtitle: i18n.modules.work.subtitle,
      description: i18n.modules.work.description,
      icon: HardHat,
      accent: 'amber',
      categories: ['সবগুলো', 'দক্ষ কারিগর', 'ড্রাইভার', 'ডেলিভারি', 'গৃহস্থালি কাজ', 'আইটি টেকনিশিয়ান'],
      futureCapabilities: [
        'নিজের কাজের রেট ও কর্মঘণ্টা নির্ধারণ',
        'Online/Offline মোড অন করে কাজের অর্ডার গ্রহণ',
        'কাজের পোর্টফোলিও ও পূর্ববর্তী কাজের ছবি আপলোড',
        'কাস্টমারের কাছ থেকে সরাসরি পেমেন্ট গ্রহণ',
      ],
    },
    jobs: {
      title: i18n.modules.jobs.title,
      subtitle: i18n.modules.jobs.subtitle,
      description: i18n.modules.jobs.description,
      icon: Briefcase,
      accent: 'blue',
      categories: ['সব চাকরি', 'দোকান কর্মচারী', 'অফিস সহকারী', 'সিকিউরিটি গার্ড', 'হোটেল কর্মী', 'ড্রাইভার', 'সেলস এক্সিকিউটিভ'],
      futureCapabilities: [
        'এলাকা ভিত্তিক ফুল-টাইম ও পার্ট-টাইম চাকরির বিজ্ঞপ্তি',
        'নিয়োগকর্তাদের জন্য সহজ চাকরির বিজ্ঞাপন পোস্ট ফর্ম',
        'সরাসরি বায়োডাটা ও ফোন কলের মাধ্যমে আবেদন',
        'বেতন ও সুবিধাদি স্পষ্টভাবে দেখার ব্যবস্থা',
      ],
    },
    ride: {
      title: i18n.modules.ride.title,
      subtitle: i18n.modules.ride.subtitle,
      description: i18n.modules.ride.description,
      icon: Car,
      accent: 'rose',
      categories: ['সব রাইড', 'বাইক রাইড', 'সিএনজি অটো', 'প্রাইভেট কার / ট্যাক্সি', 'মালবাহী পিকআপ'],
      futureCapabilities: [
        'যাত্রী ও ড্রাইভারের মধ্যে সরাসরি সংযোগ (জিরো অতিরিক্ত কমিশন মডেল)',
        'পিকআপ ও গন্তব্য নির্ধারণ ও আনুমানিক ভাড়া',
        'ড্রাইভারের লাইসেন্স ও ভেরিফিকেশন চেক',
        'জরুরি নিরাপত্তা শেয়ারিং বাটন ও হটলাইন যোগাযোগ',
      ],
    },
    delivery: {
      title: i18n.modules.delivery.title,
      subtitle: i18n.modules.delivery.subtitle,
      description: i18n.modules.delivery.description,
      icon: PackageCheck,
      accent: 'violet',
      categories: ['সব পার্সেল', 'জরুরি চিঠি/ডকুমেন্ট', 'খাবার ও পণ্য', 'ভারী পার্সেল', 'ই-কমার্স ডেলিভারি'],
      futureCapabilities: [
        'শহরের অভ্যন্তরে ১-২ ঘণ্টার মধ্যে দ্রুত ডেলিভারি রিকোয়েস্ট',
        'ডেলিভারি ট্র্যাকিং ও রাইডার স্ট্যাটাস',
        'পিকআপ এবং ডেলিভারি ঠিকানা সেট করা',
        'ক্যাশ অন ডেলিভারি (COD) হ্যান্ডলিং গাইড',
      ],
    },
    buysell: {
      title: i18n.modules.buysell.title,
      subtitle: i18n.modules.buysell.subtitle,
      description: i18n.modules.buysell.description,
      icon: ShoppingBag,
      accent: 'cyan',
      categories: ['সকল পণ্য', 'মোবাইল ও গ্যাজেট', 'আসবাবপত্র', 'মোটরসাইকেল', 'ইলেকট্রনিক্স', 'গৃহস্থালি সামগ্রী'],
      futureCapabilities: [
        'স্থানীয় ক্রেতা ও বিক্রেতার সরাসরি কেনাবেচা',
        'পণ্যের ছবি, বিবরণ ও দাম সহ ফ্রি বিজ্ঞাপন পোস্ট',
        'বিক্রেতার বর্তমান লোকেশন ও রেটিং প্রদর্শন',
        'নিরাপদ লেনদেনের জন্য সরাসরি চ্যাট ও ভেরিফিকেশন সতর্কতা',
      ],
    },
  }[moduleId];

  const Icon = moduleData.icon;

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          id="btn-module-back"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>হোমে ফিরুন</span>
        </button>

        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          HelpLine মডিউল
        </span>
      </div>

      {/* Module Title Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{moduleData.title}</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {moduleData.subtitle}
              </span>
            </div>
            <p className="text-slate-600 text-sm mt-1">{moduleData.description}</p>
          </div>
        </div>

        {/* Filter / Category Pills */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {moduleData.categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                activeTab === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State / Module Roadmap */}
      <EmptyState
        title={`${moduleData.title} (${moduleData.subtitle})`}
        description="HelpLine এর ভিত্তি আর্কিটেকচার এবং ডাটাবেজ স্কিমা প্রস্তুত করা হয়েছে। পরবর্তী ধাপে লাইভ সার্ভিস রিকোয়েস্ট ও লিস্টিং ফিচারটি যুক্ত করা হবে।"
        badge="মডিউল ফাউন্ডেশন সক্রিয়"
        actionText="হোম পেজে ফিরে যান"
        onAction={onBack}
        icon={<Icon className="w-8 h-8" />}
      />

      {/* Planned Feature Roadmap for this module */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 max-w-lg mx-auto shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
          <Info className="w-4 h-4 text-emerald-600" />
          <span>পরবর্তী ধাপে যা অন্তর্ভুক্ত থাকবে:</span>
        </div>
        <ul className="space-y-2.5">
          {moduleData.futureCapabilities.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
