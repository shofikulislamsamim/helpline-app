import { CapabilityType, ServiceDeliveryType } from '../types';

export interface ServiceTypeOption {
  id: ServiceDeliveryType;
  titleBn: string;
  titleEn?: string;
  subtitleBn: string;
  subtitleEn?: string;
  icon: string;
}

export const SERVICE_TYPES_LIST: ServiceTypeOption[] = [
  {
    id: 'on_demand',
    titleBn: 'জরুরি / অন-ডিমান্ড সেবা',
    titleEn: 'Emergency / On-Demand Service',
    subtitleBn: 'জরুরি প্রয়োজনে তাৎক্ষণিক পৌঁছানো ও সমাধান',
    subtitleEn: 'Instant arrival and prompt resolution for urgent needs',
    icon: '⚡',
  },
  {
    id: 'daily',
    titleBn: 'দৈনিক মজুরিভিত্তিক (Daily Basis)',
    titleEn: 'Daily Basis (Day Wage)',
    subtitleBn: 'সারাদিনের কাজের জন্য দৈনিক চুক্তিতে',
    subtitleEn: 'Daily contract for full-day work tasks',
    icon: '📅',
  },
  {
    id: 'contractual',
    titleBn: 'চুক্তিভিত্তিক / প্রজেক্ট (Contractual)',
    titleEn: 'Contractual / Project-Based',
    subtitleBn: 'নির্দিষ্ট কাজের আকার ও পরিমাণের ওপর ভিত্তি করে',
    subtitleEn: 'Based on defined scope and volume of the project',
    icon: '📝',
  },
  {
    id: 'full_time',
    titleBn: 'ফুল-টাইম (Full Time)',
    titleEn: 'Full-Time Employment',
    subtitleBn: 'নিয়মিত মাসিক বা দীর্ঘমেয়াদী পূর্ণকালীন নিয়োগ',
    subtitleEn: 'Regular monthly or long-term full-time engagement',
    icon: '💼',
  },
  {
    id: 'part_time',
    titleBn: 'পার্ট-টাইম (Part Time)',
    titleEn: 'Part-Time Work',
    subtitleBn: 'দৈনিক নির্দিষ্ট কয়েক ঘণ্টা বা ছুটির দিনে',
    subtitleEn: 'Specific hours per day or weekend shifts',
    icon: '⏱️',
  },
  {
    id: 'remote',
    titleBn: 'দূরবর্তী / হোম ভিজিট (Remote / Home Visit)',
    titleEn: 'Remote / Home Visit',
    subtitleBn: 'গ্রাহকের ঠিকানায় সরাসরি পরিদর্শন বা অনলাইন কনসাল্টেশন',
    subtitleEn: 'On-site visit at customer address or online consultation',
    icon: '🏠',
  },
];

export interface ProfessionDef {
  id: string;
  nameBn: string;
  nameEn: string;
  categoryMode: 'physical' | 'digital';
  icon: string;
  descriptionBn: string;
  descriptionEn?: string;
  defaultSkills: string[];
  suggestedKeywords?: string[];
}

export interface CapabilityDef {
  id: CapabilityType;
  titleBn: string;
  titleEn?: string;
  subtitleBn: string;
  subtitleEn?: string;
  icon: string;
  badgeBn: string;
  badgeEn?: string;
  isWorkerType?: boolean;
}

