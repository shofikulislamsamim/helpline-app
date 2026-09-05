import { HireRequest, UserProfile } from '../types';

// Bangladesh Area Coordinates Database (Accurate centroid points for roads & routing)
const BANGLADESH_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  // Dhaka Major Hubs
  'মিরপুর': { lat: 23.8071, lng: 90.3686 },
  'মিরপুর-১০': { lat: 23.8071, lng: 90.3686 },
  'মিরপুর (১০ নং সেক্টর)': { lat: 23.8071, lng: 90.3686 },
  'মিরপুর-১': { lat: 23.7956, lng: 90.3537 },
  'মিরপুর-২': { lat: 23.8042, lng: 90.3615 },
  'মিরপুর-১১': { lat: 23.8188, lng: 90.3672 },
  'মিরপুর-১২': { lat: 23.8274, lng: 90.3654 },
  'ধানমন্ডি': { lat: 23.7461, lng: 90.3742 },
  'গুলশান': { lat: 23.7925, lng: 90.4078 },
  'গুলশান-১': { lat: 23.7788, lng: 90.4168 },
  'গুলশান-২': { lat: 23.7925, lng: 90.4078 },
  'বনানী': { lat: 23.7937, lng: 90.4043 },
  'উত্তরা': { lat: 23.8759, lng: 90.3795 },
  'মতিঝিল': { lat: 23.7330, lng: 90.4172 },
  'মোহাম্মদপুর': { lat: 23.7658, lng: 90.3585 },
  'বাড্ডা': { lat: 23.7806, lng: 90.4267 },
  'মহাখালী': { lat: 23.7776, lng: 90.4005 },
  'ফার্মগেট': { lat: 23.7561, lng: 90.3872 },
  'যাত্রাবাড়ী': { lat: 23.7104, lng: 90.4349 },
  'ওয়ারী': { lat: 23.7188, lng: 90.4194 },
  'লালমাটিয়া': { lat: 23.7533, lng: 90.3692 },
  'শ্যামলী': { lat: 23.7719, lng: 90.3631 },
  'তেজগাঁও': { lat: 23.7600, lng: 90.3956 },
  'খিলগাঁও': { lat: 23.7516, lng: 90.4244 },
  'রামপুরা': { lat: 23.7612, lng: 90.4208 },
  'বসুন্ধরা': { lat: 23.8151, lng: 90.4255 },
  'পুরান ঢাকা': { lat: 23.7104, lng: 90.4074 },
  'শাহবাগ': { lat: 23.7383, lng: 90.3958 },
  'পল্টন': { lat: 23.7340, lng: 90.4125 },

  // Divisions & Cities
  'ঢাকা': { lat: 23.8103, lng: 90.4125 },
  'চট্টগ্রাম': { lat: 22.3569, lng: 91.7832 },
  'সিলেট': { lat: 24.8949, lng: 91.8687 },
  'রাজশাহী': { lat: 24.3745, lng: 88.6042 },
  'খুলনা': { lat: 22.8456, lng: 89.5403 },
  'বরিশাল': { lat: 22.7010, lng: 90.3535 },
  'রংপুর': { lat: 25.7439, lng: 89.2752 },
  'ময়মনসিংহ': { lat: 24.7471, lng: 90.4203 },
  'গাজীপুর': { lat: 23.9999, lng: 90.4203 },
  'নারায়ণগঞ্জ': { lat: 23.6238, lng: 90.5000 },
  'কুমিল্লা': { lat: 23.4607, lng: 91.1809 },
  'বগুড়া': { lat: 24.8465, lng: 89.3777 },
  'কক্সবাজার': { lat: 21.4272, lng: 92.0058 },
};

/**
 * Determine whether a job is Physical (local on-site service) or Digital (remote freelancing).
 * Tracking only applies to Physical/Local Jobs.
 */
export function isPhysicalJob(req: HireRequest, worker?: UserProfile): boolean {
  // If worker is marked strictly digital and not physical
  if (worker && worker.serviceCategoryModes) {
    if (worker.serviceCategoryModes.includes('digital') && !worker.serviceCategoryModes.includes('physical')) {
      return false;
    }
  }

  // Keywords that strictly designate digital freelancing/remote work
  const digitalKeywords = [
    'graphic', 'গ্রাফিক', 'design', 'ডিজাইন', 'logo', 'লোগো',
    'web', 'ওয়েব', 'developer', 'ডেভেলপার', 'software', 'সফটওয়্যার',
    'video', 'ভিডিও', 'editor', 'এডিটর', 'animation', 'অ্যানিমেশন',
    'marketing', 'মার্কেটিং', 'seo', 'এসইও', 'content', 'কনটেন্ট',
    'writing', 'রাইটিং', 'ui/ux', 'freelance', 'ফ্রিল্যান্সিং'
  ];

  // Keywords that override to physical (e.g. electrical design -> physical)
  const physicalKeywords = [
    'electric', 'ইলেকট্রিশিয়ান', 'এসি', 'ac ', 'plumb', 'প্লাম্বার',
    'carpenter', 'কাঠমিস্ত্রি', 'repair', 'মেরামত', 'ফিটিং', 'পাইপ',
    'গ্যাস', 'হোম', 'বাসা', 'হোম অ্যাপ্লায়েন্স', 'ক্লিনার', 'রংমিস্ত্রি'
  ];

  const fullText = `${req.workerProfession || ''} ${req.workType || ''} ${req.description || ''}`.toLowerCase();

  for (const phys of physicalKeywords) {
    if (fullText.includes(phys)) return true;
  }

  for (const dig of digitalKeywords) {
    if (fullText.includes(dig)) return false;
  }

  return true;
}

