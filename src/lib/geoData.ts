/**
 * Bangladesh Administrative Divisions, Districts, and Upazilas / Thanas
 * Comprehensive hierarchical database for dependent address selector
 */

export interface GeoDivision {
  id: string;
  nameBn: string;
  nameEn: string;
  districts: GeoDistrict[];
}

export interface GeoDistrict {
  id: string;
  nameBn: string;
  nameEn: string;
  upazilas: string[];
}

export const BD_GEO_DATA: GeoDivision[] = [
  {
    id: 'barishal',
    nameBn: 'বরিশাল',
    nameEn: 'Barishal',
    districts: [
      {
        id: 'barishal',
        nameBn: 'বরিশাল',
        nameEn: 'Barishal',
        upazilas: [
          'বরিশাল সদর (Barishal Sadar)',
          'বাকেরগঞ্জ (Bakerganj)',
          'বাবুগঞ্জ (Babuganj)',
          'উজিরপুর (Wazirpur)',
          'বানারীপাড়া (Banaripara)',
          'গৌরনদী (Gournadi)',
          'আগৈলঝাড়া (Agailjhara)',
          'মেহেন্দিগঞ্জ (Mehendiganj)',
          'মুলাদী (Muladi)',
          'হিজলা (Hizla)',
        ],
      },
      {
        id: 'bhola',
        nameBn: 'ভোলা',
        nameEn: 'Bhola',
        upazilas: ['ভোলা সদর', 'দৌলতখান', 'বোরহানউদ্দিন', 'তজুমদ্দিন', 'লালমোহন', 'চরফ্যাশন', 'মনপুরা'],
      },
      {
        id: 'jhalokati',
        nameBn: 'ঝালকাঠি',
        nameEn: 'Jhalokati',
        upazilas: ['ঝালকাঠি সদর', 'নলছিটি', 'রাজাপুর', 'কাঁঠালিয়া'],
      },
      {
        id: 'pirojpur',
        nameBn: 'পিরোজপুর',
        nameEn: 'Pirojpur',
        upazilas: ['পিরোজপুর সদর', 'ইন্দুরকানী', 'কাউখালী', 'ভাণ্ডারিয়া', 'মঠবাড়িয়া', 'নাজিরপুর', 'নেছারাবাদ (স্বরূপকাঠি)'],
      },
      {
        id: 'patuakhali',
        nameBn: 'পটুয়াখালী',
        nameEn: 'Patuakhali',
        upazilas: ['পটুয়াখালী সদর', 'বাউফল', 'গলাচিপা', 'দশমিনা', 'কলাপাড়া (কুয়াকাটা)', 'মির্জাগঞ্জ', 'দুমকি', 'রাঙ্গাবালী'],
      },
      {
        id: 'barguna',
        nameBn: 'বরগুনা',
        nameEn: 'Barguna',
        upazilas: ['বরগুনা সদর', 'আমতলী', 'পাথরঘাটা', 'বেতাগী', 'বামনা', 'তালতলী'],
      },
    ],
  },
  {
    id: 'dhaka',
    nameBn: 'ঢাকা',
    nameEn: 'Dhaka',
    districts: [
      {
        id: 'dhaka',
        nameBn: 'ঢাকা',
        nameEn: 'Dhaka',
        upazilas: [
          'মিরপুর (Mirpur)',
          'ধানমন্ডি (Dhanmondi)',
          'গুলশান (Gulshan)',
          'বনানী (Banani)',
          'উত্তরা (Uttara)',
          'মোহাম্মদপুর (Mohammadpur)',
          'বাড্ডা (Badda)',
          'খিলগাঁও (Khilgaon)',
          'যাত্রাবাড়ী (Jatrabari)',
          'মতিঝিল (Motijheel)',
          'পল্টন (Paltan)',
          'তেজগাঁও (Tejgaon)',
          'সাভার (Savar)',
          'ধামরাই (Dhamrai)',
          'কেরানীগঞ্জ (Keraniganj)',
          'নবাবগঞ্জ (Nawabganj)',
          'দোহার (Dohar)',
        ],
      },
      {
        id: 'gazipur',
        nameBn: 'গাজীপুর',
        nameEn: 'Gazipur',
        upazilas: ['গাজীপুর সদর', 'কালিয়াকৈর', 'শ্রীপুর', 'কাপাসিয়া', 'কালীগঞ্জ', 'টঙ্গী'],
      },
      {
        id: 'narayanganj',
        nameBn: 'নারায়ণগঞ্জ',
        nameEn: 'Narayanganj',
        upazilas: ['নারায়ণগঞ্জ সদর', 'বন্দর', 'ফতুল্লা', 'সিদ্ধিরগঞ্জ', 'রূপগঞ্জ', 'আড়াইহাজার', 'সোনারগাঁও'],
      },
      {
        id: 'tangail',
        nameBn: 'টাঙ্গাইল',
        nameEn: 'Tangail',
        upazilas: ['টাঙ্গাইল সদর', 'মির্জাপুর', 'কালিহাতী', 'ঘাটাইল', 'মধুপুর', 'সখিপুর', 'নাগরপুর', 'দেলদুয়ার'],
      },
      {
        id: 'faridpur',
        nameBn: 'ফরিদপুর',
        nameEn: 'Faridpur',
        upazilas: ['ফরিদপুর সদর', 'বোয়ালমারী', 'ভাঙ্গা', 'নগরকান্দা', 'আলফাডাঙ্গা', 'সদরপুর', 'চরভদ্রাসন', 'মধুখালী', 'সালথা'],
      },
      {
        id: 'narsingdi',
        nameBn: 'নরসিংদী',
        nameEn: 'Narsingdi',
        upazilas: ['নরসিংদী সদর', 'পলাশ', 'বেলাবো', 'মনোহরদী', 'রায়পুরা', 'শিবপুর'],
      },
    ],
  },
  {
    id: 'chattogram',
    nameBn: 'চট্টগ্রাম',
    nameEn: 'Chattogram',
    districts: [
      {
        id: 'chattogram',
        nameBn: 'চট্টগ্রাম',
        nameEn: 'Chattogram',
        upazilas: ['কোতোয়ালী', 'পাঁচলাইশ', 'হালিশহর', 'পাহাড়তলী', 'ডবলমুরিং', 'চান্দগাঁও', 'খুলশী', 'পটিয়া', 'হাটহাজারী', 'সীতাকুণ্ড', 'মীরসরাই', 'রাঙ্গুনিয়া', 'বোয়ালখালী', 'আনোয়ারা'],
      },
      {
        id: 'coxsbazar',
        nameBn: 'কক্সবাজার',
        nameEn: 'Coxs Bazar',
        upazilas: ['কক্সবাজার সদর', 'চকোরিয়া', 'মহেশখালী', 'টেকনাফ', 'উখিয়া', 'রামু', 'পেকুয়া', 'কুতুবদিয়া'],
      },
      {
        id: 'cumilla',
        nameBn: 'কুমিল্লা',
        nameEn: 'Cumilla',
        upazilas: ['কুমিল্লা আদর্শ সদর', 'কুমিল্লা সদর দক্ষিণ', 'দাউদকান্দি', 'চান্দিনা', 'মুরাদনগর', 'দেবীদ্বার', 'লাকসাম', 'বুড়িচং', 'ব্রাহ্মণপাড়া'],
      },
      {
        id: 'feni',
        nameBn: 'ফেনী',
        nameEn: 'Feni',
        upazilas: ['ফেনী সদর', 'দাগনভূঞা', 'সোনাগাজী', 'ছাগলনাইয়া', 'পরশুরাম', 'ফুলগাজী'],
      },
      {
        id: 'noakhali',
        nameBn: 'নোয়াখালী',
        nameEn: 'Noakhali',
        upazilas: ['নোয়াখালী সদর', 'বেগমগঞ্জ', 'চাটখিল', 'সেনবাগ', 'সুবর্ণচর', 'কোম্পানীগঞ্জ', 'হাতিয়া'],
      },
      {
        id: 'brahmanbaria',
        nameBn: 'ব্রাহ্মণবাড়িয়া',
        nameEn: 'Brahmanbaria',
        upazilas: ['ব্রাহ্মণবাড়িয়া সদর', 'কসবা', 'নবীনগর', 'সরাইল', 'আশুগঞ্জ', 'আখাউড়া', 'নাসিরনগর'],
      },
    ],
  },
  {
    id: 'rajshahi',
    nameBn: 'রাজশাহী',
    nameEn: 'Rajshahi',
    districts: [
      {
        id: 'rajshahi',
        nameBn: 'রাজশাহী',
        nameEn: 'Rajshahi',
        upazilas: ['বোয়ালিয়া', 'রাজপাড়া', 'মতিহার', 'শাহমখদুম', 'পবা', 'গোদাগাড়ী', 'তানোর', 'মোহনপুর', 'বাগমারা', 'চারঘাট', 'বাঘা'],
      },
      {
        id: 'bogura',
        nameBn: 'বগুড়া',
        nameEn: 'Bogura',
        upazilas: ['বগুড়া সদর', 'শেরপুর', 'শাজাহানপুর', 'গাবতলী', 'শিবগঞ্জ', 'দুপচাঁচিয়া', 'ধুনট', 'আদমদীঘি'],
      },
      {
        id: 'pabna',
        nameBn: 'পাবনা',
        nameEn: 'Pabna',
        upazilas: ['পাবনা সদর', 'ঈশ্বরদী', 'সাঁথিয়া', 'সুজানগর', 'চাটমোহর', 'ফরিদপুর', 'বেড়া'],
      },
    ],
  },
  {
    id: 'khulna',
    nameBn: 'খুলনা',
    nameEn: 'Khulna',
    districts: [
      {
        id: 'khulna',
        nameBn: 'খুলনা',
        nameEn: 'Khulna',
        upazilas: ['খুলনা সদর', 'সোনাডাঙ্গা', 'খালিশপুর', 'দৌলতপুর', 'রূপসা', 'ডুমুরিয়া', 'বটিয়াঘাটা', 'ফুলতলা', 'তেরখাদা', 'দাকোপ', 'পাইকগাছা', 'কয়রা'],
      },
      {
        id: 'jashore',
        nameBn: 'যশোর',
        nameEn: 'Jashore',
        upazilas: ['যশোর সদর', 'ঝিকরগাছা', 'অভয়নগর', 'মণিরামপুর', 'কেশবপুর', 'বাঘারপাড়া', 'শার্শা', 'চৌগাছা'],
      },
      {
        id: 'kushtia',
        nameBn: 'কুষ্টিয়া',
        nameEn: 'Kushtia',
        upazilas: ['কুষ্টিয়া সদর', 'কুমারখালী', 'ভেড়ামারা', 'মিরপুর', 'দৌলতপুর', 'খোকসা'],
      },
    ],
  },
  {
    id: 'sylhet',
    nameBn: 'সিলেট',
    nameEn: 'Sylhet',
    districts: [
      {
        id: 'sylhet',
        nameBn: 'সিলেট',
        nameEn: 'Sylhet',
        upazilas: ['সিলেট সদর', 'দক্ষিণ সুরমা', 'গোলাপগঞ্জ', 'বিয়ানীবাজার', 'বিশ্বনাথ', 'ফেঞ্চুগঞ্জ', 'জৈন্তাপুর', 'কানাইঘাট', 'কোম্পানীগঞ্জ', 'গোয়াইনঘাট'],
      },
      {
        id: 'moulvibazar',
        nameBn: 'মৌলভীবাজার',
        nameEn: 'Moulvibazar',
        upazilas: ['মৌলভীবাজার সদর', 'শ্রীমঙ্গল', 'কমলগঞ্জ', 'কুলাউড়া', 'বড়লেখা', 'রাজনগর', 'জুড়ী'],
      },
      {
        id: 'habiganj',
        nameBn: 'হবিগঞ্জ',
        nameEn: 'Habiganj',
        upazilas: ['হবিগঞ্জ সদর', 'মাধবপুর', 'চুনারুঘাট', 'নবীগঞ্জ', 'বাহুবল', 'বানিয়াচং'],
      },
    ],
  },
  {
    id: 'rangpur',
    nameBn: 'রংপুর',
    nameEn: 'Rangpur',
    districts: [
      {
        id: 'rangpur',
        nameBn: 'রংপুর',
        nameEn: 'Rangpur',
        upazilas: ['রংপুর সদর', 'গঙ্গাচড়া', 'তারাগঞ্জ', 'বদরগঞ্জ', 'মিঠাপুকুর', 'পীরগাছা', 'পীরগঞ্জ', 'কাউনিয়া'],
      },
      {
        id: 'dinajpur',
        nameBn: 'দিনাজপুর',
        nameEn: 'Dinajpur',
        upazilas: ['দিনাজপুর সদর', 'বিরামপুর', 'বীরগঞ্জ', 'বোচাগঞ্জ', 'ফুলবাড়ী', 'পার্বতীপুর', 'হাকিমপুর'],
      },
    ],
  },
  {
    id: 'mymensingh',
    nameBn: 'ময়মনসিংহ',
    nameEn: 'Mymensingh',
    districts: [
      {
        id: 'mymensingh',
        nameBn: 'ময়মনসিংহ',
        nameEn: 'Mymensingh',
        upazilas: ['ময়মনসিংহ সদর', 'ত্রিশাল', 'মুক্তাগাছা', 'ফুলবাড়িয়া', 'ভালুকা', 'গফরগাঁও', 'ঈশ্বরগঞ্জ', 'নান্দাইল', 'হালুয়াঘাট'],
      },
      {
        id: 'jamalpur',
        nameBn: 'জামালপুর',
        nameEn: 'Jamalpur',
        upazilas: ['জামালপুর সদর', 'মেলান্দহ', 'মাদারগঞ্জ', 'ইসলামপুর', 'সরিষাবাড়ী', 'বকশীগঞ্জ', 'দেওয়ানগঞ্জ'],
      },
    ],
  },
];

