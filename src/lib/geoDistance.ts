import { UserProfile, LiveLocation, PresentAddress } from '../types';

/**
 * Bengali numeral converter for display
 */
const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBnNumber(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/**
 * Calculates real spherical distance between two GPS coordinates using the Haversine formula
 * Returns distance in kilometers
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371; // Earth's mean radius in kilometers
  const toRad = (degree: number) => (degree * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Rounded to 1 decimal place
}

/**
 * Formats a distance in kilometers to user-friendly Bengali text
 * e.g., < 1 km -> "৭৫০ মিটার", >= 1 km -> "২.৪ কিমি"
 */
export function formatDistanceBn(km: number): string {
  if (km < 1) {
    const meters = Math.max(10, Math.round(km * 1000));
    return `${toBnNumber(meters)} মিটার`;
  }
  return `${toBnNumber(km.toFixed(1))} কিমি`;
}

export type LocationMatchType = 
  | 'live_gps'
  | 'upazila_match'
  | 'service_area_match'
  | 'district_match'
  | 'other_area';

export interface CustomerLocationQuery {
  latitude?: number | null;
  longitude?: number | null;
  upazila?: string | null;
  district?: string | null;
  division?: string | null;
}

export interface WorkerDistanceResult {
  hasGpsDistance: boolean;
  distanceKm: number | null;
  formattedTextBn: string;
  badgeLabelBn: string;
  formattedDistance: string; // compatibility alias
  matchLabelBn: string;      // compatibility alias
  matchType: LocationMatchType;
  isOnline: boolean;
}

/**
 * Calculate distance and location match for a worker relative to customer location.
 * STRICT PRIVACY & SAFETY RULES:
 * 1. If worker is OFFLINE: never calculate or expose live GPS distance or coordinates!
 * 2. Only calculate real GPS distance when worker is ONLINE AND has valid coordinates.
 * 3. Gracefully fallback to Upazila, Service Area, and District string matching.
 */
export function getWorkerDistanceResult(
  worker: UserProfile,
  customerLocation?: CustomerLocationQuery | LiveLocation | null,
  customerAddress?: PresentAddress | null
): WorkerDistanceResult {
  const isOnline = Boolean(worker.isOnline);

  // 1. Check live GPS eligibility:
  // Must be ONLINE, have valid lat/lon coordinates, and customer must have coordinates
  const workerCoords = isOnline ? worker.currentLocation : null;
  const hasWorkerGps =
    isOnline &&
    typeof workerCoords?.latitude === 'number' &&
    typeof workerCoords?.longitude === 'number' &&
    !isNaN(workerCoords.latitude) &&
    !isNaN(workerCoords.longitude);

  const hasCustomerGps =
    typeof customerLocation?.latitude === 'number' &&
    typeof customerLocation?.longitude === 'number' &&
    !isNaN(customerLocation.latitude) &&
    !isNaN(customerLocation.longitude);

  if (hasWorkerGps && hasCustomerGps && workerCoords && customerLocation) {
    const distanceKm = calculateHaversineDistanceKm(
      customerLocation.latitude!,
      customerLocation.longitude!,
      workerCoords.latitude!,
      workerCoords.longitude!
    );

    const formattedDist = formatDistanceBn(distanceKm);
    return {
      hasGpsDistance: true,
      distanceKm,
      formattedTextBn: `${formattedDist} দূরে (রিয়েল-টাইম জিপিএস)`,
      badgeLabelBn: `${formattedDist} দূরে`,
      formattedDistance: formattedDist,
      matchLabelBn: `${formattedDist} দূরে (জিপিএস)`,
      matchType: 'live_gps',
      isOnline: true,
    };
  }

  // 2. Fallback Location Matching (when GPS unavailable or worker is offline):
  const custUpazila = (customerAddress?.upazila || (customerLocation as CustomerLocationQuery)?.upazila || '').toLowerCase().trim();
  const custDistrict = (customerAddress?.district || (customerLocation as CustomerLocationQuery)?.district || '').toLowerCase().trim();
  const workerUpazila = (worker.presentAddress?.upazila || '').toLowerCase().trim();
  const workerDistrict = (worker.presentAddress?.district || '').toLowerCase().trim();

  // Upazila match (same thana/upazila)
  if (custUpazila && workerUpazila && (custUpazila.includes(workerUpazila) || workerUpazila.includes(custUpazila))) {
    const label = `একই থানা (${worker.presentAddress?.upazila})`;
    return {
      hasGpsDistance: false,
      distanceKm: null,
      formattedTextBn: label,
      badgeLabelBn: label,
      formattedDistance: label,
      matchLabelBn: label,
      matchType: 'upazila_match',
      isOnline,
    };
  }

  // Service Area match
  if (custUpazila && worker.serviceAreas && worker.serviceAreas.length > 0) {
    const inServiceArea = worker.serviceAreas.some((area) => {
      const a = area.toLowerCase().trim();
      return a.includes(custUpazila) || custUpazila.includes(a);
    });

    if (inServiceArea) {
      const label = 'সার্ভিস এরিয়া কভারেজ';
      return {
        hasGpsDistance: false,
        distanceKm: null,
        formattedTextBn: `${label} (${worker.presentAddress?.upazila || worker.presentAddress?.district})`,
        badgeLabelBn: label,
        formattedDistance: label,
        matchLabelBn: label,
        matchType: 'service_area_match',
        isOnline,
      };
    }
  }

  // District match (same district)
  if (custDistrict && workerDistrict && custDistrict === workerDistrict) {
    const label = `একই জেলা (${worker.presentAddress?.district})`;
    return {
      hasGpsDistance: false,
      distanceKm: null,
      formattedTextBn: `${label} • ${worker.presentAddress?.upazila || ''}`,
      badgeLabelBn: label,
      formattedDistance: label,
      matchLabelBn: label,
      matchType: 'district_match',
      isOnline,
    };
  }

  // Other area
  const locationSummary = `${worker.presentAddress?.district || 'ঢাকা'}, ${worker.presentAddress?.division || 'বাংলাদেশ'}`;
  return {
    hasGpsDistance: false,
    distanceKm: null,
    formattedTextBn: locationSummary,
    badgeLabelBn: locationSummary,
    formattedDistance: locationSummary,
    matchLabelBn: locationSummary,
    matchType: 'other_area',
    isOnline,
  };
}

/**
 * Sorts workers by proximity to customer (GPS distance first, then upazila, service area, district).
 */
export function sortWorkersByProximity(
  workers: UserProfile[],
  customerLocation?: CustomerLocationQuery | LiveLocation | null,
  customerAddress?: PresentAddress | null
): UserProfile[] {
  return [...workers].sort((a, b) => {
    const resA = getWorkerDistanceResult(
      a, 
      customerLocation, 
      customerAddress || ((customerLocation as CustomerLocationQuery)?.district ? (customerLocation as unknown as PresentAddress) : null)
    );
    const resB = getWorkerDistanceResult(
      b, 
      customerLocation, 
      customerAddress || ((customerLocation as CustomerLocationQuery)?.district ? (customerLocation as unknown as PresentAddress) : null)
    );

    // 1. Both have valid GPS distance
    if (resA.hasGpsDistance && resB.hasGpsDistance && resA.distanceKm !== null && resB.distanceKm !== null) {
      return resA.distanceKm - resB.distanceKm;
    }
    // 2. One has GPS distance
    if (resA.hasGpsDistance && !resB.hasGpsDistance) return -1;
    if (!resA.hasGpsDistance && resB.hasGpsDistance) return 1;

    // 3. Online workers prioritized
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;

    // 4. Area hierarchy
    const rankMap: Record<LocationMatchType, number> = {
      live_gps: 1,
      upazila_match: 2,
      service_area_match: 3,
      district_match: 4,
      other_area: 5,
    };
    return rankMap[resA.matchType] - rankMap[resB.matchType];
  });
}
