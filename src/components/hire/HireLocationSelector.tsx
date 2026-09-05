import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Map as MapIcon, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  Sliders,
  Sparkles,
  Search,
  Compass
} from 'lucide-react';
import { 
  BD_GEO_DATA, 
  getDistrictsByDivision, 
  getUpazilasByDistrict,
  getUnionsByUpazila,
  getAreasByUnionOrUpazila,
  extractCleanGeoName
} from '../../lib/geoData';

export type HireLocationMode = 'live' | 'area';

export interface AreaFilterSelection {
  division: string;
  district: string;
  upazila: string;
  union: string;
  area: string;
}

export interface LiveLocationCoordinates {
  latitude: number;
  longitude: number;
}

interface HireLocationSelectorProps {
  mode: HireLocationMode;
  onModeChange: (mode: HireLocationMode) => void;
  // Area Selection State & Callbacks
  areaSelection: AreaFilterSelection;
  onAreaSelectionChange: (selection: AreaFilterSelection) => void;
  // Live GPS State & Callbacks
  liveCoords: LiveLocationCoordinates | null;
  isLocating: boolean;
  gpsError: string | null;
  onRefreshGps: () => void;
  // Radius filter for Live Location
  radiusKm: number;
  onRadiusKmChange: (radius: number) => void;
  // Service Type context
  isDigitalService?: boolean;
}

