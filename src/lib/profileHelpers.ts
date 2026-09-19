import { UserProfile } from '../types';

export interface MissingProfileItem {
  id: string;
  labelBn: string;
  labelEn: string;
  weight: number;
}

export interface ProfileCompletionResult {
  percentage: number;
  missingItems: MissingProfileItem[];
  isComplete: boolean;
}

export function calculateProfileCompletion(profile: UserProfile): ProfileCompletionResult {
  let score = 0;
  const missingItems: MissingProfileItem[] = [];

  // 1. Full Name (8%)
  if (profile.fullName && profile.fullName.trim().length > 2) {
    score += 8;
  } else {
    missingItems.push({ id: 'name', labelBn: 'আপনার পূর্ণ নাম লিখুন', labelEn: 'Enter your full name', weight: 8 });
  }

  // 2. Profile Photo (8%)
  if (profile.avatarUrl && profile.avatarUrl.trim().length > 0) {
    score += 8;
  } else {
    missingItems.push({ id: 'photo', labelBn: 'একটি স্পষ্ট প্রোফাইল ছবি যুক্ত করুন', labelEn: 'Add a clear profile photo', weight: 8 });
  }

  // 3. Mobile Number (8%)
  if (profile.phoneNumber && profile.phoneNumber.trim().length >= 10) {
    score += 8;
  } else {
    missingItems.push({ id: 'phone', labelBn: 'সচল মোবাইল নম্বর প্রদান করুন', labelEn: 'Provide active phone number', weight: 8 });
  }

  // 4. Email (4%)
  if (profile.email && profile.email.includes('@')) {
    score += 4;
  } else {
    missingItems.push({ id: 'email', labelBn: 'যোগাযোগের ইমেইল অ্যাড্রেস যুক্ত করুন', labelEn: 'Add contact email address', weight: 4 });
  }

  // 5. Bio / About (6%)
  if (profile.bio && profile.bio.trim().length > 10) {
    score += 6;
  } else {
    missingItems.push({ id: 'bio', labelBn: 'নিজের বা আপনার সেবার সংক্ষিপ্ত বিবরণ (Bio) লিখুন', labelEn: 'Write a short bio or description', weight: 6 });
  }

  // 6. Present Address (10%)
  const hasAddr =
    profile.presentAddress?.division &&
    profile.presentAddress?.district &&
    profile.presentAddress?.upazila;
  if (hasAddr) {
    score += 10;
  } else {
    missingItems.push({ id: 'address', labelBn: 'বর্তমান ঠিকানা (বিভাগ, জেলা, উপজেলা) সম্পূর্ণ করুন', labelEn: 'Complete present address (division, district, upazila)', weight: 10 });
  }

  // 7. GPS Location (5%)
  if (profile.currentLocation?.latitude && profile.currentLocation?.longitude) {
    score += 5;
  } else {
    missingItems.push({ id: 'location', labelBn: 'লাইভ জিপিএস লোকেশন পারমিশন চালু করুন', labelEn: 'Enable live GPS location permission', weight: 5 });
  }

  // 8. Roles & Capabilities (8%)
  const caps = profile.capabilities || profile.roles || [];
  if (caps.length > 0) {
    score += 8;
  } else {
    missingItems.push({ id: 'roles', labelBn: 'কী কী কাজ করতে চান (Capabilities) নির্বাচন করুন', labelEn: 'Select what you want to do (Capabilities)', weight: 8 });
  }

  // 9. Professions & Main Profession (8%)
  if (profile.professions && profile.professions.length > 0) {
    score += 8;
  } else {
    missingItems.push({ id: 'professions', labelBn: 'কমপক্ষে একটি পেশা এবং প্রধান পেশা নির্বাচন করুন', labelEn: 'Select at least one profession and main profession', weight: 8 });
  }

  // 10. Skills (6%)
  if (profile.skills && profile.skills.length > 0) {
    score += 6;
  } else {
    missingItems.push({ id: 'skills', labelBn: 'আপনার কাজের পারদর্শিতা ও দক্ষতার ট্যাগ যুক্ত করুন', labelEn: 'Add skill tags', weight: 6 });
  }

  // 11. Service Types (5%)
  if (profile.serviceTypes && profile.serviceTypes.length > 0) {
    score += 5;
  } else {
    missingItems.push({ id: 'serviceTypes', labelBn: 'সার্ভিসের ধরন (জরুরি/দৈনিক/চুক্তিভিত্তিক) নির্বাচন করুন', labelEn: 'Select service types (emergency/daily/contract)', weight: 5 });
  }

  // 12. Search Keywords (4%)
  if (profile.searchKeywords && profile.searchKeywords.length > 0) {
    score += 4;
  } else {
    missingItems.push({ id: 'keywords', labelBn: 'সার্চ কিওয়ার্ডস ও লোকাল ট্যাগ যুক্ত করুন', labelEn: 'Add search keywords and local tags', weight: 4 });
  }

  // 13. Experience / Work History (6%)
  const hasExp =
    (profile.experiences && profile.experiences.length > 0) ||
    (profile.workHistories && profile.workHistories.length > 0);
  if (hasExp) {
    score += 6;
  } else {
    missingItems.push({ id: 'experience', labelBn: 'কাজের অভিজ্ঞতা বা পূর্ববর্তী চাকরির রেকর্ড যুক্ত করুন', labelEn: 'Add work experience or employment record', weight: 6 });
  }

  // 14. Service Area (6%)
  if (profile.serviceAreas && profile.serviceAreas.length > 0) {
    score += 6;
  } else {
    missingItems.push({ id: 'serviceArea', labelBn: 'সেবা প্রদানের এলাকা (Service Area) নির্বাচন করুন', labelEn: 'Select service areas', weight: 6 });
  }

  // 15. Portfolio (4%)
  if (profile.portfolio && profile.portfolio.length > 0) {
    score += 4;
  } else {
    missingItems.push({ id: 'portfolio', labelBn: 'সম্পন্ন কাজের স্যাম্পল ছবি বা পোর্টফোলিও যুক্ত করুন', labelEn: 'Add work samples or portfolio pictures', weight: 4 });
  }

  // 16. Pricing / Rate Card (2%)
  if (profile.pricing && (profile.pricing.hourlyRate || profile.pricing.dailyRate || profile.pricing.visitFee)) {
    score += 2;
  } else {
    missingItems.push({ id: 'pricing', labelBn: 'আপনার কাজের মূল্য ও রেট চার্ট নির্ধারণ করুন', labelEn: 'Set pricing and rate chart', weight: 2 });
  }

  const finalScore = Math.min(100, Math.max(0, score));

  return {
    percentage: finalScore,
    missingItems,
    isComplete: finalScore >= 80,
  };
}

/**
 * Validates Bangladeshi Phone numbers:
 * 01XXXXXXXXX (11 digits), or with +880 prefix
 */
export function isValidBdPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-]/g, '');
  const bdRegex = /^(?:\+?8801|01)[3-9]\d{8}$/;
  return bdRegex.test(cleaned);
}
