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
