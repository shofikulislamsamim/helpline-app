import React from 'react';
import { Layers, CheckCircle, Plus } from 'lucide-react';
import { ServiceDeliveryType } from '../../types';
import { SERVICE_TYPES_LIST } from '../../lib/professionsData';

interface ServiceTypesSectionProps {
  selectedTypes?: ServiceDeliveryType[];
  onChange?: (types: ServiceDeliveryType[]) => void;
  readOnly?: boolean;
}

export const ServiceTypesSection: React.FC<ServiceTypesSectionProps> = ({
  selectedTypes = ['on_demand', 'daily', 'contractual', 'remote'],
  onChange,
  readOnly = false,
}) => {
  const toggleType = (id: ServiceDeliveryType) => {
    if (readOnly || !onChange) return;
    if (selectedTypes.includes(id)) {
      if (selectedTypes.length > 1) {
        onChange(selectedTypes.filter((t) => t !== id));
      }
    } else {
      onChange([...selectedTypes, id]);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>৬. সেবার ধরন ও কাজের পরিধি (Service Delivery Types)</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          আপনি কোন কোন শর্তে বা উপায়ে কাজ করতে প্রস্তুত তা নির্বাচন করুন (এক বা একাধিক নির্বাচনযোগ্য)।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SERVICE_TYPES_LIST.map((type) => {
          const isSelected = selectedTypes.includes(type.id);
          return (
            <div
              key={type.id}
              onClick={() => toggleType(type.id)}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 select-none ${
                readOnly ? 'cursor-default' : 'cursor-pointer'
              } ${
                isSelected
                  ? 'bg-blue-50/80 border-blue-300 text-slate-900 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="text-2xl shrink-0 mt-0.5">{type.icon}</div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{type.titleBn}</h4>
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
                  {type.subtitleBn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
