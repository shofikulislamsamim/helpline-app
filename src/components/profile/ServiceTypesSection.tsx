import React from 'react';
import { Layers, CheckCircle } from 'lucide-react';
import { ServiceDeliveryType } from '../../types';
import { SERVICE_TYPES_LIST } from '../../lib/professionsData';
import { useLanguage } from '../../context/LanguageContext';

interface ServiceTypesSectionProps {
  selectedTypes?: ServiceDeliveryType[];
  onChange?: (types: ServiceDeliveryType[]) => void;
  readOnly?: boolean;
}

export const ServiceTypesSection: React.FC<ServiceTypesSectionProps> = ({
  selectedTypes = [],
  onChange,
  readOnly = false,
}) => {
  const { isBn } = useLanguage();

  const toggleType = (id: ServiceDeliveryType) => {
    if (readOnly || !onChange) return;

    if (selectedTypes.includes(id)) {
      onChange(selectedTypes.filter((t) => t !== id));
    } else {
      onChange([...selectedTypes, id]);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>{isBn ? 'কাজের ধরন ও সময়সূচি' : 'Work Type & Schedule'}</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {isBn
            ? 'আপনি কীভাবে কাজ নিতে চান—এক বা একাধিক ধরন নির্বাচন করুন।'
            : 'Choose one or more ways you are available to work.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SERVICE_TYPES_LIST.map((type) => {
          const isSelected = selectedTypes.includes(type.id);

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => toggleType(type.id)}
              disabled={readOnly}
              aria-pressed={isSelected}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 text-left select-none disabled:cursor-default ${
                isSelected
                  ? 'bg-blue-50/80 border-blue-300 text-slate-900 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="text-2xl shrink-0 mt-0.5">{type.icon}</div>

              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs text-slate-900">
                    {isBn ? type.titleBn : (type.titleEn || type.titleBn)}
                  </h4>
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-blue-600 border-blue-700 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle className="w-3 h-3" />}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {isBn ? type.subtitleBn : (type.subtitleEn || type.subtitleBn)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {selectedTypes.length === 0 && (
        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          {isBn
            ? 'কমপক্ষে একটি কাজের ধরন নির্বাচন করুন।'
            : 'Select at least one work type.'}
        </p>
      )}
    </div>
  );
};
