import { CapabilityType } from '../types';

export interface ProfessionDef {
  id: string;
  nameBn: string;
  nameEn: string;
  icon: string;
  descriptionBn: string;
  defaultSkills: string[];
}

export interface CapabilityDef {
  id: CapabilityType;
  titleBn: string;
  subtitleBn: string;
  icon: string;
  badgeBn: string;
  isWorkerType?: boolean;
}

export const CAPABILITIES_LIST: CapabilityDef[] = [
  {
    id: 'worker',
    titleBn: 'কাজ করতে চাই',
    subtitleBn: 'দক্ষ টেকনিশিয়ান বা মিস্ত্রি হিসেবে আয় করুন',
    icon: '🛠️',
    badgeBn: 'Worker',
    isWorkerType: true,
  },
  {
    id: 'customer',
    titleBn: 'কাজের মানুষ খুঁজতে চাই',
    subtitleBn: 'বাসা বা অফিসের যে কোনো কাজের দক্ষ লোক নিয়োগ করুন',
    icon: '👤',
    badgeBn: 'Hirer / Customer',
  },
  {
    id: 'job_seeker',
    titleBn: 'চাকরি খুঁজতে চাই',
    subtitleBn: 'ফুল-টাইম, পার্ট-টাইম বা চুক্তিভিত্তিক চাকরির সুযোগ',
    icon: '💼',
    badgeBn: 'Job Seeker',
  },
  {
    id: 'employer',
    titleBn: 'চাকরি দিতে চাই',
    subtitleBn: 'আপনার প্রতিষ্ঠান বা ব্যবসার জন্য কর্মী নিয়োগ করুন',
    icon: '🏢',
    badgeBn: 'Employer',
  },
  {
    id: 'passenger',
    titleBn: 'রাইড নিতে চাই',
    subtitleBn: 'সহজে গন্তব্যে পৌঁছানোর জন্য বাইক বা কার রাইড বুক করুন',
    icon: '🚗',
    badgeBn: 'Passenger',
  },
  {
    id: 'driver',
    titleBn: 'রাইড দিতে চাই',
    subtitleBn: 'বাইক, সিএনজি বা কার দিয়ে যাত্রী পরিবহন করুন',
    icon: '🚕',
    badgeBn: 'Driver',
    isWorkerType: true,
  },
  {
    id: 'delivery_customer',
    titleBn: 'কিছু পাঠাতে চাই',
    subtitleBn: 'শহরের মধ্যে পার্সেল বা ডকুমেন্ট দ্রুত ও নিরাপদে পাঠান',
    icon: '📦',
    badgeBn: 'Delivery Customer',
  },
  {
    id: 'delivery_rider',
    titleBn: 'ডেলিভারি করতে চাই',
    subtitleBn: 'পার্সেল, খাবার বা প্রয়োজনীয় পণ্য ডেলিভারি করুন',
    icon: '🛵',
    badgeBn: 'Rider',
    isWorkerType: true,
  },
  {
    id: 'buyer',
    titleBn: 'পণ্য কিনতে চাই',
    subtitleBn: 'লোকাল মার্কেটপ্লেস থেকে সাশ্রয়ী মূল্যে পণ্য কিনুন',
    icon: '🛒',
    badgeBn: 'Buyer',
  },
  {
    id: 'seller',
    titleBn: 'পণ্য বিক্রি করতে চাই',
    subtitleBn: 'নতুন বা ব্যবহৃত পণ্য স্থানীয় ক্রেতাদের কাছে বিক্রি করুন',
    icon: '🏪',
    badgeBn: 'Seller',
  },
];

