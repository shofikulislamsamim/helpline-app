import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, Calendar, MapPin } from 'lucide-react';
import { WorkHistory } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface WorkHistorySectionProps {
  histories: WorkHistory[];
  onChange: (histories: WorkHistory[]) => void;
  readOnly?: boolean;
}

export const WorkHistorySection: React.FC<WorkHistorySectionProps> = ({
  histories = [],
  onChange,
  readOnly = false,
}) => {
  const { isBn } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [location, setLocation] = useState('');
  const [jobDetails, setJobDetails] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) return;

    const newRecord: WorkHistory = {
      id: `wh-${Date.now()}`,
      company: company.trim(),
      position: position.trim(),
      startDate: startDate.trim() || '2022',
      endDate: currentlyWorking ? (isBn ? 'চলমান' : 'Present') : (endDate.trim() || '2024'),
      currentlyWorking,
      location: location.trim() || (isBn ? 'বাংলাদেশ' : 'Bangladesh'),
      jobDetails: jobDetails.trim(),
    };

    onChange([...histories, newRecord]);

    // Reset
    setCompany('');
    setPosition('');
    setStartDate('');
    setEndDate('');
    setCurrentlyWorking(false);
    setLocation('');
    setJobDetails('');
    setIsAdding(false);
  };

  const handleRemove = (id: string) => {
    onChange(histories.filter((h) => h.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>{isBn ? 'পূর্ববর্তী কর্মসংস্থান ও কাজের ইতিহাস (Work History)' : 'Previous Employment & Work History'}</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {isBn 
              ? 'যেসব প্রতিষ্ঠান বা প্রকল্পে আপনি পূর্বে কাজ করেছেন বা বর্তমানে করছেন' 
              : 'Organizations or projects where you previously worked or are currently working'}
          </p>
        </div>

        {!readOnly && !isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-blue-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isBn ? 'অভিজ্ঞতা যোগ করুন' : 'Add Experience'}</span>
          </button>
        )}
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              {isBn ? 'নতুন কাজের অভিজ্ঞতা যোগ' : 'Add New Work Experience'}
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {isBn ? 'প্রতিষ্ঠান বা মালিকের নাম (Company / Employer)' : 'Company / Employer Name'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={isBn ? 'যেমন: ইস্টার্ন ইঞ্জিনিয়ারিং' : 'e.g. Eastern Engineering'}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {isBn ? 'পদবী (Position / Designation)' : 'Position / Designation'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder={isBn ? 'যেমন: সিনিয়র ইলেকট্রিশিয়ান' : 'e.g. Senior Electrician'}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {isBn ? 'শুরুর সময় (Start Year/Date)' : 'Start Year / Date'}
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder={isBn ? 'যেমন: ২০২০' : 'e.g. 2020'}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {isBn ? 'শেষের সময় (End Year/Date)' : 'End Year / Date'}
              </label>
              <input
                type="text"
                disabled={currentlyWorking}
                value={currentlyWorking ? (isBn ? 'চলমান' : 'Present') : endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder={isBn ? 'যেমন: ২০২৪' : 'e.g. 2024'}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="currentlyWorkingCheck"
              checked={currentlyWorking}
              onChange={(e) => setCurrentlyWorking(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
            />
            <label htmlFor="currentlyWorkingCheck" className="text-xs text-slate-700 cursor-pointer font-medium">
              {isBn ? 'আমি বর্তমানে এখানে কর্মরত' : 'I am currently working here'}
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              {isBn ? 'কাজের এলাকা বা অবস্থান (Location)' : 'Work Location'}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={isBn ? 'যেমন: গুলশান, ঢাকা' : 'e.g. Gulshan, Dhaka'}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              {isBn ? 'দায়িত্ব ও কাজের সংক্ষিপ্ত বিবরণ (Job Details)' : 'Job Responsibilities & Details'}
            </label>
            <textarea
              rows={2}
              value={jobDetails}
              onChange={(e) => setJobDetails(e.target.value)}
              placeholder={isBn ? 'এই প্রতিষ্ঠানে আপনার প্রধান কাজের দায়িত্ব কী ছিল...' : 'What were your main responsibilities at this organization...'}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
            >
              {isBn ? 'সংরক্ষণ করুন' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {/* List of existing Work Histories */}
      {histories.length > 0 ? (
        <div className="space-y-3">
          {histories.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs relative flex flex-col sm:flex-row sm:items-start justify-between gap-3 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900">{item.position}</h5>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-xs text-blue-700">{item.company}</span>
                  {item.currentlyWorking && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {isBn ? 'বর্তমান কর্মস্থল' : 'Current Job'}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{item.startDate} — {item.endDate}</span>
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{item.location}</span>
                    </span>
                  )}
                </div>

                {item.jobDetails && (
                  <p className="text-xs text-slate-600 pt-1 leading-relaxed">{item.jobDetails}</p>
                )}
              </div>

              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="self-end sm:self-start p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  title={isBn ? 'মুছে ফেলুন' : 'Remove'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
          {isBn ? 'এখনও কোনো পূর্ববর্তী কর্মসংস্থান বা কাজের ইতিহাস যুক্ত করা হয়নি।' : 'No previous employment or work history added yet.'}
        </div>
      )}
    </div>
  );
};
