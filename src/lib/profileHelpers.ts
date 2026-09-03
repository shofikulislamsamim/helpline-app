import { UserProfile } from '../types';

export interface MissingProfileItem {
  id: string;
  labelBn: string;
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

  // 1. Full Name (10%)
  if (profile.fullName && profile.fullName.trim().length > 2) {
    score += 10;
  } else {
    missingItems.push({ id: 'name', labelBn: 'আপনার পূর্ণ নাম যুক্ত করুন', weight: 10 });
  }

  // 2. Profile Photo (10%)
  if (profile.avatarUrl && profile.avatarUrl.trim().length > 0) {
    score += 10;
  } else {
    missingItems.push({ id: 'photo', labelBn: 'প্রোফাইল ছবি আপলোড করুন', weight: 10 });
  }

  // 3. Mobile Number (10%)
  if (profile.phoneNumber && profile.phoneNumber.trim().length >= 10) {
    score += 10;
  } else {
    missingItems.push({ id: 'phone', labelBn: 'সচল মোবাইল নম্বর দিন', weight: 10 });
  }

  // 4. Email (5%)
  if (profile.email && profile.email.includes('@')) {
    score += 5;
  } else {
    missingItems.push({ id: 'email', labelBn: 'যোগাযোগের ইমেইল যুক্ত করুন', weight: 5 });
  }

  // 5. Present Address (15%)
  const hasAddr =
    profile.presentAddress?.division &&
    profile.presentAddress?.district &&
    profile.presentAddress?.upazila;
  if (hasAddr) {
    score += 15;
  } else {
    missingItems.push({ id: 'address', labelBn: 'বর্তমান ঠিকানা (বিভাগ, জেলা, উপজেলা) পূরণ করুন', weight: 15 });
  }

  // 6. Bio / About (10%)
  if (profile.bio && profile.bio.trim().length > 10) {
    score += 10;
  } else {
    missingItems.push({ id: 'bio', labelBn: 'নিজের বা কাজের সংক্ষিপ্ত বিবরণ (Bio) লিখুন', weight: 10 });
  }

  // 7. Roles & Capabilities (10%)
  const caps = profile.capabilities || profile.roles || [];
  if (caps.length > 0) {
    score += 10;
  } else {
    missingItems.push({ id: 'roles', labelBn: 'কী কী কাজ করতে চান (Capabilities) সিলেক্ট করুন', weight: 10 });
  }

  // 8. Professions & Skills (10%)
  const isWorker = caps.includes('worker');
  if (isWorker) {
    if (profile.professions?.length > 0 && profile.skills?.length > 0) {
      score += 10;
    } else {
      missingItems.push({ id: 'skills', labelBn: 'পেশা এবং সংশ্লিষ্ট কাজের দক্ষতা যুক্ত করুন', weight: 10 });
    }
  } else {
    // Non-workers automatically receive full marks if they have any basic selection
    score += 10;
  }

  // 9. Experience / Work History (10%)
  const hasExp =
    (profile.experiences && profile.experiences.length > 0) ||
    (profile.workHistories && profile.workHistories.length > 0);
  if (hasExp) {
    score += 10;
  } else {
    missingItems.push({ id: 'experience', labelBn: 'কাজের অভিজ্ঞতা বা পূর্ববর্তী কাজের ইতিহাস দিন', weight: 10 });
  }

  // 10. Service Area (10%)
  if (profile.serviceAreas && profile.serviceAreas.length > 0) {
    score += 10;
  } else {
    missingItems.push({ id: 'serviceArea', labelBn: 'সেবা প্রদানের এলাকা (Service Area) নির্বাচন করুন', weight: 10 });
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
