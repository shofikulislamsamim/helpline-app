import React, { useState, useMemo } from 'react';
import { 
  X, 
  CheckCircle, 
  User, 
  MapPin, 
  Briefcase, 
  Wrench, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Sparkles, 
  Award,
  Navigation,
  CreditCard,
  Image as ImageIcon,
  Lock,
  Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BD_GEO_DATA, getDistrictsByDivision, getUpazilasByDistrict } from '../../lib/geoData';
import { CAPABILITIES_LIST, STANDARD_PROFESSIONS, getProfessionSkills } from '../../lib/professionsData';
import { LocationPermissionCard } from './LocationPermissionCard';
import { CustomProfessionModal } from './CustomProfessionModal';
import { WorkHistorySection } from './WorkHistorySection';
import { ServiceTypesSection } from './ServiceTypesSection';
import { PricingRateCardSection } from './PricingRateCardSection';
import { PortfolioSection } from './PortfolioSection';
import { PrivacySettingsSection } from './PrivacySettingsSection';
import { SearchKeywordsSection } from './SearchKeywordsSection';
import { ProfilePhotoUploader } from './ProfilePhotoUploader';
import { ProfessionSkillsManager } from './ProfessionSkillsManager';
import { calculateProfileCompletion } from '../../lib/profileHelpers';
import { buildNormalizedSearchKeywords } from '../../lib/searchNormalization';
import { getProfessionByName } from '../../lib/professionsData';
import { useLanguage } from '../../context/LanguageContext';
import { 
  CapabilityType, 
  PresentAddress, 
  ProfessionExperience, 
  WorkHistory, 
  UserProfile,
  ServiceDeliveryType,
  PortfolioItem,
  PricingRateCard,
  PrivacySettings,
  ServiceCategoryMode,
  UserProfessionItem
} from '../../types';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateProfile } = useAuth();
  const { isBn, formatNumber } = useLanguage();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Form states initialized with user profile
  const [fullName, setFullName] = useState(userProfile.fullName || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile.phoneNumber || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [bio, setBio] = useState(userProfile.bio || '');

  // Address
  const [division, setDivision] = useState(userProfile.presentAddress?.division || '');
  const [district, setDistrict] = useState(userProfile.presentAddress?.district || '');
  const [upazila, setUpazila] = useState(userProfile.presentAddress?.upazila || '');
  const [unionWard, setUnionWard] = useState(userProfile.presentAddress?.unionWard || '');
  const [areaRoad, setAreaRoad] = useState(userProfile.presentAddress?.areaRoad || '');
  const [fullAddress, setFullAddress] = useState(userProfile.presentAddress?.fullAddress || '');

  // Capabilities
  const [selectedCapabilities, setSelectedCapabilities] = useState<CapabilityType[]>(
    userProfile.capabilities || userProfile.roles || []
  );

  // Service Category Modes (Physical, Digital, or Both)
  const [serviceCategoryModes, setServiceCategoryModes] = useState<ServiceCategoryMode[]>(
    userProfile.serviceCategoryModes && userProfile.serviceCategoryModes.length > 0
      ? userProfile.serviceCategoryModes
      : ['physical']
  );

  // User Professions (Structured array supporting both admin and custom items)
  const [userProfessions, setUserProfessions] = useState<UserProfessionItem[]>(() => {
    if (userProfile.userProfessions && userProfile.userProfessions.length > 0) {
      return userProfile.userProfessions;
    }
    const legacyProfessions = userProfile.professions || [];
    if (legacyProfessions.length > 0) {
      return legacyProfessions.map((pName, idx) => {
        const standardDef = getProfessionByName(pName);
        const exp = userProfile.experiences?.find((e) => e.profession === pName);
        return {
          id: standardDef?.id || `prof_${idx}_${Date.now()}`,
          nameBn: pName,
          nameEn: standardDef?.nameEn,
          categoryMode: standardDef?.categoryMode || 'physical',
          isCustom: !standardDef,
          skills: standardDef ? standardDef.defaultSkills : userProfile.skills || [],
          yearsOfExperience: exp?.years ?? 0,
          isMain: pName === userProfile.mainProfession || idx === 0,
        };
      });
    }
    return [];
  });

  const [mainProfession, setMainProfession] = useState<string>(
    userProfile.mainProfession || (userProfile.professions && userProfile.professions[0]) || ''
  );

  // Synchronized derived arrays for backward compatibility and downstream sections (portfolio, experience)
  const selectedProfessions = useMemo(
    () => userProfessions.map((p) => p.nameBn),
    [userProfessions]
  );
  const selectedSkills = useMemo(
    () => Array.from(new Set(userProfessions.flatMap((p) => p.skills))),
    [userProfessions]
  );

  // Service Delivery Types
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<ServiceDeliveryType[]>(
    userProfile.serviceTypes || []
  );

  // Search Keywords
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(
    userProfile.searchKeywords || []
  );

  // Pricing
  const [pricing, setPricing] = useState<PricingRateCard | undefined>(
    userProfile.pricing
  );

  // Experiences per profession
  const [experiences, setExperiences] = useState<ProfessionExperience[]>(
    userProfile.experiences || []
  );

  // Work Histories
  const [workHistories, setWorkHistories] = useState<WorkHistory[]>(
    userProfile.workHistories || []
  );

  // Service Areas
  const [serviceAreas, setServiceAreas] = useState<string[]>(
    userProfile.serviceAreas || []
  );
  const [newAreaInput, setNewAreaInput] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(userProfile.isOnline ?? false);

  // Portfolio
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(
    userProfile.portfolio || []
  );

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(
    userProfile.privacySettings || {
      phoneVisibility: 'public',
      addressVisibility: 'area_only',
      showLiveLocation: true,
      showOnlineStatus: true,
    }
  );

  if (!isOpen) return null;

  // Handle Division change
  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const districts = getDistrictsByDivision(newDiv);
    if (districts.length > 0) {
      setDistrict(districts[0].nameBn);
      const upazilas = getUpazilasByDistrict(newDiv, districts[0].nameBn);
      if (upazilas.length > 0) {
        setUpazila(upazilas[0]);
      }
    }
  };

  // Handle District change
  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const upazilas = getUpazilasByDistrict(division, newDist);
    if (upazilas.length > 0) {
      setUpazila(upazilas[0]);
    }
  };

  // Toggle capability
  const toggleCapability = (cap: CapabilityType) => {
    if (selectedCapabilities.includes(cap)) {
      if (selectedCapabilities.length > 1) {
        setSelectedCapabilities(selectedCapabilities.filter((c) => c !== cap));
      }
    } else {
      setSelectedCapabilities([...selectedCapabilities, cap]);
    }
  };

  // Add service area
  const handleAddServiceArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaInput.trim()) return;
    const trimmed = newAreaInput.trim();
    if (!serviceAreas.includes(trimmed)) {
      setServiceAreas([...serviceAreas, trimmed]);
    }
    setNewAreaInput('');
  };

  // Remove service area
  const removeServiceArea = (areaToRemove: string) => {
    setServiceAreas(serviceAreas.filter((a) => a !== areaToRemove));
  };

  // Save All
  const handleSaveAll = async () => {
    setSaveLoading(true);

    const updatedAddress: PresentAddress = {
      division,
      district,
      upazila,
      unionWard: unionWard.trim() || undefined,
      areaRoad: areaRoad.trim() || undefined,
      fullAddress: fullAddress.trim() || `${areaRoad ? areaRoad + ', ' : ''}${unionWard ? unionWard + ', ' : ''}${upazila}, ${district}, ${division}`,
    };

    // Pending custom professions remain visible to the owner, but are not active/searchable until admin approval.
    const activeProfessions = userProfessions.filter((p) => !p.isCustom || p.status === 'approved');
    const derivedProfessions = activeProfessions.map((p) => p.nameBn);
    const derivedSkills: string[] = Array.from(new Set<string>(activeProfessions.flatMap((p) => p.skills)));
    const finalMainProfession = (mainProfession && activeProfessions.some((p) => p.nameBn === mainProfession))
      ? mainProfession
      : activeProfessions[0]?.nameBn || '';

    // Build comprehensive normalized search keywords (synonyms, phonetic tokens, bangla & english)
    const suggestedProfessionKeywords = activeProfessions.flatMap((prof) => {
      const def = getProfessionByName(prof.nameBn);
      return def?.suggestedKeywords || [];
    });
    const allKeywordsForNormalization = [
      ...selectedKeywords,
      ...derivedProfessions,
      ...derivedSkills,
      ...suggestedProfessionKeywords,
      ...serviceAreas,
      upazila,
      district,
    ];
    const normalizedKeywords = buildNormalizedSearchKeywords(allKeywordsForNormalization);

    // Construct experiences
    const constructedExp: ProfessionExperience[] = activeProfessions.map((prof) => {
      const existing = experiences.find((e) => e.profession === prof.nameBn);
      return {
        profession: prof.nameBn,
        years: prof.yearsOfExperience ?? existing?.years ?? 0,
        description: prof.description || existing?.description || '',
        isMain: prof.nameBn === finalMainProfession,
      };
    });

    const updatedProfileData: Partial<UserProfile> = {
      fullName,
      avatarUrl: avatarUrl.trim() || undefined,
      phoneNumber,
      email: email.trim() || undefined,
      bio,
      presentAddress: updatedAddress,
      capabilities: selectedCapabilities,
      roles: selectedCapabilities,
      serviceCategoryModes,
      userProfessions,
      customProfessions: userProfessions.filter((p) => p.isCustom),
      professions: derivedProfessions,
      mainProfession: finalMainProfession,
      skills: derivedSkills,
      searchKeywords: selectedKeywords,
      searchKeywordsNormalized: normalizedKeywords,
      serviceTypes: selectedServiceTypes,
      experiences: constructedExp,
      workHistories,
      serviceAreas,
      isOnline,
      availabilityUpdatedAt: new Date().toISOString(),
      portfolio,
      pricing: pricing && (
        pricing.hourlyRate !== undefined ||
        pricing.dailyRate !== undefined ||
        pricing.visitFee !== undefined ||
        pricing.isNegotiable === true ||
        Boolean(pricing.rateDescription?.trim())
      )
        ? pricing
        : undefined,
      privacySettings,
      isProfileSetupComplete: true,
    };

    await updateProfile(updatedProfileData);
    setSaveLoading(false);
    setSaveSuccess(true);

    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  // Preview current completion
  const previewProfileObj: UserProfile = {
    ...userProfile,
    fullName,
    avatarUrl,
    phoneNumber,
    email,
    bio,
    presentAddress: { division, district, upazila, unionWard, areaRoad },
    capabilities: selectedCapabilities,
    roles: selectedCapabilities,
    professions: selectedProfessions,
    skills: selectedSkills,
    searchKeywords: selectedKeywords,
    serviceTypes: selectedServiceTypes,
    experiences,
    workHistories,
    serviceAreas,
    portfolio,
    pricing,
    privacySettings,
  };
  const completion = calculateProfileCompletion(previewProfileObj);

  const steps = [
    { id: 1, title: isBn ? 'বেসিক তথ্য' : 'Basic Info', icon: User },
    { id: 2, title: isBn ? 'বর্তমান ঠিকানা' : 'Address', icon: MapPin },
    { id: 3, title: isBn ? 'কী করতে চান' : 'Capabilities', icon: Briefcase },
    { id: 4, title: isBn ? 'পেশা ও দক্ষতা' : 'Professions & Skills', icon: Wrench },
    { id: 5, title: isBn ? 'সার্ভিস ও রেট' : 'Services & Rates', icon: CreditCard },
    { id: 6, title: isBn ? 'কাজের ইতিহাস' : 'Work History', icon: Clock },
    { id: 7, title: isBn ? 'কর্ম এলাকা' : 'Service Area', icon: Navigation },
    { id: 8, title: isBn ? 'পোর্টফোলিও' : 'Portfolio', icon: ImageIcon },
    { id: 9, title: isBn ? 'গোপনীয়তা' : 'Privacy', icon: Lock },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-blue-600 rounded-lg text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {isBn ? 'আপনার প্রোফাইল সম্পাদনা (Main Profile Setup)' : 'Profile Setup & Customization'}
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            {isBn 
              ? '১৮টি সমন্বিত সেকশনের মাধ্যমে আপনার মূল প্রোফাইল নির্ভুলভাবে সাজান।' 
              : 'Organize your complete professional profile with all integrated sections.'}
          </p>

          {/* Progress bar in header */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${completion.percentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-blue-400 shrink-0">
              {formatNumber(completion.percentage)}% {isBn ? 'সম্পন্ন' : 'Complete'}
            </span>
          </div>

          {/* Step Tabs */}
          <div className="flex items-center justify-between gap-1 mt-4 overflow-x-auto pb-1 no-scrollbar text-xs">
            {steps.map((st) => {
              const Icon = st.icon;
              const isActive = activeStep === st.id;
              const isPast = activeStep > st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setActiveStep(st.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isPast
                      ? 'bg-slate-800 text-blue-300 hover:bg-slate-700'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[11px] whitespace-nowrap">{st.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {saveSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {isBn ? 'প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!' : 'Profile Saved Successfully!'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                {isBn
                  ? 'আপনার দেওয়া সমস্ত তথ্য সফলভাবে আপডেট হয়েছে। এখন থেকে গ্রাহক ও নিয়োগকারীরা আপনাকে আরও সহজে খুঁজে পাবেন।'
                  : 'All your profile details have been saved. Clients and hirers will now be able to find and contact you easily.'}
              </p>
            </div>
          ) : (
            <>
              {/* STEP 1: Basic Info */}
              {activeStep === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>{isBn ? '১. বেসিক তথ্য ও প্রোফাইল ছবি' : '1. Basic Info & Profile Photo'}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {isBn ? `ধাপ ${formatNumber(1)} / ৯` : 'Step 1 of 9'}
                    </span>
                  </div>

                  {/* Profile Photo Direct Upload */}
                  <ProfilePhotoUploader
                    currentPhotoUrl={avatarUrl}
                    userId={userProfile.userId}
                    userName={fullName || userProfile.fullName}
                    onPhotoUploaded={(url) => setAvatarUrl(url || '')}
                  />

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'আপনার পূর্ণ নাম (বাংলা বা ইংরেজিতে) *' : 'Full Name (Bangla or English) *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={isBn ? 'যেমন: মো: আরিফুল ইসলাম' : 'e.g. Md. Ariful Islam'}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'মোবাইল নম্বর (লগইন ও যোগাযোগের জন্য) *' : 'Mobile Number (Login & Contact) *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="017xxxxxxxx"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBn ? 'ইমেইল ঠিকানা (ঐচ্ছিক)' : 'Email Address (Optional)'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="arif@example.com"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBn ? 'সংক্ষিপ্ত বিবরণ / পরিচিতি (Bio)' : 'Bio / Short Introduction'}
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={isBn ? 'নিজের কাজ, অভিজ্ঞতা ও কাজের ধরন সম্পর্কে ২-৩ বাক্যে লিখুন...' : 'Write 2-3 sentences about your expertise, experience, and service approach...'}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Address & Location */}
              {activeStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>{isBn ? '২. বর্তমান ঠিকানা ও অবস্থান (Present Address)' : '2. Present Address & Location'}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {isBn ? `ধাপ ${formatNumber(2)} / ৯` : 'Step 2 of 9'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    {isBn 
                      ? 'বাংলাদেশি প্রশাসনিক কাঠামো অনুসারে সঠিক ঠিকানা নির্বাচন করুন:' 
                      : 'Select your administrative location in Bangladesh:'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Division */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'বিভাগ *' : 'Division *'}
                      </label>
                      <select
                        value={division}
                        onChange={(e) => handleDivisionChange(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        {BD_GEO_DATA.map((d) => (
                          <option key={d.nameBn} value={d.nameBn}>
                            {isBn ? d.nameBn : d.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'জেলা *' : 'District *'}
                      </label>
                      <select
                        value={district}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        {getDistrictsByDivision(division).map((d) => (
                          <option key={d.nameBn} value={d.nameBn}>
                            {isBn ? d.nameBn : d.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Upazila */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'উপজেলা / থানা *' : 'Upazila / Thana *'}
                      </label>
                      <select
                        value={upazila}
                        onChange={(e) => setUpazila(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        {getUpazilasByDistrict(division, district).map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'ইউনিয়ন বা ওয়ার্ড নম্বর' : 'Union or Ward Number'}
                      </label>
                      <input
                        type="text"
                        value={unionWard}
                        onChange={(e) => setUnionWard(e.target.value)}
                        placeholder={isBn ? 'যেমন: ওয়ার্ড নং ০৭ বা পাইকপাড়া ইউনিয়ন' : 'e.g. Ward No. 7 or Paikpara Union'}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? 'এলাকা / মহল্লা / রোড' : 'Area / Neighborhood / Road'}
                      </label>
                      <input
                        type="text"
                        value={areaRoad}
                        onChange={(e) => setAreaRoad(e.target.value)}
                        placeholder={isBn ? 'যেমন: ব্লক-সি, রোড নং ৪, মিরপুর ১০' : 'e.g. Block C, Road 4, Mirpur 10'}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Full Address details */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBn ? 'সম্পূর্ণ ঠিকানা (বাসা / হোল্ডিং নং সহ বিস্তারিত)' : 'Full Address (House / Holding No. & Details)'}
                    </label>
                    <textarea
                      rows={2}
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      placeholder={isBn ? 'বাড়ি নং ১২/এ, রোড নং ৩, ব্লক-বি, মিরপুর, ঢাকা' : 'House 12/A, Road 3, Block B, Mirpur, Dhaka'}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Live GPS location card component */}
                  <div className="pt-2">
                    <LocationPermissionCard />
                  </div>
                </div>
              )}

              {/* STEP 3: Capabilities */}
              {activeStep === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <span>{isBn ? '৩. আপনি হেল্পলাইনে কী কী করতে চান? (Capabilities)' : '3. What do you want to do on HelpLine? (Capabilities)'}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {isBn ? `ধাপ ${formatNumber(3)} / ৯` : 'Step 3 of 9'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    {isBn 
                      ? 'HelpLine-এ একটি প্রোফাইল দিয়েই আপনি যেকোনো সুযোগ গ্রহণ করতে পারবেন। প্রযোজ্য সবগুলো নির্বাচন করুন:' 
                      : 'With one HelpLine account, you can access multiple roles and services. Select all that apply:'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CAPABILITIES_LIST.map((cap) => {
                      const isSelected = selectedCapabilities.includes(cap.id);
                      const title = isBn ? cap.titleBn : (cap.titleEn || cap.titleBn);
                      const subtitle = isBn ? cap.subtitleBn : (cap.subtitleEn || cap.subtitleBn);

                      return (
                        <div
                          key={cap.id}
                          onClick={() => toggleCapability(cap.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-300 text-blue-950 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-2xl shrink-0 mt-0.5">{cap.icon}</span>
                          <div className="space-y-0.5 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-xs text-slate-900">{title}</h4>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                              />
                            </div>
                            <p className="text-[11px] text-slate-500">{subtitle}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: Professions & Skills */}
              {activeStep === 4 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-blue-600" />
                      <span>{isBn ? '৪. পেশাসমূহ ও কাজের দক্ষতা (Professions & Skills)' : '4. Professions & Skills'}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {isBn ? `ধাপ ${formatNumber(4)} / ৯` : 'Step 4 of 9'}
                    </span>
                  </div>

                  <ProfessionSkillsManager
                    categoryModes={serviceCategoryModes}
                    userProfessions={userProfessions}
                    mainProfession={mainProfession}
                    onCategoryModesChange={setServiceCategoryModes}
                    onUserProfessionsChange={setUserProfessions}
                    onMainProfessionChange={setMainProfession}
                  />
                </div>
              )}

              {/* STEP 5: Service Types & Pricing */}
              {activeStep === 5 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>{isBn ? '৫. সেবার ধরন ও মূল্য নির্ধারণ (Service Delivery & Pricing)' : '5. Service Delivery & Pricing'}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {isBn ? `ধাপ ${formatNumber(5)} / ৯` : 'Step 5 of 9'}
                    </span>
                  </div>

                  {/* Service Delivery Types */}
                  <ServiceTypesSection
                    selectedTypes={selectedServiceTypes}
                    onChange={(types) => setSelectedServiceTypes(types)}
                  />

                  <div className="border-t border-slate-200 pt-4">
                    {/* Pricing Rate Card */}
                    <PricingRateCardSection
                      pricing={pricing}
                      onChange={(newPricing) => setPricing(newPricing)}
                    />
                  </div>
                </div>
              )}

              {/* STEP 6: Work History & Experience */}
              {activeStep === 6 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>{isBn ? '৬. কাজের অভিজ্ঞতা ও ইতিহাস (Work Experience & History)' : '6. Work Experience & History'}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {isBn ? `ধাপ ${formatNumber(6)} / ৯` : 'Step 6 of 9'}
                    </span>
                  </div>

                  {/* Per Profession Experience */}
                  {selectedProfessions.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-800">
                        {isBn ? 'নির্বাচিত পেশাগুলোতে আপনার অভিজ্ঞতার বছর:' : 'Years of experience in your selected professions:'}
                      </h4>

                      {selectedProfessions.map((prof) => {
                        const existing = experiences.find((e) => e.profession === prof);
                        const currentYears = existing?.years || 3;
                        const currentDesc = existing?.description || '';

                        return (
                          <div key={prof} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900">{prof}</span>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-slate-600">{isBn ? 'অভিজ্ঞতা:' : 'Experience:'}</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="50"
                                  value={currentYears}
                                  onChange={(e) => {
                                    const y = parseInt(e.target.value) || 0;
                                    setExperiences((prev) => {
                                      const filtered = prev.filter((p) => p.profession !== prof);
                                      return [...filtered, { profession: prof, years: y, description: currentDesc }];
                                    });
                                  }}
                                  className="w-16 p-1 text-xs border border-slate-300 rounded bg-white text-center font-bold"
                                />
                                <span className="text-slate-600 font-medium">{isBn ? 'বছর' : 'Years'}</span>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={currentDesc}
                              onChange={(e) => {
                                const val = e.target.value;
                                setExperiences((prev) => {
                                  const filtered = prev.filter((p) => p.profession !== prof);
                                  return [...filtered, { profession: prof, years: currentYears, description: val }];
                                });
                              }}
                              placeholder={isBn ? 'এই কাজের বিশেষত্ব (যেমন: ১০ তলা ভবনের মেইন ওয়্যারিং)' : 'Specialization (e.g. 10-story building main wiring)'}
                              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                      {isBn 
                        ? 'পূর্ববর্তী ধাপে কোনো পেশা নির্বাচন করা হয়নি। কাজের মানুষ হিসেবে প্রোফাইল করতে চাইলে ধাপ ৪ এ পেশা যুক্ত করুন।' 
                        : 'No professions selected in previous steps. Please add professions in Step 4 to configure experience.'}
                    </div>
                  )}

                  {/* Work History Section */}
                  <WorkHistorySection
                    histories={workHistories}
                    onChange={(h) => setWorkHistories(h)}
                  />
                </div>
              )}

              {/* STEP 7: Service Area & Search Keywords */}
              {activeStep === 7 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      <span>{isBn ? '৭. কর্ম এলাকা ও সার্চ কিওয়ার্ডস (Service Area & Search)' : '7. Service Area & Search Keywords'}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {isBn ? `ধাপ ${formatNumber(7)} / ৯` : 'Step 7 of 9'}
                    </span>
                  </div>

                  {/* Service Area Section */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800">
                      {isBn ? '"আমি যেসব এলাকায় কাজ করি" — সেবা প্রদানের এলাকা:' : '"Areas Where I Offer Service" — Working Coverage:'}
                    </h4>

                    {/* Active Service Area Chips */}
                    <div className="flex flex-wrap gap-2">
                      {serviceAreas.map((area, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                        >
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span>{area}</span>
                          <button
                            type="button"
                            onClick={() => removeServiceArea(area)}
                            className="text-blue-700 hover:text-red-600 font-bold ml-1 transition cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Add Area Form */}
                    <form onSubmit={handleAddServiceArea} className="flex gap-2 max-w-md">
                      <input
                        type="text"
                        value={newAreaInput}
                        onChange={(e) => setNewAreaInput(e.target.value)}
                        placeholder={isBn ? 'যেমন: মিরপুর ১০, উত্তরা সেক্টর ৩, ধানমন্ডি' : 'e.g. Mirpur 10, Uttara Sector 3, Dhanmondi'}
                        className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        {isBn ? '+ এলাকা যোগ করুন' : '+ Add Area'}
                      </button>
                    </form>

                    {/* Quick Suggestions based on upazila */}
                    <div className="pt-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">
                        {isBn ? 'প্রস্তাবিত এলাকা:' : 'Suggested Areas:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {[
                          isBn ? `${upazila} সম্পূর্ণ` : `All of ${upazila}`,
                          isBn ? `${district} সদর` : `${district} Sadar`,
                          isBn ? `${upazila} ও আশেপাশের এলাকা` : `${upazila} and nearby areas`,
                          isBn ? `${district} জেলার মধ্যে` : `Within ${district} district`,
                        ].map((sug, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              if (!serviceAreas.includes(sug)) {
                                setServiceAreas([...serviceAreas, sug]);
                              }
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] text-slate-700 border border-slate-200 cursor-pointer"
                          >
                            + {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Availability Section */}
                  <div className="border-t border-slate-200 pt-4 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        {isBn ? 'কাজের জন্য আপনার বর্তমান Availability' : 'Your Current Work Availability'}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {isBn ? 'আপনি এখন নতুন কাজ নেওয়ার জন্য প্রস্তুত কি না তা জানান।' : 'Let people know whether you are currently available for new work.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOnline((value) => !value)}
                      aria-pressed={isOnline}
                      className={`w-full sm:w-auto flex items-center justify-between gap-4 px-4 py-3 rounded-xl border transition cursor-pointer ${isOnline ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>
                          <span className="block text-xs font-bold text-slate-900">{isOnline ? (isBn ? 'এখন কাজের জন্য Available' : 'Available for work') : (isBn ? 'এখন কাজের জন্য Available নই' : 'Not currently available')}</span>
                          <span className="block text-[11px] text-slate-500 mt-0.5">{isBn ? 'প্রোফাইলে এই স্ট্যাটাস দেখানো হতে পারে।' : 'This status may be shown on your profile.'}</span>
                        </span>
                      </div>
                      <span className={`text-[11px] font-bold ${isOnline ? 'text-emerald-700' : 'text-slate-500'}`}>{isOnline ? (isBn ? 'চালু' : 'ON') : (isBn ? 'বন্ধ' : 'OFF')}</span>
                    </button>
                  </div>

                  {/* Search Keywords Section */}
                  <div className="border-t border-slate-200 pt-4">
                    <SearchKeywordsSection
                      keywords={selectedKeywords}
                      professions={userProfessions}
                      skills={selectedSkills}
                      onChange={(kw) => setSelectedKeywords(kw)}
                    />
                  </div>
                </div>
              )}

              {/* STEP 8: Portfolio */}
              {activeStep === 8 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-purple-600" />
                      <span>{isBn ? '৮. পোর্টফোলিও ও কাজের নমুনা (Portfolio)' : '8. Portfolio & Work Samples'}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {isBn ? `ধাপ ${formatNumber(8)} / ৯` : 'Step 8 of 9'}
                    </span>
                  </div>

                  <PortfolioSection
                    portfolio={portfolio}
                    userProfessions={selectedProfessions}
                    onChange={(newPort) => setPortfolio(newPort)}
                  />
                </div>
              )}

              {/* STEP 9: Privacy Settings */}
              {activeStep === 9 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-600" />
                      <span>{isBn ? '৯. ব্যক্তিগত তথ্যের গোপনীয়তা নিয়ন্ত্রণ (Privacy Settings)' : '9. Privacy & Visibility Settings'}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {isBn ? `ধাপ ${formatNumber(9)} / ৯` : 'Step 9 of 9'}
                    </span>
                  </div>

                  <PrivacySettingsSection
                    settings={privacySettings}
                    onChange={(newSettings) => setPrivacySettings(newSettings)}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!saveSuccess && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            {activeStep > 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isBn ? 'পূর্ববর্তী ধাপ' : 'Previous'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                {isBn ? 'পরে পূরণ করব' : 'Skip for now'}
              </button>
            )}

            <div className="flex items-center gap-2">
              {activeStep < 9 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isBn ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saveLoading}
                  onClick={handleSaveAll}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {saveLoading
                      ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...')
                      : (isBn ? 'প্রোফাইল সংরক্ষণ ও সম্পন্ন করুন' : 'Save & Complete Profile')}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom Profession Modal Sub-dialog */}
      <CustomProfessionModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAdded={(customItem) => {
          if (!userProfessions.some((p) => p.nameBn === customItem.nameBn)) {
            setUserProfessions([...userProfessions, customItem]);
            if (!mainProfession) setMainProfession(customItem.nameBn);
          }
        }}
      />
    </div>
  );
};
