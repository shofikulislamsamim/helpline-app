import React, { useState } from 'react';
import { Search, Filter, MapPin, Wrench, Briefcase, Car, PackageCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { i18n } from '../lib/i18n';

interface SearchPageProps {
  onNavigate: (view: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filterCategories = [
    { id: 'all', label: 'সবগুলো (All)' },
    { id: 'workers', label: '🛠️ মিস্ত্রি ও কর্মী', icon: Wrench },
    { id: 'jobs', label: '💼 চাকরি', icon: Briefcase },
    { id: 'rides', label: '🚗 রাইড', icon: Car },
    { id: 'deliveries', label: '📦 পার্সেল', icon: PackageCheck },
    { id: 'products', label: '🛒 কেনাবেচা', icon: ShoppingBag },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">সার্চ ও ফিল্টার</h1>
          <span className="text-xs text-slate-500">লোকাল অনুসন্ধান</span>
        </div>

        {/* Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="কর্মী, কাজ, চাকরি, পণ্য বা সেবা লিখে Search করুন..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {filterCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedFilter(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedFilter === c.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Empty / Roadmap State */}
      <EmptyState
        title="স্মার্ট লোকাল সার্চ ইঞ্জিন"
        description="বাংলাদেশ জিও-লোকেশন ও ক্যাটাগরি ভিত্তিক লাইভ সার্চের ডাটাবেজ ইনডেক্সিং প্রক্রিয়াধীন রয়েছে।"
        badge="সার্চ আর্কিটেকচার সক্রিয়"
        actionText="হোম পেজে ফিরে যান"
        onAction={() => onNavigate('home')}
        icon={<Search className="w-8 h-8" />}
      />
    </div>
  );
};