export const STANDARD_PROFESSIONS: ProfessionDef[] = [
  {
    id: 'electrician',
    nameBn: 'ইলেকট্রিশিয়ান (Electrician)',
    nameEn: 'Electrician',
    icon: '⚡',
    descriptionBn: 'বাসাবাড়ি ও কারখানার বৈদ্যুতিক ওয়্যারিং ও সামগ্রী মেরামত',
    defaultSkills: [
      'Fan Installation (ফ্যান ফিটিং)',
      'Light Installation (লাইট সংযোগ)',
      'House Wiring (হাউস ওয়্যারিং)',
      'Switch Repair (সুইচবোর্ড মেরামত)',
      'MCB Installation (সার্কিট ব্রেকার)',
      'Generator Servicing (জেনারেটর সার্ভিসিং)',
      'Solar Panel Setup (সোলার প্যানেল)',
      'IPS & Battery Repair (আইপিএস মেরামত)',
    ],
  },
  {
    id: 'ac_technician',
    nameBn: 'এসি টেকনিশিয়ান (AC Technician)',
    nameEn: 'AC Technician',
    icon: '❄️',
    descriptionBn: 'এসি ইনস্টলেশন, গ্যাস রিফিল ও নিয়মিত সার্ভিসিং',
    defaultSkills: [
      'AC Installation (এসি ফিটিং ও স্থানান্তর)',
      'Gas Refill (গ্যাস রিফিল ও লিক চেক)',
      'Compressor Repair (কম্প্রেসার মেরামত)',
      'AC Deep Cleaning (জেট ওয়াশ ও সার্ভিসিং)',
      'Master Circuit Repair (পিসিবি সার্কিট মেরামত)',
      'Thermostat Replacement (থার্মোস্টেট পরিবর্তন)',
    ],
  },
  {
    id: 'plumber',
    nameBn: 'প্লাম্বার ও স্যানিটারি মিস্ত্রি (Plumber)',
    nameEn: 'Plumber',
    icon: '🔧',
    descriptionBn: 'পানির লাইন ফিটিং, ড্রেনেজ ও স্যানিটারি ওয়্যার মেরামত',
    defaultSkills: [
      'Pipe Fitting (পাইপ সংযোগ ও মেরামত)',
      'Sanitary Ware Setup (বেসিন ও কমোড ফিটিং)',
      'Water Pump Installation (পানির মোটর/পাম্প)',
      'Water Leakage Repair (পানির লিকেজ মেরামত)',
      'Drainage Unblocking (ড্রেন ও পাইপ জ্যাম ক্লিনিং)',
      'Geyser & Water Heater (গিজার ইনস্টলেশন)',
      'Water Tank Cleaning (পানির ট্যাংক পরিষ্কার)',
    ],
  },
  {
    id: 'painter',
    nameBn: 'রং মিস্ত্রি (Painter)',
    nameEn: 'Painter',
    icon: '🎨',
    descriptionBn: 'দেয়াল পেইন্টিং, পুটিং ও পলিশিং কাজ',
    defaultSkills: [
      'Interior Wall Painting (ভেতরের দেয়াল রং)',
      'Exterior Weather Coating (বাইরের ওয়েদার কোট)',
      'Wall Putty & Primer (পুটিং ও প্রাইমার ফিনিশিং)',
      'Wood Polishing & Lacquer (কাঠের ফার্নিচার পলিশ)',
      'Waterproofing (ছাদ ও দেয়ালের ড্যাম্প প্রুফিং)',
      'Texture Design (টেক্সচার ও ডেকোরেশন)',
    ],
  },
  {
    id: 'it_technician',
    nameBn: 'কম্পিউটার ও মোবাইল টেকনিশিয়ান',
    nameEn: 'Computer & Mobile Technician',
    icon: '💻',
    descriptionBn: 'ল্যাপটপ, ডেস্কটপ, প্রিন্টার ও স্মার্টফোন মেরামত',
    defaultSkills: [
      'Windows & OS Setup (উইন্ডোজ সেটআপ)',
      'Hardware Troubleshooting (হার্ডওয়্যার মেরামত)',
      'Laptop Display & Keyboard (ডিসপ্লে ও কিবোর্ড পরিবর্তন)',
      'CCTV Camera Setup (সিসিটিভি ক্যামেরা ইনস্টলেশন)',
      'Wi-Fi & Router Setup (ওয়াইফাই নেটওয়ার্কিং)',
      'Mobile Display & Charging Port (মোবাইল চার্জিং ও স্ক্রিন)',
    ],
  },
  {
    id: 'carpenter',
    nameBn: 'কাঠমিস্ত্রি (Carpenter)',
    nameEn: 'Carpenter',
    icon: '🪚',
    descriptionBn: 'ফার্নিচার তৈরি, দরজার লক ফিটিং ও কাঠের ইন্টেরিয়র',
    defaultSkills: [
      'Furniture Making (খাট, আলমারি, টেবিল তৈরি)',
      'Door & Window Fitting (দরজা ও জানালা ফিটিং)',
      'Lock & Handle Repair (লক ও হ্যান্ডেল পরিবর্তন)',
      'Kitchen Cabinet Setup (কিচেন ক্যাবিনেট)',
      'Partition & Ceiling (সিলিং ও কাঠের পার্টিশন)',
    ],
  },
  {
    id: 'mason',
    nameBn: 'রাজমিস্ত্রি ও টাইলস মিস্ত্রি (Mason)',
    nameEn: 'Mason',
    icon: '🧱',
    descriptionBn: 'ইট গাঁথুনি, প্লাস্টার, টাইলস ও মার্বেল ফিটিং',
    defaultSkills: [
      'Brickwork (ইট গাঁথুনির কাজ)',
      'Plastering (দেয়াল ও সিলিং প্লাস্টার)',
      'Tiles & Marble Fitting (টাইলস ও মার্বেল বসানো)',
      'Concrete Casting (ছাদ ও পিলার ঢালাই)',
      'Waterproofing & Renovation (পুরাতন বাড়ি সংস্কার)',
    ],
  },
  {
    id: 'appliance_repair',
    nameBn: 'হোম অ্যাপ্লায়েন্স মেরামত (Appliance Repair)',
    nameEn: 'Appliance Repair',
    icon: '🔌',
    descriptionBn: 'ফ্রিজ, ওয়াশিং মেশিন, ওভেন ও টিভি মেরামত',
    defaultSkills: [
      'Refrigerator Gas & Thermostat (ফ্রিজের গ্যাস ও কুলিং)',
      'Washing Machine Motor (ওয়াশিং মেশিন ড্রাম ও মোটর)',
      'Microwave Oven Repair (মাইক্রোওয়েভ ওভেন হিটিং)',
      'LED TV Screen & Power (টিভি প্যানেল ও পাওয়ার সাপ্লাই)',
      'Blender & Mixer Repair (ব্লেন্ডার ও মিক্সার)',
    ],
  },
  {
    id: 'cleaner',
    nameBn: 'ক্লিনার ও ডিপ ক্লিনিং কর্মী (Cleaning Specialist)',
    nameEn: 'Cleaning Specialist',
    icon: '🧹',
    descriptionBn: 'বাসা ও অফিসের ডিপ ক্লিনিং এবং জীবাণুমুক্তকরণ',
    defaultSkills: [
      'Full Home Deep Cleaning (বাসার সম্পূর্ণ পরিষ্কার)',
      'Sofa & Carpet Shampoo Wash (সোফা ও কার্পেট ওয়াশ)',
      'Kitchen Oil & Stain Removal (কিচেন ডিপ ক্লিন)',
      'Bathroom Acid Wash & Descaling (বাথরুম পরিষ্কার)',
      'Pest Control & Disinfection (পোকা-মাকড় দমন ও স্প্রে)',
    ],
  },
  {
    id: 'driver',
    nameBn: 'ড্রাইভার ও রাইডার (Professional Driver)',
    nameEn: 'Professional Driver',
    icon: '🚘',
    descriptionBn: 'ব্যক্তিগত ও বাণিজ্যিক গাড়ি চালনা',
    defaultSkills: [
      'Private Car Driving (প্রাইভেট কার চালনা)',
      'Motorcycle & Scooter Riding (বাইক রাইডিং)',
      'CNG & Auto Driving (সিএনজি / অটো চালনা)',
      'Microbus & Van Driving (মাইক্রোবাস ও পিকআপ)',
      'Highway & Long Route Driving (হাইওয়ে ড্রাইভিং)',
    ],
  },
];

export const PROFESSIONS_LIST = STANDARD_PROFESSIONS;

export const getProfessionSkills = (professionName: string): string[] => {
  const found = STANDARD_PROFESSIONS.find(
    (p) =>
      p.nameBn.toLowerCase().includes(professionName.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(professionName.toLowerCase()) ||
      professionName.toLowerCase().includes(p.id)
  );
  return found ? found.defaultSkills : [];
};
