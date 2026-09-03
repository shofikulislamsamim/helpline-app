import { 
  VerificationStatus, 
  DriverVerificationStatus, 
  IdentityDocumentType, 
  VerificationRequest 
} from '../types';

/**
 * Mask sensitive numbers for privacy.
 * Example: NID 1990123456789 -> ******6789
 */
export function maskDocumentNumber(docNum?: string): string {
  if (!docNum) return '******';
  const clean = docNum.trim();
  if (clean.length <= 4) return '****';
  const lastFour = clean.slice(-4);
  return '******' + lastFour;
}

/**
 * Convert Bengali digits (০-৯) to English digits (0-9) for standard validation
 */
export function convertBnToEnDigits(str: string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[০-৯]/g, (d) => String(bnDigits.indexOf(d)));
}

/**
 * Validate NID format:
 * - 10 digits (Smart Card)
 * - 13 digits (Old NID)
 * - 17 digits (Birth year + 13 digits)
 */
export function validateNidNumber(num: string): { isValid: boolean; errorBn?: string } {
  if (!num || !num.trim()) {
    return { isValid: false, errorBn: 'এনআইডি নম্বর প্রদান করুন' };
  }
  const clean = convertBnToEnDigits(num.replace(/[\s-]/g, ''));
  if (!/^\d+$/.test(clean)) {
    return { isValid: false, errorBn: 'এনআইডি নম্বরে শুধু সংখ্যা হতে হবে' };
  }
  if (clean.length !== 10 && clean.length !== 13 && clean.length !== 17) {
    return { 
      isValid: false, 
      errorBn: 'এনআইডি নম্বর ১০ ডিজিট (স্মার্ট কার্ড) অথবা ১৩/১৭ ডিজিট হতে হবে' 
    };
  }
  return { isValid: true };
}

/**
 * Validate Birth Registration format:
 * - 17 digits online birth certificate
 */
export function validateBirthRegNumber(num: string): { isValid: boolean; errorBn?: string } {
  if (!num || !num.trim()) {
    return { isValid: false, errorBn: 'জন্ম নিবন্ধন নম্বর প্রদান করুন' };
  }
  const clean = convertBnToEnDigits(num.replace(/[\s-]/g, ''));
  if (!/^\d+$/.test(clean)) {
    return { isValid: false, errorBn: 'জন্ম নিবন্ধন নম্বরে শুধু সংখ্যা হতে হবে' };
  }
  if (clean.length !== 17) {
    return { isValid: false, errorBn: 'অনলাইন জন্ম নিবন্ধন নম্বর ১৭ ডিজিট হতে হবে' };
  }
  return { isValid: true };
}

/**
 * Validate Passport Number:
 * - 8 to 9 alphanumeric chars
 */
export function validatePassportNumber(num: string): { isValid: boolean; errorBn?: string } {
  if (!num || !num.trim()) {
    return { isValid: false, errorBn: 'পাসপোর্ট নম্বর প্রদান করুন' };
  }
  const clean = num.replace(/[\s-]/g, '').toUpperCase();
  if (clean.length < 8 || clean.length > 9) {
    return { isValid: false, errorBn: 'পাসপোর্ট নম্বর ৮ বা ৯ অক্ষরের হতে হবে (যেমন: A12345678 বা EE0123456)' };
  }
  return { isValid: true };
}

/**
 * Validate Driving License Number:
 * - 8 to 16 alphanumeric characters
 */
export function validateDrivingLicenseNumber(num: string): { isValid: boolean; errorBn?: string } {
  if (!num || !num.trim()) {
    return { isValid: false, errorBn: 'ড্রাইভিং লাইসেন্স নম্বর প্রদান করুন' };
  }
  const clean = num.replace(/[\s-]/g, '').toUpperCase();
  if (clean.length < 7 || clean.length > 18) {
    return { isValid: false, errorBn: 'সঠিক ড্রাইভিং লাইসেন্স নম্বর প্রদান করুন (যেমন: DK0123456)' };
  }
  return { isValid: true };
}

/**
 * Get user-facing status details & colors
 */
