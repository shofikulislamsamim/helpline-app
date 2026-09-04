import { HireAdminSettings, ServiceFeeBreakdown } from '../types';
import { calculateServiceFee as baseCalculateFee } from './feeCalculator';

export interface CommissionSettings {
  isEnabled: boolean;
  commissionPercentage: number;
  fixedFee: number;
  minPlatformFee: number;
  maxPlatformFee: number;
  effectiveDate: string;
  notes: string;
}

export const DEFAULT_COMMISSION_SETTINGS: CommissionSettings = {
  isEnabled: true,
  commissionPercentage: 5,
  fixedFee: 10,
  minPlatformFee: 10,
  maxPlatformFee: 500,
  effectiveDate: '2026-03-01',
  notes: 'প্রস্তুতিমূলক হিসাব। কোনো টাকা সরাসরি কাটা হয় না, কাজ শেষে গ্রাহক কর্মীকে সরাসরি পরিশোধ করবেন।',
};

export interface CalculatedFeeResult extends ServiceFeeBreakdown {
  isEnabled: boolean;
  totalServiceFee: number;
  percentageFee: number;
  workerReceivableAmount: number;
  customerTotalPayable: number;
  preparatoryNotice: string;
}

/**
 * Calculates platform commission and service fee breakdown.
 * Adapts seamlessly between CommissionSettings and HireAdminSettings.
 */
export function calculateServiceFee(
  agreedPrice: number,
  settings?: Partial<CommissionSettings> | Partial<HireAdminSettings> | null
): CalculatedFeeResult {
  const basePrice = Math.max(0, Number(agreedPrice) || 0);
  
  // Normalise input settings
  const isEnabled = settings && 'isEnabled' in settings 
    ? Boolean(settings.isEnabled) 
    : (settings && 'serviceFeeEnabled' in settings ? Boolean(settings.serviceFeeEnabled) : true);

  const percentage = settings && 'commissionPercentage' in settings && typeof settings.commissionPercentage === 'number'
    ? settings.commissionPercentage
    : 5;

  const fixed = settings && 'fixedFee' in settings && typeof settings.fixedFee === 'number'
    ? settings.fixedFee
    : (settings && 'fixedServiceFee' in settings && typeof settings.fixedServiceFee === 'number' ? settings.fixedServiceFee : 10);

  const minFee = settings && 'minPlatformFee' in settings && typeof settings.minPlatformFee === 'number'
    ? settings.minPlatformFee
    : (settings && 'minServiceFee' in settings && typeof settings.minServiceFee === 'number' ? settings.minServiceFee : 10);

  const maxFee = settings && 'maxPlatformFee' in settings && typeof settings.maxPlatformFee === 'number'
    ? settings.maxPlatformFee
    : (settings && 'maxServiceFee' in settings && typeof settings.maxServiceFee === 'number' ? settings.maxServiceFee : 500);

  const notes = settings && 'notes' in settings && typeof settings.notes === 'string'
    ? settings.notes
    : 'প্রস্তুতিমূলক হিসাব। কোনো টাকা সরাসরি কাটা হয় না, গ্রাহক কাজ শেষে কর্মীকে সরাসরি পরিশোধ করবেন।';

  if (!isEnabled || basePrice === 0) {
    return {
      feeEnabled: false,
      isEnabled: false,
      agreedPrice: basePrice,
      commissionPercentage: 0,
      fixedFee: 0,
      percentageFee: 0,
      calculatedFee: 0,
      totalServiceFee: 0,
      workerReceivable: basePrice,
      workerReceivableAmount: basePrice,
      customerPayable: basePrice,
      customerTotalPayable: basePrice,
      calculatedAt: new Date().toISOString(),
      preparatoryNotice: notes,
    };
  }

  const percentageFee = Math.round((basePrice * percentage) / 100);
  const rawTotalFee = percentageFee + fixed;
  const boundedFee = Math.max(minFee, Math.min(maxFee, rawTotalFee));
  const finalFee = Math.min(boundedFee, Math.floor(basePrice * 0.5)); // Never exceed 50%
  const workerReceivable = Math.max(0, basePrice - finalFee);

  return {
    feeEnabled: true,
    isEnabled: true,
    agreedPrice: basePrice,
    commissionPercentage: percentage,
    fixedFee: fixed,
    percentageFee,
    calculatedFee: finalFee,
    totalServiceFee: finalFee,
    workerReceivable,
    workerReceivableAmount: workerReceivable,
    customerPayable: basePrice,
    customerTotalPayable: basePrice,
    calculatedAt: new Date().toISOString(),
    preparatoryNotice: notes,
  };
}
