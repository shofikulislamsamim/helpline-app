/**
 * Centralized Bengali-First Localization Dictionary for HelpLine
 * Provides Bengali labels with standard English tech terms (Profile, Online, Offline, Chat, Call, Search, Filter, Dashboard, Admin, OTP, Status).
 */

export const i18n = {
  appName: 'HelpLine',
  appTagline: 'বাংলাদেশের অল-ইন-ওয়ান লোকাল মার্কেটপ্লেস',
  
  // Navigation
  nav: {
    home: 'হোম',
    search: 'Search',
    messages: 'Chat',
    activity: 'কার্যক্রম',
    profile: 'Profile',
    admin: 'Admin',
    hotline: 'Hotline',
    notifications: 'নোটিফিকেশন',
    policies: 'নীতিমালা',
  },

  // Home Screen
  home: {
    questionPrompt: 'আপনি কী করতে চান?',
    searchPlaceholder: 'কর্মী, কাজ, চাকরি, পণ্য বা রাইড Search করুন...',
    currentLocationPrefix: 'আপনার লোকেশন',
    changeLocation: 'পরিবর্তন',
    safetyDisclaimer: 'HelpLine একটি সংযোগকারী প্ল্যাটফর্ম। কাজের চুক্তি বা আর্থিক লেনদেনের পূর্বে উভয় পক্ষ নিজ দায়িত্বে যাচাই করে নিন।',
    safetyTitle: 'সতর্কতা ও নিরাপত্তা',
    quickHotlineText: 'জরুরি সাহায্য ও সহায়তার জন্য HelpLine হটলাইনে Call করুন:',
    supportCallBtn: 'Hotline এ Call করুন',
  },

  // Six primary service cards
  modules: {
    hire: {
      title: 'Hire',
      subtitle: 'কাজের মানুষ খুঁজুন',
      badge: 'টেকনিশিয়ান ও মিস্ত্রি',
      description: 'ইলেকট্রিশিয়ান, প্লাম্বার, এসি টেকনিশিয়ান, রঙের মিস্ত্রি, রাজমিস্ত্রি ও গৃহকর্মী সরাসরি খুঁজুন।',
    },
    work: {
      title: 'Work',
      subtitle: 'কাজ করুন',
      badge: 'কাজের সুযোগ',
      description: 'আপনার কাজের দক্ষতা যোগ করুন, কাস্টমারদের সরাসরি সাড়া দিন এবং স্বাধীনভাবে আয় করুন।',
    },
    jobs: {
      title: 'Jobs',
      subtitle: 'চাকরি খুঁজুন / চাকরি দিন',
      badge: 'ফুল-টাইম ও পার্ট-টাইম',
      description: 'দোকান, অফিস, ড্রাইভিং, সিকিউরিটি ও স্থানীয় প্রতিষ্ঠানে চাকরি খুঁজুন বা নতুন লোক নিয়োগ দিন।',
    },
    ride: {
      title: 'Ride',
      subtitle: 'রাইড নিন',
      badge: 'বাইক ও সিএনজি',
      description: 'নিকটবর্তী বিশ্বস্ত বাইক, সিএনজি বা গাড়ি চালকদের সাথে দ্রুত সরাসরি যোগাযোগ করুন।',
    },
    delivery: {
      title: 'Send',
      subtitle: 'কিছু পাঠান',
      badge: 'পার্সেল ও কুরিয়ার',
      description: 'শহরের মধ্যে যেকোনো পার্সেল, জরুরি ডকুমেন্ট বা খাদ্যদ্রব্য নির্ভরযোগ্য রাইডারে পাঠান।',
    },
    buysell: {
      title: 'Buy & Sell',
      subtitle: 'কিনুন / বিক্রি করুন',
      badge: 'স্থানীয় কেনাবেচা',
      description: 'মোবাইল, আসবাবপত্র, ইলেকট্রনিক্স বা দরকারি পণ্য সরাসরি স্থানীয় মানুষের সাথে কেনাবেচা করুন।',
    },
  },

  // Common UI words
  common: {
    online: 'Online',
    offline: 'Offline',
    onlineStatusText: 'আমি এখন কাজের জন্য Available',
    offlineStatusText: 'আমি এখন কাজের জন্য Available নই',
    filter: 'Filter',
    status: 'Status',
    dashboard: 'Dashboard',
    otp: 'OTP',
    verified: 'ভেরিফাইড',
    unverified: 'অযাচাইকৃত',
    pending: 'অপেক্ষমান (Pending)',
    login: 'লগইন করুন',
    loginGoogle: 'Google দিয়ে লগইন করুন',
    loginDemo: 'ডেমো ইউজার হিসেবে লগইন',
    logout: 'লগআউট',
    viewAll: 'সবগুলো দেখুন',
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল',
    back: 'ফিরে যান',
    loading: 'লোড হচ্ছে...',
    free: 'ফ্রি (FREE)',
    bdtSymbol: '৳',
    placeholderRoadmapNote: 'এই ফিচারটি পরবর্তী ধাপে যুক্ত হবে।',
    verifiedPlatformNote: 'প্ল্যাটফর্ম ভেরিফিকেশন কোনো ইউজারের ভবিষ্যৎ সততা বা কাজের মানের নিশ্চয়তা দেয় না। সতর্কতা অবলম্বন করুন।',
  },

  // Profile View
  profile: {
    mainProfileTitle: 'মেইন Profile',
    ratingLabel: 'রেটিং',
    reviewCountLabel: 'রিভিউ',
    jobsDoneLabel: 'সম্পন্ন কাজ',
    joinedLabel: 'যোগদান',
    availabilityTitle: 'কাজের প্রাপ্যতা (Availability)',
    rolesTitle: 'সক্রিয় রোল ও সক্ষমতা',
    skillsTitle: 'দক্ষতা ও পেশা (Skills & Professions)',
    addressTitle: 'বর্তমান ঠিকানা (Present Address)',
    verificationSection: 'আইডি ও এনআইডি ভেরিফিকেশন',
    verifyActionBtn: 'ভেরিফিকেশন সম্পন্ন করুন',
    subscriptionStatusTitle: 'সাবস্ক্রিপশন প্যাকেজ',
    activePlanText: 'বর্তমান প্ল্যান:',
    bengaliLanguage: 'বাংলা (ডিফল্ট)',
  },

  // Admin Area
  admin: {
    title: 'HelpLine Admin Panel',
    subtitle: 'ব্যবসা ও প্ল্যাটফর্ম নিয়ন্ত্রণ ব্যবস্থা',
    kpiUsers: 'মোট ইউজার',
    kpiPendingVerification: 'পেন্ডিং ভেরিফিকেশন',
    kpiActiveServices: 'সক্রিয় সার্ভিস রিকোয়েস্ট',
    kpiManualPayments: 'ম্যানুয়াল পেমেন্ট রিকোয়েস্ট',
    switchNotice: 'অ্যাডমিন নিয়ন্ত্রণ: স্বাভাবিক ব্যবসায়িক পরিবর্তনের জন্য মালিককে ডেভেলপারদের উপর নির্ভরশীল হতে হবে না।',
    menu: {
      dashboard: 'Dashboard',
      users: 'Users (ব্যবহারকারী)',
      verification: 'Verification (যাচাইকরণ)',
      categories: 'Categories (ক্যাটাগরি)',
      hireWork: 'Hire & Work',
      jobs: 'Jobs (চাকরি)',
      ride: 'Ride (যাতায়াত)',
      delivery: 'Delivery (পার্সেল)',
      buySell: 'Buy & Sell (কেনাবেচা)',
      subscription: 'Subscription (প্যাকেজ)',
      payments: 'Payments (ম্যানুয়াল পেমেন্ট)',
      reviews: 'Reviews & Ratings',
      complaints: 'Complaints (অভিযোগ)',
      liveSupport: 'Live Support (সহায়তা)',
      notifications: 'Notifications (বিজ্ঞপ্তি)',
      policies: 'Policies (নীতিমালা)',
      content: 'Content Management',
      analytics: 'Analytics (পরিসংখ্যান)',
      globalSettings: 'Global Settings',
      adminRoles: 'Admin Roles (ভূমিকা)',
    },
  },
};
