import React, { useState } from 'react';
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
  Navigation
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BD_GEO_DATA, getDistrictsByDivision, getUpazilasByDistrict } from '../../lib/geoData';
import { CAPABILITIES_LIST, STANDARD_PROFESSIONS, getProfessionSkills } from '../../lib/professionsData';
import { LocationPermissionCard } from './LocationPermissionCard';
import { CustomProfessionModal } from './CustomProfessionModal';
import { WorkHistorySection } from './WorkHistorySection';
import { calculateProfileCompletion } from '../../lib/profileHelpers';
import { CapabilityType, PresentAddress, ProfessionExperience, WorkHistory, UserProfile } from '../../types';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateProfile } = useAuth();

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
  const [division, setDivision] = useState(userProfile.presentAddress?.division || 'ঢাকা');
  const [district, setDistrict] = useState(userProfile.presentAddress?.district || 'ঢাকা');
  const [upazila, setUpazila] = useState(userProfile.presentAddress?.upazila || 'মিরপুর');
  const [unionWard, setUnionWard] = useState(userProfile.presentAddress?.unionWard || '');
  const [areaRoad, setAreaRoad] = useState(userProfile.presentAddress?.areaRoad || '');
  const [fullAddress, setFullAddress] = useState(userProfile.presentAddress?.fullAddress || '');

  // Capabilities
  const [selectedCapabilities, setSelectedCapabilities] = useState<CapabilityType[]>(
    userProfile.capabilities || userProfile.roles || ['customer', 'worker']
  );

  // Professions & Main
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>(
    userProfile.professions || []
  );
  const [mainProfession, setMainProfession] = useState<string>(
    userProfile.mainProfession || (userProfile.professions && userProfile.professions[0]) || ''
  );

  // Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>(userProfile.skills || []);
  const [newSkillInput, setNewSkillInput] = useState<string>('');

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

  if (!isOpen) return null;

  // Handle Division change
  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const districts = getDistrictsByDivision(newDiv);
    if (districts.length > 0) {
      setDistrict(districts[0].nameBn);
      const upazilas = districts[0].upazilas;
      setUpazila(upazilas[0] || '');
    }
  };

  // Handle District change
  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const upazilas = getUpazilasByDistrict(division, newDist);
    setUpazila(upazilas[0] || '');
  };

  // Toggle capabilities
  const toggleCapability = (cap: CapabilityType) => {
    if (selectedCapabilities.includes(cap)) {
      if (selectedCapabilities.length > 1) {
        setSelectedCapabilities(selectedCapabilities.filter((c) => c !== cap));
      }
    } else {
      setSelectedCapabilities([...selectedCapabilities, cap]);
    }
  };

  // Toggle profession
  const toggleProfession = (prof: string) => {
    if (selectedProfessions.includes(prof)) {
      const next = selectedProfessions.filter((p) => p !== prof);
      setSelectedProfessions(next);
      if (mainProfession === prof) {
        setMainProfession(next[0] || '');
      }
    } else {
      const next = [...selectedProfessions, prof];
      setSelectedProfessions(next);
      if (!mainProfession) setMainProfession(prof);

      // Auto-suggest skills for this profession
      const autoSkills = getProfessionSkills(prof);
      const toAdd = autoSkills.filter((s) => !selectedSkills.includes(s)).slice(0, 3);
      if (toAdd.length > 0) {
        setSelectedSkills((prev) => [...prev, ...toAdd]);
      }
    }
  };

  // Add custom skill
  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillInput.trim() && !selectedSkills.includes(newSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  // Remove skill
  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  // Add custom service area
  const handleAddServiceArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAreaInput.trim() && !serviceAreas.includes(newAreaInput.trim())) {
      setServiceAreas([...serviceAreas, newAreaInput.trim()]);
      setNewAreaInput('');
    }
  };

  // Remove service area
  const removeServiceArea = (area: string) => {
    setServiceAreas(serviceAreas.filter((a) => a !== area));
  };

  // Save all profile data
  const handleSaveAll = async () => {
    setSaveLoading(true);

    const updatedAddress: PresentAddress = {
      division,
      district,
      upazila,
      unionWard,
      areaRoad,
      fullAddress: fullAddress.trim() || `${areaRoad ? areaRoad + ', ' : ''}${unionWard ? unionWard + ', ' : ''}${upazila}, ${district}, ${division}`,
    };

    // Construct experiences
    const constructedExp: ProfessionExperience[] = selectedProfessions.map((prof) => {
      const existing = experiences.find((e) => e.profession === prof);
      return {
        profession: prof,
        years: existing?.years || 3,
        description: existing?.description || `${prof} হিসেবে আবাসিক ও বাণিজ্যিক গ্রাহকদের বিশ্বস্ত সেবা প্রদান।`,
        isMain: prof === mainProfession,
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
      professions: selectedProfessions,
      mainProfession: mainProfession || selectedProfessions[0] || '',
      skills: selectedSkills,
      experiences: constructedExp,
      workHistories,
      serviceAreas,
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
    experiences,
    workHistories,
    serviceAreas,
  };
  const completion = calculateProfileCompletion(previewProfileObj);

  const steps = [
    { id: 1, title: 'বেসিক তথ্য', icon: User },
    { id: 2, title: 'বর্তমান ঠিকানা', icon: MapPin },
    { id: 3, title: 'কী করতে চান', icon: Briefcase },
    { id: 4, title: 'পেশা ও দক্ষতা', icon: Wrench },
    { id: 5, title: 'কাজের ইতিহাস', icon: Clock },
    { id: 6, title: 'কর্ম এলাকা', icon: Navigation },
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
              আপনার প্রোফাইল প্রায় প্রস্তুত (Profile Setup)
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            নির্ভুল তথ্য দিয়ে প্রোফাইল সাজান যাতে গ্রাহক বা নিয়োগকারীরা সহজে আপনাকে খুঁজে পায়।
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
              {completion.percentage}% সম্পন্ন
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
                      ? 'text-emerald-400 hover:bg-slate-800'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{st.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {saveSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                আপনার সমস্ত তথ্য HelpLine প্ল্যাটফর্মে আপডেট করা হয়েছে।
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
                      <span>১. বেসিক তথ্য (Basic Information)</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">ধাপ ১ / ৬</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      আপনার পূর্ণ নাম (Full Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        মোবাইল নম্বর (Mobile Number) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ইমেইল এড্রেস (Email Address)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rafiqul@example.com"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      প্রোফাইল ছবির লিংক (Photo URL)
                    </label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <p className="text-[10px] text-slate-500 mt-0.5">ছবি না দিলে নামের আদ্যক্ষর ব্যবহার করা হবে</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      নিজের সম্পর্কে বা কাজের বিবরণ (Bio / About)
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="আপনার কাজের অভিজ্ঞতা, বিশেষ দক্ষতা বা আপনার সার্ভিস সম্পর্কে গ্রাহকদের জন্য কিছু লিখুন..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Present Address & Live Location */}
              {activeStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>২. বর্তমান ঠিকানা (Hierarchical Address)</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">ধাপ ২ / ৬</span>
                  </div>

                  <p className="text-xs text-slate-500">
                    বিভাগ সিলেক্ট করলে স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট জেলা এবং জেলার অধীনে উপজেলাসমূহ ফিল্টার হবে।
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Division */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        বিভাগ (Division) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={division}
                        onChange={(e) => handleDivisionChange(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                      >
                        {BD_GEO_DATA.map((d) => (
                          <option key={d.id} value={d.nameBn}>
                            {d.nameBn} ({d.nameEn})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        জেলা (District) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={district}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                      >
                        {getDistrictsByDivision(division).map((dist) => (
                          <option key={dist.id} value={dist.nameBn}>
                            {dist.nameBn} ({dist.nameEn})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Upazila / Thana */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        উপজেলা / থানা <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={upazila}
                        onChange={(e) => setUpazila(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                      >
                        {getUpazilasByDistrict(division, district).map((upz, idx) => (
                          <option key={idx} value={upz}>
                            {upz}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ইউনিয়ন / ওয়ার্ড / পৌরসভা (Union / Ward)
                      </label>
                      <input
                        type="text"
                        value={unionWard}
                        onChange={(e) => setUnionWard(e.target.value)}
                        placeholder="যেমন: ওয়ার্ড নং ৩ বা পৌরসভা"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        এলাকা / গ্রাম / রোড / বাড়ি নং
                      </label>
                      <input
                        type="text"
                        value={areaRoad}
                        onChange={(e) => setAreaRoad(e.target.value)}
                        placeholder="যেমন: রোড ৪, ব্লক বি, বাড়ি ১২"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      পূর্ণ বিস্তারিত ঠিকানা (Full Address)
                    </label>
                    <input
                      type="text"
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      placeholder="যেমন: বাড়ি ১২, রোড ৪, ব্লক বি, মিরপুর-১০, ঢাকা"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  {/* GPS Live Location Integration */}
                  <LocationPermissionCard />
                </div>
              )}

              {/* STEP 3: Roles & Capabilities */}
              {activeStep === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <span>৩. আপনি কী কী করতে চান? (Roles & Capabilities)</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">ধাপ ৩ / ৬</span>
                  </div>

                  <p className="text-xs text-slate-500">
                    একই প্রোফাইল থেকে আপনি একাধিক ভূমিকা পালন করতে পারেন। প্রযোজ্য সবগুলো নির্বাচন করুন:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CAPABILITIES_LIST.map((cap) => {
                      const isSelected = selectedCapabilities.includes(cap.id);
                      return (
                        <div
                          key={cap.id}
                          onClick={() => toggleCapability(cap.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-500 text-slate-900 shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{cap.icon}</span>
                            <div>
                              <div className="font-bold text-xs sm:text-sm text-slate-900">
                                {cap.titleBn}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                {cap.subtitleBn}
                              </div>
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border mt-0.5 ${
                              isSelected
                                ? 'bg-blue-600 border-blue-700 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: Professions & Skills */}
              {activeStep === 4 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-blue-600" />
                      <span>৪. পেশা ও দক্ষতাসমূহ (Professions & Skills)</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">ধাপ ৪ / ৬</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-600">
                      আপনার কাজের ধরনসমূহ নির্বাচন করুন (একাধিক নির্বাচন করা সম্ভব):
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsCustomModalOpen(true)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-blue-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ নতুন কাজের ধরন যোগ করুন</span>
                    </button>
                  </div>

                  {/* Standard Professions Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {STANDARD_PROFESSIONS.map((prof) => {
                      const isSelected = selectedProfessions.includes(prof.nameBn);
                      const isMain = mainProfession === prof.nameBn;

                      return (
                        <div
                          key={prof.id}
                          onClick={() => toggleProfession(prof.nameBn)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition relative flex flex-col justify-between ${
                            isSelected
                              ? 'bg-blue-50 border-blue-500 text-slate-900'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xl">{prof.icon}</span>
                            {isSelected && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMainProfession(prof.nameBn);
                                }}
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  isMain ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-600 hover:bg-amber-200'
                                }`}
                                title="প্রধান পেশা হিসেবে চিহ্নিত করুন"
                              >
                                {isMain ? '★ প্রধান' : 'প্রধান করুন'}
                              </button>
                            )}
                          </div>
                          <div className="text-xs font-bold">{prof.nameBn}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Skills Section */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <label className="block text-xs font-semibold text-slate-800">
                      সংশ্লিষ্ট কাজের দক্ষতা ও স্পেশালাইজেশন (Skills Tags)
                    </label>

                    {/* Active Skills Pills */}
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>⚡ {sk}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(sk)}
                            className="text-emerald-700 hover:text-red-600 transition"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Add Custom Skill */}
                    <form onSubmit={handleAddCustomSkill} className="flex gap-2 max-w-md">
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        placeholder="যেমন: সোলার ব্যাটারি সেটআপ"
                        className="flex-1 text-xs p-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        + দক্ষতা যোগ
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* STEP 5: Experience & Work History */}
              {activeStep === 5 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>৫. কাজের অভিজ্ঞতা ও ইতিহাস (Experience & History)</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">ধাপ ৫ / ৬</span>
                  </div>

                  {/* Profession-specific Experience Inputs */}
                  {selectedProfessions.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-800">
                        নির্বাচিত প্রতিটি পেশার জন্য অভিজ্ঞতার বছর:
                      </h4>
                      {selectedProfessions.map((prof, idx) => {
                        const existing = experiences.find((e) => e.profession === prof);
                        const currentYears = existing?.years || 3;
                        const currentDesc = existing?.description || '';

                        return (
                          <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">
                                👔 {prof}
                              </span>
                              <div className="flex items-center gap-1.5 text-xs">
                                <label className="text-slate-600">অভিজ্ঞতা:</label>
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
                                <span className="text-slate-600 font-medium">বছর</span>
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
                              placeholder="এই কাজের বিশেষত্ব (যেমন: ১০ তলা ভবনের মেইন ওয়্যারিং)"
                              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                      পূর্ববর্তী ধাপে কোনো পেশা নির্বাচন করা হয়নি। কাজের মানুষ হিসেবে প্রোফাইল করতে চাইলে ধাপ ৪ এ পেশা যুক্ত করুন।
                    </div>
                  )}

                  {/* Work History Section */}
                  <WorkHistorySection
                    histories={workHistories}
                    onChange={(h) => setWorkHistories(h)}
                  />
                </div>
              )}

              {/* STEP 6: Service Area */}
              {activeStep === 6 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      <span>৬. সেবা প্রদানের এলাকা (Service Area)</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">ধাপ ৬ / ৬</span>
                  </div>

                  <p className="text-xs text-slate-500">
                    "আমি যেসব এলাকায় কাজ করি" — আপনি যে এলাকাগুলোতে গিয়ে সার্ভিস দিতে সক্ষম তা যোগ করুন।
                  </p>

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
                          className="text-blue-700 hover:text-red-600 font-bold ml-1 transition"
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
                      placeholder="যেমন: মিরপুর ১০, উত্তরা সেক্টর ৩, ধানমন্ডি"
                      className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      + এলাকা যোগ করুন
                    </button>
                  </form>

                  {/* Quick Suggestions based on upazila */}
                  <div className="pt-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">প্রস্তাবিত এলাকা:</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[
                        `${upazila} সম্পূর্ণ`,
                        `${district} সদর`,
                        'আশেপাশের ৫ কিমি ব্যাসার্ধ',
                        'সমগ্র মেট্রোপলিটন এলাকা',
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
                <span>পূর্ববর্তী ধাপ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                পরে পূরণ করব
              </button>
            )}

            <div className="flex items-center gap-2">
              {activeStep < 6 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>পরবর্তী ধাপ</span>
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
                  <span>{saveLoading ? 'সংরক্ষণ হচ্ছে...' : 'প্রোফাইল সংরক্ষণ ও সম্পন্ন করুন'}</span>
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
        onAdded={(profName) => {
          if (!selectedProfessions.includes(profName)) {
            setSelectedProfessions([...selectedProfessions, profName]);
            if (!mainProfession) setMainProfession(profName);
          }
        }}
      />
    </div>
  );
};
