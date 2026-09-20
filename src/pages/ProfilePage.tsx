import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  ShieldCheck, 
  ShieldAlert, 
  Briefcase, 
  Wrench, 
  CheckCircle, 
  Clock, 
  CreditCard,
  Edit3,
  Sparkles,
  Award,
  Navigation,
  Image as ImageIcon,
  Activity,
  Plus,
  Radio,
  FileText,
  Lock,
  Layers,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StatusToggle } from '../components/common/StatusToggle';
import { ProfileCompletionBanner } from '../components/profile/ProfileCompletionBanner';
import { LocationPermissionCard } from '../components/profile/LocationPermissionCard';
import { WorkHistorySection } from '../components/profile/WorkHistorySection';
import { CustomProfessionModal } from '../components/profile/CustomProfessionModal';
import { ProfileSetupModal } from '../components/profile/ProfileSetupModal';
import { PortfolioSection } from '../components/profile/PortfolioSection';
import { PricingRateCardSection } from '../components/profile/PricingRateCardSection';
import { ServiceTypesSection } from '../components/profile/ServiceTypesSection';
import { SearchKeywordsSection } from '../components/profile/SearchKeywordsSection';
import { PrivacySettingsSection } from '../components/profile/PrivacySettingsSection';
import { ProfilePhotoUploader } from '../components/profile/ProfilePhotoUploader';
import { RatingReputationSection } from '../components/profile/RatingReputationSection';
import { CAPABILITIES_LIST } from '../lib/professionsData';
import { i18n } from '../lib/i18n';
import { CapabilityType, UserProfessionItem } from '../types';
import { buildNormalizedSearchKeywords } from '../lib/searchNormalization';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/common/LanguageSelector';

interface ProfilePageProps {
  onNavigate: (view: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    userProfile, 
    updateProfile, 
    toggleRole, 
    isProfileSetupOpen, 
    openProfileSetup, 
    closeProfileSetup 
  } = useAuth();
  const { t, isBn, formatNumber } = useLanguage();

  const [isCustomProfModalOpen, setIsCustomProfModalOpen] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');

  const activeCapabilities = userProfile.capabilities || userProfile.roles || [];