export const CAPABILITIES_LIST: CapabilityDef[] = [
  {
    id: 'worker',
    titleBn: 'কাজ করতে চাই',
    titleEn: 'I Want to Work',
    subtitleBn: 'দক্ষ কর্মী বা পেশাজীবী হিসেবে কাজ করুন',
    subtitleEn: 'Offer your skills and services',
    icon: '🛠️',
    badgeBn: 'Worker',
    badgeEn: 'Worker',
    isWorkerType: true,
  },
  {
    id: 'customer',
    titleBn: 'কাজের মানুষ খুঁজতে চাই',
    titleEn: 'I Want to Hire',
    subtitleBn: 'দক্ষ কর্মী বা পেশাজীবী নিয়োগ করুন',
    subtitleEn: 'Hire skilled workers and professionals',
    icon: '👤',
    badgeBn: 'Hirer / Customer',
    badgeEn: 'Customer',
  },
  {
    id: 'job_seeker',
    titleBn: 'চাকরি খুঁজতে চাই',
    titleEn: 'Looking for a Job',
    subtitleBn: 'চাকরি ও কর্মসংস্থানের সুযোগ খুঁজুন',
    subtitleEn: 'Find suitable job opportunities',
    icon: '💼',
    badgeBn: 'Job Seeker',
    badgeEn: 'Job Seeker',
  },
  {
    id: 'employer',
    titleBn: 'চাকরি দিতে চাই',
    titleEn: 'Looking to Hire Staff',
    subtitleBn: 'আপনার প্রতিষ্ঠান বা ব্যবসার জন্য কর্মী নিয়োগ করুন',
    subtitleEn: 'Recruit employees for your organization',
    icon: '🏢',
    badgeBn: 'Employer',
    badgeEn: 'Employer',
  },
];

