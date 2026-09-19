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
  isEnabled: false,
  commissionPercentage: 0,
  fixedFee: 0,
  minPlatformFee: 0,
  maxPlatformFee: 0,
  effectiveDate: '2026-03-01',
  notes: 'হেল্পলাইনে কোনো প্ল্যাটফর্ম ফি, সার্ভিস চার্জ বা কমিশন নেই (০%)। গ্রাহক কাজ শেষে কর্মীকে সরাসরি সম্পূর্ণ পারিশ্রমিক পরিশোধ করবেন।',
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
 * HelpLine Final Payment Rule: NO transaction-related fees (0% fee, 0% commission).
 * Customer Payable = Agreed Price, Worker Receivable = Agreed Price, All Fees = 0.
 */
export function calculateServiceFee(
  agreedPrice: number,
  _settings?: Partial<CommissionSettings> | Partial<HireAdminSettings> | null
): CalculatedFeeResult {
  const basePrice = Math.max(0, Number(agreedPrice) || 0);

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
    preparatoryNotice: 'হেল্পলাইনে কোনো প্ল্যাটফর্ম ফি বা কমিশন নেই (০%)। গ্রাহক সরাসরি সম্পূর্ণ টাকা কর্মীকে পরিশোধ করবেন।',
  };
}