export const HireLocationSelector: React.FC<HireLocationSelectorProps> = ({
  mode,
  onModeChange,
  areaSelection,
  onAreaSelectionChange,
  liveCoords,
  isLocating,
  gpsError,
  onRefreshGps,
  radiusKm,
  onRadiusKmChange,
  isDigitalService = false,
}) => {
  // Custom area typing toggle
  const [isCustomArea, setIsCustomArea] = useState(false);
  const [customAreaText, setCustomAreaText] = useState('');

  // Dropdown data options derived from dependent hierarchy
  const availableDistricts = React.useMemo(() => {
    if (!areaSelection.division || areaSelection.division === 'all') return [];
    return getDistrictsByDivision(areaSelection.division);
  }, [areaSelection.division]);

  const availableUpazilas = React.useMemo(() => {
    if (!areaSelection.division || areaSelection.division === 'all' || !areaSelection.district || areaSelection.district === 'all') {
      return [];
    }
    return getUpazilasByDistrict(areaSelection.division, areaSelection.district);
  }, [areaSelection.division, areaSelection.district]);

  const availableUnions = React.useMemo(() => {
    if (!areaSelection.upazila) return [];
    return getUnionsByUpazila(areaSelection.upazila);
  }, [areaSelection.upazila]);

  const availableAreas = React.useMemo(() => {
    if (!areaSelection.upazila) return [];
    return getAreasByUnionOrUpazila(areaSelection.upazila, areaSelection.union);
  }, [areaSelection.upazila, areaSelection.union]);

  // Handlers for dependent changes
  const handleDivisionChange = (newDivision: string) => {
    onAreaSelectionChange({
      division: newDivision,
      district: 'all',
      upazila: '',
      union: '',
      area: '',
    });
    setIsCustomArea(false);
    setCustomAreaText('');
  };

  const handleDistrictChange = (newDistrict: string) => {
    onAreaSelectionChange({
      ...areaSelection,
      district: newDistrict,
      upazila: '',
      union: '',
      area: '',
    });
    setIsCustomArea(false);
    setCustomAreaText('');
  };

  const handleUpazilaChange = (newUpazila: string) => {
    onAreaSelectionChange({
      ...areaSelection,
      upazila: newUpazila,
      union: '',
      area: '',
    });
    setIsCustomArea(false);
    setCustomAreaText('');
  };

  const handleUnionChange = (newUnion: string) => {
    onAreaSelectionChange({
      ...areaSelection,
      union: newUnion,
      area: '',
    });
  };

  const handleAreaChange = (newArea: string) => {
    if (newArea === '__custom__') {
      setIsCustomArea(true);
      onAreaSelectionChange({
        ...areaSelection,
        area: customAreaText,
      });
    } else {
      setIsCustomArea(false);
      onAreaSelectionChange({
        ...areaSelection,
        area: newArea,
      });
    }
  };

  const handleCustomAreaBlur = () => {
    onAreaSelectionChange({
      ...areaSelection,
      area: customAreaText.trim(),
    });
  };

  const handleResetArea = () => {
    onAreaSelectionChange({
      division: 'all',
      district: 'all',
      upazila: '',
      union: '',
      area: '',
    });
    setIsCustomArea(false);
    setCustomAreaText('');
  };

  // Build breadcrumb summary string
  const areaSummaryText = React.useMemo(() => {
    const parts: string[] = [];
    if (areaSelection.division && areaSelection.division !== 'all') {
      parts.push(areaSelection.division);
    } else {
      return 'সারা বাংলাদেশ (সব বিভাগ)';
    }

    if (areaSelection.district && areaSelection.district !== 'all') {
      parts.push(areaSelection.district);
    }
    if (areaSelection.upazila) {
      parts.push(extractCleanGeoName(areaSelection.upazila));
    }
    if (areaSelection.union) {
      parts.push(areaSelection.union);
    }
    if (areaSelection.area) {
      parts.push(areaSelection.area);
    }
    return parts.join(' → ');
  }, [areaSelection]);

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* 1. Header & Mutually Exclusive Selector */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>কোথা থেকে Worker খুঁজবেন?</span>
          </label>
          
          {isDigitalService && (
            <span className="text-[11px] font-semibold text-violet-700 bg-violet-100/70 px-2.5 py-0.5 rounded-full">
              ডিজিটাল সেবা: সারা দেশ প্রযোজ্য
            </span>
          )}
        </div>

        {/* Mutually Exclusive Selector: 📍 Live Location vs 🗺️ এলাকা দিয়ে খুঁজুন */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option 1: Live Location */}
          <button
            type="button"
            id="hire-location-mode-live-btn"
            onClick={() => onModeChange('live')}
            className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition cursor-pointer flex items-start gap-3 relative ${
              mode === 'live'
                ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="pt-0.5">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition ${
                  mode === 'live'
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {mode === 'live' && <span className="w-2 h-2 rounded-full bg-white" />}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <span>📍 Live Location</span>
                {liveCoords && mode === 'live' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    সক্রিয়
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                আপনার বর্তমান অবস্থানের কাছাকাছি Worker খুঁজুন
              </p>
            </div>
          </button>

          {/* Option 2: Area Search */}
          <button
            type="button"
            id="hire-location-mode-area-btn"
            onClick={() => onModeChange('area')}
            className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition cursor-pointer flex items-start gap-3 relative ${
              mode === 'area'
                ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="pt-0.5">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition ${
                  mode === 'area'
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {mode === 'area' && <span className="w-2 h-2 rounded-full bg-white" />}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <span>🗺️ এলাকা দিয়ে খুঁজুন</span>
                {mode === 'area' && areaSelection.division !== 'all' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 truncate max-w-[120px]">
                    {areaSelection.upazila ? extractCleanGeoName(areaSelection.upazila) : areaSelection.district !== 'all' ? areaSelection.district : areaSelection.division}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                নির্দিষ্ট এলাকা নির্বাচন করে Worker খুঁজুন
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Mode Content Panel */}
      {mode === 'live' ? (
        /* LIVE LOCATION PANEL */
        <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-2xs space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  {isLocating
                    ? '🛰️ জিপিএস অবস্থান যাচাই করা হচ্ছে...'
                    : liveCoords
                    ? 'আপনার Live Location সক্রিয় আছে'
                    : 'লাইভ জিপিএস অবস্থান প্রস্তুত'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {liveCoords
                    ? `জিপিএস কোঅর্ডিনেট: ${liveCoords.latitude.toFixed(4)}, ${liveCoords.longitude.toFixed(4)}`
                    : 'ব্রাউজার পারমিশন দিয়ে আপনার বর্তমান দূরত্বে কর্মী ফিল্টার করুন'}
                </p>
              </div>
            </div>

            {/* GPS Action / Refresh button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="hire-refresh-gps-btn"
                onClick={onRefreshGps}
                disabled={isLocating}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 border border-blue-200 transition cursor-pointer disabled:opacity-60"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'খোঁজা হচ্ছে...' : 'লোকেশন রিফ্রেশ'}</span>
              </button>

              {/* Radius Filter for Live Location */}
              {!isDigitalService && (
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs">
                  <span className="text-[11px] text-slate-500 font-semibold shrink-0">ব্যাসার্ধ:</span>
                  <select
                    value={radiusKm}
                    onChange={(e) => onRadiusKmChange(Number(e.target.value))}
                    className="font-bold text-slate-800 bg-transparent outline-none cursor-pointer text-xs"
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

          {/* GPS Error & Fallback Prompt */}
          {gpsError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{gpsError}</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  আপনার Live Location পাওয়া যাচ্ছে না। চাইলে{' '}
                  <button
                    type="button"
                    onClick={() => onModeChange('area')}
                    className="font-bold underline text-blue-700 hover:text-blue-900 cursor-pointer ml-0.5"
                  >
                    🗺️ এলাকা দিয়ে খুঁজুন
                  </button>{' '}
                  ব্যবহার করুন।
                </p>
              </div>
              <button
                type="button"
                onClick={() => onModeChange('area')}
                className="px-2.5 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 font-bold text-[11px] text-amber-900 shrink-0 cursor-pointer"
              >
                এলাকা নির্বাচন করুন
              </button>
            </div>
          )}
        </div>
      ) : (
        /* MANUAL AREA SEARCH PANEL (GPS-INDEPENDENT) */
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">
                ম্যানুয়াল এলাকা নির্বাচন (জিপিএস প্রয়োজন নেই)
              </span>
            </div>
            
            <button
              type="button"
              id="hire-reset-area-btn"
              onClick={handleResetArea}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              ফিল্টার রিসেট (Reset)
            </button>
          </div>

          {/* 5-Tier Hierarchical Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
            {/* 1. Division (বিভাগ) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                বিভাগ
              </label>
              <select
                id="hire-division-select"
                value={areaSelection.division}
                onChange={(e) => handleDivisionChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
              >
                <option value="all">সব বিভাগ (বাংলাদেশ)</option>
                {BD_GEO_DATA.map((d) => (
                  <option key={d.id} value={d.nameBn}>
                    {d.nameBn} ({d.nameEn})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. District (জেলা) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                জেলা
              </label>
              <select
                id="hire-district-select"
                value={areaSelection.district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={!areaSelection.division || areaSelection.division === 'all'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white disabled:opacity-50 disabled:bg-slate-100"
              >
                <option value="all">
                  {areaSelection.division === 'all' ? 'আগে বিভাগ বাছুন' : 'সব জেলা'}
                </option>
                {availableDistricts.map((dist) => (
                  <option key={dist.id} value={dist.nameBn}>
                    {dist.nameBn}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Upazila / Thana (উপজেলা / থানা) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                উপজেলা / থানা
              </label>
              <select
                id="hire-upazila-select"
                value={areaSelection.upazila}
                onChange={(e) => handleUpazilaChange(e.target.value)}
                disabled={!areaSelection.district || areaSelection.district === 'all'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white disabled:opacity-50 disabled:bg-slate-100"
              >
                <option value="">
                  {areaSelection.district === 'all' ? 'আগে জেলা বাছুন' : 'সব উপজেলা / থানা'}
                </option>
                {availableUpazilas.map((up, idx) => (
                  <option key={idx} value={up}>
                    {up}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Union / Pourashava / Ward (ইউনিয়ন / পৌরসভা / ওয়ার্ড) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                ইউনিয়ন / ওয়ার্ড
              </label>
              <select
                id="hire-union-select"
                value={areaSelection.union}
                onChange={(e) => handleUnionChange(e.target.value)}
                disabled={!areaSelection.upazila}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white disabled:opacity-50 disabled:bg-slate-100"
              >
                <option value="">
                  {!areaSelection.upazila ? 'আগে থানা বাছুন' : 'সব ইউনিয়ন / ওয়ার্ড'}
                </option>
                {availableUnions.map((un, idx) => (
                  <option key={idx} value={un}>
                    {un}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Village / Area / Road (গ্রাম / এলাকা) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                গ্রাম / এলাকা
              </label>
              {!isCustomArea ? (
                <select
                  id="hire-area-select"
                  value={areaSelection.area}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  disabled={!areaSelection.upazila}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white disabled:opacity-50 disabled:bg-slate-100"
                >
                  <option value="">
                    {!areaSelection.upazila ? 'আগে থানা বাছুন' : 'সব এলাকা / গ্রাম'}
                  </option>
                  {availableAreas.map((ar, idx) => (
                    <option key={idx} value={ar}>
                      {ar}
                    </option>
                  ))}
                  <option value="__custom__">✍️ নিজের এলাকা লিখুন...</option>
                </select>
              ) : (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    id="hire-custom-area-input"
                    value={customAreaText}
                    onChange={(e) => setCustomAreaText(e.target.value)}
                    onBlur={handleCustomAreaBlur}
                    placeholder="এলাকার নাম লিখুন..."
                    className="w-full px-2.5 py-1.5 rounded-xl border border-blue-300 bg-white text-slate-800 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomArea(false);
                      onAreaSelectionChange({ ...areaSelection, area: '' });
                    }}
                    className="text-[10px] text-slate-400 hover:text-slate-700 px-1 font-bold"
                    title="ড্রপডাউনে ফিরুন"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Location Summary Strip */}
      <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          {mode === 'live' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-bold text-blue-900">📍 Live Location:</span>
              <span className="text-slate-600">
                {liveCoords
                  ? `আপনার বর্তমান অবস্থান থেকে ${radiusKm > 0 ? `${radiusKm} কিমি ব্যাসার্ধের` : 'নিকটবর্তী'} Worker দেখানো হচ্ছে`
                  : 'বর্তমান লোকেশন পারমিশন অপেক্ষা করছে'}
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="font-bold text-slate-900">🗺️ এলাকা দিয়ে অনুসন্ধান:</span>
              <span className="text-blue-800 font-semibold truncate max-w-md">
                {areaSummaryText}
              </span>
            </>
          )}
        </div>

        {mode === 'area' && areaSelection.division !== 'all' && (
          <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
            GPS ফ্রি ম্যানুয়াল সার্চ
          </span>
        )}
      </div>
    </div>
  );
};