export const STANDARD_PROFESSIONS: ProfessionDef[] = [
  // 📍 Physical / Local Services
  {
    id: 'electrician',
    nameBn: 'ইলেকট্রিশিয়ান (Electrician)',
    nameEn: 'Electrician',
    categoryMode: 'physical',
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
    suggestedKeywords: [
      'Electrician',
      'ইলেকট্রিশিয়ান',
      'ইলেকট্রিশিয়ান',
      'ইলেকট্রিক মিস্ত্রি',
      'বৈদ্যুতিক মিস্ত্রি',
      'বাসার ইলেকট্রিক কাজ',
      'ফ্যান লাগানো',
      'ফ্যান মেরামত',
      'House Wiring',
      'Electrical Work',
      'সার্কিট ব্রেকার',
      'আইপিএস মেরামত'
    ],
  },
  {
    id: 'ac_technician',
    nameBn: 'এসি টেকনিশিয়ান (AC Technician)',
    nameEn: 'AC Technician',
    categoryMode: 'physical',
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
    suggestedKeywords: [
      'AC Technician',
      'এসি টেকনিশিয়ান',
      'এসি মিস্ত্রি',
      'এসি সার্ভিসিং',
      'এসি মেরামত',
      'এসি গ্যাস রিফিল',
      'AC Servicing',
      'AC Repair',
      'AC Installation',
      'ইনভার্টার এসি গ্যাস'
    ],
  },
  {
    id: 'plumber',
    nameBn: 'প্লাম্বার ও স্যানিটারি মিস্ত্রি (Plumber)',
    nameEn: 'Plumber',
    categoryMode: 'physical',
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
    suggestedKeywords: [
      'Plumber',
      'প্লাম্বার',
      'স্যানিটারি মিস্ত্রি',
      'পাইপ মিস্ত্রি',
      'পানির মিস্ত্রি',
      'পানির পাম্প',
      'পাইপ লিকেজ',
      'কমোড ফিটিং',
      'গিজার ইনস্টলেশন'
    ],
  },
  {
    id: 'painter',
    nameBn: 'রং মিস্ত্রি (Painter)',
    nameEn: 'Painter',
    categoryMode: 'physical',
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
    suggestedKeywords: [
      'Painter',
      'রং মিস্ত্রি',
      'পেইন্টার',
      'ওয়াল পেইন্টিং',
      'দেয়াল রং',
      'পুটিং ও রং',
      'রংমিস্ত্রি'
    ],
  },
  {
    id: 'it_technician',
    nameBn: 'কম্পিউটার ও মোবাইল টেকনিশিয়ান',
    nameEn: 'Computer & Mobile Technician',
    categoryMode: 'physical',
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
    suggestedKeywords: [
      'Computer Technician',
      'কম্পিউটার টেকনিশিয়ান',
      'ল্যাপটপ মেরামত',
      'সিসিটিভি ক্যামেরা',
      'ওয়াইফাই রাউটার',
      'উইন্ডোজ সেটআপ'
    ],
  },
  {
    id: 'carpenter',
    nameBn: 'কাঠমিস্ত্রি (Carpenter)',
    nameEn: 'Carpenter',
    categoryMode: 'physical',
    icon: '🪚',
    descriptionBn: 'ফার্নিচার তৈরি, দরজার লক ফিটিং ও কাঠের ইন্টেরিয়র',
    defaultSkills: [
      'Furniture Making (খাট, আলমারি, টেবিল তৈরি)',
      'Door & Window Fitting (দরজা ও জানালা ফিটিং)',
      'Lock & Handle Repair (লক ও হ্যান্ডেল পরিবর্তন)',
      'Kitchen Cabinet Setup (কিচেন ক্যাবিনেট)',
      'Partition & Ceiling (সিলিং ও কাঠের পার্টিশন)',
    ],
    suggestedKeywords: [
      'Carpenter',
      'কাঠমিস্ত্রি',
      'ফার্নিচার মিস্ত্রি',
      'দরজা ফিটিং',
      'লক মেরামত',
      'কাঠের কাজ'
    ],
  },
  {
    id: 'mason',
    nameBn: 'রাজমিস্ত্রি ও টাইলস মিস্ত্রি (Mason)',
    nameEn: 'Mason',
    categoryMode: 'physical',
    icon: '🧱',
    descriptionBn: 'ইট গাঁথুনি, প্লাস্টার, টাইলস ও মার্বেল ফিটিং',
    defaultSkills: [
      'Brickwork (ইট গাঁথুনির কাজ)',
      'Plastering (দেয়াল ও সিলিং প্লাস্টার)',
      'Tiles & Marble Fitting (টাইলস ও মার্বেল বসানো)',
      'Concrete Casting (ছাদ ও পিলার ঢালাই)',
      'Waterproofing & Renovation (পুরাতন বাড়ি সংস্কার)',
    ],
    suggestedKeywords: [
      'Mason',
      'রাজমিস্ত্রি',
      'টাইলস মিস্ত্রি',
      'মার্বেল মিস্ত্রি',
      'প্লাস্টার',
      'বিল্ডিং নির্মাণ'
    ],
  },
  {
    id: 'appliance_repair',
    nameBn: 'হোম অ্যাপ্লায়েন্স মেরামত (Appliance Repair)',
    nameEn: 'Appliance Repair',
    categoryMode: 'physical',
    icon: '🔌',
    descriptionBn: 'ফ্রিজ, ওয়াশিং মেশিন, ওভেন ও টিভি মেরামত',
    defaultSkills: [
      'Refrigerator Gas & Thermostat (ফ্রিজের গ্যাস ও কুলিং)',
      'Washing Machine Motor (ওয়াশিং মেশিন ড্রাম ও মোটর)',
      'Microwave Oven Repair (মাইক্রোওয়েভ ওভেন হিটিং)',
      'LED TV Screen & Power (টিভি প্যানেল ও পাওয়ার সাপ্লাই)',
      'Blender & Mixer Repair (ব্লেন্ডার ও মিক্সার)',
    ],
    suggestedKeywords: [
      'Appliance Repair',
      'হোম অ্যাপ্লায়েন্স',
      'ফ্রিজ মিস্ত্রি',
      'ওভেন মেরামত',
      'টিভি মেরামত',
      'ওয়াশিং মেশিন মেরামত'
    ],
  },
  {
    id: 'cleaner',
    nameBn: 'ক্লিনার ও ডিপ ক্লিনিং কর্মী (Cleaning Specialist)',
    nameEn: 'Cleaning Specialist',
    categoryMode: 'physical',
    icon: '🧹',
    descriptionBn: 'বাসা ও অফিসের ডিপ ক্লিনিং এবং জীবাণুমুক্তকরণ',
    defaultSkills: [
      'Full Home Deep Cleaning (বাসার সম্পূর্ণ পরিষ্কার)',
      'Sofa & Carpet Shampoo Wash (সোফা ও কার্পেট ওয়াশ)',
      'Kitchen Oil & Stain Removal (কিচেন ডিপ ক্লিন)',
      'Bathroom Acid Wash & Descaling (বাথরুম পরিষ্কার)',
      'Pest Control & Disinfection (পোকা-মাকড় দমন ও স্প্রে)',
    ],
    suggestedKeywords: [
      'Cleaner',
      'ক্লিনার',
      'ডিপ ক্লিনিং',
      'বাসা পরিষ্কার',
      'সোফা ওয়াশ',
      'কার্পেট ওয়াশ',
      'পেস্ট কন্ট্রোল'
    ],
  },
  {
    id: 'driver',
    nameBn: 'ড্রাইভার ও রাইডার (Professional Driver)',
    nameEn: 'Professional Driver',
    categoryMode: 'physical',
    icon: '🚘',
    descriptionBn: 'ব্যক্তিগত ও বাণিজ্যিক গাড়ি চালনা',
    defaultSkills: [
      'Private Car Driving (প্রাইভেট কার চালনা)',
      'Motorcycle & Scooter Riding (বাইক রাইডিং)',
      'CNG & Auto Driving (সিএনজি / অটো চালনা)',
      'Microbus & Van Driving (মাইক্রোবাস ও পিকআপ)',
      'Highway & Long Route Driving (হাইওয়ে ড্রাইভিং)',
    ],
    suggestedKeywords: [
      'Driver',
      'ড্রাইভার',
      'গাড়ি চালক',
      'ব্যক্তিগত ড্রাইভার',
      'প্রাইভেট কার',
      'রাইডার'
    ],
  },

  // 💻 Freelance / Digital Services
  {
    id: 'graphic_designer',
    nameBn: 'গ্রাফিক ডিজাইনার (Graphic Designer)',
    nameEn: 'Graphic Designer',
    categoryMode: 'digital',
    icon: '🎨',
    descriptionBn: 'লোগো, সোশ্যাল মিডিয়া পোস্ট, ব্যানার ও ব্র্যান্ড আইডেন্টিটি ডিজাইন',
    defaultSkills: [
      'Logo Design (লোগো ডিজাইন)',
      'Social Media Design (সোশ্যাল মিডিয়া পোস্ট ও ব্যানার)',
      'Thumbnail Design (ইউটিউব থাম্বনেইল ডিজাইন)',
      'Brand Identity (ব্র্যান্ডিং ও কালার প্যালেট)',
      'Flyer & Brochure (ফ্লায়ার ও ব্রোশিউর ডিজাইন)',
      'Vector Illustration (ভেক্টর আর্ট ও ইলাস্ট্রেশন)',
      'Photoshop & Illustrator (ফটোশপ ও ইলাস্ট্রেটর)',
    ],
    suggestedKeywords: [
      'Graphic Designer',
      'গ্রাফিক ডিজাইনার',
      'গ্রাফিক্স ডিজাইনার',
      'Logo Maker',
      'লোগো ডিজাইন',
      'লোগো ডিজাইনার',
      'ব্যানার ডিজাইন',
      'Thumbnail Design',
      'Photoshop',
      'Illustrator',
      'সোশ্যাল মিডিয়া ব্যানার'
    ],
  },
  {
    id: 'video_editor',
    nameBn: 'ভিডিও এডিটর (Video Editor)',
    nameEn: 'Video Editor',
    categoryMode: 'digital',
    icon: '🎬',
    descriptionBn: 'ইউটিউব ভিডিও, রিলস, শর্টস, কালার গ্রেডিং ও মোশন গ্রাফিক্স',
    defaultSkills: [
      'YouTube Video Editing (ইউটিউব ভিডিও এডিটিং)',
      'Reels & Shorts Editing (রিলস ও শর্টস তৈরি)',
      'Color Grading & Correction (কালার গ্রেডিং)',
      'Audio Mixing & Sound Design (অডিও মিক্সিং)',
      'Motion Graphics (মোশন গ্রাফিক্স ও ট্রানজিশন)',
      'Subtitle & Caption (সাবটাইটেল যুক্ত করা)',
    ],
    suggestedKeywords: [
      'Video Editor',
      'ভিডিও এডিটর',
      'ভিডিও এডিটিং',
      'Reels Editor',
      'রিলস এডিটিং',
      'Premiere Pro',
      'After Effects',
      'Shorts Maker',
      'ইউটিউব এডিটর'
    ],
  },
  {
    id: 'web_developer',
    nameBn: 'ওয়েব ডেভেলপার (Web Developer)',
    nameEn: 'Web Developer',
    categoryMode: 'digital',
    icon: '💻',
    descriptionBn: 'ওয়েবসাইট ডিজাইন, ওয়ার্ডপ্রেস, ফ্রন্টএন্ড ও ফুল স্ট্যাক ডেভেলপমেন্ট',
    defaultSkills: [
      'WordPress Customization (ওয়ার্ডপ্রেস ওয়েবসাইট)',
      'Frontend Development (React, HTML, CSS)',
      'E-commerce Store Setup (অনলাইন শপ তৈরি)',
      'Landing Page Design (ল্যান্ডিং পেজ ডিজাইন)',
      'Bug Fixing & Speed (বাগ ফিক্স ও স্পিড বৃদ্ধি)',
      'Full Stack Development (Node, Express, DB)',
    ],
    suggestedKeywords: [
      'Web Developer',
      'ওয়েব ডেভেলপার',
      'ওয়েবসাইট তৈরি',
      'WordPress Expert',
      'ওয়েব ডিজাইন',
      'Frontend Developer',
      'Full Stack Developer',
      'React Developer',
      'ল্যান্ডিং পেজ'
    ],
  },
  {
    id: 'digital_marketer',
    nameBn: 'ডিজিটাল মার্কেটার ও এসইও (Digital Marketer)',
    nameEn: 'Digital Marketer',
    categoryMode: 'digital',
    icon: '📈',
    descriptionBn: 'ফেসবুক অ্যাডস, গুগল ক্যাম্পেইন, এসইও ও সোশ্যাল মিডিয়া প্রমোশন',
    defaultSkills: [
      'Facebook & Instagram Ads (ফেসবুক পেইড ক্যাম্পেইন)',
      'Google Ads & Search Marketing (গুগল অ্যাডস)',
      'SEO / Search Engine Optimization (ওয়েবসাইট এসইও)',
      'Social Media Page Management (পেইজ ম্যানেজমেন্ট)',
      'Content Strategy & Copywriting (কন্টেন্ট মার্কেটিং)',
    ],
    suggestedKeywords: [
      'Digital Marketer',
      'ডিজিটাল মার্কেটিং',
      'Facebook Ads',
      'এসইও বিশেষজ্ঞ',
      'Google Ads',
      'সোশ্যাল মিডিয়া মার্কেটিং',
      'ফেসবুক বুস্টিং'
    ],
  },
  {
    id: 'content_writer',
    nameBn: 'কন্টেন্ট রাইটার ও অনুবাদক (Content Writer)',
    nameEn: 'Content Writer',
    categoryMode: 'digital',
    icon: '✍️',
    descriptionBn: 'বাংলা ও ইংরেজি আর্টিকেল, ব্লগের লেখা, কপিরাইটিং ও অনুবাদ',
    defaultSkills: [
      'Bengali Content Writing (বাংলা আর্টিকেল ও ব্লগ)',
      'English Content Writing (ইংরেজি কন্টেন্ট)',
      'English to Bengali Translation (ইংরেজি থেকে বাংলা অনুবাদ)',
      'Ad Copywriting (বিজ্ঞাপনের জন্য আকর্ষণীয় লেখা)',
      'Proofreading & Editing (প্রুফরিডিং ও বানান সংশোধন)',
    ],
    suggestedKeywords: [
      'Content Writer',
      'কন্টেন্ট রাইটার',
      'অনুবাদক',
      'কপিরাইটার',
      'ইংরেজি থেকে বাংলা অনুবাদ',
      'আর্টিকেল লেখা',
      'ব্লগ লেখক'
    ],
  },
  {
    id: 'ui_ux_designer',
    nameBn: 'ইউআই/ইউএক্স ডিজাইনার (UI/UX Designer)',
    nameEn: 'UI/UX Designer',
    categoryMode: 'digital',
    icon: '📱',
    descriptionBn: 'মোবাইল অ্যাপ ও ওয়েবসাইটের ইউজার ইন্টারফেস ও প্রোটোটাইপ ডিজাইন',
    defaultSkills: [
      'Mobile App UI Design (মোবাইল অ্যাপ ডিজাইন)',
      'Web UI & Dashboard Design (ওয়েব ড্যাশবোর্ড)',
      'Figma Prototyping (ফিগমা প্রোটোটাইপ)',
      'Wireframing & User Flow (ওয়্যারফ্রেম তৈরি)',
      'Design System & Components (ডিজাইন সিস্টেম)',
    ],
    suggestedKeywords: [
      'UI/UX Designer',
      'ইউআই ডিজাইনার',
      'Figma Expert',
      'অ্যাপ ডিজাইন',
      'ওয়েবসাইট লেআউট',
      'User Interface'
    ],
  },
];