  const handleAddSkillDirectly = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const trimmed = newSkillInput.trim();
    const currentSkills = userProfile.skills || [];
    if (!currentSkills.includes(trimmed)) {
      const nextSkills = [...currentSkills, trimmed];
      const allKeywords = [
        ...(userProfile.searchKeywords || []),
        ...(userProfile.professions || []),
        ...nextSkills,
        ...(userProfile.serviceAreas || []),
        userProfile.presentAddress?.upazila || '',
        userProfile.presentAddress?.district || '',
      ];
      const normalized = buildNormalizedSearchKeywords(allKeywords);
      await updateProfile({ 
        skills: nextSkills,
        searchKeywordsNormalized: normalized 
      });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkillDirectly = async (skillToRemove: string) => {
    const currentSkills = userProfile.skills || [];
    const nextSkills = currentSkills.filter((s) => s !== skillToRemove);
    const allKeywords = [
      ...(userProfile.searchKeywords || []),
      ...(userProfile.professions || []),
      ...nextSkills,
      ...(userProfile.serviceAreas || []),
      userProfile.presentAddress?.upazila || '',
      userProfile.presentAddress?.district || '',
    ];
    const normalized = buildNormalizedSearchKeywords(allKeywords);
    await updateProfile({ 
      skills: nextSkills,
      searchKeywordsNormalized: normalized 
    });
  };

  const handleCustomProfessionAdded = async (newProf: UserProfessionItem) => {
    const existingUserProfs = userProfile.userProfessions || [];
    const updatedUserProfs = [...existingUserProfs, newProf];
    const updatedProfessions = Array.from(new Set([...(userProfile.professions || []), newProf.nameBn]));
    const updatedSkills = Array.from(new Set([...(userProfile.skills || []), ...newProf.skills]));
    const updatedModes = Array.from(
      new Set([...(userProfile.serviceCategoryModes || ['physical']), newProf.categoryMode])
    );

    const allKeywordsForNormalization = [
      ...(userProfile.searchKeywords || []),
      ...updatedProfessions,
      ...updatedSkills,
      ...(userProfile.serviceAreas || []),
      userProfile.presentAddress?.upazila || '',
      userProfile.presentAddress?.district || '',
    ];
    const normalizedKeywords = buildNormalizedSearchKeywords(allKeywordsForNormalization);

    await updateProfile({
      userProfessions: updatedUserProfs,
      customProfessions: updatedUserProfs.filter((p) => p.isCustom),
      professions: updatedProfessions,
      skills: updatedSkills,
      serviceCategoryModes: updatedModes,
      searchKeywordsNormalized: normalizedKeywords,
      mainProfession: userProfile.mainProfession || newProf.nameBn,
    });
    setIsCustomProfModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* 18. Dynamic Profile Completion Banner */}
      <ProfileCompletionBanner 
        profile={userProfile} 
        onOpenSetup={openProfileSetup} 
      />

      {/* 1. Main User Profile Header Card (Basic Info) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-5">
            {/* Avatar with Online/Offline indicator */}
            <div className="relative shrink-0">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.fullName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-blue-600 shadow-xs"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-xs">
                  {userProfile.fullName ? userProfile.fullName.charAt(0) : 'U'}
                </div>
              )}
              <span
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                  userProfile.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
                title={userProfile.isOnline ? (isBn ? 'অনলাইন (Online)' : 'Online (Active)') : (isBn ? 'অফলাইন (Offline)' : 'Offline')}
              />
            </div>

            {/* Identity Info */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {userProfile.fullName}
                </h1>
                {userProfile.verificationStatus === 'approved' || userProfile.verificationStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isBn ? '✓ ভেরিফাইড (Verified)' : '✓ Verified'}</span>
                  </span>
                ) : userProfile.verificationStatus === 'under_review' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isBn ? '🔍 পর্যালোচনা চলছে' : '🔍 Under Review'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isBn ? 'অযাচাইকৃত (Unverified)' : 'Unverified'}</span>
                  </span>
                )}

                {/* Driver Badge if verified */}
                {(userProfile.driverVerificationStatus === 'approved' || userProfile.isDriverVerified) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    <span>🚗</span>
                    <span>{isBn ? 'ড্রাইভার' : 'Driver'}</span>
                  </span>
                )}
              </div>

              {/* Main Profession Badge & Present District */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                {userProfile.mainProfession && (
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 font-bold rounded-md border border-blue-200 flex items-center gap-1">
                    <Award className="w-3 h-3 text-blue-600" />
                    <span>{userProfile.mainProfession}</span>
                  </span>
                )}
                <span className="flex items-center gap-1 font-medium text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {userProfile.presentAddress?.upazila ? `${userProfile.presentAddress.upazila}, ` : ''}
                    {userProfile.presentAddress?.district || (isBn ? 'বাংলাদেশ' : 'Bangladesh')}
                  </span>
                </span>
                <span className="flex items-center gap-1 font-semibold text-amber-600">
                  {userProfile.reviewCount > 0 ? (
                    <>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{userProfile.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({formatNumber(userProfile.reviewCount)} {isBn ? 'রিভিউ' : 'reviews'})</span>
                    </>
                  ) : (
                    <span className="text-slate-400 font-normal">{isBn ? 'এখনও কোনো রিভিউ নেই' : 'No reviews yet'}</span>
                  )}
                </span>
              </div>

              {/* Phone & Email (Respecting Privacy Settings) */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {userProfile.privacySettings?.phoneVisibility === 'hidden'
                      ? (isBn ? '🔒 নম্বর গোপন রাখা হয়েছে' : '🔒 Number Hidden')
                      : userProfile.phoneNumber}
                  </span>
                </span>
                {userProfile.email && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{userProfile.email}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Edit CTA Button */}
          <button
            onClick={openProfileSetup}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isBn ? 'সম্পূর্ণ প্রোফাইল সম্পাদনা করুন' : 'Edit Full Profile'}</span>
          </button>
        </div>

        {/* Bio */}
        {userProfile.bio && (
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-700 leading-relaxed">
            <p className="font-semibold text-slate-900 mb-0.5">{isBn ? 'পরিচিতি (Bio):' : 'Bio:'}</p>
            <p>{userProfile.bio}</p>
          </div>
        )}

        {/* Profile Photo Direct Image Upload (📷 Profile Photo) */}
        <div className="mt-5 pt-5 border-t border-slate-100">
          <ProfilePhotoUploader
            currentPhotoUrl={userProfile.avatarUrl}
            userId={userProfile.userId}
            userName={userProfile.fullName}
            onPhotoUploaded={async (newUrl) => {
              await updateProfile({ avatarUrl: newUrl || '' });
            }}
            autoSaveToProfile={async (newUrl) => {
              await updateProfile({ avatarUrl: newUrl || '' });
              return true;
            }}
          />
        </div>
      </div>

      {/* 2. Online / Offline Availability Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${userProfile.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>১. কাজের প্রাপ্যতা (Online / Offline Availability)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              আপনি অনলাইনে থাকলে কাস্টমাররা আপনাকে সরাসরি কল করতে এবং জরুরি কাজে আমন্ত্রণ জানাতে পারবেন।
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
          <StatusToggle />

          <div className="text-xs text-slate-500 space-y-0.5">
            {userProfile.isOnline ? (
              <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>আপনি বর্তমানে কাজের জন্য প্রস্তুত (Available)</span>
              </p>
            ) : (
              <p className="text-slate-600 font-medium">
                বর্তমানে অফলাইনে আছেন। কাজ পাওয়ার জন্য সুইচটি চালু করুন।
              </p>
            )}
            {userProfile.lastOnlineAt && (
              <p className="text-[11px] text-slate-400">
                সর্বশেষ সক্রিয়: {new Date(userProfile.lastOnlineAt).toLocaleTimeString('bn-BD')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Roles & Capabilities (১০টি সক্ষমতা) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>২. সক্রিয় সক্ষমতা ও ভূমিকা (Capabilities)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              HelpLine-এ আপনি একই প্রোফাইলে একাধিক রোলে সক্রিয় থাকতে পারেন।
            </p>
          </div>
          <button
            onClick={openProfileSetup}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            পরিবর্তন করুন
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CAPABILITIES_LIST.map((cap) => {
            const isSelected = activeCapabilities.includes(cap.id);
            return (
              <div
                key={cap.id}
                onClick={() => toggleRole(cap.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-300 text-blue-950 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl shrink-0 mt-0.5">{cap.icon}</span>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-slate-900">{cap.titleBn}</h3>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{cap.subtitleBn}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Present Address (বর্তমান ঠিকানা) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>৩. বর্তমান ঠিকানা (Present Address)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              বাংলাদেশি প্রশাসনিক কাঠামো অনুসারে আপনার নির্দিষ্ট বর্তমান অবস্থান
            </p>
          </div>
          <button
            onClick={openProfileSetup}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            সম্পাদনা
          </button>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          {/* Breadcrumb Hierarchy */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700">
              বিভাগ: {userProfile.presentAddress?.division || 'ঢাকা'}
            </span>
            <span className="text-slate-400">›</span>
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700">
              জেলা: {userProfile.presentAddress?.district || 'ঢাকা'}
            </span>
            <span className="text-slate-400">›</span>
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700">
              উপজেলা/থানা: {userProfile.presentAddress?.upazila || 'মিরপুর'}
            </span>
            {userProfile.presentAddress?.unionWard && (
              <>
                <span className="text-slate-400">›</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700">
                  {userProfile.presentAddress.unionWard}
                </span>
              </>
            )}
          </div>

          {/* Detailed Street Address */}
          {userProfile.presentAddress?.fullAddress ? (
            <div className="text-xs text-slate-600 pt-1">
              <strong className="text-slate-800">পূর্ণ ঠিকানা:</strong> {userProfile.presentAddress.fullAddress}
            </div>
          ) : userProfile.presentAddress?.areaRoad ? (
            <div className="text-xs text-slate-600 pt-1">
              <strong className="text-slate-800">এলাকা/রোড:</strong> {userProfile.presentAddress.areaRoad}
            </div>
          ) : null}
        </div>
      </div>

      {/* 5. Live GPS Location (বর্তমান লাইভ লোকেশন) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>৪. লাইভ জিপিএস লোকেশন ও পারমিশন (Live GPS Location)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            কাছাকাছি কাজ পেতে ও সঠিক দূরত্ব গণনার জন্য আপনার ডিভাইসের লাইভ জিপিএস লোকেশন সচল রাখুন।
          </p>
        </div>

        <LocationPermissionCard />
      </div>

      {/* 6. Professions & Skills (পেশা ও দক্ষতা) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>৫. পেশাসমূহ ও কাজের দক্ষতা (Professions & Skills)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">আপনার দক্ষতা ও সংশ্লিষ্ট কাজের তালিকা</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustomProfModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন পেশা তৈরি</span>
            </button>
            <button
              onClick={openProfileSetup}
              className="text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>সম্পাদনা</span>
            </button>
          </div>
        </div>

        {/* Service Category Modes Badges */}
        {userProfile.serviceCategoryModes && userProfile.serviceCategoryModes.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-500">সার্ভিসের ধরন:</span>
            {userProfile.serviceCategoryModes.includes('physical') && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                <span>📍</span>
                <span>লোকাল / ফিজিক্যাল সার্ভিস</span>
              </span>
            )}
            {userProfile.serviceCategoryModes.includes('digital') && (
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[11px] font-bold border border-indigo-200 flex items-center gap-1">
                <span>💻</span>
                <span>ফ্রিল্যান্স / ডিজিটাল সার্ভিস</span>
              </span>
            )}
          </div>
        )}

        {/* Professions List */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">নির্বাচিত পেশা:</label>
          {userProfile.userProfessions && userProfile.userProfessions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userProfile.userProfessions.map((prof, idx) => {
                const isMain = prof.nameBn === userProfile.mainProfession || prof.isMain;
                return (
                  <div
                    key={prof.id || idx}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      isMain
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-blue-50 text-blue-900 border border-blue-200'
                    }`}
                  >
                    <span>{prof.categoryMode === 'digital' ? '💻' : '📍'}</span>
                    <span>{prof.nameBn}</span>
                    {prof.nameEn && <span className="text-[10px] opacity-75">({prof.nameEn})</span>}
                    {prof.isCustom && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold ${
                        isMain ? 'bg-blue-700 text-blue-100' : 'bg-blue-200 text-blue-800'
                      }`}>
                        কাস্টম
                      </span>
                    )}
                    {isMain && (
                      <span className="text-[10px] bg-white text-blue-700 px-1.5 py-0.2 rounded-md font-black">
                        প্রধান
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : userProfile.professions && userProfile.professions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userProfile.professions.map((prof, idx) => {
                const isMain = prof === userProfile.mainProfession;
                return (
                  <span
                    key={idx}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      isMain
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-blue-50 text-blue-900 border border-blue-200'
                    }`}
                  >
                    <span>{prof}</span>
                    {isMain && (
                      <span className="text-[10px] bg-white text-blue-700 px-1.5 py-0.2 rounded-md font-black">
                        প্রধান
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">কোনো পেশা এখনও যুক্ত করা হয়নি।</p>
          )}
        </div>

        {/* Skills Tags */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">কাজের দক্ষতা ও স্পেশালাইজেশন (Skills):</label>
            <button
              onClick={openProfileSetup}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              দক্ষতা সম্পাদনা
            </button>
          </div>

          {userProfile.skills && userProfile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {userProfile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium border border-slate-200 flex items-center gap-1"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkillDirectly(skill)}
                    className="text-slate-400 hover:text-rose-600 ml-0.5 cursor-pointer font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">কোনো দক্ষতার ট্যাগ যোগ করা হয়নি।</p>
          )}

          {/* Quick Skill Entry Form */}
          <form onSubmit={handleAddSkillDirectly} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="নতুন কাজের দক্ষতা লিখুন (যেমন: ইনভার্টার এসি গ্যাস চার্জ)"
              className="flex-1 text-xs p-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              + যোগ করুন
            </button>
          </form>
        </div>
      </div>

      {/* 7. Service Delivery Types (সেবার ধরন ও কাজের পরিধি) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <ServiceTypesSection
          selectedTypes={userProfile.serviceTypes}
          onChange={async (newTypes) => {
            await updateProfile({ serviceTypes: newTypes });
          }}
        />
      </div>

      {/* 8. Search Keywords & Local Tags (সার্চ কিওয়ার্ডস) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <SearchKeywordsSection
          keywords={userProfile.searchKeywords}
          professions={userProfile.userProfessions || userProfile.professions}
          skills={userProfile.skills}
          onChange={async (newKeywords) => {
            const allKeywords = [
              ...newKeywords,
              ...(userProfile.professions || []),
              ...(userProfile.skills || []),
              ...(userProfile.serviceAreas || []),
              userProfile.presentAddress?.upazila || '',
              userProfile.presentAddress?.district || '',
            ];
            const normalized = buildNormalizedSearchKeywords(allKeywords);
            await updateProfile({
              searchKeywords: newKeywords,
              searchKeywordsNormalized: normalized,
            });
          }}
        />
      </div>

      {/* 9. Profession Experience (পেশাগত অভিজ্ঞতা) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>৭. পেশাগত অভিজ্ঞতার বিবরণ (Experience)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">প্রতিটি পেশায় মোট কাজের বছর ও পারদর্শিতা</p>
          </div>
          <button
            onClick={openProfileSetup}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            পরিবর্তন
          </button>
        </div>

        {userProfile.experiences && userProfile.experiences.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userProfile.experiences.map((exp, i) => (
              <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{exp.profession}</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-extrabold rounded-md">
                    {exp.years} বছরের অভিজ্ঞতা
                  </span>
                </div>
                {exp.description && (
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
            অভিজ্ঞতার বিস্তারিত তথ্য যুক্ত করা হয়নি। প্রোফাইল সেটআপ থেকে যোগ করুন।
          </div>
        )}
      </div>

      {/* 10. Work History (কাজের ইতিহাস) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <WorkHistorySection
          histories={userProfile.workHistories || []}
          onChange={async (newHistories) => {
            await updateProfile({ workHistories: newHistories });
          }}
        />
      </div>

      {/* 11. Service Area (সেবা প্রদানের এলাকা) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-600" />
              <span>৮. সেবা প্রদানের এলাকা (Service Area)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">"আমি যেসব এলাকায় গিয়ে কাজ করতে পারি"</p>
          </div>
          <button
            onClick={openProfileSetup}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            এলাকা পরিবর্তন
          </button>
        </div>

        {userProfile.serviceAreas && userProfile.serviceAreas.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {userProfile.serviceAreas.map((area, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{area}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">কোনো নির্দিষ্ট কর্ম এলাকা এখনও চিহ্নিত করা হয়নি।</p>
        )}
      </div>

      {/* 12. Portfolio & Sample Works (পোর্টফোলিও ও কাজের নমুনা) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <PortfolioSection
          portfolio={userProfile.portfolio || []}
          userProfessions={userProfile.professions || []}
          onChange={async (newPortfolio) => {
            await updateProfile({ portfolio: newPortfolio });
          }}
        />
      </div>

      {/* 13. Pricing & Rate Card (সেবার মূল্য ও রেট চার্ট) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <PricingRateCardSection
          pricing={userProfile.pricing}
          onChange={async (newPricing) => {
            await updateProfile({ pricing: newPricing });
          }}
        />
      </div>

      {/* 14. Identity & Driver Verification Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>১৪. পরিচয়পত্র ও চালক ভেরিফিকেশন (Identity & Driver Verification)</span>
            </h2>
            <p className="text-xs text-slate-500">
              জাতীয় পরিচয়পত্র (NID), ড্রাইভিং লাইসেন্স বা জন্ম সনদ দিয়ে প্রোফাইল যাচাই করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {userProfile.verificationStatus === 'approved' || userProfile.verificationStatus === 'verified' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>✓ যাচাইকৃত প্রোফাইল</span>
              </span>
            ) : userProfile.verificationStatus === 'pending' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>⏳ অপেক্ষমান (Pending)</span>
              </span>
            ) : userProfile.verificationStatus === 'under_review' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>🔍 পর্যালোচনা চলছে</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                <ShieldAlert className="w-4 h-4 text-slate-500" />
                <span>অযাচাইকৃত (Unverified)</span>
              </span>
            )}

            {/* Driver Badge if verified */}
            {(userProfile.driverVerificationStatus === 'approved' || userProfile.isDriverVerified) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                <span>🚗</span>
                <span>✓ ড্রাইভার ভেরিফাইড</span>
              </span>
            )}
          </div>
        </div>

        {/* Action Button to open Verification Center */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-slate-900">
              {userProfile.verificationStatus === 'approved' || userProfile.verificationStatus === 'verified'
                ? 'আপনার প্রোফাইল সফলভাবে যাচাইকৃত'
                : 'ভেরিফিকেশন রিকোয়েস্ট ও স্ট্যাটাস কেন্দ্র'}
            </h3>
            <p className="text-[11px] text-slate-500">
              দাখিলকৃত ডকুমেন্টের স্ট্যাটাস, অ্যাডমিন রিভিউ নোট ও নতুন ভেরিফিকেশন রিকোয়েস্ট পাঠাতে ভেরিফিকেশন সেন্টারে যান।
            </p>
          </div>

          <button
            onClick={() => onNavigate('verification')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {userProfile.verificationStatus === 'approved' || userProfile.verificationStatus === 'verified'
                ? 'ভেরিফিকেশন রেকর্ড দেখুন →'
                : 'ভেরিফিকেশন পেজে যান →'}
            </span>
          </button>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
          <strong>জরুরি সতর্কতা:</strong> {i18n.common.verifiedPlatformNote}
        </div>
      </div>

      {/* 15. Rating, Reputation & Performance (রেটিং ও পারফরম্যান্স) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <RatingReputationSection profile={userProfile} />
      </div>

      {/* 16. Privacy Settings (ব্যক্তিগত তথ্যের গোপনীয়তা নিয়ন্ত্রণ) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <PrivacySettingsSection
          settings={userProfile.privacySettings}
          onChange={async (newSettings) => {
            await updateProfile({ privacySettings: newSettings });
          }}
        />
      </div>

      {/* Language Preference Section (ভাষা নির্বাচন) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="text-lg">🌐</span>
              <span>{isBn ? 'ভাষা নির্বাচন (Language Preference)' : 'Language Preference'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn
                ? 'HelpLine অ্যাপ্লিকেশনের ভাষা নির্বাচন করুন (বাংলা অথবা English)'
                : 'Select your preferred language for the HelpLine interface (Bengali or English)'}
            </p>
          </div>
        </div>

        <div className="pt-1">
          <LanguageSelector variant="full" />
        </div>
      </div>

      {/* 17. Subscription & Payment Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>১৭. সাবস্ক্রিপশন ও প্ল্যাটফর্ম পেমেন্ট (Subscription)</span>
          </h2>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            {i18n.common.free}
          </span>
        </div>
        <p className="text-xs text-slate-600">
          বর্তমানে HelpLine প্ল্যাটফর্ম সম্পূর্ণ ফ্রি (FREE - ৳০) মোডে সচল রয়েছে।
          ভবিষ্যতে দৈনিক, মাসিক বা বাৎসরিক সাবস্ক্রিপশন চালু হলে bKash, Nagad ও Rocket এর মাধ্যমে ম্যানুয়াল পেমেন্ট করা যাবে।
        </p>
      </div>

      {/* Modals */}
      <ProfileSetupModal
        isOpen={isProfileSetupOpen}
        onClose={closeProfileSetup}
      />

      <CustomProfessionModal
        isOpen={isCustomProfModalOpen}
        onClose={() => setIsCustomProfModalOpen(false)}
        onAdded={handleCustomProfessionAdded}
      />
    </div>
  );
};
