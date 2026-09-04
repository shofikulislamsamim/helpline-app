import { HireAdminSettings, ServiceFeeBreakdown } from '../types';

/**
 * Calculates platform service fee and worker receivable breakdown based on centralized admin settings.
 * Ensures the original agreed price is preserved and provides a complete audit trail.
 */
export function calculateServiceFee(
  agreedPrice: number,
  settings: HireAdminSettings
): ServiceFeeBreakdown {
  const basePrice = Math.max(0, Number(agreedPrice) || 0);

  // If service fee is disabled by admin or price is 0
  if (!settings.serviceFeeEnabled || basePrice === 0) {
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

  const percentage = Math.max(0, Number(settings.commissionPercentage) || 0);
  const fixed = Math.max(0, Number(settings.fixedServiceFee) || 0);
  const minFee = Math.max(0, Number(settings.minServiceFee) || 0);
  const maxFee = Math.max(minFee, Number(settings.maxServiceFee) || 500);

  // 1. Percentage commission component
  const percentageFee = Math.round((basePrice * percentage) / 100);

  // 2. Add optional fixed fee
  const rawTotalFee = percentageFee + fixed;

  // 3. Apply min and max boundary caps
  const boundedFee = Math.max(minFee, Math.min(maxFee, rawTotalFee));

  // 4. Safe ceiling: platform fee should never exceed 50% of the job price
  const finalCalculatedFee = Math.min(boundedFee, Math.floor(basePrice * 0.5));

  // 5. Worker net receivable and Customer total payable
  const workerReceivable = Math.max(0, basePrice - finalCalculatedFee);
  const customerPayable = basePrice; // In our marketplace model, customer pays agreed price, commission is deducted for platform

  return {
    feeEnabled: true,
    agreedPrice: basePrice,
    commissionPercentage: percentage,
    fixedFee: fixed,
    calculatedFee: finalCalculatedFee,
    workerReceivable,
    customerPayable,
    calculatedAt: new Date().toISOString(),
  };
}
