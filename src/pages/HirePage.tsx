import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  CheckCircle2, 
  Star, 
  SlidersHorizontal, 
  Briefcase, 
  ArrowLeft, 
  UserCheck, 
  Sparkles, 
  Clock, 
  X,
  Navigation,
  LocateFixed,
  Compass
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

interface HirePageProps {
  onBack?: () => void;
  onNavigate?: (view: string) => void;
}

export const HirePage: React.FC<HirePageProps> = ({ onBack, onNavigate }) => {
  const { workers } = useHire();
  const { userProfile } = useAuth();

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState<string>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('');
  const [minExperience, setMinExperience] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Geolocation & Proximity States
  const [customerLocation, setCustomerLocation] = useState<CustomerLocationQuery>(() => ({
    division: userProfile.presentAddress?.division || 'ঢাকা',
    district: userProfile.presentAddress?.district || 'ঢাকা',
    upazila: userProfile.presentAddress?.upazila || 'মিরপুর (১০ নং সেক্টর)',
    coordinates: userProfile.currentLocation?.coordinates || { latitude: 23.8069, longitude: 90.3687 },
  }));
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'experience' | 'jobs'>('distance');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(0); // 0 = all distances

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
        setLocationSuccessMsg('লাইভ জিপিএস লোকেশন সক্রিয় হয়েছে!');
        setTimeout(() => setLocationSuccessMsg(null), 3000);
      },
      (err) => {
        setIsGettingLocation(false);
        console.warn('Geolocation notice:', err);
        setLocationSuccessMsg('ডিফল্ট মিরপুর, ঢাকা লোকেশন ব্যবহার হচ্ছে');
        setTimeout(() => setLocationSuccessMsg(null), 3000);
      },
      { timeout: 8000 }
    );
  };

  // Modal states
  const [selectedWorkerForProfile, setSelectedWorkerForProfile] = useState<UserProfile | null>(null);
  const [selectedWorkerForHire, setSelectedWorkerForHire] = useState<UserProfile | null>(null);

  const quickTags = [
    { label: 'ইলেকট্রিশিয়ান', value: 'ইলেকট্রিশিয়ান' },
    { label: 'ফ্যান ফিটিং', value: 'ফ্যান' },
    { label: 'প্লাম্বার', value: 'প্লাম্বার' },
    { label: 'এসি সার্ভিসিং', value: 'এসি' },
    { label: 'রং মিস্ত্রি', value: 'রং' },
    { label: 'কম্পিউটার সার্ভিস', value: 'কম্পিউটার' },
    { label: 'ছুটা বুয়া / ক্লিনার', value: 'ক্লিনার' },
  ];

  // Filter workers based on criteria
  const filteredWorkers = useMemo(() => {
    return workers.filter((w) => {
      // Must have 'worker' capability or role
      const hasWorkerRole = w.capabilities?.includes('worker') || w.roles?.includes('worker');
      if (!hasWorkerRole) return false;

      // Verification check if required (support both verified and approved)
      if (onlyVerified && w.verificationStatus !== 'verified' && w.verificationStatus !== 'approved') return false;

      // Online filter
      if (onlyOnline && !w.isOnline) return false;

      // Profession filter
      if (selectedProfession !== 'all') {
        const hasProf =
          w.mainProfession === selectedProfession ||
          (w.professions && w.professions.includes(selectedProfession));
        if (!hasProf) return false;
      }

      // Location filters
      if (selectedDivision !== 'all') {
        if (w.presentAddress?.division !== selectedDivision) return false;
      }
      if (selectedDistrict !== 'all') {
        if (w.presentAddress?.district !== selectedDistrict) return false;
      }
      if (selectedUpazila.trim()) {
        const searchUp = selectedUpazila.toLowerCase().trim();
        const workerUp = (w.presentAddress?.upazila || '').toLowerCase();
        const inServiceArea = (w.serviceAreas || []).some((a) => a.toLowerCase().includes(searchUp));
        if (!workerUp.includes(searchUp) && !inServiceArea) return false;
      }

      // Experience filter
      const exp = w.experiences?.[0]?.years || 1;
      if (minExperience > 0 && exp < minExperience) return false;

      // Rating filter
      const rating = w.rating || 5.0;
      if (minRating > 0 && rating < minRating) return false;

      // Search query (name, profession, skills, workType)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = w.fullName.toLowerCase().includes(q);
        const profMatch = (w.professions || []).some((p) => p.toLowerCase().includes(q));
        const skillMatch = (w.skills || []).some((s) => s.toLowerCase().includes(q));
        const bioMatch = (w.bio || '').toLowerCase().includes(q);
        const areaMatch = (w.serviceAreas || []).some((a) => a.toLowerCase().includes(q));

        if (!nameMatch && !profMatch && !skillMatch && !bioMatch && !areaMatch) {
          return false;
        }
      }

      return true;
    });
  }, [
    workers,
    searchQuery,
    selectedProfession,
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    minExperience,
    minRating,
    onlyOnline,
    onlyVerified,
  ]);

  // Proximity & Sorting Processor
  const processedWorkers = useMemo(() => {
    let result = [...filteredWorkers];

    // Optional Max Distance filter (for workers with distance data)
    if (maxDistanceKm > 0) {
      result = result.filter((w) => {
        const distRes = getWorkerDistanceResult(w, customerLocation);
        if (distRes.matchType === 'live_gps' && distRes.distanceKm !== undefined) {
          return distRes.distanceKm <= maxDistanceKm;
        }
        return true; // Keep fallback matches
      });
    }

    // Sorting
    if (sortBy === 'distance') {
      result = sortWorkersByProximity(result, customerLocation);
    } else if (sortBy === 'rating') {
      result = result.sort((a, b) => (b.rating || 5.0) - (a.rating || 5.0));
    } else if (sortBy === 'experience') {
      result = result.sort((a, b) => {
        const expA = a.experiences?.[0]?.years || 1;
        const expB = b.experiences?.[0]?.years || 1;
        return expB - expA;
      });
    } else if (sortBy === 'jobs') {
      result = result.sort((a, b) => (b.completedJobsCount || 0) - (a.completedJobsCount || 0));
    }

    return result;
  }, [filteredWorkers, customerLocation, sortBy, maxDistanceKm]);

  // Separate into Online and Offline workers
  const onlineWorkers = processedWorkers.filter((w) => w.isOnline);
  const offlineWorkers = processedWorkers.filter((w) => !w.isOnline);

  const handleHireSuccess = (request: HireRequest) => {
    setSelectedWorkerForHire(null);
    if (onNavigate) {
      onNavigate('activity');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs relative overflow-hidden">
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>HelpLine নির্ভরযোগ্য কারিগর প্ল্যাটফর্ম</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              কাজের মানুষ খুঁজুন (Hire Workers)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              বাসা-বাড়ি ও অফিসের জন্য জাতীয় পরিচয়পত্র যাচাইকৃত নির্ভরযোগ্য দক্ষ মিস্ত্রি ও টেকনিশিয়ান খুঁজে নিন
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
              মোট কর্মী: {filteredWorkers.length} জন
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="আপনি কী কাজ করাতে চান? যেমন: সিলিং ফ্যান ফিটিং, এসি গ্যাস রিফিল, বেসিন পাইপ মেরামত..."
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-20 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`absolute right-2 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isFilterOpen
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>ফিল্টার</span>
            </button>
          </div>

          {/* Quick Search Chips */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">পপুলার:</span>
            {quickTags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSearchQuery(tag.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  searchQuery === tag.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Real-time Location & Sort Bar */}
          <div className="mt-4 p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0">
                <LocateFixed className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-800">
                    আপনার অনুসন্ধান অবস্থান: {customerLocation.upazila || customerLocation.district || 'ঢাকা'}
                  </span>
                  {customerLocation.coordinates && (
                    <span className="text-[10px] text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded font-medium">
                      জিপিএস স্থানাঙ্ক সংযুক্ত
                    </span>
                  )}
                  {locationSuccessMsg && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold animate-fadeIn">
                      ✓ {locationSuccessMsg}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  অনলাইন কর্মীদের সাথে রিয়েল-টাইম দূরত্ব গণনায় ব্যবহৃত হচ্ছে
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch lg:self-auto shrink-0 flex-wrap">
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 text-xs font-bold transition shadow-2xs cursor-pointer disabled:opacity-60"
              >
                <Navigation className={`w-3.5 h-3.5 text-blue-600 ${isGettingLocation ? 'animate-spin' : ''}`} />
                <span>{isGettingLocation ? 'লোকেশন লোড হচ্ছে...' : 'লাইভ লোকেশন নিন'}</span>
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold shrink-0">বাছাই:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
                >
                  <option value="distance">📍 দূরত্ব অনুসারে (নিকটবর্তী আগে)</option>
                  <option value="rating">⭐ সর্বোচ্চ রেটিং</option>
                  <option value="experience">⏱️ অভিজ্ঞতা (বছর)</option>
                  <option value="jobs">💼 সম্পন্ন কাজ</option>
                </select>
              </div>

              {/* Distance Radius Filter */}
              <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-xl border border-slate-200">
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
            </div>
          </div>
        </div>

        {/* Expandable Advance Filter Drawer */}
        {isFilterOpen && (
          <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>উন্নত অনুসন্ধান ফিল্টার (Advanced Filters)</span>
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
                  setSearchQuery('');
                }}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
              >
                রিসেট করুন
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {/* Profession */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">পেশা / ক্যাটাগরি</label>
                <select
                  value={selectedProfession}
                  onChange={(e) => setSelectedProfession(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800"
                >
                  <option value="all">সব পেশা</option>
                  {PROFESSIONS_LIST.map((p) => (
                    <option key={p.id} value={p.nameBn}>
                      {p.nameBn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Division */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">বিভাগ</label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800"
                >
                  <option value="all">সকল বিভাগ</option>
                  <option value="ঢাকা">ঢাকা</option>
                  <option value="চট্টগ্রাম">চট্টগ্রাম</option>
                  <option value="রাজশাহী">রাজশাহী</option>
                  <option value="খুলনা">খুলনা</option>
                  <option value="বরিশাল">বরিশাল</option>
                  <option value="সিলেট">সিলেট</option>
                  <option value="রংপুর">রংপুর</option>
                  <option value="ময়মনসিংহ">ময়মনসিংহ</option>
                </select>
              </div>

              {/* Area / Upazila */}
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
                  <option value={10}>১০+ বছর</option>
                </select>
              </div>
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
                <span className="font-semibold text-slate-700">শুধুমাত্র অনলাইন কর্মী (🟢 Available Now)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="font-semibold text-emerald-800">শুধুমাত্র ভেরিফাইড কারিগর (✓ Verified)</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 1. Online Workers Section (🟢 Available Now) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-lg font-bold text-slate-900">
              নিকটস্থ সক্রিয় কর্মী (Available Now)
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
              নিচের তালিকা থেকে অফলাইন কর্মীদের প্রোফাইল দেখতে পারেন অথবা অনুরোধ পাঠাতে পারেন। তারা অনলাইনে ফিরলেই নোটিফিকেশন পাবেন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onlineWorkers.map((worker) => (
              <WorkerCard
                key={worker.userId}
                worker={worker}
                customerLocation={customerLocation}
                onViewProfile={(w) => setSelectedWorkerForProfile(w)}
                onHireRequest={(w) => setSelectedWorkerForHire(w)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. Offline Workers Section (🔴 Currently Offline) */}
      {(!onlyOnline && offlineWorkers.length > 0) && (
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <h2 className="text-base font-bold text-slate-700">
                  অন্যান্য তালিকাভুক্ত কর্মী (বর্তমানে অফলাইন)
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                অফলাইন কর্মীদের ক্ষেত্রে লাইভ অবস্থান দেখানো হয় না। অগ্রিম কাজের অনুরোধ পাঠাতে পারেন।
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
                customerLocation={customerLocation}
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
          customerLocation={customerLocation}
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
