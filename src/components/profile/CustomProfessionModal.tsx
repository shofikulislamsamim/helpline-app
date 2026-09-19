import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle, HelpCircle, MapPin, Laptop, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ServiceCategoryMode, UserProfessionItem } from '../../types';

interface CustomProfessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategoryMode?: ServiceCategoryMode;
  onAdded?: (professionItem: UserProfessionItem) => void;
}

export const CustomProfessionModal: React.FC<CustomProfessionModalProps> = ({
  isOpen,
  onClose,
  initialCategoryMode = 'physical',
  onAdded,
}) => {
  const { submitCustomCategoryRequest } = useAuth();
  const { isBn, t } = useLanguage();
  const [categoryMode, setCategoryMode] = useState<ServiceCategoryMode>(initialCategoryMode);
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddSkillFromInput = () => {
    const trimmed = skillsInput.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      setSkillsList([...skillsList, trimmed]);
      setSkillsInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const handleKeyDownSkills = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkillFromInput();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const primaryName = nameBn.trim() || nameEn.trim();
    if (!primaryName) return;

    try {
      setLoading(true);

      // Create structured UserProfessionItem
      const newProfItem: UserProfessionItem = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        nameBn: nameBn.trim() || primaryName,
        nameEn: nameEn.trim() || undefined,
        categoryMode,
        isCustom: true,
        status: 'pending',
        skills: [...skillsList],
        yearsOfExperience: Number(yearsOfExperience) || 1,
        description: description.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      // Submit for admin tracking/moderation
      await submitCustomCategoryRequest(
        newProfItem.nameBn,
        newProfItem.nameEn,
        description.trim() || undefined
      );

      // Callback to add directly to user's structured professions
      if (onAdded) {
        onAdded(newProfItem);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setNameBn('');
        setNameEn('');
        setDescription('');
        setSkillsList([]);
        setSkillsInput('');
        onClose();
      }, 1300);
    } catch (err) {
      console.error('Error adding custom profession:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm sm:text-base">
              {isBn ? 'নতুন কাজের ধরন বা পেশা তৈরি করুন' : 'Create New Profession or Service Type'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition cursor-pointer"
            aria-label={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">
              {isBn ? 'কাজের ধরন সফলভাবে প্রোফাইলে যোগ হয়েছে!' : 'Profession successfully added to profile!'}
            </h4>
            <p className="text-xs text-slate-500">
              {isBn 
                ? 'এটি তাৎক্ষণিকভাবে আপনার প্রোফাইলে যুক্ত হয়েছে এবং অনুসন্ধানযোগ্য হবে।' 
                : 'This has been added to your profile immediately and will be searchable.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>{isBn ? 'উন্মুক্ত সুবিধা: ' : 'Open Feature: '}</strong>
                {isBn 
                  ? 'অ্যাডমিন তালিকায় না থাকলেও আপনি নিজের যেকোনো পেশা ও দক্ষতা যোগ করতে পারবেন। এটি সাথে সাথে আপনার প্রোফাইলে সেভ হবে।' 
                  : 'Even if not in the pre-defined list, you can add any profession and skills. It saves to your profile immediately.'}
              </div>
            </div>

            {/* Service Type Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {isBn ? 'কাজের ক্যাটাগরি ধরন নির্বাচন করুন' : 'Select Service Category Type'} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryMode('physical')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-left transition cursor-pointer ${
                    categoryMode === 'physical'
                      ? 'bg-blue-50 border-blue-500 text-blue-800 font-semibold ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">📍 Physical / Local</div>
                    <div className="text-[10px] text-slate-500">
                      {isBn ? 'বাসায় বা এলাকায় গিয়ে সেবা' : 'On-site / in-person service'}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCategoryMode('digital')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-left transition cursor-pointer ${
                    categoryMode === 'digital'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-800 font-semibold ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Laptop className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">💻 Freelance / Digital</div>
                    <div className="text-[10px] text-slate-500">
                      {isBn ? 'অনলাইন বা রিমোট কাজ' : 'Online / remote work'}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'পেশার নাম (বাংলায়)' : 'Profession Name (Bengali)'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder={isBn ? 'যেমন: সোলার প্যানেল টেকনিশিয়ান, সিসিটিভি ক্যামেরা স্পেশালিস্ট' : 'e.g. Solar Panel Technician, CCTV Specialist'}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'Profession Name (ইংরেজিতে - ঐচ্ছিক)' : 'Profession Name (English - Optional)'}
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Solar Panel Technician"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? 'কাজের অভিজ্ঞতা (বছর)' : 'Years of Experience'}
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? 'কাজের সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)' : 'Short Description (Optional)'}
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isBn ? 'যেমন: অন-গ্রিড ও অফ-গ্রিড সোলার ইনস্টলেশন' : 'e.g. On-grid & off-grid solar installation'}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Custom Skills for this profession */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'এই পেশার আওতাধীন কাজের দক্ষতা (Skills)' : 'Skills under this profession'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  onKeyDown={handleKeyDownSkills}
                  placeholder={isBn ? 'দক্ষতা লিখে Enter চাপুন (যেমন: সোলার ইনভার্টার ফিটিং)' : 'Type skill and press Enter (e.g. Solar Inverter Fitting)'}
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddSkillFromInput}
                  disabled={!skillsInput.trim()}
                  className="px-3 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  {isBn ? 'যোগ' : 'Add'}
                </button>
              </div>

              {/* Added Skills Badges */}
              {skillsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {skillsList.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 border border-slate-200 text-slate-800"
                    >
                      <Tag className="w-3 h-3 text-slate-400" />
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                disabled={loading || (!nameBn.trim() && !nameEn.trim())}
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {loading 
                  ? (isBn ? 'যোগ হচ্ছে...' : 'Adding...') 
                  : (isBn ? 'পেশা যোগ করুন' : 'Add Profession')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
