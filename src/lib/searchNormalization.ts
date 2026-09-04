/**
 * Search normalization engine for HelpLine
 * Handles Bengali & English text normalization, spelling variations,
 * and tokenization for future HIRE search indexing.
 */

/**
 * Standardize Bengali text by normalizing common vowel/consonant representations
 */
export function normalizeBengali(text: string): string {
  if (!text) return '';

  return text
    // Replace decomposed characters with unified ones
    .replace(/\u09AF\u09BC/g, 'য়') // য + ় -> য়
    .replace(/\u09A1\u09BC/g, 'ড়') // ড + ় -> ড়
    .replace(/\u09A2\u09BC/g, 'ঢ়') // ঢ + ় -> ঢ়
    // Normalize long vowels to short vowels for fuzzy match
    .replace(/ী/g, 'ি')
    .replace(/ঈ/g, 'ই')
    .replace(/ূ/g, 'ু')
    .replace(/ঊ/g, 'উ')
    // Normalize sibilants
    .replace(/[শষ]/g, 'স')
    // Normalize retroflex nasal
    .replace(/ণ/g, 'ন')
    // Normalize candrabindu & hasanta
    .replace(/ঁ/g, '')
    // Replace punctuation and symbols with space
    .replace(/[\.,\-_+=\/\\|:;'"?!@#$%^&*()[\]{}<>~`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Standardize English & general text
 */
export function normalizeGeneral(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\.,\-_+=\/\\|:;'"?!@#$%^&*()[\]{}<>~`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Common Bengali & English keyword variations dictionary
 */
export const SYNONYM_DICTIONARY: Record<string, string[]> = {
  // Electrician
  electrician: ['electrician', 'ইলেকট্রিশিয়ান', 'ইলেকট্রিশিয়ান', 'ইলেকট্রিক মিস্ত্রি', 'বৈদ্যুতিক মিস্ত্রি', 'ফ্যান ফিটিং', 'হাউস ওয়্যারিং', 'wiring'],
  'ইলেকট্রিশিয়ান': ['electrician', 'ইলেকট্রিশিয়ান', 'ইলেকট্রিশিয়ান', 'ইলেকট্রিক মিস্ত্রি', 'বৈদ্যুতিক মিস্ত্রি', 'বাসার ইলেকট্রিক কাজ', 'house wiring'],
  'ইলেকট্রিশিয়ান': ['electrician', 'ইলেকট্রিশিয়ান', 'ইলেকট্রিশিয়ান', 'ইলেকট্রিক মিস্ত্রি', 'বৈদ্যুতিক মিস্ত্রি'],
  'ইলেকট্রিক মিস্ত্রি': ['electrician', 'ইলেকট্রিশিয়ান', 'ইলেকট্রিক মিস্ত্রি', 'বৈদ্যুতিক মিস্ত্রি', 'electrical work'],
  
  // Plumber
  plumber: ['plumber', 'প্লাম্বার', 'স্যানিটারি মিস্ত্রি', 'পাইপ মিস্ত্রি', 'পানির মিস্ত্রি', 'pipe repair'],
  'প্লাম্বার': ['plumber', 'প্লাম্বার', 'স্যানিটারি মিস্ত্রি', 'পাইপ ফিটিং', 'পানির পাম্প'],
  'স্যানিটারি মিস্ত্রি': ['plumber', 'প্লাম্বার', 'স্যানিটারি মিস্ত্রি', 'কমোড ফিটিং', 'বেসিন মেরামত'],
  
  // AC Technician
  'ac technician': ['ac technician', 'এসি টেকনিশিয়ান', 'এসি মিস্ত্রি', 'ac servicing', 'ac repair', 'এসি গ্যাস রিফিল'],
  'এসি টেকনিশিয়ান': ['ac technician', 'এসি টেকনিশিয়ান', 'এসি মিস্ত্রি', 'এসি সার্ভিসিং', 'এসি মেরামত', 'ac installation'],
  'এসি মিস্ত্রি': ['ac technician', 'এসি টেকনিশিয়ান', 'এসি মিস্ত্রি', 'ac gas refill'],

  // Graphic Designer
  'graphic designer': ['graphic designer', 'গ্রাফিক ডিজাইনার', 'গ্রাফিক্স ডিজাইনার', 'logo designer', 'লোগো ডিজাইন', 'thumbnail maker', 'banner design'],
  'গ্রাফিক ডিজাইনার': ['graphic designer', 'গ্রাফিক ডিজাইনার', 'গ্রাফিক্স ডিজাইনার', 'লোগো ডিজাইনার', 'লোগো তৈরি', 'ব্যানার ডিজাইন'],
  'লোগো ডিজাইনার': ['logo designer', 'logo maker', 'লোগো ডিজাইন', 'graphic designer', 'গ্রাফিক ডিজাইনার'],

  // Video Editor
  'video editor': ['video editor', 'ভিডিও এডিটর', 'ভিডিও এডিটিং', 'reels editor', 'youtube editor', 'ভিডিও তৈরি'],
  'ভিডিও এডিটর': ['video editor', 'ভিডিও এডিটর', 'ভিডিও এডিটিং', 'রিলস এডিটিং', 'ইউটিউব ভিডিও এডিটিং'],

  // Web Developer
  'web developer': ['web developer', 'ওয়েব ডেভেলপার', 'ওয়েবসাইট তৈরি', 'wordpress developer', 'web design', 'frontend developer'],
  'ওয়েব ডেভেলপার': ['web developer', 'ওয়েব ডেভেলপার', 'ওয়েবসাইট তৈরি', 'ওয়েব ডিজাইন', 'ওয়ার্ডপ্রেস'],

  // Solar Panel
  'solar panel technician': ['solar panel technician', 'সোলার প্যানেল টেকনিশিয়ান', 'সোলার মিস্ত্রি', 'solar inverter', 'সোলার বিদ্যুৎ'],
  'সোলার প্যানেল টেকনিশিয়ান': ['solar panel technician', 'সোলার প্যানেল মিস্ত্রি', 'সোলার টেকনিশিয়ান', 'solar inverter installation'],
  'সোলার প্যানেল মিস্ত্রি': ['solar technician', 'সোলার প্যানেল মিস্ত্রি', 'সোলার টেকনিশিয়ান', 'solar panel'],
};

/**
 * Generate normalized search keywords array from an array of raw strings
 * Includes:
 * 1. Cleaned raw values
 * 2. General lowercased values
 * 3. Normalized Bengali phonetic versions
 * 4. Synonym expansions where known
 */
export function buildNormalizedSearchKeywords(rawItems: string[]): string[] {
  const set = new Set<string>();

  rawItems.forEach((item) => {
    if (!item) return;
    const trimmed = item.trim();
    if (!trimmed) return;

    // Add trimmed
    set.add(trimmed);

    // General normalized (lowercase, punctuation stripped)
    const genNorm = normalizeGeneral(trimmed);
    if (genNorm) {
      set.add(genNorm);

      // Add individual tokens if multi-word
      const tokens = genNorm.split(' ').filter((t) => t.length > 1);
      tokens.forEach((t) => set.add(t));
    }

    // Bengali normalized
    const bnNorm = normalizeBengali(trimmed);
    if (bnNorm && bnNorm !== genNorm) {
      set.add(bnNorm);
      const bnTokens = bnNorm.split(' ').filter((t) => t.length > 1);
      bnTokens.forEach((t) => set.add(t));
    }

    // Synonym expansion
    const lookupKey = genNorm.toLowerCase();
    if (SYNONYM_DICTIONARY[lookupKey]) {
      SYNONYM_DICTIONARY[lookupKey].forEach((syn) => {
        set.add(syn);
        set.add(normalizeGeneral(syn));
      });
    }

    // Check partial matches in synonym dictionary
    Object.keys(SYNONYM_DICTIONARY).forEach((key) => {
      if (lookupKey.includes(key) || key.includes(lookupKey)) {
        SYNONYM_DICTIONARY[key].forEach((syn) => {
          set.add(syn);
          set.add(normalizeGeneral(syn));
        });
      }
    });
  });

  return Array.from(set).filter((k) => k && k.length > 1);
}
