import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { i18n } from '../../lib/i18n';

interface EmptyStateProps {
  title: string;
  description?: string;
  badge?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  badge = 'পরবর্তী ধাপের রোডম্যাপ',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 text-center max-w-lg mx-auto shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-100/80">
        {icon || <Sparkles className="w-8 h-8" />}
      </div>

      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 mb-3">
        <span>🚧 {badge}</span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>

      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 my-4 text-emerald-900 font-semibold text-sm">
        {i18n.common.placeholderRoadmapNote}
      </div>

      {description && (
        <p className="text-slate-600 text-sm leading-relaxed mb-6">{description}</p>
      )}

      {actionText && onAction && (
        <button
          id="btn-empty-state-action"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition shadow-xs cursor-pointer"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
