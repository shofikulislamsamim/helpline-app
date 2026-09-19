import React from 'react';
import { Wrench, HardHat, Briefcase, Car, PackageCheck, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { ModuleId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ServiceCardsProps {
  onSelectModule: (moduleId: ModuleId) => void;
}

export const ServiceCards: React.FC<ServiceCardsProps> = ({ onSelectModule }) => {
  const { t, formatNumber } = useLanguage();

  const serviceCards = [
    {
      id: 'hire' as ModuleId,
      number: formatNumber(1),
      title: t.modules.hire.title,
      subtitle: t.modules.hire.subtitle,
      badge: t.modules.hire.badge,
      description: t.modules.hire.description,
      icon: Wrench,
      accent: 'orange',
      iconBg: 'bg-orange-100 text-orange-600',
    },
    {
      id: 'work' as ModuleId,
      number: formatNumber(2),
      title: t.modules.work.title,
      subtitle: t.modules.work.subtitle,
      badge: t.modules.work.badge,
      description: t.modules.work.description,
      icon: HardHat,
      accent: 'green',
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      id: 'jobs' as ModuleId,
      number: formatNumber(3),
      title: t.modules.jobs.title,
      subtitle: t.modules.jobs.subtitle,
      badge: t.modules.jobs.badge,
      description: t.modules.jobs.description,
      icon: Briefcase,
      accent: 'purple',
      iconBg: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'ride' as ModuleId,
      number: formatNumber(4),
      title: t.modules.ride.title,
      subtitle: t.modules.ride.subtitle,
      badge: t.modules.ride.badge,
      description: t.modules.ride.description,
      icon: Car,
      accent: 'blue',
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'delivery' as ModuleId,
      number: formatNumber(5),
      title: t.modules.delivery.title,
      subtitle: t.modules.delivery.subtitle,
      badge: t.modules.delivery.badge,
      description: t.modules.delivery.description,
      icon: PackageCheck,
      accent: 'red',
      iconBg: 'bg-red-100 text-red-600',
    },
    {
      id: 'buysell' as ModuleId,
      number: formatNumber(6),
      title: t.modules.buysell.title,
      subtitle: t.modules.buysell.subtitle,
      badge: t.modules.buysell.badge,
      description: t.modules.buysell.description,
      icon: ShoppingBag,
      accent: 'emerald',
      iconBg: 'bg-emerald-100 text-emerald-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {serviceCards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.id}
            id={`card-service-${card.id}`}
            onClick={() => onSelectModule(card.id)}
            className="group bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            {/* Top row with icon & badge */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-xs`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition">
                    #{card.number}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-slate-400 transition">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition">
                  {card.title}
                </h3>
                <p className="text-slate-500 text-sm mt-0.5 font-medium">
                  {card.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed mt-3 line-clamp-2">
                {card.description}
              </p>
            </div>

            {/* Bottom action indicator */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold group-hover:text-blue-600 transition">
              <span>{card.badge}</span>
              <span className="group-hover:translate-x-1 transition-transform text-blue-600 font-bold">
                {t.home.stepForward} →
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
