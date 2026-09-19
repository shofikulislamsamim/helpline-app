import React, { useState, useMemo } from 'react';
import { Search, Tag, Plus, X, Sparkles, PlusCircle } from 'lucide-react';
import { getSuggestedKeywordsForSelection } from '../../lib/professionsData';
import { UserProfessionItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface SearchKeywordsSectionProps {
  keywords?: string[];
  professions?: (string | UserProfessionItem)[];
  skills?: string[];
  onChange?: (keywords: string[]) => void;
  readOnly?: boolean;
}

export const SearchKeywordsSection: React.FC<SearchKeywordsSectionProps> = ({
  keywords = [],
  professions = [],
  skills = [],
  onChange,
  readOnly = false,
}) => {
  const { isBn, formatNumber } = useLanguage();
  const [inputVal, setInputVal] = useState('');

  // Extract profession names
  const professionNames = useMemo(() => {
    return professions.map((p) => (typeof p === 'string' ? p : p.nameBn));
  }, [professions]);

  // Derive relevant suggested keywords based on user's selected professions and skills
  const contextualSuggestions = useMemo(() => {
    const suggested = getSuggestedKeywordsForSelection(professionNames, skills);
    // Filter out keywords already in user's list
    return suggested.filter((s) => !keywords.includes(s));
  }, [professionNames, skills, keywords]);

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || !onChange) return;
    const trimmed = inputVal.trim();
    if (!keywords.includes(trimmed)) {
      onChange([...keywords, trimmed]);
    }
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (kw: string) => {
    if (!onChange || readOnly) return;
    onChange(keywords.filter((k) => k !== kw));
  };

  const handleAddSuggestion = (sugg: string) => {
    if (!onChange || readOnly) return;
    if (!keywords.includes(sugg)) {
      onChange([...keywords, sugg]);
    }
  };

  const handleAddAllSuggestions = () => {
    if (!onChange || readOnly || contextualSuggestions.length === 0) return;
    const combined = Array.from(new Set([...keywords, ...contextualSuggestions.slice(0, 10)]));
    onChange(combined);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            <span>{isBn ? 'সার্চ কিওয়ার্ডস ও ট্যাগ (Search Keywords)' : 'Search Keywords & Tags'}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {formatNumber(keywords.length)} {isBn ? 'টি ট্যাগ' : 'tags'}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBn 
              ? 'গ্রাহক বা ক্লায়েন্টরা যেসব বাংলা বা ইংরেজি নামে অনুসন্ধান করেন (যেমন: "এসি মিস্ত্রি", "লোগো তৈরি", "House Wiring") সেগুলো যুক্ত রাখুন।' 
              : 'Add keywords customers might search for in Bengali or English (e.g. "AC technician", "Logo design", "House Wiring").'}
          </p>
        </div>

        {!readOnly && onChange && contextualSuggestions.length > 0 && (
          <button
            type="button"
            onClick={handleAddAllSuggestions}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isBn ? 'প্রস্তাবিত সব ট্যাগ যোগ করুন' : 'Add All Suggested Tags'}</span>
          </button>
        )}
      </div>

      {/* Input box */}
      {!readOnly && onChange && (
        <form onSubmit={handleAdd} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isBn ? 'নতুন সার্চ কিওয়ার্ড লিখুন (বাংলা বা ইংরেজি) এবং Enter চাপুন' : 'Type new search keyword (Bengali or English) and press Enter'}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isBn ? 'ট্যাগ যোগ' : 'Add Tag'}</span>
          </button>
        </form>
      )}

      {/* Keywords Chips */}
      {keywords.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {keywords.map((kw, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <span># {kw}</span>
              {!readOnly && onChange && (
                <button
                  type="button"
                  onClick={() => handleRemove(kw)}
                  className="text-blue-400 hover:text-rose-600 p-0.5 rounded-full cursor-pointer transition"
                  title={isBn ? 'মুছে ফেলুন' : 'Remove'}
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
            ? 'কোনো সার্চ কিওয়ার্ড এখনও যুক্ত করা হয়নি। নিচের প্রস্তাবিত ট্যাগগুলো নির্বাচন করতে পারেন।' 
            : 'No search keywords added yet. You can select from suggested tags below.'}
        </p>
      )}

      {/* Suggested chips to add */}
      {!readOnly && onChange && contextualSuggestions.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold">
              {isBn ? 'আপনার পেশা ও দক্ষতার ভিত্তিতে প্রস্তাবিত কিওয়ার্ড:' : 'Suggested keywords based on your profession and skills:'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {contextualSuggestions.slice(0, 12).map((sugg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAddSuggestion(sugg)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 rounded-lg border border-slate-200 text-xs font-medium transition cursor-pointer"
              >
                <PlusCircle className="w-3 h-3 text-slate-400" />
                <span>{sugg}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
