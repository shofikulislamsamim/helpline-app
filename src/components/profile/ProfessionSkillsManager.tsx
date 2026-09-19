import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Laptop, 
  Plus, 
  Trash2, 
  Check, 
  Star, 
  Sparkles, 
  Search, 
  X, 
  ChevronDown,
  ChevronUp,
  Briefcase
} from 'lucide-react';
import { 
  ServiceCategoryMode, 
  UserProfessionItem 
} from '../../types';
import { 
  STANDARD_PROFESSIONS, 
  ProfessionDef, 
  getProfessionByName 
} from '../../lib/professionsData';
import { CustomProfessionModal } from './CustomProfessionModal';
import { useLanguage } from '../../context/LanguageContext';

interface ProfessionSkillsManagerProps {
  categoryModes: ServiceCategoryMode[];
  userProfessions: UserProfessionItem[];
  mainProfession?: string;
  onCategoryModesChange: (modes: ServiceCategoryMode[]) => void;
  onUserProfessionsChange: (professions: UserProfessionItem[]) => void;
  onMainProfessionChange: (main: string) => void;
  readOnly?: boolean;
}

export const ProfessionSkillsManager: React.FC<ProfessionSkillsManagerProps> = ({
  categoryModes = ['physical'] as ServiceCategoryMode[],
  userProfessions = [],
  mainProfession = '',
  onCategoryModesChange,
  onUserProfessionsChange,
  onMainProfessionChange,
  readOnly = false,
}) => {
  const { isBn, formatNumber } = useLanguage();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'physical' | 'digital'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProfId, setExpandedProfId] = useState<string | null>(null);
  const [customSkillInputs, setCustomSkillInputs] = useState<Record<string, string>>({});

  // 1. SERVICE TYPE TOGGLER
  const toggleCategoryMode = (mode: ServiceCategoryMode) => {
    if (readOnly) return;
    if (categoryModes.includes(mode)) {
      // Prevent unchecking all modes (must keep at least one)
      if (categoryModes.length <= 1) return;
      const remaining: ServiceCategoryMode[] = mode === 'physical' ? ['digital'] : ['physical'];
      onCategoryModesChange(remaining);
    } else {
      const both: ServiceCategoryMode[] = ['physical', 'digital'];
      onCategoryModesChange(both);
    }
  };

  // Filter admin professions based on active service modes and search query
  const filteredAvailableProfessions = useMemo(() => {
    return STANDARD_PROFESSIONS.filter((prof) => {
      // Category mode filter
      if (!categoryModes.includes(prof.categoryMode)) {
        return false;
      }
      // Tab filter
      if (activeTab === 'physical' && prof.categoryMode !== 'physical') return false;
      if (activeTab === 'digital' && prof.categoryMode !== 'digital') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesBn = prof.nameBn.toLowerCase().includes(q);
        const matchesEn = prof.nameEn.toLowerCase().includes(q);
        const matchesSkill = prof.defaultSkills.some((s) => s.toLowerCase().includes(q));
        const matchesDescBn = prof.descriptionBn.toLowerCase().includes(q);
        const matchesDescEn = prof.descriptionEn?.toLowerCase().includes(q) || false;
        return matchesBn || matchesEn || matchesSkill || matchesDescBn || matchesDescEn;
      }

      return true;
    });
  }, [categoryModes, activeTab, searchQuery]);

  // Handle toggle selection of a standard profession
  const handleToggleStandardProfession = (profDef: ProfessionDef) => {
    if (readOnly) return;

    const existingIdx = userProfessions.findIndex(
      (p) => p.nameBn === profDef.nameBn || p.id === profDef.id
    );

    if (existingIdx >= 0) {
      // Remove profession
      const removedProf = userProfessions[existingIdx];
      const updated = userProfessions.filter((_, idx) => idx !== existingIdx);
      onUserProfessionsChange(updated);

      // Reassign main profession if removed was the main
      if (mainProfession === removedProf.nameBn) {
        onMainProfessionChange(updated[0]?.nameBn || '');
      }
    } else {
      // Add profession with its default skills
      const newProfItem: UserProfessionItem = {
        id: profDef.id,
        nameBn: profDef.nameBn,
        nameEn: profDef.nameEn,
        categoryMode: profDef.categoryMode,
        isCustom: false,
        skills: [...profDef.defaultSkills],
        yearsOfExperience: 3,
        isMain: userProfessions.length === 0,
      };

      const updated = [...userProfessions, newProfItem];
      onUserProfessionsChange(updated);

      // Auto set as main if none
      if (!mainProfession) {
        onMainProfessionChange(newProfItem.nameBn);
      }
      // Auto expand newly added profession so user can immediately customize skills
      setExpandedProfId(newProfItem.id);
    }
  };

  // Handle adding custom profession from modal
  const handleAddCustomProfession = (customItem: UserProfessionItem) => {
    // Check if already exists
    const existing = userProfessions.some(
      (p) => p.nameBn.toLowerCase() === customItem.nameBn.toLowerCase()
    );
    if (existing) return;

    const updated = [...userProfessions, customItem];
    onUserProfessionsChange(updated);

    // If no main, set this
    if (!mainProfession) {
      onMainProfessionChange(customItem.nameBn);
    }

    // Ensure its category mode is active
    if (!categoryModes.includes(customItem.categoryMode)) {
      onCategoryModesChange([...categoryModes, customItem.categoryMode]);
    }

    setExpandedProfId(customItem.id);
  };

  // Remove a profession
  const handleRemoveProfession = (profId: string, profNameBn: string) => {
    if (readOnly) return;
    const updated = userProfessions.filter((p) => p.id !== profId);
    onUserProfessionsChange(updated);
    if (mainProfession === profNameBn) {
      onMainProfessionChange(updated[0]?.nameBn || '');
    }
  };

  // Toggle a skill for a specific profession
  const handleToggleSkillForProfession = (profId: string, skillName: string) => {
    if (readOnly) return;
    const updated = userProfessions.map((p) => {
      if (p.id !== profId) return p;
      const hasSkill = p.skills.includes(skillName);
      const newSkills = hasSkill
        ? p.skills.filter((s) => s !== skillName)
        : [...p.skills, skillName];
      return { ...p, skills: newSkills };
    });
    onUserProfessionsChange(updated);
  };

  // Add custom skill to a specific profession
  const handleAddCustomSkillToProfession = (profId: string) => {
    const rawInput = customSkillInputs[profId] || '';
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    const updated = userProfessions.map((p) => {
      if (p.id !== profId) return p;
      if (p.skills.includes(trimmed)) return p;
      return { ...p, skills: [...p.skills, trimmed] };
    });

    onUserProfessionsChange(updated);
    setCustomSkillInputs({ ...customSkillInputs, [profId]: '' });
  };

  // Update years of experience for a profession
  const handleUpdateExperience = (profId: string, years: number) => {
    if (readOnly) return;
    const updated = userProfessions.map((p) => {
      if (p.id !== profId) return p;
      return { ...p, yearsOfExperience: Math.max(0, years) };
    });
    onUserProfessionsChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------------------- */}
      {/* 1. SERVICE TYPE SELECTION                                        */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>{isBn ? '১. সেবার ধরন নির্বাচন করুন (Service Type)' : '1. Select Service Category (Service Type)'}</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn 
                ? 'আপনি কী ধরনের কাজ করেন বা ক্লায়েন্টকে সেবা দেন? (এক বা উভয়টি নির্বাচন করতে পারেন)' 
                : 'What kind of services or work do you offer to clients? (Select one or both)'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Physical / Local Option */}
          <div
            onClick={() => toggleCategoryMode('physical')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
              categoryModes.includes('physical')
                ? 'bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                : 'bg-white/60 border-slate-200 hover:border-slate-300 opacity-70'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  📍 Physical / Local Service
                </span>
                <input
                  type="checkbox"
                  checked={categoryModes.includes('physical')}
                  onChange={() => {}}
                  disabled={categoryModes.length === 1 && categoryModes.includes('physical')}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isBn
                  ? 'গ্রাহকের বাসা, দোকান বা নির্দিষ্ট ঠিকানায় গিয়ে সরাসরি কাজ (যেমন: ইলেকট্রিশিয়ান, এসি মিস্ত্রি, প্লাম্বার, কার্পেন্টার)।'
                  : 'On-site service at customer location (e.g., Electrician, AC Tech, Plumber, Carpenter).'}
              </p>
            </div>
          </div>

          {/* Freelance / Digital Option */}
          <div
            onClick={() => toggleCategoryMode('digital')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
              categoryModes.includes('digital')
                ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white/60 border-slate-200 hover:border-slate-300 opacity-70'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  💻 Freelance / Digital Service
                </span>
                <input
                  type="checkbox"
                  checked={categoryModes.includes('digital')}
                  onChange={() => {}}
                  disabled={categoryModes.length === 1 && categoryModes.includes('digital')}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isBn
                  ? 'কম্পিউটার বা অনলাইনে রিমোট ফ্রিল্যান্সিং কাজ (যেমন: গ্রাফিক ডিজাইন, ভিডিও এডিটিং, ওয়েব ডেভেলপমেন্ট, ডিজিটাল মার্কেটিং)।'
                  : 'Remote freelance work via computer/online (e.g., Graphic Design, Video Editing, Web Dev, Digital Marketing).'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* 2. SELECTED PROFESSIONS LIST & MANAGEMENT                       */}
      {/* ---------------------------------------------------------------- */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{isBn ? `আপনার নির্বাচিত পেশাসমূহ (${formatNumber(userProfessions.length)})` : `Your Selected Professions (${userProfessions.length})`}</span>
              {userProfessions.length > 0 && (
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                  {isBn ? 'একাধিক পেশা সমর্থিত' : 'Multiple Supported'}
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn 
                ? 'প্রতিটি পেশার পাশে ক্লিক করে এর আওতাধীন নির্দিষ্ট দক্ষতা ও অভিজ্ঞতা কাস্টমাইজ করুন।' 
                : 'Click each profession to customize its specific skills and experience.'}
            </p>
          </div>

          {!readOnly && (
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isBn ? '➕ নিজের Profession তৈরি করুন' : '➕ Create Custom Profession'}</span>
            </button>
          )}
        </div>

        {/* Selected Professions Cards with Skills Dropdown */}
        {userProfessions.length > 0 ? (
          <div className="space-y-3">
            {userProfessions.map((profItem) => {
              const isMain = profItem.nameBn === mainProfession;
              const isExpanded = expandedProfId === profItem.id;
              const standardDef = getProfessionByName(profItem.nameBn);
              const availableDefaultSkills = standardDef ? standardDef.defaultSkills : [];
              const displayName = isBn ? (profItem.nameBn || profItem.nameEn) : (profItem.nameEn || profItem.nameBn);

              return (
                <div
                  key={profItem.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isMain
                      ? 'bg-blue-50/40 border-blue-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header Bar */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2">
                    <div 
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      onClick={() => setExpandedProfId(isExpanded ? null : profItem.id)}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm shrink-0">
                        {profItem.categoryMode === 'digital' ? '💻' : '📍'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {displayName}
                          </h5>
                          {profItem.isCustom && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                              {isBn ? 'কাস্টম পেশা' : 'Custom'}
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                              profItem.categoryMode === 'digital'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {profItem.categoryMode === 'digital' ? 'Digital / Freelance' : 'Physical / Local'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {isBn 
                            ? `${formatNumber(profItem.skills.length)} টি দক্ষতা • ${formatNumber(profItem.yearsOfExperience || 1)} বছর অভিজ্ঞতা`
                            : `${profItem.skills.length} skills • ${profItem.yearsOfExperience || 1} years exp`}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Set as Main Profession Button */}
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => onMainProfessionChange(profItem.nameBn)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            isMain
                              ? 'bg-amber-400 text-slate-950 shadow-2xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                          title={isBn ? (isMain ? 'প্রধান পেশা হিসেবে নির্ধারিত' : 'প্রধান পেশা নির্ধারণ করুন') : (isMain ? 'Main Profession' : 'Set as Main')}
                        >
                          <Star className={`w-3.5 h-3.5 ${isMain ? 'fill-slate-950' : ''}`} />
                          <span className="hidden sm:inline">
                            {isBn ? (isMain ? 'প্রধান পেশা' : 'প্রধান করুন') : (isMain ? 'Main' : 'Set Main')}
                          </span>
                        </button>
                      )}

                      {/* Expand/Collapse Toggle */}
                      <button
                        type="button"
                        onClick={() => setExpandedProfId(isExpanded ? null : profItem.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title={isBn ? 'দক্ষতা সম্পাদনা করুন' : 'Edit Skills'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {/* Remove Profession Button */}
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProfession(profItem.id, profItem.nameBn)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title={isBn ? 'পেশা মুছে ফেলুন' : 'Remove Profession'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ------------------------------------------------------------ */}
                  {/* EXPANDED SKILLS & EXPERIENCE EDITOR                          */}
                  {/* ------------------------------------------------------------ */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-50/70 border-t border-slate-200 space-y-4">
                      {/* Experience & Notes */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold text-slate-700">
                            {isBn ? 'অভিজ্ঞতা (বছর):' : 'Experience (Years):'}
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={50}
                            disabled={readOnly}
                            value={profItem.yearsOfExperience || 1}
                            onChange={(e) =>
                              handleUpdateExperience(profItem.id, Number(e.target.value))
                            }
                            className="w-16 p-1.5 text-xs text-center font-bold bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          {isBn 
                            ? '(প্রোফাইল সার্চ রেজাল্টে অভিজ্ঞতার বছর হাইলাইট হবে)' 
                            : '(Experience years will be highlighted in search results)'}
                        </span>
                      </div>

                      {/* Active Skills for this Profession */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-800">
                          {isBn 
                            ? `${displayName}-এ আপনার নির্বাচিত দক্ষতাসমূহ:` 
                            : `Your selected skills in ${displayName}:`}
                        </label>

                        {profItem.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {profItem.skills.map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-blue-200 text-blue-900 shadow-2xs"
                              >
                                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span>{skill}</span>
                                {!readOnly && (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSkillForProfession(profItem.id, skill)}
                                    className="text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                                    title={isBn ? 'বাদ দিন' : 'Remove'}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic">
                            {isBn 
                              ? 'কোনো নির্দিষ্ট দক্ষতা এখনও নির্বাচন করা হয়নি। নিচের প্রস্তাবিত তালিকা থেকে নির্বাচন করুন অথবা নতুন দক্ষতা লিখুন।' 
                              : 'No specific skills selected yet. Select from suggestions below or add custom skills.'}
                          </p>
                        )}
                      </div>

                      {/* Admin Suggested Skills for this profession */}
                      {availableDefaultSkills.length > 0 && !readOnly && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>{isBn ? 'এই পেশার প্রস্তাবিত সাধারণ দক্ষতাসমূহ (ক্লিক করে যোগ/বাদ দিন):' : 'Suggested skills for this profession (click to add/remove):'}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {availableDefaultSkills.map((defSkill) => {
                              const isSelected = profItem.skills.includes(defSkill);
                              return (
                                <button
                                  key={defSkill}
                                  type="button"
                                  onClick={() => handleToggleSkillForProfession(profItem.id, defSkill)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                                    isSelected
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3" />}
                                  <span>{defSkill}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Add Custom Skill for this Profession */}
                      {!readOnly && (
                        <div className="pt-2 border-t border-slate-200">
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            {isBn ? '➕ নিজের Skill যোগ করুন (কাস্টম দক্ষতা):' : '➕ Add Custom Skill:'}
                          </label>
                          <div className="flex gap-2 max-w-md">
                            <input
                              type="text"
                              value={customSkillInputs[profItem.id] || ''}
                              onChange={(e) =>
                                setCustomSkillInputs({
                                  ...customSkillInputs,
                                  [profItem.id]: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCustomSkillToProfession(profItem.id);
                                }
                              }}
                              placeholder={isBn 
                                ? (profItem.categoryMode === 'digital' ? 'যেমন: YouTube Thumbnail Design, Reels Editing' : 'যেমন: Solar Inverter Setup, ফলস সিলিং')
                                : (profItem.categoryMode === 'digital' ? 'e.g. YouTube Thumbnail Design, Reels Editing' : 'e.g. Solar Inverter Setup, False Ceiling')}
                              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddCustomSkillToProfession(profItem.id)}
                              disabled={!(customSkillInputs[profItem.id] || '').trim()}
                              className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
                            >
                              {isBn ? '+ স্কিল যোগ' : '+ Add'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-5 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-2">
            <p className="text-xs text-slate-600 font-medium">
              {isBn 
                ? 'আপনার কোনো পেশা এখনও যুক্ত করা হয়নি। নিচের তালিকা থেকে আপনার পেশা(সমূহ) নির্বাচন করুন অথবা নিজের পেশা তৈরি করুন।'
                : 'No professions added yet. Select from the list below or create your custom profession.'}
            </p>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* 3. SELECT FROM AVAILABLE / ADMIN PROFESSIONS                     */}
      {/* ---------------------------------------------------------------- */}
      {!readOnly && (
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                {isBn ? 'জনপ্রিয় পেশার তালিকা থেকে নির্বাচন করুন' : 'Select from Popular Professions'}
              </h4>
              <p className="text-xs text-slate-500">
                {isBn 
                  ? 'প্রযোজ্য সবগুলো পেশায় ক্লিক করুন (একাধিক পেশা বেছে নেওয়া যাবে)'
                  : 'Click all that apply (multiple selections supported)'}
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isBn ? 'সব' : 'All'}
              </button>
              {categoryModes.includes('physical') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('physical')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                    activeTab === 'physical'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span>Physical</span>
                </button>
              )}
              {categoryModes.includes('digital') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('digital')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                    activeTab === 'digital'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Laptop className="w-3 h-3 text-indigo-600" />
                  <span>Digital</span>
                </button>
              )}
            </div>
          </div>

          {/* Search bar for professions */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn 
                ? 'পেশা বা কাজের নাম খুঁজুন (যেমন: ইলেকট্রিশিয়ান, ভিডিও এডিটর, গ্রাফিক, প্লাম্বার)...' 
                : 'Search professions or jobs (e.g. Electrician, Video Editor, Plumber)...'}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Available Professions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1">
            {filteredAvailableProfessions.map((prof) => {
              const isSelected = userProfessions.some(
                (p) => p.nameBn === prof.nameBn || p.id === prof.id
              );
              const profName = isBn ? prof.nameBn : prof.nameEn;
              const profDesc = isBn ? prof.descriptionBn : (prof.descriptionEn || prof.descriptionBn);

              return (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => handleToggleStandardProfession(prof)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-950 ring-1 ring-blue-500/30 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{prof.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold truncate">{profName}</span>
                      {isSelected ? (
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {profDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Profession Modal */}
      <CustomProfessionModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        initialCategoryMode={categoryModes[0] || 'physical'}
        onAdded={handleAddCustomProfession}
      />
    </div>
  );
};
