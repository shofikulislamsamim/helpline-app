import { UserProfile, ServiceCategoryMode } from '../types';
import { CustomerLocationQuery, getWorkerDistanceResult } from './geoDistance';

// Synonyms and bilingual mappings for common searches in Bengali & English
export const SEARCH_SYNONYM_MAP: Record<string, string[]> = {
  // Physical / Local
  electrician: ['electrician', 'ইলেকট্রিশিয়ান', 'ইলেকট্রিশিয়ান', 'ইলেকট্রিক মিস্ত্রি', 'বৈদ্যুতিক', 'কারেন্ট', 'কারেন্টের কাজ', 'ওয়্যারিং', 'হাউস ওয়্যারিং', 'wiring', 'সুইচবোর্ড', 'switch', 'সার্কিট ব্রেকার', 'mcb', 'ফ্যান', 'fan', 'ফ্যান ফিটিং', 'ফ্যান লাগানো', 'ফ্যান লাগানোর লোক', 'জেনারেটর', 'generator'],
  ac: ['ac', 'এসি', 'এয়ার কন্ডিশনার', 'এসি টেকনিশিয়ান', 'এসি মিস্ত্রি', 'এসি সার্ভিসিং', 'গ্যাস রিফিল', 'gas refill', 'কম্প্রেসার', 'compressor', 'কুলিং', 'cooling', 'জেট ওয়াশ', 'ইনভার্টার এসি'],
  plumber: ['plumber', 'প্লাম্বার', 'পাইপ', 'পাইপফিটার', 'পাইপ মিস্ত্রি', 'পানির লাইন', 'পানির পাম্প', 'পানির মোটর', 'motor', 'পানি পড়া', 'লিকেজ', 'leakage', 'বাথরুম ফিটিংস', 'স্যানিটারি', 'sanitary', 'ট্যাপ', 'কমোড'],
  painter: ['painter', 'পেইন্টার', 'রং মিস্ত্রি', 'রং মিস্ত্ৰি', 'রঙ মিস্ত্রি', 'কালার', 'ওয়াল পেইন্ট', 'পেইন্টিং', 'আবহাওয়া প্রতিরোধী রং', 'ওয়েদার কোট', 'weather coat', 'বার্নিশ', 'পলিশ', 'পুটিং', 'putty'],
  carpenter: ['carpenter', 'কাঠমিস্ত্রি', 'কাঠ মিস্ত্রি', 'কাঠের কাজ', 'ফার্নিচার', 'furniture', 'আসবাবপত্র', 'দরজা ফিটিং', 'ডোর লক', 'door lock', 'কব্জা', 'কিচেন ক্যাবিনেট', 'cabinet'],
  cleaner: ['cleaner', 'ক্লিনার', 'ক্লিনিং', 'ডিপ ক্লিনিং', 'deep cleaning', 'বাসা পরিষ্কার', 'বাসা মোছা', 'ছুটা বুয়া', 'বুয়া', 'সোফা ওয়াশ', 'কার্পেট ওয়াশ', 'carpet wash', 'পেস্ট কন্ট্রোল', 'পোকা দমন'],
  driver: ['driver', 'ড্রাইভার', 'গাড়ি চালক', 'চালক', 'প্রাইভেট কার চালক', 'ব্যক্তিগত ড্রাইভার', 'কার ড্রাইভার', 'রাইডার', 'বাইকার', 'মাইক্রোবাস'],
  computer: ['computer', 'কম্পিউটার', 'ল্যাপটপ', 'laptop', 'পিসি', 'pc', 'হার্ডওয়্যার', 'hardware', 'উইন্ডোজ', 'windows', 'সিসিটিভি', 'cctv', 'রাউটার', 'ওয়াইফাই', 'wifi'],
  solar: ['solar', 'সোলার', 'সৌর বিদ্যুৎ', 'সোলার প্যানেল', 'solar panel', 'আইপিএস', 'ips', 'ব্যাটারি', 'battery'],

  // Freelance / Digital
  graphic: ['graphic', 'graphics', 'গ্রাফিক', 'গ্রাফিক্স', 'গ্রাফিক ডিজাইনার', 'graphic designer', 'ডিজাইনার', 'লোগো', 'logo', 'লোগো ডিজাইন', 'logo design', 'লোগো তৈরি', 'ব্যানার', 'banner', 'থাম্বনেইল', 'thumbnail', 'ইউটিউব থাম্বনেইল', 'ফটোশপ', 'photoshop', 'ইলাস্ট্রেটর', 'illustrator', 'পোস্টার', 'poster', 'ফ্লায়ার', 'flyer'],
  web: ['web', 'ওয়েব', 'ওয়েবসাইট', 'website', 'ওয়েব ডেভেলপার', 'web developer', 'ডেভেলপার', 'developer', 'প্রোগ্রামার', 'programmer', 'কোডিং', 'coding', 'react', 'nextjs', 'ফ্রন্টএন্ড', 'frontend', 'ব্যাকএন্ড', 'backend', 'fullstack', 'ওয়ার্ডপ্রেস', 'wordpress', 'ই-কমার্স', 'ecommerce', 'ল্যান্ডিং পেজ'],
  video: ['video', 'ভিডিও', 'ভিডিও এডিটর', 'video editor', 'ভিডিও এডিটিং', 'video editing', 'এডিটিং', 'editing', 'রিলস', 'reels', 'শর্টস', 'shorts', 'টিকটক', 'tiktok', 'ইউটিউব ভিডিও', 'youtube video', 'কালার গ্রেডিং', 'color grading', 'মোশন গ্রাফিক্স', 'motion graphics'],
  marketing: ['marketing', 'মার্কেটিং', 'ডিজিটাল মার্কেটিং', 'digital marketing', 'ডিজিটাল মার্কেটার', 'digital marketer', 'ফেসবুক অ্যাড', 'facebook ads', 'ফেসবুক বুস্ট', 'গুগল অ্যাডস', 'google ads', 'এসইও', 'seo', 'সার্চ ইঞ্জিন', 'কন্টেন্ট মার্কেটিং', 'সোশ্যাল মিডিয়া'],
  writer: ['writer', 'রাইটার', 'কন্টেন্ট রাইটার', 'content writer', 'কপিরাইটার', 'copywriter', 'অনুবাদ', 'অনুবাদক', 'translation', 'আর্টিকেল', 'article', 'ব্লগ', 'blog'],
  uiux: ['ui', 'ux', 'uiux', 'ui/ux', 'ইউআই', 'ইউএক্স', 'ইউআই ডিজাইনার', 'ui designer', 'figma', 'ফিগমা', 'অ্যাপ ডিজাইন', 'app design', 'ইন্টারফেস']
};

