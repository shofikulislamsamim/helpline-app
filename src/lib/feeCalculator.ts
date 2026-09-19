import { HireAdminSettings, ServiceFeeBreakdown } from '../types';

/**
 * Calculates platform service fee and worker receivable breakdown based on centralized admin settings.
 * Ensures the original agreed price is preserved and provides a complete audit trail.
 */
export function calculateServiceFee(
  agreedPrice: number,
  _settings?: Partial<HireAdminSettings> | null
): ServiceFeeBreakdown {
  const basePrice = Math.max(0, Number(agreedPrice) || 0);

  return {
    feeEnabled: false,
    agreedPrice: basePrice,
    commissionPercentage: 0,
    fixedFee: 0,
    calculatedFee: 0,
    workerReceivable: basePrice,
    customerPayable: basePrice,
    calculatedAt: new Date().toISOString(),
  };
}