export function getVerificationStatusInfo(status: VerificationStatus) {
  switch (status) {
    case 'approved':
    case 'verified':
      return {
        labelBn: 'যাচাই সম্পন্ন (Approved)',
        color: 'emerald',
        icon: '✓',
        badgeBg: 'bg-emerald-100 border-emerald-300 text-emerald-800',
        dotColor: 'bg-emerald-500',
        descriptionBn: 'আপনার জাতীয় পরিচয়পত্র HelpLine ভেরিফিকেশন টিম কর্তৃক সফলভাবে অনুমোদিত হয়েছে।'
      };
    case 'under_review':
      return {
        labelBn: 'যাচাই করা হচ্ছে (Under Review)',
        color: 'blue',
        icon: '🔍',
        badgeBg: 'bg-blue-100 border-blue-300 text-blue-800',
        dotColor: 'bg-blue-500',
        descriptionBn: 'HelpLine ভেরিফিকেশন টিম বর্তমানে আপনার দাখিলকৃত তথ্য ও নথি পর্যালোচনা করছে।'
      };
    case 'pending':
      return {
        labelBn: 'যাচাইয়ের জন্য জমা দেওয়া হয়েছে (Pending)',
        color: 'amber',
        icon: '⏳',
        badgeBg: 'bg-amber-100 border-amber-300 text-amber-800',
        dotColor: 'bg-amber-500',
        descriptionBn: 'আপনার ভেরিফিকেশন রিকোয়েস্ট জমা হয়েছে। শীঘ্রই অ্যাডমিন এটি পর্যালোচনা করবেন।'
      };
    case 'rejected':
      return {
        labelBn: 'যাচাই প্রত্যাখ্যাত (Rejected)',
        color: 'rose',
        icon: '✕',
        badgeBg: 'bg-rose-100 border-rose-300 text-rose-800',
        dotColor: 'bg-rose-500',
        descriptionBn: 'দাখিলকৃত তথ্যে গরমিল বা অস্পষ্টতার কারণে আবেদনটি সাময়িক প্রত্যাখ্যাত হয়েছে।'
      };
    case 'reverification_required':
      return {
        labelBn: 'পুনরায় যাচাই প্রয়োজন (Re-verification Required)',
        color: 'purple',
        icon: '↻',
        badgeBg: 'bg-purple-100 border-purple-300 text-purple-800',
        dotColor: 'bg-purple-500',
        descriptionBn: 'তথ্য হালনাগাদ বা ডকুমেন্টের স্পষ্ট ছবি দিয়ে পুনরায় জমা দেওয়ার অনুরোধ করা হয়েছে।'
      };
    case 'not_submitted':
    case 'unverified':
    default:
      return {
        labelBn: 'এখনও জমা দেওয়া হয়নি (Not Submitted)',
        color: 'slate',
        icon: '⚠️',
        badgeBg: 'bg-slate-100 border-slate-300 text-slate-700',
        dotColor: 'bg-slate-400',
        descriptionBn: 'আপনার প্রোফাইল এখনও অযাচাইকৃত। মার্কেটপ্লেসে সম্পূর্ণ সক্রিয় হতে এখনই পরিচয়পত্র জমা দিন।'
      };
  }
}

export function getDriverVerificationStatusInfo(status?: DriverVerificationStatus) {
  switch (status) {
    case 'approved':
      return {
        labelBn: 'ড্রাইভার ভেরিফাইড (Driver Approved)',
        icon: '🚗 ✓',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        isAllowedToDrive: true
      };
    case 'pending':
      return {
        labelBn: 'লাইসেন্স যাচাই অপেক্ষমান',
        icon: '🚗 ⏳',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        isAllowedToDrive: false
      };
    case 'rejected':
      return {
        labelBn: 'লাইসেন্স প্রত্যাখ্যাত',
        icon: '🚗 ✕',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
        isAllowedToDrive: false
      };
    case 'reverification_required':
      return {
        labelBn: 'লাইসেন্স পুনরায় যাচাই প্রয়োজন',
        icon: '🚗 ↻',
        badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
        isAllowedToDrive: false
      };
    case 'not_required':
    default:
      return {
        labelBn: 'লাইসেন্স যাচাই করা হয়নি',
        icon: '🚗 ⚠️',
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
        isAllowedToDrive: false
      };
  }
}