export const PROFESSIONS_LIST = STANDARD_PROFESSIONS;

export const getProfessionsByCategory = (category: 'physical' | 'digital'): ProfessionDef[] => {
  return STANDARD_PROFESSIONS.filter((p) => p.categoryMode === category);
};

export const getProfessionByName = (name: string): ProfessionDef | undefined => {
  if (!name) return undefined;
  const q = name.toLowerCase().trim();
  return STANDARD_PROFESSIONS.find(
    (p) =>
      p.id.toLowerCase() === q ||
      p.nameBn.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      q.includes(p.nameBn.toLowerCase()) ||
      q.includes(p.nameEn.toLowerCase())
  );
};

export const getProfessionSkills = (professionName: string): string[] => {
  if (!professionName) return [];
  const found = getProfessionByName(professionName);
  return found ? found.defaultSkills : [];
};

export const getSuggestedKeywordsForSelection = (
  professions: string[] = [],
  skills: string[] = []
): string[] => {
  const result = new Set<string>();

  // Add keywords from matched professions
  professions.forEach((pName) => {
    const matched = getProfessionByName(pName);
    if (matched?.suggestedKeywords) {
      matched.suggestedKeywords.forEach((kw) => result.add(kw));
    } else {
      // Custom profession: add raw name
      result.add(pName);
    }
  });

  // Add relevant skill keywords
  skills.forEach((sk) => {
    // strip parentheses if any: e.g. "Fan Installation (ফ্যান ফিটিং)" -> "Fan Installation", "ফ্যান ফিটিং"
    const cleaned = sk.replace(/[()]/g, ' ').trim();
    if (cleaned.length > 2) {
      result.add(cleaned);
    }
  });

  // Base helpful service keywords
  result.add('জরুরি সার্ভিস');
  result.add('অভিজ্ঞ মিস্ত্রি');
  result.add('বাসায় এসে কাজ');

  return Array.from(result);
};