/**
 * Clean & normalize string for tolerant bilingual matching
 */
export const normalizeSearchText = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'–—]/g, ' ')
    // Normalize Bengali unicode characters (e.g. য়/য়, ড়/ঢ়)
    .replace(/য়/g, 'য়')
    .replace(/ঢ়/g, 'ড়')
    .replace(/ী/g, 'ি') // normalize long-ee to short-ee for spelling tolerance
    .replace(/ূ/g, 'ু') // normalize long-oo to short-oo
    .replace(/ষ/g, 'শ') // normalize sh to sha
    .replace(/স/g, 'শ') // normalize sa to sha for search flexibility
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Checks if a worker qualifies for a specific Service Category Mode
 */
export const isWorkerInServiceType = (
  worker: UserProfile,
  serviceType: 'physical' | 'digital'
): boolean => {
  // Explicit service category modes
  if (worker.serviceCategoryModes && worker.serviceCategoryModes.length > 0) {
    if (worker.serviceCategoryModes.includes(serviceType)) {
      return true;
    }
  }

  // Check userProfessions items
  if (worker.userProfessions && worker.userProfessions.length > 0) {
    const hasType = worker.userProfessions.some((up) => {
      if (up.categoryMode === serviceType) return true;
      if (serviceType === 'digital') {
        const text = (up.nameBn || up.nameEn || '').toLowerCase();
        return text.includes('গ্রাফিক') || text.includes('graphic') ||
               text.includes('ওয়েব') || text.includes('web') ||
               text.includes('ভিডিও') || text.includes('video') ||
               text.includes('মার্কেটার') || text.includes('marketing') ||
               text.includes('ডিজাইন') || text.includes('design');
      }
      return false;
    });
    if (hasType) return true;
  }

  // Fallback: Infer from professions array
  const allProfText = [
    worker.mainProfession || '',
    ...(worker.professions || []),
    ...(worker.skills || [])
  ].join(' ').toLowerCase();

  const digitalKeywords = [
    'graphic', 'গ্রাফিক', 'designer', 'ডিজাইনার', 'logo', 'লোগো', 
    'web', 'ওয়েব', 'developer', 'ডেভেলপার', 'video', 'ভিডিও', 
    'editor', 'এডিটর', 'marketing', 'মার্কেটিং', 'content', 'কন্টেন্ট', 
    'writer', 'রাইটার', 'ui/ux', 'ইউআই', 'figma', 'ফিগমা', 'seo', 'react', 'photoshop'
  ];

  const hasDigitalSign = digitalKeywords.some((kw) => allProfText.includes(kw));

  if (serviceType === 'digital') {
    return hasDigitalSign;
  } else {
    // Physical is default or explicit
    return !hasDigitalSign || (worker.serviceCategoryModes?.includes('physical') ?? true);
  }
};