export function getDocumentTypeInfo(type: IdentityDocumentType) {
  switch (type) {
    case 'nid':
      return {
        nameBn: 'জাতীয় পরিচয়পত্র (NID / স্মার্ট কার্ড)',
        icon: '🪪',
        shortBn: 'এনআইডি',
        subtitleBn: '১০ ডিজিটের স্মার্ট কার্ড অথবা ১৩/১৭ ডিজিটের জাতীয় পরিচয়পত্র',
        placeholder: 'যেমন: 1990123456789 বা 1234567890',
        example: '১০ বা ১৩/১৭ সংখ্যা'
      };
    case 'birth_registration':
      return {
        nameBn: 'জন্ম নিবন্ধন সনদ (Birth Registration)',
        icon: '📄',
        shortBn: 'জন্ম নিবন্ধন',
        subtitleBn: '১৭ ডিজিটের অনলাইন ডিজিটাল জন্ম নিবন্ধন সনদ',
        placeholder: 'যেমন: 20001234567890123',
        example: '১৭ ডিজিটের নম্বর'
      };
    case 'passport':
      return {
        nameBn: 'আন্তর্জাতিক পাসপোর্ট (Passport)',
        icon: '🛂',
        shortBn: 'পাসপোর্ট',
        subtitleBn: 'বাংলাদেশ ই-পাসপোর্ট বা মেশিন রিডেবল পাসপোর্ট',
        placeholder: 'যেমন: A12345678 বা EE0123456',
        example: '৮ বা ৯ অক্ষরের কোড'
      };
    case 'driving_license':
      return {
        nameBn: 'ড্রাইভিং লাইসেন্স (Driving License)',
        icon: '🚗',
        shortBn: 'ড্রাইভিং লাইসেন্স',
        subtitleBn: 'বিআরটিএ কর্তৃক ইস্যুকৃত প্রফেশনাল বা নন-প্রফেশনাল লাইসেন্স',
        placeholder: 'যেমন: DK0123456 বা BRTA লাইসেন্স নম্বর',
        example: 'বিআরটিএ রেফারেন্স নম্বর'
      };
  }
}

/**
 * Optimize / Compress image to lightweight Base64 data URL
 * Fits smoothly within Firestore document size limits (< 250KB)
 */
