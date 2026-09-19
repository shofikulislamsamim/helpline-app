/**
 * Complete Bengali & English Localization Dictionary for HelpLine App
 * Strict Rule: When Bengali is selected, 100% UI is Bengali.
 * When English is selected, 100% UI is English.
 * User-entered content remains untouched.
 */

export type Language = 'bn' | 'en';

export interface TranslationSchema {
  nav: {
    home: string;
    hire: string;
    work: string;
    jobs: string;
    ride: string;
    delivery: string;
    buysell: string;
    search: string;
    messages: string;
    activity: string;
    profile: string;
    verification: string;
    policies: string;
    admin: string;
    hotline: string;
    notifications: string;
    language: string;
    changeLanguage: string;
    selectLanguage: string;
    bengali: string;
    english: string;
    mainModules: string;
    adminAccess: string;
    adminDashboard: string;
    footerTerms: string;
    footerTagline: string;
  };
  common: {
    online: string;
    offline: string;
    onlineStatusText: string;
    offlineStatusText: string;
    filter: string;
    status: string;
    dashboard: string;
    verified: string;
    unverified: string;
    pending: string;
    underReview: string;
    rejected: string;
    completed: string;
    inProgress: string;
    login: string;
    register: string;
    logout: string;
    viewAll: string;
    viewDetails: string;
    save: string;
    cancel: string;
    back: string;
    edit: string;
    delete: string;
    search: string;
    loading: string;
    free: string;
    bdtSymbol: string;
    contact: string;
    call: string;
    message: string;
    address: string;
    division: string;
    district: string;
    upazila: string;
    yes: string;
    no: string;
    close: string;
    confirm: string;
    submit: string;
    continue: string;
    send: string;
    rating: string;
    reviews: string;
    jobsDone: string;
    joined: string;
    all: string;
    reset: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    phone: string;
    email: string;
    notes: string;
    km: string;
    meters: string;
    minutes: string;
    hours: string;
    days: string;
    emergency: string;
    emergencyCall: string;
    safetyNotice: string;
    safetyTitle: string;
    zeroFeeNotice: string;
    noDataFound: string;
    emptyStateDesc: string;
    switchMode: string;
    goToOnline: string;
    goToOffline: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    identifierLabel: string;
    identifierPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    loginBtn: string;
    registerBtn: string;
    demoLoginBtn: string;
    googleLoginBtn: string;
    dontHaveAccount: string;
    alreadyHaveAccount: string;
    createAccountLink: string;
    loginLink: string;
    orDivider: string;
    demoModeNotice: string;
    invalidCredentials: string;
    passwordTooShort: string;
    invalidPhone: string;
    nameRequired: string;
    emailInUse: string;
    authFailed: string;
  };
  home: {
    questionPrompt: string;
    subtitle: string;
    searchPlaceholder: string;
    currentLocation: string;
    changeLocation: string;
    platformBadge: string;
    activeRequestsAlert: string;
    viewWorkRequests: string;
    hotlineBanner: string;
    hotlineAction: string;
    safetyDisclaimer: string;
    safetyTitle: string;
    exploreModules: string;
    stepForward: string;
  };
  modules: {
    hire: {
      title: string;
      subtitle: string;
      badge: string;
      description: string;
    };
    work: {
      title: string;
      subtitle: string;
      badge: string;
      description: string;
    };
    jobs: {
      title: string;
      subtitle: string;
      badge: string;
      description: string;
    };
    ride: {
      title: string;
      subtitle: string;
      badge: string;
      description: string;
    };
    delivery: {
      title: string;
      subtitle: string;
      badge: string;
      description: string;
    };
    buysell: {
      title: string;
      subtitle: string;
      badge: string;
      description: string;
    };
  };
  profile: {
    mainProfileTitle: string;
    profileOverview: string;
    editProfileBtn: string;
    setupProfileBtn: string;
    availabilityStatus: string;
    rolesSection: string;
    rolesSubtitle: string;
    skillsSection: string;
    skillsSubtitle: string;
    addSkillBtn: string;
    skillInputPlaceholder: string;
    professionsSection: string;
    professionsSubtitle: string;
    addCustomProfession: string;
    workHistorySection: string;
    serviceAreaSection: string;
    serviceAreaSubtitle: string;
    changeAreaBtn: string;
    noServiceArea: string;
    portfolioSection: string;
    rateCardSection: string;
    verificationSection: string;
    verificationSubtitle: string;
    verificationBtn: string;
    verifiedBadge: string;
    pendingBadge: string;
    underReviewBadge: string;
    unverifiedBadge: string;
    driverBadge: string;
    reputationSection: string;
    privacySection: string;
    subscriptionSection: string;
    freeNotice: string;
    languageSection: string;
    languageSubtitle: string;
    bengaliOption: string;
    englishOption: string;
    currentSelectedLanguage: string;
    emergencyContact: string;
    personalInfo: string;
    phone: string;
    email: string;
    address: string;
    presentAddress: string;
    permanentAddress: string;
    bio: string;
    bioPlaceholder: string;
    saveProfile: string;
  };
  hire: {
    pageTitle: string;
    pageSubtitle: string;
    searchPlaceholder: string;
    physicalServiceTab: string;
    physicalServiceDesc: string;
    digitalServiceTab: string;
    digitalServiceDesc: string;
    allCategories: string;
    selectProfession: string;
    filterTitle: string;
    minExperience: string;
    minRating: string;
    onlyOnline: string;
    onlyVerified: string;
    onlyPortfolio: string;
    maxDistance: string;
    allDistances: string;
    sortBy: string;
    sortDistance: string;
    sortRating: string;
    sortExperience: string;
    sortJobs: string;
    sortRelevance: string;
    workerCountFound: string;
    noWorkersTitle: string;
    noWorkersDesc: string;
    viewProfile: string;
    hireNow: string;
    distanceAway: string;
    yearsExp: string;
    completedJobs: string;
    ratingText: string;
    modalTitle: string;
    jobDetails: string;
    jobCategory: string;
    workDescription: string;
    workDescriptionPlaceholder: string;
    budgetLabel: string;
    budgetPlaceholder: string;
    preferredDate: string;
    locationLabel: string;
    sendRequestBtn: string;
    requestSuccessNotice: string;
    callWorker: string;
    chatWithWorker: string;
    agreedPrice: string;
    customerPayable: string;
    workerReceivable: string;
    platformFee: string;
    zeroFeeGuarantee: string;
  };
  work: {
    pageTitle: string;
    pageSubtitle: string;
    tabs: {
      requests: string;
      history: string;
      performance: string;
    };
    subTabs: {
      newRequests: string;
      activeJobs: string;
      completedJobs: string;
      rejectedJobs: string;
    };
    noRequestsTitle: string;
    noRequestsDesc: string;
    sendQuoteBtn: string;
    acceptJobBtn: string;
    rejectJobBtn: string;
    startTravelingBtn: string;
    arriveAtLocationBtn: string;
    startWorkBtn: string;
    completeWorkBtn: string;
    digitalJobRecordBtn: string;
    quoteModalTitle: string;
    quoteAmountLabel: string;
    quoteNotesLabel: string;
    submitQuoteBtn: string;
    earningsSummary: string;
    totalEarned: string;
    completedJobsCount: string;
    ratingOverview: string;
    reviewList: string;
    customerName: string;
    serviceType: string;
    jobAddress: string;
    statusTimeline: string;
    trackCustomerLocation: string;
    requestAdditionalPrice: string;
    additionalWorkTitle: string;
  };
  activity: {
    pageTitle: string;
    pageSubtitle: string;
    tabAll: string;
    tabHire: string;
    tabWork: string;
    emptyTitle: string;
    emptyDesc: string;
    orderId: string;
    date: string;
    amount: string;
    viewDetails: string;
    statusRequested: string;
    statusQuoted: string;
    statusAccepted: string;
    statusEnRoute: string;
    statusArrived: string;
    statusInProgress: string;
    statusCompleted: string;
    statusCancelled: string;
  };
  search: {
    pageTitle: string;
    pageSubtitle: string;
    inputPlaceholder: string;
    filterByCategory: string;
    filterByLocation: string;
    resultsCount: string;
    noResultsFound: string;
    searchSuggestions: string;
  };
  messages: {
    pageTitle: string;
    pageSubtitle: string;
    conversations: string;
    noConversations: string;
    selectConversation: string;
    typeMessagePlaceholder: string;
    sendBtn: string;
    online: string;
    offline: string;
  };
  verification: {
    pageTitle: string;
    pageSubtitle: string;
    nidStepTitle: string;
    nidStepDesc: string;
    photoStepTitle: string;
    photoStepDesc: string;
    driverStepTitle: string;
    driverStepDesc: string;
    statusApproved: string;
    statusPending: string;
    statusRejected: string;
    uploadDocBtn: string;
    submitVerificationBtn: string;
  };
  policies: {
    pageTitle: string;
    pageSubtitle: string;
    termsTitle: string;
    privacyTitle: string;
    safetyTitle: string;
    noFeeTitle: string;
    noFeeDescription: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  bn: {
    nav: {
      home: 'হোম',
      hire: 'কাজের মানুষ (Hire)',
      work: 'কাজ করতে চাই (Work)',
      jobs: 'চাকরি (Jobs)',
      ride: 'রাইড (Ride)',
      delivery: 'পার্সেল (Delivery)',
      buysell: 'কেনাবেচা (Buy/Sell)',
      search: 'সার্চ (Search)',
      messages: 'মেসেজ (Chat)',
      activity: 'হিস্টোরি (Activity)',
      profile: 'প্রোফাইল (Profile)',
      verification: 'ভেরিফিকেশন কেন্দ্র',
      policies: 'শর্তাবলী ও পলিসি',
      admin: 'এডমিন ড্যাশবোর্ড',
      hotline: 'হটলাইন',
      notifications: 'বিজ্ঞপ্তি',
      language: 'ভাষা (Language)',
      changeLanguage: 'ভাষা পরিবর্তন করুন',
      selectLanguage: 'ভাষা নির্বাচন করুন',
      bengali: 'বাংলা (Bengali)',
      english: 'English (ইংরেজি)',
      mainModules: 'মূল মডিউলসমূহ',
      adminAccess: 'এডমিন অ্যাক্সেস',
      adminDashboard: 'এডমিন ড্যাশবোর্ড',
      footerTerms: 'ব্যবহারের শর্তাবলী ও নিরাপত্তা নীতি',
      footerTagline: 'বাংলাদেশের অল-ইন-ওয়ান লোকাল মার্কেটপ্লেস',
    },
    common: {
      online: 'অনলাইন (Online)',
      offline: 'অফলাইন (Offline)',
      onlineStatusText: 'আমি এখন কাজের জন্য Available',
      offlineStatusText: 'আমি এখন কাজের জন্য Available নই',
      filter: 'ফিল্টার',
      status: 'স্ট্যাটাস',
      dashboard: 'ড্যাশবোর্ড',
      verified: 'যাচাইকৃত (Verified)',
      unverified: 'অযাচাইকৃত (Unverified)',
      pending: 'অপেক্ষমান (Pending)',
      underReview: 'পর্যালোচনাধীন',
      rejected: 'বাতিলকৃত',
      completed: 'সম্পন্ন',
      inProgress: 'চলমান',
      login: 'লগইন',
      register: 'নিবন্ধন',
      logout: 'লগআউট',
      viewAll: 'সবগুলো দেখুন',
      viewDetails: 'বিস্তারিত দেখুন',
      save: 'সংরক্ষণ করুন',
      cancel: 'বাতিল',
      back: 'ফিরে যান',
      edit: 'সম্পাদনা',
      delete: 'মুছে ফেলুন',
      search: 'অনুসন্ধান',
      loading: 'লোড হচ্ছে...',
      free: 'ফ্রি (FREE - ৳০)',
      bdtSymbol: '৳',
      contact: 'যোগাযোগ',
      call: 'কল করুন',
      message: 'মেসেজ',
      address: 'ঠিকানা',
      division: 'বিভাগ',
      district: 'জেলা',
      upazila: 'উপজেলা/থানা',
      yes: 'হ্যাঁ',
      no: 'না',
      close: 'বন্ধ করুন',
      confirm: 'নিশ্চিত করুন',
      submit: 'জমা দিন',
      continue: 'এগিয়ে যান',
      send: 'পাঠান',
      rating: 'রেটিং',
      reviews: 'রিভিউ',
      jobsDone: 'সম্পন্ন কাজ',
      joined: 'যোগদান',
      all: 'সবগুলো',
      reset: 'রিসেট',
      error: 'ত্রুটি',
      success: 'সফল',
      warning: 'সতর্কতা',
      info: 'তথ্য',
      phone: 'ফোন নম্বর',
      email: 'ইমেইল',
      notes: 'বিশেষ দ্রষ্টব্য',
      km: 'কিমি',
      meters: 'মিটার',
      minutes: 'মিনিট',
      hours: 'ঘণ্টা',
      days: 'দিন',
      emergency: 'জরুরি সহায়তা',
      emergencyCall: 'হটলাইনে কল করুন',
      safetyNotice: 'HelpLine একটি সংযোগকারী প্ল্যাটফর্ম। কাজের চুক্তি বা আর্থিক লেনদেনের পূর্বে উভয় পক্ষ নিজ দায়িত্বে যাচাই করে নিন।',
      safetyTitle: 'সতর্কতা ও নিরাপত্তা',
      zeroFeeNotice: 'হেল্পলাইনে কোনো সার্ভিস ফি বা প্ল্যাটফর্ম কমিশন নেই (৳০)। গ্রাহকের প্রদেয় ও কর্মীর প্রাপ্য ১০০% সমান।',
      noDataFound: 'কোনো তথ্য পাওয়া যায়নি',
      emptyStateDesc: 'বর্তমানে এখানে দেখানোর মতো কোনো রেকর্ড নেই।',
      switchMode: 'মোড পরিবর্তন করুন',
      goToOnline: 'Online হন',
      goToOffline: 'Offline মোডে যান',
    },
    auth: {
      loginTitle: 'হেল্পলাইনে লগইন করুন',
      loginSubtitle: 'আপনার মোবাইল নম্বর বা ইমেইল দিয়ে সহজে প্রবেশ করুন',
      registerTitle: 'নতুন অ্যাকাউন্ট তৈরি করুন',
      registerSubtitle: 'বাংলাদেশের সেরা লোকাল মার্কেটপ্লেসে যুক্ত হোন',
      identifierLabel: 'মোবাইল নম্বর বা ইমেইল',
      identifierPlaceholder: '01700123456 অথবা name@example.com',
      passwordLabel: 'পাসওয়ার্ড',
      passwordPlaceholder: 'কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড',
      fullNameLabel: 'আপনার পূর্ণ নাম',
      fullNamePlaceholder: 'উদাঃ মোঃ রফিকুল ইসলাম',
      phoneLabel: 'মোবাইল নম্বর',
      phonePlaceholder: '01XXXXXXXXX',
      emailLabel: 'ইমেইল (ঐচ্ছিক)',
      emailPlaceholder: 'name@example.com',
      loginBtn: 'লগইন করুন',
      registerBtn: 'নিবন্ধন সম্পন্ন করুন',
      demoLoginBtn: 'ডেমো ইউজার হিসেবে তাৎক্ষণিক প্রবেশ',
      googleLoginBtn: 'Google অ্যাকাউন্ট দিয়ে প্রবেশ',
      dontHaveAccount: 'অ্যাকাউন্ট নেই?',
      alreadyHaveAccount: 'ইতোমধ্যে অ্যাকাউন্ট আছে?',
      createAccountLink: 'নতুন অ্যাকাউন্ট খুলুন',
      loginLink: 'লগইন করুন',
      orDivider: 'অথবা',
      demoModeNotice: 'পরীক্ষার সুবিধার্থে কোনো পাসওয়ার্ড ছাড়াই সরাসরি প্রবেশ করতে পারবেন।',
      invalidCredentials: 'ভুল তথ্য বা অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।',
      passwordTooShort: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।',
      invalidPhone: 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01700123456)।',
      nameRequired: 'অনুগ্রহ করে আপনার সঠিক পূর্ণ নাম লিখুন।',
      emailInUse: 'এই তথ্য দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।',
      authFailed: 'প্রবেশ ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।',
    },
    home: {
      questionPrompt: 'আপনি কী করতে চান?',
      subtitle: 'আপনার পছন্দের সার্ভিসটি বেছে নিন এবং এগিয়ে যান',
      searchPlaceholder: 'কর্মী, কাজ, চাকরি, পণ্য বা রাইড সার্চ করুন...',
      currentLocation: 'বর্তমান লোকেশন',
      changeLocation: 'ঠিকানা পরিবর্তন',
      platformBadge: 'HelpLine বাংলাদেশ • অল-ইন-ওয়ান প্ল্যাটফর্ম',
      activeRequestsAlert: 'আপনার জন্য নতুন কাজের অনুরোধ এসেছে!',
      viewWorkRequests: 'অনুরোধ দেখুন',
      hotlineBanner: 'জরুরি সাহায্য ও সহায়তার জন্য HelpLine হটলাইনে কল করুন:',
      hotlineAction: 'Hotline এ কল করুন',
      safetyDisclaimer: 'HelpLine একটি সরাসরি সংযোগকারী প্ল্যাটফর্ম। কাজের চুক্তি বা আর্থিক লেনদেনের পূর্বে উভয় পক্ষ নিজ দায়িত্বে যাচাই করে নিন।',
      safetyTitle: 'সতর্কতা ও নিরাপত্তা',
      exploreModules: 'সার্ভিসসমূহ এক্সপ্লোর করুন',
      stepForward: 'এগিয়ে যান',
    },
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
        subtitle: 'চাকরি খুঁজুন / দিন',
        badge: 'ফুল-টাইম ও পার্ট-টাইম',
        description: 'দোকান, অফিস, ড্রাইভিং, সিকিউরিটি ও স্থানীয় প্রতিষ্ঠানে চাকরি খুঁজুন বা লোক নিয়োগ দিন।',
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
        subtitle: 'কেনাবেচা করুন',
        badge: 'স্থানীয় মার্কেটপ্লেস',
        description: 'মোবাইল, আসবাবপত্র, ইলেকট্রনিক্স বা দরকারি পণ্য সরাসরি স্থানীয় মানুষের সাথে কেনাবেচা করুন।',
      },
    },
    profile: {
      mainProfileTitle: 'মেইন প্রোফাইল (Main Profile)',
      profileOverview: 'ব্যক্তিগত তথ্য ও কর্মক্ষেত্রের সম্পূর্ণ বিবরণ',
      editProfileBtn: 'প্রোফাইল এডিট',
      setupProfileBtn: 'প্রোফাইল সেটআপ',
      availabilityStatus: 'কাজের প্রাপ্যতা (Availability Status)',
      rolesSection: 'সক্রিয় রোল ও সক্ষমতা (Active Capabilities)',
      rolesSubtitle: 'আপনি কোন কোন ক্ষেত্রে কাজ করতে বা সেবা পেতে চান তা সক্রিয় করুন',
      skillsSection: 'দক্ষতা ও বিশেষত্ব (Skills)',
      skillsSubtitle: 'আপনার কাজের সাথে সম্পর্কিত সুনির্দিষ্ট দক্ষতা ও টুলস',
      addSkillBtn: 'দক্ষতা যুক্ত করুন',
      skillInputPlaceholder: 'নতুন দক্ষতা লিখুন (উদাঃ AC Installation, Wiring)',
      professionsSection: 'পেশা ও কাজের ধরণ (Professions)',
      professionsSubtitle: 'আপনার প্রাথমিক ও সহকারী পেশাসমূহ',
      addCustomProfession: 'কাস্টম পেশা যোগ করুন',
      workHistorySection: 'কাজের পূর্ব অভিজ্ঞতা (Work History)',
      serviceAreaSection: 'সেবা প্রদানের এলাকা (Service Area)',
      serviceAreaSubtitle: 'আমি যেসব এলাকায় গিয়ে সরাসরি কাজ করতে সক্ষম',
      changeAreaBtn: 'এলাকা পরিবর্তন',
      noServiceArea: 'কোনো নির্দিষ্ট কর্ম এলাকা এখনও চিহ্নিত করা হয়নি।',
      portfolioSection: 'পোর্টফোলিও ও কাজের নমুনা ছবি (Portfolio)',
      rateCardSection: 'সেবার মূল্য ও রেট চার্ট (Pricing / Rate Card)',
      verificationSection: 'পরিচয়পত্র ও চালক ভেরিফিকেশন (Identity Verification)',
      verificationSubtitle: 'জাতীয় পরিচয়পত্র (NID), ড্রাইভিং লাইসেন্স দিয়ে প্রোফাইল যাচাই করুন',
      verificationBtn: 'ভেরিফিকেশন কেন্দ্রে যান',
      verifiedBadge: '✓ যাচাইকৃত প্রোফাইল',
      pendingBadge: '⏳ অপেক্ষমান (Pending)',
      underReviewBadge: '🔍 পর্যালোচনা চলছে',
      unverifiedBadge: 'অযাচাইকৃত (Unverified)',
      driverBadge: '✓ ড্রাইভার ভেরিফাইড',
      reputationSection: 'রেটিং, রিভিউ ও পারফরম্যান্স (Reputation)',
      privacySection: 'ব্যক্তিগত তথ্যের গোপনীয়তা নিয়ন্ত্রণ (Privacy Settings)',
      subscriptionSection: 'সাবস্ক্রিপশন ও প্ল্যাটফর্ম পেমেন্ট (Subscription)',
      freeNotice: 'বর্তমানে HelpLine প্ল্যাটফর্ম সম্পূর্ণ ফ্রি (FREE - ৳০) মোডে সচল রয়েছে। কোনো সার্ভিস চার্জ বা কমিশন নেই।',
      languageSection: 'ভাষা নির্বাচন (Language Preference)',
      languageSubtitle: 'HelpLine অ্যাপের ভাষা পরিবর্তন করুন',
      bengaliOption: 'বাংলা (Bengali - ডিফল্ট)',
      englishOption: 'English (ইংরেজি)',
      currentSelectedLanguage: 'বর্তমান ভাষা',
      emergencyContact: 'জরুরি যোগাযোগ নম্বর',
      personalInfo: 'ব্যক্তিগত তথ্য',
      phone: 'ফোন নম্বর',
      email: 'ইমেইল',
      address: 'ঠিকানা',
      presentAddress: 'বর্তমান ঠিকানা',
      permanentAddress: 'স্থায়ী ঠিকানা',
      bio: 'পরিচিতি ও বায়ো',
      bioPlaceholder: 'আপনার কাজের অভিজ্ঞতা ও নিজের সম্পর্কে সংক্ষেপে লিখুন...',
      saveProfile: 'প্রোফাইল তথ্য সংরক্ষণ করুন',
    },
    hire: {
      pageTitle: 'কাজের মানুষ খুঁজুন (HIRE)',
      pageSubtitle: 'আপনার এলাকা বা অনলাইনে দক্ষ টেকনিশিয়ান ও পেশাদার কারিগর নিয়োগ করুন',
      searchPlaceholder: 'পেশা, কাজের ধরন বা এলাকার নাম লিখে খুঁজুন...',
      physicalServiceTab: '📍 ফিজিক্যাল / লোকাল মিস্ত্রি',
      physicalServiceDesc: 'বাসা-অফিস ভিজিট করে কাজ (ইলেকট্রিশিয়ান, প্লাম্বার, রঙ ইত্যাদি)',
      digitalServiceTab: '💻 ফ্রিল্যান্স / ডিজিটাল সার্ভিস',
      digitalServiceDesc: 'অনলাইন ও রিমোট কাজ (গ্রাফিক্স, ওয়েব, টাইপিং, ডাটা এন্ট্রি ইত্যাদি)',
      allCategories: 'সকল পেশা / ক্যাটাগরি',
      selectProfession: 'পেশা নির্বাচন করুন',
      filterTitle: 'ফিল্টার ও সার্চ অপশন',
      minExperience: 'ন্যূনতম অভিজ্ঞতা (বছর)',
      minRating: 'ন্যূনতম রেটিং',
      onlyOnline: 'শুধুমাত্র অনলাইনে সক্রিয় (Available)',
      onlyVerified: 'শুধুমাত্র যাচাইকৃত কর্মী (Verified)',
      onlyPortfolio: 'কাজের নমুনাযুক্ত কর্মী (With Portfolio)',
      maxDistance: 'সর্বোচ্চ দূরত্ব (কিমি)',
      allDistances: 'যেকোনো দূরত্ব',
      sortBy: 'সাজানোর ধরণ (Sort By)',
      sortDistance: 'কাছের দূরত্ব অনুযায়ী',
      sortRating: 'সেরা রেটিং অনুযায়ী',
      sortExperience: 'বেশি অভিজ্ঞতা অনুযায়ী',
      sortJobs: 'সম্পন্ন কাজের সংখ্যা অনুযায়ী',
      sortRelevance: 'প্রাসঙ্গিকতা অনুযায়ী',
      workerCountFound: 'জন দক্ষ কর্মী পাওয়া গেছে',
      noWorkersTitle: 'কোনো কর্মী খুঁজে পাওয়া যায়নি',
      noWorkersDesc: 'আপনার ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।',
      viewProfile: 'প্রোফাইল দেখুন',
      hireNow: 'হায়ার রিকোয়েস্ট পাঠান',
      distanceAway: 'কিমি দূরে',
      yearsExp: 'বছর অভিজ্ঞতা',
      completedJobs: 'টি কাজ সম্পন্ন',
      ratingText: 'রেটিং',
      modalTitle: 'কাজের জন্য অনুরোধ পাঠান',
      jobDetails: 'কাজের বিস্তারিত বিবরণ',
      jobCategory: 'কাজের ধরন ও পেশা',
      workDescription: 'কী কাজ করাতে চান বিস্তারিত লিখুন',
      workDescriptionPlaceholder: 'কাজের সমস্যা ও প্রয়োজনীয়তার বিস্তারিত বর্ণনা দিন...',
      budgetLabel: 'আপনার বাজেট (টাকা)',
      budgetPlaceholder: 'উদাঃ ৫০০',
      preferredDate: 'কাজের সময় ও তারিখ',
      locationLabel: 'কাজের স্থান / ঠিকানা',
      sendRequestBtn: 'অনুরোধ নিশ্চিত করুন',
      requestSuccessNotice: 'আপনার কাজের অনুরোধ সফলভাবে কর্মীর কাছে পাঠানো হয়েছে!',
      callWorker: 'সরাসরি কল করুন',
      chatWithWorker: 'চ্যাট করুন',
      agreedPrice: 'সম্মত কাজের মূল্য',
      customerPayable: 'গ্রাহকের প্রদেয়',
      workerReceivable: 'কর্মীর প্রাপ্য আয়',
      platformFee: 'প্ল্যাটফর্ম ফি (০% নীতি)',
      zeroFeeGuarantee: 'হেল্পলাইনে কোনো কমিশন নেই। কর্মীর প্রাপ্য ও গ্রাহকের প্রদেয় ১০০% সমান।',
    },
    work: {
      pageTitle: 'Work / কাজ করতে চাই',
      pageSubtitle: 'কাস্টমারদের কাজের অনুরোধে সাড়া দিন ও ১০০% আয়ে কাজ করুন',
      tabs: {
        requests: '📥 কাজের অনুরোধসমূহ',
        history: '📋 সম্পন্ন কাজের ইতিহাস',
        performance: '📊 আয় ও পারফরম্যান্স',
      },
      subTabs: {
        newRequests: '🔴 নতুন অনুরোধ',
        activeJobs: '🟡 চলমান কাজ',
        completedJobs: '🟢 সম্পন্ন কাজ',
        rejectedJobs: '⚪ বাতিলকৃত',
      },
      noRequestsTitle: 'কোনো অনুরোধ নেই',
      noRequestsDesc: 'বর্তমানে আপনার এই তালিকায় কোনো কাজ পেন্ডিং নেই।',
      sendQuoteBtn: 'কোটেশন পাঠান',
      acceptJobBtn: 'কাজ শুরু করুন',
      rejectJobBtn: 'অনুরোধ ফিরিয়ে দিন',
      startTravelingBtn: 'কাজে রওনা দিয়েছি (En Route)',
      arriveAtLocationBtn: 'কাজের স্থানে পৌঁছেছি (Arrived)',
      startWorkBtn: 'কাজ শুরু করছি (Start Job)',
      completeWorkBtn: 'কাজ সম্পন্ন হয়েছে (Complete)',
      digitalJobRecordBtn: 'ডিজিটাল জব সার্টিফিকেট',
      quoteModalTitle: 'কাজের জন্য মূল্য ও কোটেশন পাঠান',
      quoteAmountLabel: 'কাজের আনুমানিক মূল্য (টাকা)',
      quoteNotesLabel: 'কোটেশনের শর্ত বা বিবরণ',
      submitQuoteBtn: 'কোটেশন পেশ করুন',
      earningsSummary: 'মোট অর্জিত আয়',
      totalEarned: 'মোট আয় (৳০ কমিশন)',
      completedJobsCount: 'সম্পন্ন কাজের সংখ্যা',
      ratingOverview: 'গড় কাস্টমার রেটিং',
      reviewList: 'গ্রাহকদের মতামত ও রিভিউ',
      customerName: 'গ্রাহকের নাম',
      serviceType: 'কাজের ধরণ',
      jobAddress: 'কাজের ঠিকানা',
      statusTimeline: 'কাজের অগ্রগতি টাইমলাইন',
      trackCustomerLocation: 'গ্রাহকের অবস্থান ম্যাপ',
      requestAdditionalPrice: 'অতিরিক্ত কাজের বিল যোগ করুন',
      additionalWorkTitle: 'অতিরিক্ত কাজের আবেদন',
    },
    activity: {
      pageTitle: 'কার্যক্রম ও হিস্টোরি (Activity)',
      pageSubtitle: 'আপনার সকল হায়ার ও কাজের পূর্বাপর রেকর্ড',
      tabAll: 'সকল রেকর্ড',
      tabHire: 'হায়ার রিকোয়েস্ট (গ্রাহক হিসেবে)',
      tabWork: 'কাজের অনুরোধ (কর্মী হিসেবে)',
      emptyTitle: 'কোনো কার্যক্রম পাওয়া যায়নি',
      emptyDesc: 'আপনার নতুন কোনো কাজের অনুরোধ বা লেনদেন এখনও তৈরি হয়নি।',
      orderId: 'আইডি',
      date: 'তারিখ',
      amount: 'মূল্য',
      viewDetails: 'বিস্তারিত দেখুন',
      statusRequested: 'অনুরোধ পাঠানো হয়েছে',
      statusQuoted: 'কোটেশন দেওয়া হয়েছে',
      statusAccepted: 'গৃহীত হয়েছে',
      statusEnRoute: 'রওনা দিয়েছে',
      statusArrived: 'পৌঁছেছে',
      statusInProgress: 'কাজ চলছে',
      statusCompleted: 'সম্পন্ন হয়েছে',
      statusCancelled: 'বাতিল হয়েছে',
    },
    search: {
      pageTitle: 'অনুসন্ধান কেন্দ্র (Search)',
      pageSubtitle: 'কর্মী, পেশা, সার্ভিস ও কাজের সুযোগ এক ঠিকানায়',
      inputPlaceholder: 'যেকোনো পেশা, সার্ভিস, জেলা বা কীওয়ার্ড লিখুন...',
      filterByCategory: 'ক্যাটাগরি অনুযায়ী ফিল্টার',
      filterByLocation: 'লোকেশন অনুযায়ী ফিল্টার',
      resultsCount: 'টি ফলাফল পাওয়া গেছে',
      noResultsFound: 'কোনো মিল পাওয়া যায়নি',
      searchSuggestions: 'জনপ্রিয় অনুসন্ধানসমূহ',
    },
    messages: {
      pageTitle: 'মেসেজ ও বার্তালাপ (Messages)',
      pageSubtitle: 'গ্রাহক ও কর্মীদের সাথে নিরাপদ সরাসরি যোগাযোগ',
      conversations: 'চ্যাট তালিকা',
      noConversations: 'কোনো চলমান বার্তালাপ নেই',
      selectConversation: 'বার্তালাপ শুরু করতে বামপাশ থেকে যেকোনো চ্যাট নির্বাচন করুন',
      typeMessagePlaceholder: 'আপনার বার্তা লিখুন...',
      sendBtn: 'পাঠান',
      online: 'সক্রিয় (Online)',
      offline: 'অফলাইন (Offline)',
    },
    verification: {
      pageTitle: 'ভেরিফিকেশন কেন্দ্র (Verification Center)',
      pageSubtitle: 'প্রোফাইল বিশ্বস্ততা বৃদ্ধি করতে পরিচয়পত্র যাচাই করুন',
      nidStepTitle: '১. জাতীয় পরিচয়পত্র (NID)',
      nidStepDesc: 'আপনার NID কার্ডের উভয় পাশের পরিষ্কার ছবি দাখিল করুন',
      photoStepTitle: '২. প্রোফাইল ও সেলফি ছবি',
      photoStepDesc: 'পরিষ্কার পাসপোর্ট সাইজের ছবি আপলোড করুন',
      driverStepTitle: '৩. ড্রাইভিং লাইসেন্স (ড্রাইভারদের জন্য)',
      driverStepDesc: 'রাইড শেয়ারিং এর জন্য বৈধ ড্রাইভিং লাইসেন্স আবশ্যক',
      statusApproved: 'সফলভাবে যাচাইকৃত (Verified)',
      statusPending: 'অপেক্ষমান (Under Review)',
      statusRejected: 'পুনরায় আবেদন করুন',
      uploadDocBtn: 'ডকুমেন্ট আপলোড করুন',
      submitVerificationBtn: 'যাচাইকরণের জন্য দাখিল করুন',
    },
    policies: {
      pageTitle: 'ব্যবহারের শর্তাবলী ও নিরাপত্তা নীতি',
      pageSubtitle: 'HelpLine প্ল্যাটফর্মের কার্যপ্রণালী ও নির্দেশিকা',
      termsTitle: 'ব্যবহারের সাধারণ শর্তাবলী',
      privacyTitle: 'ব্যক্তিগত তথ্যের সুরক্ষা নীতি',
      safetyTitle: 'নিরাপত্তা ও দায়িত্বশীলতা নির্দেশনা',
      noFeeTitle: '১০০% নো-কমিশন ও নো-ফি নীতি',
      noFeeDescription: 'HelpLine প্ল্যাটফর্ম কোনো প্রকার মধ্যস্থতাকারী ফি বা লেনদেন কমিশন চার্জ করে না। গ্রাহকের সম্মত মূল্য ও কর্মীর প্রাপ্য শতভাগ সমান।',
    },
  },
  en: {
    nav: {
      home: 'Home',
      hire: 'Hire Worker',
      work: 'Work / I Want to Work',
      jobs: 'Jobs',
      ride: 'Ride',
      delivery: 'Delivery',
      buysell: 'Buy & Sell',
      search: 'Search',
      messages: 'Messages',
      activity: 'Activity',
      profile: 'Profile',
      verification: 'Verification Center',
      policies: 'Terms & Policies',
      admin: 'Admin Dashboard',
      hotline: 'Hotline',
      notifications: 'Notifications',
      language: 'Language',
      changeLanguage: 'Change Language',
      selectLanguage: 'Select Language',
      bengali: 'বাংলা (Bengali)',
      english: 'English',
      mainModules: 'Main Modules',
      adminAccess: 'Admin Access',
      adminDashboard: 'Admin Dashboard',
      footerTerms: 'Terms of Use & Safety Policy',
      footerTagline: "Bangladesh's All-in-One Local Marketplace",
    },
    common: {
      online: 'Online',
      offline: 'Offline',
      onlineStatusText: 'I am now Available for work',
      offlineStatusText: 'I am not Available for work right now',
      filter: 'Filter',
      status: 'Status',
      dashboard: 'Dashboard',
      verified: 'Verified',
      unverified: 'Unverified',
      pending: 'Pending',
      underReview: 'Under Review',
      rejected: 'Rejected',
      completed: 'Completed',
      inProgress: 'In Progress',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      viewAll: 'View All',
      viewDetails: 'View Details',
      save: 'Save',
      cancel: 'Cancel',
      back: 'Go Back',
      edit: 'Edit',
      delete: 'Delete',
      search: 'Search',
      loading: 'Loading...',
      free: 'Free (৳0)',
      bdtSymbol: '৳',
      contact: 'Contact',
      call: 'Call',
      message: 'Message',
      address: 'Address',
      division: 'Division',
      district: 'District',
      upazila: 'Upazila / Thana',
      yes: 'Yes',
      no: 'No',
      close: 'Close',
      confirm: 'Confirm',
      submit: 'Submit',
      continue: 'Continue',
      send: 'Send',
      rating: 'Rating',
      reviews: 'Reviews',
      jobsDone: 'Jobs Done',
      joined: 'Joined',
      all: 'All',
      reset: 'Reset',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      phone: 'Phone Number',
      email: 'Email',
      notes: 'Special Notes',
      km: 'km',
      meters: 'm',
      minutes: 'min',
      hours: 'hrs',
      days: 'days',
      emergency: 'Emergency Support',
      emergencyCall: 'Call Helpline',
      safetyNotice: 'HelpLine is a matchmaking platform. Both parties must verify independently before agreements or financial transactions.',
      safetyTitle: 'Safety & Disclaimer',
      zeroFeeNotice: 'HelpLine charges 0% service fee or platform commission (৳0). Customer payable and worker receivable are 100% equal.',
      noDataFound: 'No data found',
      emptyStateDesc: 'There are currently no records to display here.',
      switchMode: 'Switch Mode',
      goToOnline: 'Go Online',
      goToOffline: 'Go Offline',
    },
    auth: {
      loginTitle: 'Log in to HelpLine',
      loginSubtitle: 'Enter your phone number or email to access your account',
      registerTitle: 'Create a New Account',
      registerSubtitle: "Join Bangladesh's premier local services marketplace",
      identifierLabel: 'Mobile Number or Email',
      identifierPlaceholder: '01700123456 or name@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'At least 6 characters',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'e.g. John Doe / Md. Rafiqul Islam',
      phoneLabel: 'Mobile Number',
      phonePlaceholder: '01XXXXXXXXX',
      emailLabel: 'Email (Optional)',
      emailPlaceholder: 'name@example.com',
      loginBtn: 'Log In',
      registerBtn: 'Complete Registration',
      demoLoginBtn: 'Instant Demo Login',
      googleLoginBtn: 'Sign in with Google',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      createAccountLink: 'Sign Up',
      loginLink: 'Log In',
      orDivider: 'OR',
      demoModeNotice: 'For testing, you can sign in directly with 1-click demo accounts without passwords.',
      invalidCredentials: 'Invalid credentials or account not found. Please try again.',
      passwordTooShort: 'Password must be at least 6 characters long.',
      invalidPhone: 'Please enter a valid Bangladeshi mobile number (e.g. 01700123456).',
      nameRequired: 'Please enter your full name.',
      emailInUse: 'An account already exists with this phone or email.',
      authFailed: 'Authentication failed. Please try again.',
    },
    home: {
      questionPrompt: 'What would you like to do?',
      subtitle: 'Choose your desired service module and proceed',
      searchPlaceholder: 'Search workers, jobs, rides, products or services...',
      currentLocation: 'Current Location',
      changeLocation: 'Change Location',
      platformBadge: 'HelpLine Bangladesh • All-in-One Platform',
      activeRequestsAlert: 'You have new incoming work requests!',
      viewWorkRequests: 'View Requests',
      hotlineBanner: 'For immediate assistance, call the official HelpLine hotline:',
      hotlineAction: 'Call Hotline',
      safetyDisclaimer: 'HelpLine is a direct matchmaking platform. Both parties must independently verify terms and safety prior to agreement.',
      safetyTitle: 'Safety & Disclaimer',
      exploreModules: 'Explore Services',
      stepForward: 'Proceed',
    },
    modules: {
      hire: {
        title: 'Hire',
        subtitle: 'Find Skilled Workers',
        badge: 'Technicians & Craftsmen',
        description: 'Directly find electricians, plumbers, AC technicians, painters, masons and domestic helpers.',
      },
      work: {
        title: 'Work',
        subtitle: 'Offer Your Services',
        badge: 'Work Opportunities',
        description: 'Add your skills, respond to customer requests, and earn independently with 0% commission.',
      },
      jobs: {
        title: 'Jobs',
        subtitle: 'Find or Post Jobs',
        badge: 'Full-Time & Part-Time',
        description: 'Discover or hire talent for stores, offices, driving, security, and local establishments.',
      },
      ride: {
        title: 'Ride',
        subtitle: 'Get a Ride',
        badge: 'Bikes & CNGs',
        description: 'Connect quickly and directly with nearby reliable bike, CNG, or car drivers.',
      },
      delivery: {
        title: 'Send',
        subtitle: 'Send a Parcel',
        badge: 'Parcel & Courier',
        description: 'Send parcels, urgent documents, or food items across the city with dependable riders.',
      },
      buysell: {
        title: 'Buy & Sell',
        subtitle: 'Buy or Sell Items',
        badge: 'Local Marketplace',
        description: 'Buy and sell mobiles, furniture, electronics, and essentials directly with local residents.',
      },
    },
    profile: {
      mainProfileTitle: 'Main Profile',
      profileOverview: 'Complete overview of your personal information and capabilities',
      editProfileBtn: 'Edit Profile',
      setupProfileBtn: 'Setup Profile',
      availabilityStatus: 'Availability Status',
      rolesSection: 'Active Roles & Capabilities',
      rolesSubtitle: 'Enable or disable the roles you participate in on the platform',
      skillsSection: 'Skills & Specializations',
      skillsSubtitle: 'Specific technical skills, tools, and expertise you provide',
      addSkillBtn: 'Add Skill',
      skillInputPlaceholder: 'Enter skill (e.g. AC Installation, Wiring)',
      professionsSection: 'Professions & Work Types',
      professionsSubtitle: 'Your primary and secondary designated professions',
      addCustomProfession: 'Add Custom Profession',
      workHistorySection: 'Work History & Experience',
      serviceAreaSection: 'Service Coverage Areas',
      serviceAreaSubtitle: 'Neighborhoods and cities where you can visit and deliver services',
      changeAreaBtn: 'Change Areas',
      noServiceArea: 'No specific service coverage area has been defined yet.',
      portfolioSection: 'Portfolio & Sample Work Photos',
      rateCardSection: 'Pricing & Service Rate Card',
      verificationSection: 'Identity & Driver Verification',
      verificationSubtitle: 'Verify your account using National ID (NID) or Driving License',
      verificationBtn: 'Go to Verification Center',
      verifiedBadge: '✓ Verified Profile',
      pendingBadge: '⏳ Pending Approval',
      underReviewBadge: '🔍 Under Review',
      unverifiedBadge: 'Unverified Profile',
      driverBadge: '✓ Driver Verified',
      reputationSection: 'Ratings, Reviews & Reputation',
      privacySection: 'Privacy & Security Settings',
      subscriptionSection: 'Subscription & Platform Billing',
      freeNotice: 'Currently HelpLine operates on 100% FREE (৳0) mode. No subscription fees or transaction commissions apply.',
      languageSection: 'Language Preference',
      languageSubtitle: 'Change application language between Bengali and English',
      bengaliOption: 'বাংলা (Bengali - Default)',
      englishOption: 'English',
      currentSelectedLanguage: 'Current Language',
      emergencyContact: 'Emergency Contact Number',
      personalInfo: 'Personal Information',
      phone: 'Phone Number',
      email: 'Email',
      address: 'Address',
      presentAddress: 'Present Address',
      permanentAddress: 'Permanent Address',
      bio: 'Bio & Introduction',
      bioPlaceholder: 'Write a brief description of your background, experience, and services...',
      saveProfile: 'Save Profile Changes',
    },
    hire: {
      pageTitle: 'Find Skilled Workers (HIRE)',
      pageSubtitle: 'Hire trusted local technicians or digital freelance specialists near you',
      searchPlaceholder: 'Search by profession, skill, or area name...',
      physicalServiceTab: '📍 Local / Physical Craftsmen',
      physicalServiceDesc: 'On-site home & office visits (Electrician, Plumber, Painter, etc.)',
      digitalServiceTab: '💻 Digital / Remote Freelance',
      digitalServiceDesc: 'Online & remote services (Design, Web, Typing, Data Entry, etc.)',
      allCategories: 'All Categories / Professions',
      selectProfession: 'Select Profession',
      filterTitle: 'Filters & Search Options',
      minExperience: 'Minimum Experience (Years)',
      minRating: 'Minimum Rating',
      onlyOnline: 'Available Online Only',
      onlyVerified: 'Verified Workers Only',
      onlyPortfolio: 'Workers with Portfolio Only',
      maxDistance: 'Maximum Distance (km)',
      allDistances: 'Any Distance',
      sortBy: 'Sort By',
      sortDistance: 'Closest Distance',
      sortRating: 'Highest Rating',
      sortExperience: 'Most Experience',
      sortJobs: 'Most Completed Jobs',
      sortRelevance: 'Relevance',
      workerCountFound: 'skilled workers found',
      noWorkersTitle: 'No workers found',
      noWorkersDesc: 'Try adjusting your filters or expanding the search distance.',
      viewProfile: 'View Profile',
      hireNow: 'Send Hire Request',
      distanceAway: 'km away',
      yearsExp: 'yrs experience',
      completedJobs: 'jobs completed',
      ratingText: 'Rating',
      modalTitle: 'Send Hire Request',
      jobDetails: 'Job Description & Details',
      jobCategory: 'Work Category',
      workDescription: 'Describe the work required',
      workDescriptionPlaceholder: 'Provide specific details on what needs repair, installation or service...',
      budgetLabel: 'Your Proposed Budget (BDT)',
      budgetPlaceholder: 'e.g. 500',
      preferredDate: 'Preferred Date & Time',
      locationLabel: 'Job Location / Address',
      sendRequestBtn: 'Send Request',
      requestSuccessNotice: 'Your hire request has been sent to the worker successfully!',
      callWorker: 'Call Worker',
      chatWithWorker: 'Chat with Worker',
      agreedPrice: 'Agreed Job Price',
      customerPayable: 'Customer Total Payable',
      workerReceivable: 'Worker Net Receivable',
      platformFee: 'Platform Fee (0% Policy)',
      zeroFeeGuarantee: 'HelpLine charges 0% commission. Worker receivable and customer payable are 100% equal.',
    },
    work: {
      pageTitle: 'Work / I Want to Work',
      pageSubtitle: 'Respond to customer requests and earn 100% of your agreed price',
      tabs: {
        requests: '📥 Work Requests',
        history: '📋 Job History',
        performance: '📊 Earnings & Stats',
      },
      subTabs: {
        newRequests: '🔴 New Requests',
        activeJobs: '🟡 Active Jobs',
        completedJobs: '🟢 Completed',
        rejectedJobs: '⚪ Rejected / Cancelled',
      },
      noRequestsTitle: 'No Requests Found',
      noRequestsDesc: 'There are currently no pending jobs in this list.',
      sendQuoteBtn: 'Send Quotation',
      acceptJobBtn: 'Accept Job',
      rejectJobBtn: 'Decline Request',
      startTravelingBtn: 'En Route to Location',
      arriveAtLocationBtn: 'Arrived at Location',
      startWorkBtn: 'Start Job',
      completeWorkBtn: 'Mark Job Complete',
      digitalJobRecordBtn: 'Digital Job Certificate',
      quoteModalTitle: 'Submit Job Quotation',
      quoteAmountLabel: 'Quoted Price (BDT)',
      quoteNotesLabel: 'Terms / Notes for Customer',
      submitQuoteBtn: 'Submit Quotation',
      earningsSummary: 'Total Earnings Summary',
      totalEarned: 'Total Earnings (0% Commission)',
      completedJobsCount: 'Completed Jobs',
      ratingOverview: 'Average Rating',
      reviewList: 'Customer Reviews & Feedback',
      customerName: 'Customer Name',
      serviceType: 'Service Type',
      jobAddress: 'Job Address',
      statusTimeline: 'Job Progress Timeline',
      trackCustomerLocation: 'Customer Map Location',
      requestAdditionalPrice: 'Request Additional Work Amount',
      additionalWorkTitle: 'Additional Amount Request',
    },
    activity: {
      pageTitle: 'Activity & History',
      pageSubtitle: 'Complete track record of all your hire requests and jobs',
      tabAll: 'All Records',
      tabHire: 'Hire Orders (As Customer)',
      tabWork: 'Jobs Undertaken (As Worker)',
      emptyTitle: 'No activity records found',
      emptyDesc: 'You do not have any job requests or activity history yet.',
      orderId: 'Order ID',
      date: 'Date',
      amount: 'Amount',
      viewDetails: 'View Details',
      statusRequested: 'Request Sent',
      statusQuoted: 'Quotation Provided',
      statusAccepted: 'Accepted',
      statusEnRoute: 'En Route',
      statusArrived: 'Arrived',
      statusInProgress: 'In Progress',
      statusCompleted: 'Completed',
      statusCancelled: 'Cancelled',
    },
    search: {
      pageTitle: 'Search Center',
      pageSubtitle: 'Find workers, professions, local services and opportunities in one place',
      inputPlaceholder: 'Search by profession, skill, district, or keyword...',
      filterByCategory: 'Filter by Category',
      filterByLocation: 'Filter by Location',
      resultsCount: 'results found',
      noResultsFound: 'No matches found',
      searchSuggestions: 'Popular Searches',
    },
    messages: {
      pageTitle: 'Messages & Chat',
      pageSubtitle: 'Secure direct communication between customers and workers',
      conversations: 'Conversations',
      noConversations: 'No conversations yet',
      selectConversation: 'Select a conversation from the left to start chatting',
      typeMessagePlaceholder: 'Type your message...',
      sendBtn: 'Send',
      online: 'Online',
      offline: 'Offline',
    },
    verification: {
      pageTitle: 'Verification Center',
      pageSubtitle: 'Verify your identity documents to gain verified status and trust',
      nidStepTitle: '1. National ID (NID)',
      nidStepDesc: 'Upload clear front and back photos of your NID card',
      photoStepTitle: '2. Profile & Selfie Photo',
      photoStepDesc: 'Upload a clear passport-sized face photograph',
      driverStepTitle: '3. Driving License (For Drivers)',
      driverStepDesc: 'Valid driving license is required for offering ride services',
      statusApproved: 'Verified',
      statusPending: 'Under Review',
      statusRejected: 'Re-apply',
      uploadDocBtn: 'Upload Document',
      submitVerificationBtn: 'Submit for Verification',
    },
    policies: {
      pageTitle: 'Terms of Service & Safety Policies',
      pageSubtitle: 'HelpLine operating rules, guidelines and safety standards',
      termsTitle: 'Terms of Use',
      privacyTitle: 'Privacy Policy',
      safetyTitle: 'Safety Guidelines & Responsibilities',
      noFeeTitle: '100% No-Fee & No-Commission Policy',
      noFeeDescription: 'HelpLine charges zero intermediary fees or transaction deductions. Customer agreed price and worker receivable are 100% equal.',
    },
  },
};