/**
 * Calculates a deterministic relevance score for a worker against a search query
 */
export const calculateWorkerRelevance = (
  worker: UserProfile,
  searchQuery: string,
  serviceType: 'physical' | 'digital',
  customerLocation?: CustomerLocationQuery
): { score: number; matchedKeywords: string[]; isMatch: boolean } => {
  const normalizedQuery = normalizeSearchText(searchQuery);
  if (!normalizedQuery) {
    // Base score when query is empty:
    let baseScore = (worker.reviewCount > 0 ? worker.rating : 0) * 10 + (worker.completedJobsCount || 0);
    if (worker.isOnline) baseScore += 50;
    if (worker.verificationStatus === 'verified' || worker.verificationStatus === 'approved') baseScore += 30;
    if (serviceType === 'digital' && worker.portfolio && worker.portfolio.length > 0) baseScore += 25;
    return { score: baseScore, matchedKeywords: [], isMatch: true };
  }

  const queryTokens = normalizedQuery.split(' ').filter((t) => t.length > 1);

  // Expand query with synonyms
  const expandedTokens = new Set<string>(queryTokens);
  queryTokens.forEach((token) => {
    Object.entries(SEARCH_SYNONYM_MAP).forEach(([_, synonyms]) => {
      const isSynonym = synonyms.some((syn) => normalizeSearchText(syn).includes(token) || token.includes(normalizeSearchText(syn)));
      if (isSynonym) {
        synonyms.forEach((s) => expandedTokens.add(normalizeSearchText(s)));
      }
    });
  });

  const matchedKeywords: string[] = [];
  let score = 0;
  let matchesAny = false;

  // 1. Check Profession Match (Highest Weight)
  const professionsList = [
    worker.mainProfession,
    ...(worker.professions || []),
    ...(worker.userProfessions?.flatMap((p) => [p.nameBn, p.nameEn || '']) || []),
    ...(worker.customProfessions?.flatMap((p) => [p.nameBn, p.nameEn || '']) || []),
  ].filter(Boolean) as string[];

  for (const prof of professionsList) {
    const normProf = normalizeSearchText(prof);
    // Exact or phrase match
    if (normProf.includes(normalizedQuery) || normalizedQuery.includes(normProf)) {
      score += 120;
      matchedKeywords.push(prof);
      matchesAny = true;
      break;
    }
    // Token match
    const tokenMatch = Array.from(expandedTokens).some((t) => normProf.includes(t));
    if (tokenMatch) {
      score += 70;
      matchedKeywords.push(prof);
      matchesAny = true;
      break;
    }
  }

  // 2. Check Skills Match (Second Weight)
  const allSkills = [
    ...(worker.skills || []),
    ...(worker.userProfessions?.flatMap((p) => p.skills || []) || []),
  ];

  for (const skill of allSkills) {
    const normSkill = normalizeSearchText(skill);
    if (normSkill.includes(normalizedQuery)) {
      score += 85;
      matchedKeywords.push(skill);
      matchesAny = true;
    } else if (Array.from(expandedTokens).some((t) => normSkill.includes(t))) {
      score += 50;
      matchedKeywords.push(skill);
      matchesAny = true;
    }
  }

  // 3. Check Custom & Search Keywords (Third Weight)
  const allKeywords = [
    ...(worker.searchKeywords || []),
    ...(worker.searchKeywordsNormalized || []),
    ...(worker.userProfessions?.flatMap((p) => [p.description || '', ...(p.skills || [])]) || []),
  ];

  for (const kw of allKeywords) {
    const normKw = normalizeSearchText(kw);
    if (normKw.includes(normalizedQuery) || normalizedQuery.includes(normKw)) {
      score += 65;
      matchedKeywords.push(kw);
      matchesAny = true;
    } else if (Array.from(expandedTokens).some((t) => normKw.includes(t))) {
      score += 40;
      matchedKeywords.push(kw);
      matchesAny = true;
    }
  }

  // 4. Bio & Full Name Match
  const normName = normalizeSearchText(worker.fullName);
  const normBio = normalizeSearchText(worker.bio || '');

  if (normName.includes(normalizedQuery)) {
    score += 40;
    matchesAny = true;
  }
  if (Array.from(expandedTokens).some((t) => normBio.includes(t))) {
    score += 25;
    matchesAny = true;
  }

  // 5. For Physical Services: Service Area & Location match
  if (serviceType === 'physical') {
    const allAreas = [
      worker.presentAddress?.upazila || '',
      worker.presentAddress?.district || '',
      ...(worker.serviceAreas || [])
    ];
    for (const area of allAreas) {
      const normArea = normalizeSearchText(area);
      if (normArea && (normArea.includes(normalizedQuery) || Array.from(expandedTokens).some((t) => normArea.includes(t)))) {
        score += 35;
        matchedKeywords.push(area);
        matchesAny = true;
      }
    }
  }

  // If there is a match, add quality/availability booster bonuses:
  if (matchesAny) {
    // Online booster
    if (worker.isOnline) score += 25;

    // Verified status booster
    if (worker.verificationStatus === 'verified' || worker.verificationStatus === 'approved') {
      score += 20;
    }

    // Rating booster
    score += (worker.reviewCount > 0 ? worker.rating : 0) * 5;

    // Experience booster
    const exp = worker.experiences?.[0]?.years ?? 0;
    score += Math.min(exp, 15) * 2;

    // Digital Specific Boosters
    if (serviceType === 'digital') {
      // Portfolio booster
      if (worker.portfolio && worker.portfolio.length > 0) {
        score += Math.min(worker.portfolio.length * 8, 30);
      }
      // Completed jobs count booster
      score += Math.min((worker.completedJobsCount || 0) * 0.5, 25);
    }

    // Physical Specific Boosters (Location / Distance)
    if (serviceType === 'physical' && customerLocation) {
      const distRes = getWorkerDistanceResult(worker, customerLocation);
      if (distRes.matchType === 'live_gps' && distRes.distanceKm !== undefined) {
        // Closer workers get up to +35
        const proximityBoost = Math.max(0, 35 - distRes.distanceKm * 2.5);
        score += proximityBoost;
      } else if (distRes.matchType === 'upazila_match') {
        score += 25;
      } else if (distRes.matchType === 'service_area_match') {
        score += 20;
      } else if (distRes.matchType === 'district_match') {
        score += 10;
      }
    }
  }

  return {
    score,
    matchedKeywords: Array.from(new Set(matchedKeywords)),
    isMatch: matchesAny
  };
};

/**
 * Formats a safe location string for a worker
 * - Strict Privacy Rule: NEVER expose exact live GPS coordinates of offline workers!
 */
export const getSafeWorkerLocationDisplay = (
  worker: UserProfile,
  serviceType: 'physical' | 'digital'
): string => {
  if (serviceType === 'digital') {
    return 'ডিজিটাল / রিমোট সেবা (সারা বাংলাদেশ)';
  }

  // Check privacy settings
  const addressVis = worker.privacySettings?.addressVisibility || 'area_only';
  if (addressVis === 'city_only') {
    return worker.presentAddress?.district || 'ঢাকা';
  }

  // Safe area display: upazila + district
  const upazila = worker.presentAddress?.upazila;
  const district = worker.presentAddress?.district || 'ঢাকা';

  if (upazila) {
    return `${upazila}, ${district}`;
  }
  if (worker.serviceAreas && worker.serviceAreas.length > 0) {
    return `${worker.serviceAreas[0]}, ${district}`;
  }
  return district;
};