export const getDistrictsByDivision = (divisionName: string): GeoDistrict[] => {
  const division = BD_GEO_DATA.find(
    (d) => d.nameBn === divisionName || d.nameEn.toLowerCase() === divisionName.toLowerCase()
  );
  return division ? division.districts : [];
};

export const getUpazilasByDistrict = (divisionName: string, districtName: string): string[] => {
  const districts = getDistrictsByDivision(divisionName);
  const district = districts.find(
    (d) => d.nameBn === districtName || d.nameEn.toLowerCase() === districtName.toLowerCase()
  );
  return district ? district.upazilas : [];
};

/**
 * Strips parentheses and normalized English text for clean matching
 */
export const extractCleanGeoName = (name: string): string => {
  if (!name) return '';
  return name.split('(')[0].trim();
};

/**
 * Union / Pourashava / Ward lists by Upazila
 */
export const UPAZILA_UNIONS_MAP: Record<string, string[]> = {
  // Dhaka
  'মিরপুর': ['ওয়ার্ড ৩', 'ওয়ার্ড ৭', 'ওয়ার্ড ৮', 'ওয়ার্ড ১০', 'ওয়ার্ড ১১', 'ওয়ার্ড ১২', 'ওয়ার্ড ১৪', 'মিরপুর সেনানিবাস', 'ওয়ার্ড ২'],
  'ধানমন্ডি': ['ওয়ার্ড ১৫', 'ওয়ার্ড ৪৯', 'ধানমন্ডি আবাসিক এলাকা', 'সাতমসজিদ রোড এলাকা'],
  'উত্তরা': ['সেক্টর ৭', 'সেক্টর ৩', 'সেক্টর ১', 'সেক্টর ৫', 'সেক্টর ৯', 'সেক্টর ১১', 'সেক্টর ১৩', 'ওয়ার্ড ১', 'ওয়ার্ড ৫১'],
  'গুলশান': ['ওয়ার্ড ১৯', 'ওয়ার্ড ২০', 'গুলশান ১ সার্কেল', 'গুলশান ২ সার্কেল'],
  'বনানী': ['ওয়ার্ড ১৯', 'বনানী ব্লক ই', 'বনানী আবাসিক এলাকা', 'কাকলী জোন'],
  'মোহাম্মদপুর': ['ওয়ার্ড ২৯', 'ওয়ার্ড ৩১', 'ওয়ার্ড ৩২', 'ওয়ার্ড ৩৩', 'ওয়ার্ড ৩৪', 'বসিলা ইউনিয়ন'],
  'বাড্ডা': ['ওয়ার্ড ২১', 'ওয়ার্ড ৩৮', 'ওয়ার্ড ৩৯', 'উত্তর বাড্ডা', 'দক্ষিণ বাড্ডা'],
  'খিলগাঁও': ['ওয়ার্ড ১', 'ওয়ার্ড ২', 'ওয়ার্ড ৩', 'খিলগাঁও মডেল ইউনিয়ন'],
  'যাত্রাবাড়ী': ['ওয়ার্ড ৪৮', 'ওয়ার্ড ৫০', 'ওয়ার্ড ৬২', 'ওয়ার্ড ৬৩', 'কুতুবখালী জোন'],
  'মতিঝিল': ['ওয়ার্ড ৯', 'ওয়ার্ড ১০', 'দিলকুশা এলাকা', 'মতিঝিল বা/এ'],
  'তেজগাঁও': ['ওয়ার্ড ২৪', 'ওয়ার্ড ২৫', 'তেজগাঁও শিল্প এলাকা', 'নাখালপাড়া'],
  'সাভার': ['সাভার পৌরসভা', 'আমিনবাজার ইউনিয়ন', 'আশুলিয়া ইউনিয়ন', 'ধামসোনা ইউনিয়ন', 'বিরুলিয়া ইউনিয়ন'],
  'কেরানীগঞ্জ': ['কেরানীগঞ্জ মডেল', 'জিনজিরা ইউনিয়ন', 'কালিন্দী ইউনিয়ন', 'শুভাঢ্যা ইউনিয়ন'],
  // Gazipur & Narayanganj
  'গাজীপুর সদর': ['গাজীপুর সিটি কর্পোরেশন', 'জয়দেবপুর সদর', 'চৌরাস্তা জোন', 'কোনাবাড়ী জোন', 'কাশিমপুর'],
  'টঙ্গী': ['টঙ্গী পশ্চিম জোন', 'টঙ্গী পূর্ব জোন', 'চেরাগ আলী', 'স্টেশন রোড জোন'],
  'নারায়ণগঞ্জ সদর': ['নারায়ণগঞ্জ সিটি কর্পোরেশন', 'চাষাড়া জোন', 'পাইকপাড়া', 'গোদনাইল'],
  'ফতুল্লা': ['ফতুল্লা ইউনিয়ন', 'কুতুবপুর ইউনিয়ন', 'এনায়েতনগর ইউনিয়ন'],
  // Chattogram
  'পাঁচলাইশ': ['ওয়ার্ড ৭', 'ওয়ার্ড ৮', 'নাসিরাবাদ জোন', 'মুরাদপুর জোন'],
  'কোতোয়ালী': ['ওয়ার্ড ২০', 'ওয়ার্ড ২১', 'আন্দরকিল্লা জোন', 'নিউ মার্কেট জোন'],
  // Sylhet
  'সিলেট সদর': ['সিলেট সিটি কর্পোরেশন', 'খাদিমনগর ইউনিয়ন', 'টুকুরবাজার ইউনিয়ন', 'জালালাবাদ ইউনিয়ন'],
  // Rajshahi
  'বোয়ালিয়া': ['ওয়ার্ড ১১', 'ওয়ার্ড ১২', 'ওয়ার্ড ১৪', 'সাহেব বাজার জোন'],
  // Khulna
  'খুলনা সদর': ['ওয়ার্ড ২১', 'ওয়ার্ড ২২', 'ওয়ার্ড ২৪', 'দৌলতপুর জোন'],
};

