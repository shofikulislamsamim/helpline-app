import React, { useState } from 'react';
import { ArrowLeft, Shield, FileText, AlertTriangle, Users, Ban, CheckCircle } from 'lucide-react';
import { i18n } from '../lib/i18n';

interface PoliciesPageProps {
  onBack: () => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'safety' | 'terms' | 'privacy' | 'guidelines' | 'prohibited'>('safety');

  const policies = {
    safety: {
      id: 'safety',
      title: 'নিরাপত্তা ও সতর্কতা নির্দেশিকা (Safety Policy)',
      icon: Shield,
      summary: 'HelpLine মূলত ক্রেতা-বিক্রেতা, কর্মী ও সেবা প্রার্থীদের মধ্যে একটি নিরপেক্ষ সংযোগকারী প্ল্যাটফর্ম।',
      content: [
        {
          h: 'উভয় পক্ষ যাচাইকরণ (Verification):',
          t: 'কোনো কাজ শুরু করার পূর্বে, রাইডে ওঠার পূর্বে বা মালামাল আদান-প্রদানের পূর্বে অপর পক্ষের জাতীয় পরিচয়পত্র (NID), ফোন নম্বর ও প্রাসঙ্গিক তথ্যাদি নিজ দায়িত্বে নিশ্চিত হয়ে নিন।',
        },
        {
          h: 'প্ল্যাটফর্ম ভেরিফিকেশন সীমাবদ্ধতা:',
          t: 'HelpLine এ ইউজার কর্তৃক প্রদত্ত এনআইডি বা তথ্যের প্রাথমিক সত্যতা যাচাই করা হলেও, এটি কোনো ব্যক্তির ভবিষ্যৎ আচরণ, সততা, বা কাজের মানের চূড়ান্ত গ্যারান্টি প্রদান করে না।',
        },
        {
          h: 'আর্থিক লেনদেন সতর্কতা:',
          t: 'কাজ সম্পূর্ণ হওয়া এবং সন্তুষ্টি অর্জনের পূর্বে কোনো অযাচিত অগ্রিম অর্থ (Advance Payment) প্রদান করবেন না। যেকোনো আর্থিক লেনদেন সম্পূর্ণ আপনার ও অপর পক্ষের নিজস্ব সমঝোতা।',
        },
        {
          h: 'জরুরি সহায়তা:',
          t: 'যেকোনো অনাকাঙ্ক্ষিত পরিস্থিতি, নিরাপত্তা ঝুঁকি বা প্রতারণার আশঙ্কায় তাত্ক্ষণিকভাবে জাতীয় জরুরি সেবা ৯৯৯ এবং HelpLine হটলাইনে যোগাযোগ করুন।',
        },
      ],
    },
    terms: {
      id: 'terms',
      title: 'ব্যবহারের শর্তাবলী (Terms & Conditions)',
      icon: FileText,
      summary: 'HelpLine প্ল্যাটফর্ম ব্যবহারের নিয়ম ও চুক্তিসমূহ।',
      content: [
        {
          h: '১. সেবার ধরণ:',
          t: 'HelpLine সরাসরি কোনো সেবা, পরিবহন বা পণ্য সরবরাহকারী প্রতিষ্ঠান নয়। এটি স্বাধীন ব্যবহারকারীদের মধ্যে পারস্পরিক যোগাযোগের ডিজিটাল মাধ্যম হিসেবে কাজ করে।',
        },
        {
          h: '২. অ্যাকাউন্ট দায়িত্ব:',
          t: 'প্রতিটি ব্যবহারকারী তার অ্যাকাউন্টের সঠিক তথ্য এবং পাসওয়ার্ড সুরক্ষার জন্য এককভাবে দায়ী। ভুয়া তথ্য প্রদান করলে অ্যাকাউন্ট স্থগিত করা হতে পারে।',
        },
        {
          h: '৩. অভিযোগ ও সহায়তা:',
          t: 'নীতিমালা লঙ্ঘিত হলে কর্তৃপক্ষ যেকোনো বিজ্ঞাপন বা প্রোফাইল তদন্তসাপেক্ষে অপসারণ করার অধিকার সংরক্ষণ করে।',
        },
      ],
    },
    privacy: {
      id: 'privacy',
      title: 'গোপনীয়তা নীতি (Privacy Policy)',
      icon: Users,
      summary: 'আপনার ব্যক্তিগত তথ্যের নিরাপত্তা ও ব্যবহার সম্পর্কিত নিয়ম।',
      content: [
        {
          h: '১. সংগৃহীত তথ্য:',
          t: 'প্রোফাইল তৈরি ও যাচাইকরণের জন্য নাম, ফোন নম্বর, ঠিকানা এবং ঐচ্ছিক এনআইডি তথ্য নিরাপদে ফায়ারবেস ক্লাউড স্টোরেজে সংরক্ষিত থাকে।',
        },
        {
          h: '২. লোকেশন শেয়ারিং:',
          t: 'লাইভ লোকেশন শুধুমাত্র সেবা আদান-প্রদানের সময় এবং ব্যবহারকারীর স্পষ্ট অনুমতিক্রমে শেয়ার করা হবে।',
        },
      ],
    },
    guidelines: {
      id: 'guidelines',
      title: 'কমিউনিটি নির্দেশিকা (Community Guidelines)',
      icon: Users,
      summary: 'পরস্পর সম্মানজনক ও পেশাদার আচরণ নিশ্চিতকরণের নিয়ম।',
      content: [
        {
          h: 'মর্যাদাপূর্ণ আচরণ:',
          t: 'কর্মী, চালক ও গ্রাহক প্রত্যেকের সাথে শালীন ও শ্রদ্ধাশীল আচরণ করুন। কোনো প্রকার গালিগালাজ বা হয়রানি সম্পূর্ণ নিষিদ্ধ।',
        },
        {
          h: 'সময়ানুবর্তিতা:',
          t: 'নির্দিষ্ট সময়ে কাজ সম্পন্ন করুন অথবা জরুরি কারণে বিলম্ব হলে পূর্বেই অপর পক্ষকে অবহিত করুন।',
        },
      ],
    },
    prohibited: {
      id: 'prohibited',
      title: 'নিষিদ্ধ পণ্য ও সেবা (Prohibited Items)',
      icon: Ban,
      summary: 'HelpLine এ যেসকল পণ্য ও সেবার লিস্টিং বা প্রচার সম্পূর্ণ অবৈধ।',
      content: [
        {
          h: 'আইনত নিষিদ্ধ দ্রব্যাদি:',
          t: 'মাদকদ্রব্য, অবৈধ অস্ত্র, বিস্ফোরক, চুরি করা মালামাল এবং বাংলাদেশের প্রচলিত আইনে নিষিদ্ধ কোনো পণ্য বেচাকেনা করা সম্পূর্ণ দণ্ডনীয় অপরাধ।',
        },
        {
          h: 'জাল নথিপত্র ও প্রতারণামূলক স্কিম:',
          t: 'কোনো জাল সনদ, ভুয়া ভিসা বা মাল্টি-লেভেল মার্কেটিং (MLM) বিষয়ক প্রস্তাব পোস্ট করা নিষিদ্ধ।',
        },
      ],
    },
  };

  const currentPolicy = policies[activeTab];

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ফিরে যান</span>
        </button>

        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          আইনি ও নিরাপত্তা শর্তাবলী
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(Object.keys(policies) as (keyof typeof policies)[]).map((key) => {
          const item = policies[key];
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {item.title.split('(')[0].trim()}
            </button>
          );
        })}
      </div>

      {/* Policy Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">{currentPolicy.title}</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            {currentPolicy.summary}
          </p>
        </div>

        <div className="space-y-4">
          {currentPolicy.content.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">{sec.h}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{sec.t}</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            HelpLine প্ল্যাটফর্মে রেজিস্টার করা এবং প্রোফাইল ভেরিফিকেশনের আবেদন করার মাধ্যমে ব্যবহারকারী হিসেবে আপনি এই নীতিমালা মেনে নিতে সম্মত হচ্ছেন।
          </p>
        </div>
      </div>
    </div>
  );
};
