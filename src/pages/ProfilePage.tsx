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
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StatusToggle } from '../components/common/StatusToggle';
import { ProfileCompletionBanner } from '../components/profile/ProfileCompletionBanner';
import { LocationPermissionCard } from '../components/profile/LocationPermissionCard';
import { WorkHistorySection } from '../components/profile/WorkHistorySection';
import { CustomProfessionModal } from '../components/profile/CustomProfessionModal';
import { ProfileSetupModal } from '../components/profile/ProfileSetupModal';
import { CAPABILITIES_LIST } from '../lib/professionsData';
import { i18n } from '../lib/i18n';

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

  const [isCustomProfModalOpen, setIsCustomProfModalOpen] = useState(false);
  const [verificationSubmitted, setVerificationSubmitted] = useState(
    userProfile.verificationStatus === 'pending'
  );

  const handleRequestVerification = async () => {
    setVerificationSubmitted(true);
    await updateProfile({ verificationStatus: 'pending' });
  };

  const activeCapabilities = userProfile.capabilities || userProfile.roles || [];

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Dynamic Profile Completion Banner */}
      <ProfileCompletionBanner 
        profile={userProfile} 
        onOpenSetup={openProfileSetup} 
      />

      {/* Main User Profile Header Card */}
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
                title={userProfile.isOnline ? 'Online' : 'Offline'}
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
                    <span>✓ ভেরিফাইড (Verified)</span>
                  </span>
                ) : userProfile.verificationStatus === 'under_review' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>🔍 পর্যালোচনাধীন (Under Review)</span>
                  </span>
                ) : userProfile.verificationStatus === 'reverification_required' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                    <span>⚠️ পুনরায় যাচাই প্রয়োজন</span>
                  </span>
                ) : userProfile.verificationStatus === 'rejected' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>✕ প্রত্যাখ্যাত (Rejected)</span>
                  </span>
                ) : userProfile.verificationStatus === 'pending' || verificationSubmitted ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>⏳ ভেরিফিকেশন অপেক্ষমান (Pending)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                    <span>অযাচাইকৃত (Unverified)</span>
                  </span>
                )}

                {/* Driver Verified Badge */}
                {(userProfile.driverVerificationStatus === 'approved' || userProfile.isDriverVerified) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    <span>🚗</span>
                    <span>✓ ড্রাইভার ভেরিফাইড</span>
                  </span>
                )}
              </div>

              {userProfile.mainProfession && (
                <p className="text-xs sm:text-sm font-bold text-blue-700">
                  ⭐ প্রধান পেশা: {userProfile.mainProfession}
                </p>
              )}

              <p className="text-xs sm:text-sm text-slate-600 max-w-xl line-clamp-2">
                {userProfile.bio || 'প্রোফাইলে এখনও কোনো বিবরণ যোগ করা হয়নি।'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-900">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{userProfile.rating}</span>
                  <span className="text-slate-500 font-normal">({userProfile.reviewCount} রিভিউ)</span>
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>{userProfile.completedJobsCount}টি কাজ সম্পন্ন</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>যোগদান: {userProfile.joinedDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Edit Profile CTA */}
          <button
            onClick={openProfileSetup}
            className="self-start sm:self-auto px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span>প্রোফাইল সম্পাদন (Edit Profile)</span>
          </button>
        </div>

        {/* Contact details row */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <Phone className="w-4 h-4 text-blue-600 shrink-0" />
            <span>মোবাইল: <strong className="text-slate-900">{userProfile.phoneNumber}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <Mail className="w-4 h-4 text-blue-600 shrink-0" />
            <span>ইমেইল: <strong className="text-slate-900">{userProfile.email || 'সংযুক্ত নেই'}</strong></span>
          </div>
        </div>
      </div>

      {/* Section 1: Online / Offline Availability Toggle */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${userProfile.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>১. কাজের প্রাপ্যতা (Online / Offline Availability)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {userProfile.isOnline 
                ? '🟢 আপনি এখন কাজের জন্য Available। গ্রাহকরা আপনাকে খুঁজে পাবেন।' 
                : '🔴 আপনি এখন কাজের জন্য Available নন। আপনার প্রোফাইল সার্চে অফলাইন দেখাবে।'}
            </p>
          </div>

          <StatusToggle />
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <span>সর্বশেষ স্ট্যাটাস পরিবর্তন: {userProfile.availabilityUpdatedAt ? new Date(userProfile.availabilityUpdatedAt).toLocaleTimeString('bn-BD') : 'সম্প্রতি'}</span>
          <span>•</span>
          <span>সর্বশেষ সক্রিয়: {userProfile.lastActiveAt ? new Date(userProfile.lastActiveAt).toLocaleDateString('bn-BD') : 'আজ'}</span>
        </div>
      </section>

      {/* Section 2: Roles & Capabilities */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              ২. সক্রিয় রোল ও সক্ষমতা (One Account, Multiple Roles)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              একই HelpLine অ্যাকাউন্ট থেকে আপনি একই সাথে সার্ভিস দিতে এবং সেবা নিতে পারেন।
            </p>
          </div>
          <button
            onClick={openProfileSetup}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            পরিবর্তন করুন
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CAPABILITIES_LIST.map((cap) => {
            const isAssigned = activeCapabilities.includes(cap.id);
            return (
              <button
                key={cap.id}
                onClick={() => toggleRole(cap.id)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isAssigned
                    ? 'bg-blue-50/70 border-blue-300 text-slate-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xl">{cap.icon}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                      isAssigned
                        ? 'bg-blue-600 border-blue-700 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isAssigned && <CheckCircle className="w-3 h-3" />}
                  </div>
                </div>

                <div className="font-bold text-xs text-slate-900">{cap.titleBn}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{cap.subtitleBn}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 3: Present Address & GPS Location */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              ৩. বর্তমান ঠিকানা ও অবস্থান (Bangladesh Hierarchical Address)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              বিভাগ → জেলা → উপজেলা/থানা → ইউনিয়ন/ওয়ার্ড → এলাকা
            </p>
          </div>
          <button
            onClick={openProfileSetup}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>ঠিকানা আপডেট করুন</span>
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-bold text-slate-900">
              {userProfile.presentAddress.division} বিভাগ → {userProfile.presentAddress.district} জেলা → {userProfile.presentAddress.upazila}
            </span>
          </div>
          <p className="text-slate-600 pl-6 text-xs leading-relaxed">
            {userProfile.presentAddress.unionWard && `${userProfile.presentAddress.unionWard} • `}
            {userProfile.presentAddress.areaRoad && `${userProfile.presentAddress.areaRoad} • `}
            {userProfile.presentAddress.fullAddress || `${userProfile.presentAddress.upazila}, ${userProfile.presentAddress.district}`}
          </p>
        </div>

        {/* GPS Live Location status & permission button */}
        <LocationPermissionCard />
      </div>

      {/* Section 4: Professions & Skills */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              ৪. পেশা ও দক্ষতাসমূহ (Professions & Skills)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              যেসব বিষয়ে আপনি পেশাদার সেবা প্রদান করতে পারেন
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustomProfModalOpen(true)}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold cursor-pointer"
            >
              + নতুন কাজের ধরন
            </button>
            <button
              onClick={openProfileSetup}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              সম্পাদনা
            </button>
          </div>
        </div>

        {/* Professions list */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">নির্বাচিত পেশাসমূহ:</label>
          {userProfile.professions && userProfile.professions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userProfile.professions.map((p, idx) => {
                const isMain = userProfile.mainProfession === p;
                return (
                  <span
                    key={idx}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-2xs ${
                      isMain
                        ? 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-300'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}
                  >
                    <span>👔 {p}</span>
                    {isMain && (
                      <span className="text-[10px] bg-amber-400 text-slate-900 px-1 rounded font-extrabold">
                        প্রধান
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">এখনও কোনো পেশা যুক্ত করা হয়নি।</p>
          )}
        </div>

        {/* Skills list */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700">দক্ষতা ও বিশেষত্ব (Skills Tags):</label>
          {userProfile.skills && userProfile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userProfile.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-medium"
                >
                  ⚡ {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">কোনো দক্ষতার ট্যাগ যোগ করা হয়নি।</p>
          )}
        </div>
      </div>

      {/* Section 5: Profession Experience */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              ৫. পেশাগত অভিজ্ঞতার বিবরণ (Experience)
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
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
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

      {/* Section 6: Work History */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <WorkHistorySection
          histories={userProfile.workHistories || []}
          onChange={async (newHistories) => {
            await updateProfile({ workHistories: newHistories });
          }}
        />
      </div>

      {/* Section 7: Service Area */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              ৭. সেবা প্রদানের এলাকা (Service Area)
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

      {/* Section 8: Placeholders for Future Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Portfolio Placeholder */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900">
              পোর্টফোলিও ও কাজের ছবি (Portfolio)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            পূর্বের সম্পন্ন কাজের ছবি ও ভিডিও আপলোড সুবিধা পরবর্তী ধাপে যুক্ত করা হবে।
          </p>
          <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400 font-medium">
            📸 পোর্টফোলিও আপলোড — শীঘ্রই আসছে (Step 3)
          </div>
        </div>

        {/* Activity & Reviews Placeholder */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900">
              সাম্প্রতিক কাজ ও রিভিউ হিস্টোরি
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            গ্রাহকদের রেটিং, রিভিউ ও সম্পন্ন কাজের তালিকা এখানে দৃশ্যমান হবে।
          </p>
          <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400 font-medium">
            ⭐ মার্কেটপ্লেস রিভিউ ফিড — সক্রিয়
          </div>
        </div>
      </div>

      {/* Section 9: Identity & Driver Verification Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>৯. পরিচয়পত্র ও চালক ভেরিফিকেশন (Identity & Driver Verification)</span>
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
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>🔍 পর্যালোচনা চলছে</span>
              </span>
            ) : userProfile.verificationStatus === 'reverification_required' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                <span>⚠️ পুনরায় যাচাই প্রয়োজন</span>
              </span>
            ) : userProfile.verificationStatus === 'rejected' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>✕ প্রত্যাখ্যাত (Rejected)</span>
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

      {/* Section 10: Subscription Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>১০. সাবস্ক্রিপশন ও পেমেন্ট (Subscription)</span>
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
      />
    </div>
  );
};