/**
 * Popular Villages / Areas / Roads by Upazila or Union
 */
export const UPAZILA_AREAS_MAP: Record<string, string[]> = {
  'মিরপুর': ['মিরপুর-১০ গোলচত্বর', 'মিরপুর-১', 'মিরপুর-২', 'পল্লবী', 'কাজীপাড়া', 'শেওড়াপাড়া', 'মিরপুর-১১', 'মিরপুর-১২', 'মিরপুর-১৪', 'রোড ২, ব্লক সি'],
  'ধানমন্ডি': ['ধানমন্ডি ৮/এ', 'ধানমন্ডি ২৭', 'ধানমন্ডি ৩/এ', 'সাতমসজিদ রোড', 'লালমাটিয়া', 'সোবহানবাগ', 'ফার্মগেট সংযোগ'],
  'উত্তরা': ['সেক্টর ৭', 'সেক্টর ৩', 'আজমপুর', 'জসিমউদ্দীন মোড়', 'রাজলক্ষ্মী', 'হাউজবিল্ডিং', 'দিয়াবাড়ী'],
  'গুলশান': ['গুলশান-১', 'গুলশান-২', 'রোড ১১', 'পুলিশ প্লাজা', 'গুলশান এভিনিউ'],
  'বনানী': ['রোড ১১', 'ব্লক ই', 'কাকলী', 'কামাল আতাতুর্ক এভিনিউ', 'বনানী ডিওএইচএস'],
  'মোহাম্মদপুর': ['টাউন হল', 'রিং রোড', 'আসাদগেট', 'তাজমহল রোড', 'নূরজাহান রোড', 'বসিলা ব্রিজ'],
  'বাড্ডা': ['মধ্য বাড্ডা', 'উত্তর বাড্ডা', 'মেরুল বাড্ডা', 'ডিআইটি প্রজেক্ট', 'আফতাবনগর'],
  'যাত্রাবাড়ী': ['যাত্রাবাড়ী চৌরাস্তা', 'ধলপুর মেইন রোড', 'সায়েদাবাদ', 'শনির আখড়া', 'রায়েরবাগ'],
  'সাভার': ['সাভার বাসস্ট্যান্ড', 'সিআরপি রোড', 'আশুলিয়া বাজার', 'বাইপাইল', 'নবীনগর'],
  'গাজীপুর সদর': ['চৌরাস্তা', 'জয়দেবপুর স্টেশন রোড', 'শিববাড়ি মোড়', 'কোনাবাড়ী', 'বোর্ড বাজার'],
  'টঙ্গী': ['টঙ্গী কলেজ রোড', 'চেরাগ আলী মার্কেট', 'টঙ্গী বাজার', 'আব্দুল্লাহপুর সংলগ্ন'],
  'নারায়ণগঞ্জ সদর': ['চাষাড়া মোড়', 'বঙ্গবন্ধু সড়ক', 'কলেজ রোড', 'খানপুর'],
  'পাঁচলাইশ': ['প্রবর্তক মোড়', 'মুরাদপুর', '২ নং গেট', 'জিইসি মোড়', 'নাসিরাবাদ হাউজিং'],
  'সিলেট সদর': ['জিন্দাবাজার', 'আম্বরখানা', 'চৌহাট্টা', 'উপশহর', 'টিলাগড়'],
};