export async function compressImageFile(
  file: File, 
  maxWidth = 1200, 
  maxHeight = 1200, 
  quality = 0.80
): Promise<{ dataUrl: string; sizeBytes: number; fileName: string; fileType: string }> {
  return new Promise((resolve, reject) => {
    // If PDF, convert directly as base64 without canvas
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve({
          dataUrl,
          sizeBytes: file.size,
          fileName: file.name,
          fileType: 'application/pdf'
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Fill white background for transparent PNG conversion to JPEG
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      // approximate base64 bytes
      const approxBytes = Math.round((compressedDataUrl.length * 3) / 4);

      resolve({
        dataUrl: compressedDataUrl,
        sizeBytes: approxBytes,
        fileName: file.name.replace(/\.[^/.]+$/, "") + '.jpg',
        fileType: 'image/jpeg'
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('ইমেজ লোড করতে ব্যর্থ হয়েছে'));
    };

    img.src = objectUrl;
  });
}

/**
 * Standard Rejection Reasons for Admin Panel
 */
export const REJECTION_REASONS = [
  'তথ্যের সাথে ডকুমেন্টের মিল নেই',
  'ডকুমেন্টের ছবি পরিষ্কার নয়',
  'ডকুমেন্টের তথ্য অসম্পূর্ণ',
  'ডকুমেন্টের মেয়াদ শেষ',
  'ভুল ডকুমেন্ট জমা দেওয়া হয়েছে',
  'অন্যান্য (বিস্তারিত নিচে লিখুন)',
];

/**
 * Initial sample verification requests to seed the Admin Verification Center
 * for instant testing and auditing
 */
export const SAMPLE_SEED_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'HLV-10021',
    userId: 'user-02-karim',
    userName: 'আব্দুল করিম',
    userPhone: '০১৭১১-২২৩৩৪৪',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    userAddress: 'বাড়ি ৫, রোড ২, মিরপুর-১২, ঢাকা',
    userCapabilities: ['worker', 'customer'],
    userProfessions: ['প্লাম্বার (Plumber)', 'পাইপ ফিটিংস'],
    documentType: 'nid',
    documentNumber: '19882691234567890',
    documentNumberMasked: '******7890',
    submittedInformation: {
      fullName: 'আব্দুল করিম',
      dateOfBirth: '1988-04-12',
      documentNumber: '19882691234567890',
      fatherOrSpouseName: 'মোঃ মনসুর আলী',
      bloodGroup: 'B+'
    },
    documentFiles: {
      frontUrl: 'https://images.unsplash.com/photo-1589330694653-dad6ef0140be?w=600&auto=format&fit=crop',
      frontFileName: 'nid_front.jpg',
      frontFileType: 'image/jpeg',
      backUrl: 'https://images.unsplash.com/photo-1589330694653-dad6ef0140be?w=600&auto=format&fit=crop',
      backFileName: 'nid_back.jpg',
      backFileType: 'image/jpeg'
    },
    status: 'pending',
    submittedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    verificationVersion: 1,
    policyAgreed: true,
    policyAgreedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString()
  },
  {
    id: 'HLV-10022',
    userId: 'user-03-tareq',
    userName: 'তারেক মাহমুদ',
    userPhone: '০১৮২২-৩৩৪৪৫৫',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    userAddress: 'জিইসি মোড়, চকবাজার, চট্টগ্রাম',
    userCapabilities: ['driver', 'delivery_rider'],
    userProfessions: ['ড্রাইভার (Driver)', 'মোটর মেকানিক'],
    documentType: 'driving_license',
    documentNumber: 'DK08945621',
    documentNumberMasked: '******5621',
    submittedInformation: {
      fullName: 'তারেক মাহমুদ',
      dateOfBirth: '1992-08-20',
      documentNumber: 'DK08945621',
      issueDate: '2021-02-15',
      expiryDate: '2031-02-14',
      licenseType: 'professional',
      bloodGroup: 'O+'
    },
    documentFiles: {
      frontUrl: 'https://images.unsplash.com/photo-1589330694653-dad6ef0140be?w=600&auto=format&fit=crop',
      frontFileName: 'license_front.jpg',
      frontFileType: 'image/jpeg',
      backUrl: 'https://images.unsplash.com/photo-1589330694653-dad6ef0140be?w=600&auto=format&fit=crop',
      backFileName: 'license_back.jpg',
      backFileType: 'image/jpeg'
    },
    status: 'under_review',
    submittedAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
    reviewedBy: {
      adminId: 'admin-01',
      adminName: 'Super Admin',
      role: 'super_admin'
    },
    verificationVersion: 1,
    policyAgreed: true,
    policyAgreedAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
  },
  {
    id: 'HLV-10020',
    userId: 'user-04-shahid',
    userName: 'শহীদুল ইসলাম',
    userPhone: '০১৯৩৩-৪৫৫৫৬৬',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
    userAddress: 'উপশহর, বোয়ালিয়া, রাজশাহী',
    userCapabilities: ['worker'],
    userProfessions: ['রং মিস্ত্রি (Painter)'],
    documentType: 'birth_registration',
    documentNumber: '19955412345678901',
    documentNumberMasked: '******8901',
    submittedInformation: {
      fullName: 'শহীদুল ইসলাম',
      dateOfBirth: '1995-11-05',
      documentNumber: '19955412345678901',
      fatherOrSpouseName: 'মোঃ আব্দুল জব্বার'
    },
    documentFiles: {
      docUrl: 'https://images.unsplash.com/photo-1589330694653-dad6ef0140be?w=600&auto=format&fit=crop',
      docFileName: 'birth_certificate.jpg',
      docFileType: 'image/jpeg'
    },
    status: 'rejected',
    rejectionReason: 'ডকুমেন্টের ছবি পরিষ্কার নয়',
    adminFeedback: 'অনুগ্রহ করে আলোতে পরিষ্কারভাবে ডিজিটাল জন্ম সনদের পুরো পাতা স্ক্যান বা ছবি তুলে পুনরায় আপলোড করুন।',
    submittedAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    reviewedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    reviewedBy: {
      adminId: 'admin-01',
      adminName: 'Super Admin',
      role: 'super_admin'
    },
    verificationVersion: 1,
    policyAgreed: true,
    policyAgreedAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString()
  },
  {
    id: 'HLV-10019',
    userId: 'user-05-nasir',
    userName: 'নাসির উদ্দিন',
    userPhone: '০১৭৪৪-৫৫৬৬৭৭',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop',
    userAddress: 'চৌহাট্টা, সিলেট সদর, সিলেট',
    userCapabilities: ['worker', 'seller'],
    userProfessions: ['কার্পেন্টার (কাঠমিস্ত্রি)'],
    documentType: 'nid',
    documentNumber: '7845129630',
    documentNumberMasked: '******9630',
    submittedInformation: {
      fullName: 'নাসির উদ্দিন',
      dateOfBirth: '1984-06-18',
      documentNumber: '7845129630',
      bloodGroup: 'A+'
    },
    documentFiles: {
      frontUrl: 'https://images.unsplash.com/photo-1589330694653-dad6ef0140be?w=600&auto=format&fit=crop',
      frontFileName: 'smart_card_front.jpg',
      frontFileType: 'image/jpeg',
      backUrl: 'https://images.unsplash.com/photo-1589330694653-dad6ef0140be?w=600&auto=format&fit=crop',
      backFileName: 'smart_card_back.jpg',
      backFileType: 'image/jpeg'
    },
    status: 'approved',
    submittedAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    reviewedAt: new Date(Date.now() - 3600 * 1000 * 50).toISOString(),
    reviewedBy: {
      adminId: 'admin-02',
      adminName: 'Verification Admin',
      role: 'verification_admin'
    },
    verificationVersion: 1,
    policyAgreed: true,
    policyAgreedAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 50).toISOString()
  }
];