/**
 * Resolves coordinates for customer work location using known Bangladesh locations.
 */
export function resolveCustomerLocation(workLocation?: HireRequest['workLocation']): { lat: number; lng: number } {
  if (!workLocation) {
    return BANGLADESH_LOCATIONS['মিরপুর-১০'];
  }

  const queryCandidates = [
    workLocation.areaRoad,
    workLocation.upazila,
    workLocation.district,
    workLocation.division,
    workLocation.fullAddress,
  ].filter(Boolean) as string[];

  // 1. Direct match check
  for (const candidate of queryCandidates) {
    for (const [key, coords] of Object.entries(BANGLADESH_LOCATIONS)) {
      if (candidate.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(candidate.toLowerCase())) {
        return coords;
      }
    }
  }

  // 2. Full address partial match
  if (workLocation.fullAddress) {
    const addr = workLocation.fullAddress.toLowerCase();
    for (const [key, coords] of Object.entries(BANGLADESH_LOCATIONS)) {
      if (addr.includes(key.toLowerCase())) {
        return coords;
      }
    }
  }

  // Fallback to Dhaka central/Mirpur-10
  return BANGLADESH_LOCATIONS['মিরপুর-১০'];
}

/**
 * Converts English digits to Bengali digits.
 */
export function toBengaliDigits(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
}

/**
 * Formats road distance in Bengali (e.g. "৩.২ কি.মি." or "৪৫০ মিটার").
 */
export function formatRoadDistanceBn(meters: number): string {
  if (meters < 1000) {
    return `${toBengaliDigits(Math.round(meters))} মিটার`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${toBengaliDigits(km)} কি.মি.`;
}

/**
 * Formats ETA in Bengali (e.g. "১২ মিনিট" or "১ ঘণ্টা ১৫ মিনিট").
 */
export function formatEtaBn(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) {
    return `${toBengaliDigits(minutes)} মিনিট`;
  }
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  if (remMinutes === 0) {
    return `${toBengaliDigits(hours)} ঘণ্টা`;
  }
  return `${toBengaliDigits(hours)} ঘণ্টা ${toBengaliDigits(remMinutes)} মিনিট`;
}

export interface RouteCalculationResult {
  distanceMeters: number;
  durationSeconds: number;
  geometry: [number, number][]; // [latitude, longitude] sequence along road
  distanceTextBn: string;
  etaTextBn: string;
}

/**
 * Computes a real road route between origin and destination using the OSRM Driving Road API.
 * Falls back to road-adjusted interpolation if the network is temporarily offline.
 */
export async function fetchRealRoadRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<RouteCalculationResult> {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceMeters = Math.round(route.distance);
        const durationSeconds = Math.round(route.duration);

        // OSRM geometry coordinates are [lng, lat], convert to Leaflet standard [lat, lng]
        const geometry: [number, number][] = route.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]]
        );

        return {
          distanceMeters,
          durationSeconds,
          geometry,
          distanceTextBn: formatRoadDistanceBn(distanceMeters),
          etaTextBn: formatEtaBn(durationSeconds),
        };
      }
    }
  } catch (err) {
    console.warn('OSRM road routing fallback engaged:', err);
  }

  // Graceful road-curvature fallback if external router is unreachable
  const straightDistanceMeters = calculateHaversineMeters(origin, destination);
  // Real roads in urban cities have on average ~1.35x curvature factor over straight distance
  const roadDistanceMeters = Math.round(straightDistanceMeters * 1.35);
  // City driving speed estimate ~22 km/h (6.1 m/s) with Dhaka traffic
  const durationSeconds = Math.max(60, Math.round(roadDistanceMeters / 6.1));

  // Generate intermediate waypoint curve
  const steps = 12;
  const geometry: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = origin.lat + (destination.lat - origin.lat) * t;
    const lng = origin.lng + (destination.lng - origin.lng) * t;
    // Add realistic subtle road curve
    const jitter = Math.sin(t * Math.PI) * 0.002;
    geometry.push([lat + jitter, lng - jitter]);
  }

  return {
    distanceMeters: roadDistanceMeters,
    durationSeconds,
    geometry,
    distanceTextBn: formatRoadDistanceBn(roadDistanceMeters),
    etaTextBn: formatEtaBn(durationSeconds),
  };
}

/**
 * Calculates straight-line distance in meters between two lat/lng coordinates (Haversine formula).
 */
export function calculateHaversineMeters(
  pointA: { lat: number; lng: number },
  pointB: { lat: number; lng: number }
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (pointA.lat * Math.PI) / 180;
  const phi2 = (pointB.lat * Math.PI) / 180;
  const deltaPhi = ((pointB.lat - pointA.lat) * Math.PI) / 180;
  const deltaLambda = ((pointB.lng - pointA.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Computes bearing (heading in degrees 0-360) between two coordinates.
 */
export function calculateBearing(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number }
): number {
  const startLat = (start.lat * Math.PI) / 180;
  const startLng = (start.lng * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const endLng = (end.lng * Math.PI) / 180;

  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}