/**
 * Returns Union / Pourashava / Ward options for a selected Upazila
 */
export const getUnionsByUpazila = (upazilaName: string): string[] => {
  if (!upazilaName) return [];
  const cleanUpazila = extractCleanGeoName(upazilaName);
  
  // Look for matched entry in dictionary
  for (const [key, unions] of Object.entries(UPAZILA_UNIONS_MAP)) {
    if (cleanUpazila.includes(key) || key.includes(cleanUpazila)) {
      return unions;
    }
  }

  // Fallback defaults for any upazila in Bangladesh
  return [
    'পৌরসভা / সদর ওয়ার্ড ১-৩',
    'পৌরসভা / সদর ওয়ার্ড ৪-৬',
    'পৌরসভা / সদর ওয়ার্ড ৭-৯',
    '১নং সদর ইউনিয়ন',
    '২নং উত্তর ইউনিয়ন',
    '৩নং দক্ষিণ ইউনিয়ন',
    '৪নং পূর্ব ইউনিয়ন',
    '৫নং পশ্চিম ইউনিয়ন',
  ];
};

/**
 * Returns Village / Area / Road options for a selected Upazila and optional Union
 */
export const getAreasByUnionOrUpazila = (upazilaName: string, unionName?: string): string[] => {
  if (!upazilaName) return [];
  const cleanUpazila = extractCleanGeoName(upazilaName);

  for (const [key, areas] of Object.entries(UPAZILA_AREAS_MAP)) {
    if (cleanUpazila.includes(key) || key.includes(cleanUpazila)) {
      return areas;
    }
  }

  // Fallback defaults for any upazila in Bangladesh
  return [
    'সদর বাজার / প্রধান মোড়',
    'মেইন রোড এলাকা',
    'স্টেশন / বাসস্ট্যান্ড রোড',
    'কলেজ / স্কুল রোড',
    'থানা রোড এলাকা',
    'কেন্দ্রীয় আবাসিক এলাকা',
  ];
};
