import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  Navigation, 
  Clock, 
  Star, 
  ArrowLeft,
  ChevronDown,
  Layers,
  Laptop,
  Wrench,
  CheckCircle2,
  SlidersHorizontal,
  FolderGit2
} from 'lucide-react';
import { UserProfile, HireRequest } from '../types';
import { useHire } from '../context/HireContext';
import { useAuth } from '../context/AuthContext';
import { WorkerCard } from '../components/hire/WorkerCard';
import { WorkerProfileModal } from '../components/hire/WorkerProfileModal';
import { HireRequestModal } from '../components/hire/HireRequestModal';
import { PROFESSIONS_LIST } from '../lib/professionsData';
import { 
  CustomerLocationQuery, 
  sortWorkersByProximity, 
  getWorkerDistanceResult 
} from '../lib/geoDistance';
import { 
  isWorkerInServiceType, 
  calculateWorkerRelevance, 
  normalizeSearchText 
} from '../lib/hireSearchEngine';

interface HirePageProps {
  onBack?: () => void;
  onNavigate?: (view: string) => void;
}

export const HirePage: React.FC<HirePageProps> = ({ onBack, onNavigate }) => {
  const { workers } = useHire();
  const { userProfile } = useAuth();

  // Primary Service Type: Physical / Local vs Freelance / Digital
  const [serviceType, setServiceType] = useState<'physical' | 'digital'>('physical');

  // Search query & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState<string>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('');
  const [minExperience, setMinExperience] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(true);
  const [onlyWithPortfolio, setOnlyWithPortfolio] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sorting: Physical default 'distance', Digital default 'rating'
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'experience' | 'jobs' | 'relevance'>('distance');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(0); // 0 = all distances

  // Geolocation & Proximity States (Strictly for Physical Services)
  const [customerLocation, setCustomerLocation] = useState<CustomerLocationQuery>(() => ({
    division: userProfile.presentAddress?.division || 'ঢাকা',
    district: userProfile.presentAddress?.district || 'ঢাকা',
    upazila: userProfile.presentAddress?.upazila || 'মিরপুর (১০ নং সেক্টর)',
    coordinates: userProfile.currentLocation?.coordinates || { latitude: 23.8069, longitude: 90.3687 },
  }));
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);

  // Handle live GPS capture
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationSuccessMsg('ব্রাউজারে Geolocation সাপোর্ট নেই');
      setTimeout(() => setLocationSuccessMsg(null), 3000);
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGettingLocation(false);
        setCustomerLocation((prev) => ({
          ...prev,
          coordinates: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
        }));
        setLocationSuccessMsg('লাইভ জিপিএস লোকেশন আপডেট হয়েছে!');
        setTimeout(() => setLocationSuccessMsg(null), 3000);
      },
      (err) => {
        setIsGettingLocation(false);
        console.warn('Geolocation notice:', err);
        setLocationSuccessMsg('ডিফল্ট ঢাকা লোকেশন ব্যবহার হচ্ছে');
        setTimeout(() => setLocationSuccessMsg(null), 3000);
      },
      { timeout: 8000 }
    );
  };

  // Modal states
  const [selectedWorkerForProfile, setSelectedWorkerForProfile] = useState<UserProfile | null>(null);
  const [selectedWorkerForHire, setSelectedWorkerForHire] = useState<UserProfile | null>(null);

  // Quick search suggestion tags based on service type
  const physicalQuickTags = [
    { label: 'ইলেকট্রিশিয়ান', value: 'ইলেকট্রিশিয়ান' },
    { label: 'ফ্যান ফিটিং', value: 'ফ্যান ফিটিং' },
    { label: 'প্লাম্বার / পাইপ', value: 'প্লাম্বার' },
    { label: 'এসি সার্ভিসিং', value: 'এসি' },
    { label: 'রং মিস্ত্রি', value: 'রং মিস্ত্রি' },
    { label: 'কাঠমিস্ত্রি', value: 'কাঠমিস্ত্রি' },
    { label: 'সোলার প্যানেল', value: 'সোলার প্যানেল' },
    { label: 'বাসা পরিষ্কার', value: 'ক্লিনার' },
  ];

  const digitalQuickTags = [
    { label: 'লোগো ডিজাইন', value: 'লোগো ডিজাইন' },
    { label: 'ওয়েব ডেভেলপার', value: 'ওয়েব ডেভেলপার' },
    { label: 'ভিডিও এডিটর', value: 'ভিডিও এডিটর' },
    { label: 'ইউটিউব থাম্বনেইল', value: 'থাম্বনেইল' },
    { label: 'ফেসবুক অ্যাডস', value: 'ফেসবুক অ্যাড' },
    { label: 'রিলস ও শর্টস', value: 'রিলস' },
    { label: 'ওয়ার্ডপ্রেস', value: 'ওয়ার্ডপ্রেস' },
    { label: 'এসইও (SEO)', value: 'এসইও' },
  ];

  // Counts for each service type
  const countsByServiceType = useMemo(() => {
    let physicalCount = 0;
    let digitalCount = 0;
    workers.forEach((w) => {
      const hasWorkerRole = w.capabilities?.includes('worker') || w.roles?.includes('worker');
      if (!hasWorkerRole) return;
      if (isWorkerInServiceType(w, 'physical')) physicalCount++;
      if (isWorkerInServiceType(w, 'digital')) digitalCount++;
    });
    return { physical: physicalCount, digital: digitalCount };
  }, [workers]);

  // Handle Tab Switch
  const handleServiceTypeChange = (newType: 'physical' | 'digital') => {
    setServiceType(newType);
    setSelectedProfession('all');
    setSearchQuery('');
    // Switch default sort
    if (newType === 'digital') {
      setSortBy('rating');
    } else {
      setSortBy('distance');
    }
  };

  // Filter & Search Engine Processor
  const processedWorkers = useMemo(() => {
    // 1. Base eligibility check
    const eligibleWorkers = workers.filter((w) => {
      const hasWorkerRole = w.capabilities?.includes('worker') || w.roles?.includes('worker');
      if (!hasWorkerRole) return false;

      // Service type match
      if (!isWorkerInServiceType(w, serviceType)) return false;

      // Verification filter
      if (onlyVerified && w.verificationStatus !== 'verified' && w.verificationStatus !== 'approved') {
        return false;
      }

      // Online filter
      if (onlyOnline && !w.isOnline) return false;

      // Portfolio filter (Digital only)
      if (serviceType === 'digital' && onlyWithPortfolio) {
        if (!w.portfolio || w.portfolio.length === 0) return false;
      }

      // Profession category filter
      if (selectedProfession !== 'all') {
        const hasProf =
          w.mainProfession === selectedProfession ||
          (w.professions && w.professions.includes(selectedProfession)) ||
          (w.userProfessions && w.userProfessions.some((up) => up.nameBn === selectedProfession || up.nameEn === selectedProfession));
        if (!hasProf) return false;
      }

      // Physical Location filters (Only for Physical Services)
      if (serviceType === 'physical') {
        if (selectedDivision !== 'all') {
          if (w.presentAddress?.division !== selectedDivision) return false;
        }
        if (selectedDistrict !== 'all') {
          if (w.presentAddress?.district !== selectedDistrict) return false;
        }
        if (selectedUpazila.trim()) {
          const searchUp = normalizeSearchText(selectedUpazila);
          const workerUp = normalizeSearchText(w.presentAddress?.upazila || '');
          const inServiceArea = (w.serviceAreas || []).some((a) =>
            normalizeSearchText(a).includes(searchUp)
          );
          if (!workerUp.includes(searchUp) && !inServiceArea) return false;
        }

        // Distance radius filter
        if (maxDistanceKm > 0) {
          const distRes = getWorkerDistanceResult(w, customerLocation);
          if (distRes.matchType === 'live_gps' && distRes.distanceKm !== undefined) {
            if (distRes.distanceKm > maxDistanceKm) return false;
          }
        }
      }

      // Experience filter
      const exp = w.experiences?.[0]?.years || 1;
      if (minExperience > 0 && exp < minExperience) return false;

      // Rating filter
      const rating = w.rating || 5.0;
      if (minRating > 0 && rating < minRating) return false;

      return true;
    });

    // 2. Score with Deterministic Search Engine
    type ScoredWorker = {
      worker: UserProfile;
      score: number;
      matchedKeywords: string[];
      isMatch: boolean;
    };

    const scoredList: ScoredWorker[] = eligibleWorkers.map((worker) => {
      const rel = calculateWorkerRelevance(
        worker,
        searchQuery,
        serviceType,
        serviceType === 'physical' ? customerLocation : undefined
      );
      return {
        worker,
        score: rel.score,
        matchedKeywords: rel.matchedKeywords,
        isMatch: rel.isMatch,
      };
    });

    // Filter out non-matches if a search query is active
    let results = searchQuery.trim()
      ? scoredList.filter((item) => item.isMatch)
      : scoredList;

    // 3. Apply Sorting
    if (searchQuery.trim() && sortBy === 'relevance') {
      // Relevance first
      results.sort((a, b) => b.score - a.score);
      return results.map((item) => item.worker);
    }

    if (serviceType === 'physical' && sortBy === 'distance') {
      // Proximity sort
      const workersOnly = results.map((item) => item.worker);
      return sortWorkersByProximity(workersOnly, customerLocation);
    }

    if (sortBy === 'rating') {
      results.sort((a, b) => (b.worker.rating || 5.0) - (a.worker.rating || 5.0));
      return results.map((item) => item.worker);
    }

    if (sortBy === 'experience') {
      results.sort((a, b) => {
        const expA = a.worker.experiences?.[0]?.years || 1;
        const expB = b.worker.experiences?.[0]?.years || 1;
        return expB - expA;
      });
      return results.map((item) => item.worker);
    }

    if (sortBy === 'jobs') {
      results.sort(
        (a, b) => (b.worker.completedJobsCount || 0) - (a.worker.completedJobsCount || 0)
      );
      return results.map((item) => item.worker);
    }

    // Default fallback: relevance score
    results.sort((a, b) => b.score - a.score);
    return results.map((item) => item.worker);
  }, [
    workers,
    serviceType,
    searchQuery,
    selectedProfession,
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    minExperience,
    minRating,
    onlyOnline,
    onlyVerified,
    onlyWithPortfolio,
    maxDistanceKm,
    customerLocation,
    sortBy,
  ]);

  // Separate online and offline workers
  const onlineWorkers = processedWorkers.filter((w) => w.isOnline);
  const offlineWorkers = processedWorkers.filter((w) => !w.isOnline);

  const handleHireSuccess = (request: HireRequest) => {
    setSelectedWorkerForHire(null);
    if (onNavigate) {
      onNavigate('activity');
    }
  };

  const isDigital = serviceType === 'digital';

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Service Type Selection */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs relative overflow-hidden">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোমে ফিরে যান</span>
          </button>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>🔎 HIRE • সেন্ট্রাল সার্ভিস সার্চ ইঞ্জিন</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>কাজের মানুষ খুঁজুন</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              লোকাল অন-সাইট মিস্ত্রি থেকে শুরু করে দক্ষ ডিজিটাল ফ্রিল্যান্সার — সরাসরি যাচাইকৃত কাজের মানুষ খুঁজে নিন।
            </p>
          </div>

          {/* Location Badge (Physical only) */}
          {!isDigital && (
            <div className="flex flex-col sm:items-end gap-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate max-w-[200px]">
                  {customerLocation.upazila}, {customerLocation.district}
                </span>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={isGettingLocation}
                  className="text-blue-600 hover:text-blue-800 font-bold ml-1 cursor-pointer"
                  title="জিপিএস লোকেশন রিফ্রেশ করুন"
                >
                  {isGettingLocation ? '...' : 'পরিবর্তন'}
                </button>
              </div>
              {locationSuccessMsg && (
                <span className="text-[11px] font-bold text-emerald-600 animate-fadeIn">
                  ✓ {locationSuccessMsg}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 2. Primary Service Type Switcher (লোকাল সেবা vs ডিজিটাল সেবা) */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            সার্ভিস ক্যাটাগরি নির্বাচন করুন
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            {/* Tab 1: Physical / Local Services */}
            <button
              type="button"
              onClick={() => handleServiceTypeChange('physical')}
              className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border-2 text-left transition cursor-pointer ${
                serviceType === 'physical'
                  ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  serviceType === 'physical'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                📍
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    লোকাল সেবা (Physical Services)
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {countsByServiceType.physical} জন
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  ইলেকট্রিশিয়ান, এসি, প্লাম্বার, রং, টেকনিশিয়ান ও অন-সাইট সেবা
                </p>
              </div>
            </button>

            {/* Tab 2: Freelance / Digital Services */}
            <button
              type="button"
              onClick={() => handleServiceTypeChange('digital')}
              className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border-2 text-left transition cursor-pointer ${
                serviceType === 'digital'
                  ? 'border-violet-600 bg-violet-50/70 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  serviceType === 'digital'
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                💻
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    ডিজিটাল সেবা (Freelance & Digital)
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                    {countsByServiceType.digital} জন
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  গ্রাফিক ডিজাইন, ওয়েব, ভিডিও এডিটিং, ডিজিটাল মার্কেটিং ও কন্টেন্ট
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 3. Search Bar + Quick Suggestion Chips */}
        <div className="mt-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isDigital
                  ? 'লোগো ডিজাইন, ওয়েব ডেভেলপার, ভিডিও এডিটর, থাম্বনেইল বা কীওয়ার্ড লিখে খুঁজুন...'
                  : 'ইলেকট্রিশিয়ান, এসি মিস্ত্রি, প্লাম্বার, ফ্যান ফিটিং বা এলাকা লিখে খুঁজুন...'
              }
              className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Suggestion Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] text-slate-400 font-semibold shrink-0">জনপ্রিয় সার্চ:</span>
            {(isDigital ? digitalQuickTags : physicalQuickTags).map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSearchQuery(tag.value)}
                className={`px-3 py-1 rounded-full shrink-0 font-medium transition cursor-pointer ${
                  searchQuery === tag.value
                    ? isDigital
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Controls Bar: Filter Toggle & Differentiated Sorts */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
              isFilterOpen
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>ফিল্টার অপশন (Filters)</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Differentiated Sorting & Radius Filter */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold shrink-0">সর্ট:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
              >
                {searchQuery.trim() && <option value="relevance">🎯 সর্বাধিক প্রাসঙ্গিক (Relevance)</option>}
                {!isDigital && <option value="distance">📍 নিকটতম দূরত্ব (Nearest Proximity)</option>}
                <option value="rating">⭐ সর্বোচ্চ রেটিং (Highest Rating)</option>
                <option value="experience">⏱️ কাজের অভিজ্ঞতা (Experience)</option>
                <option value="jobs">💼 সম্পন্ন কাজ (Completed Jobs)</option>
              </select>
            </div>

            {/* Distance Radius (Strictly for Physical Services) */}
            {!isDigital && (
              <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold shrink-0">ব্যাসার্ধ:</span>
                <select
                  value={maxDistanceKm}
                  onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                  className="text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
                >
                  <option value={0}>সকল দূরত্ব</option>
                  <option value={3}>৩ কিমি-এর মধ্যে</option>
                  <option value={5}>৫ কিমি-এর মধ্যে</option>
                  <option value={10}>১০ কিমি-এর মধ্যে</option>
                  <option value={20}>২০ কিমি-এর মধ্যে</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* 5. Expandable Advanced Filter Drawer */}
        {isFilterOpen && (
          <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>উন্নত অনুসন্ধান ফিল্টার ({isDigital ? 'ডিজিটাল সার্ভিস' : 'লোকাল সার্ভিস'})</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  setSelectedProfession('all');
                  setSelectedDivision('all');
                  setSelectedDistrict('all');
                  setSelectedUpazila('');
                  setMinExperience(0);
                  setMinRating(0);
                  setOnlyOnline(false);
                  setOnlyVerified(true);
                  setOnlyWithPortfolio(false);
                  setSearchQuery('');
                }}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
              >
                রিসেট করুন (Reset)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {/* Profession Category */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">পেশা / ক্যাটাগরি</label>
                <select
                  value={selectedProfession}
                  onChange={(e) => setSelectedProfession(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800"
                >
                  <option value="all">সব ক্যাটাগরি</option>
                  {PROFESSIONS_LIST.filter((p) =>
                    isDigital ? p.categoryMode === 'digital' : p.categoryMode === 'physical'
                  ).map((p) => (
                    <option key={p.id} value={p.nameBn}>
                      {p.nameBn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">ন্যূনতম অভিজ্ঞতা</label>
                <select
                  value={minExperience}
                  onChange={(e) => setMinExperience(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800"
                >
                  <option value={0}>সব অভিজ্ঞতা</option>
                  <option value={1}>১+ বছর</option>
                  <option value={3}>৩+ বছর</option>
                  <option value={5}>৫+ বছর</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">ন্যূনতম রেটিং</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800"
                >
                  <option value={0}>সকল রেটিং</option>
                  <option value={4.5}>৪.৫+ স্টার</option>
                  <option value={4.8}>৪.৮+ স্টার</option>
                </select>
              </div>

              {/* Location filters (Physical only) */}
              {!isDigital ? (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">এলাকা / থানা</label>
                  <input
                    type="text"
                    value={selectedUpazila}
                    onChange={(e) => setSelectedUpazila(e.target.value)}
                    placeholder="যেমন: মিরপুর, উত্তরা, ধানমন্ডি"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">পোর্টফোলিও</label>
                  <select
                    value={onlyWithPortfolio ? 'with_portfolio' : 'all'}
                    onChange={(e) => setOnlyWithPortfolio(e.target.value === 'with_portfolio')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800"
                  >
                    <option value="all">সকল ডিজিটাল প্রফেশনাল</option>
                    <option value="with_portfolio">🎨 পোর্টফোলিও যুক্ত প্রজেক্টসহ</option>
                  </select>
                </div>
              )}
            </div>

            {/* Quick Toggles */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-200 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyOnline}
                  onChange={(e) => setOnlyOnline(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-700">শুধুমাত্র সক্রিয় কর্মী (🟢 Available Now)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="font-semibold text-emerald-800">শুধুমাত্র যাচাইকৃত প্রফেশনাল (✓ Verified)</span>
              </label>

              {isDigital && (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyWithPortfolio}
                    onChange={(e) => setOnlyWithPortfolio(e.target.checked)}
                    className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4"
                  />
                  <span className="font-semibold text-violet-800">পোর্টফোলিও নমুনা যুক্ত (🎨 Portfolio Showcase)</span>
                </label>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 6. Online Workers Section (🟢 Available Now) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-lg font-bold text-slate-900">
              {isDigital
                ? 'সক্রিয় ফ্রিল্যান্সার ও ক্রিয়েটর (Available Now)'
                : 'নিকটস্থ সক্রিয় কর্মী (Available Now)'}
            </h2>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {onlineWorkers.length} জন অনলাইন
          </span>
        </div>

        {onlineWorkers.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-700 text-sm">এই মুহূর্তে কোনো কর্মী অনলাইনে নেই</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              নিচের তালিকা থেকে অফলাইন কর্মীদের প্রোফাইল দেখতে পারেন অথবা অগ্রিম কাজের অনুরোধ পাঠাতে পারেন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onlineWorkers.map((worker) => (
              <WorkerCard
                key={worker.userId}
                worker={worker}
                serviceType={serviceType}
                customerLocation={isDigital ? undefined : customerLocation}
                onViewProfile={(w) => setSelectedWorkerForProfile(w)}
                onHireRequest={(w) => setSelectedWorkerForHire(w)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 7. Offline Workers Section (🔴 Currently Offline) */}
      {(!onlyOnline && offlineWorkers.length > 0) && (
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <h2 className="text-base font-bold text-slate-700">
                  {isDigital
                    ? 'অন্যান্য ডিজিটাল প্রফেশনাল (বর্তমানে অফলাইন)'
                    : 'অন্যান্য তালিকাভুক্ত কর্মী (বর্তমানে অফলাইন)'}
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isDigital
                  ? 'অফলাইন প্রফেশনালদের মেসেজ বা কাজের অর্ডার পাঠিয়ে রাখতে পারেন। তারা অনলাইনে এলেই রিপ্লাই দেবেন।'
                  : 'অফলাইন কর্মীদের ক্ষেত্রে লাইভ অবস্থান দেখানো হয় না। অগ্রিম কাজের অনুরোধ পাঠাতে পারেন।'}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {offlineWorkers.length} জন
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-90">
            {offlineWorkers.map((worker) => (
              <WorkerCard
                key={worker.userId}
                worker={worker}
                serviceType={serviceType}
                customerLocation={isDigital ? undefined : customerLocation}
                onViewProfile={(w) => setSelectedWorkerForProfile(w)}
                onHireRequest={(w) => setSelectedWorkerForHire(w)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Profile Modal */}
      {selectedWorkerForProfile && (
        <WorkerProfileModal
          worker={selectedWorkerForProfile}
          customerLocation={isDigital ? undefined : customerLocation}
          onClose={() => setSelectedWorkerForProfile(null)}
          onHireRequest={(w) => {
            setSelectedWorkerForProfile(null);
            setSelectedWorkerForHire(w);
          }}
        />
      )}

      {/* Hire Request Modal */}
      {selectedWorkerForHire && (
        <HireRequestModal
          worker={selectedWorkerForHire}
          onClose={() => setSelectedWorkerForHire(null)}
          onSuccess={handleHireSuccess}
        />
      )}
    </div>
  );
};
