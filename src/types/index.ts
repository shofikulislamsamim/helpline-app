/**
 * HelpLine Types and Models
 * Bengali-first local marketplace platform for Bangladesh
 */

export type UserRoleType = 
  | 'worker'             // 🛠️ কাজ করতে চাই — Worker
  | 'customer'           // 👤 কাজের মানুষ খুঁজতে চাই — Hirer / Customer
  | 'job_seeker'         // 💼 চাকরি খুঁজতে চাই — Job Seeker
  | 'employer'           // 🏢 চাকরি দিতে চাই — Employer
  | 'passenger'          // 🚗 রাইড নিতে চাই — Passenger
  | 'driver'             // 🚕 রাইড দিতে চাই — Driver
  | 'delivery_customer'  // 📦 কিছু পাঠাতে চাই — Delivery Customer
  | 'delivery_rider'     // 🛵 ডেলিভারি করতে চাই — Rider
  | 'delivery_agent'     // ডেলিভারি ম্যান (backward compatibility)
  | 'buyer'              // 🛒 পণ্য কিনতে চাই — Buyer
  | 'seller';            // 🏪 পণ্য বিক্রি করতে চাই — Seller

export type CapabilityType = UserRoleType;

export interface ProfessionExperience {
  profession: string;
  years: number;
  description?: string;
  isMain?: boolean;
}

export interface WorkHistory {
  id: string;
  company: string;          // কোম্পানি / নিয়োগকারী
  position: string;         // পদবী
  startDate: string;        // শুরুর বছর / তারিখ
  endDate: string;          // সমাপ্তির বছর / তারিখ
  currentlyWorking: boolean;// বর্তমানে এখানে কর্মরত
  location: string;         // কর্মস্থল / শহর
  jobDetails: string;       // দায়িত্ব ও কাজের বিবরণ
}

export interface CustomCategoryRequest {
  id: string;
  userId: string;
  userName: string;
  professionNameBn: string;
  professionNameEn?: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface UserRoleRecord {
  userId: string;
  capabilities: CapabilityType[];
  activeCapabilities: CapabilityType[];
  createdAt: string;
  updatedAt: string;
}

export type VerificationStatus = 
  | 'not_submitted'
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'reverification_required'
  | 'unverified' // backward compatibility with Step 2
  | 'verified';   // backward compatibility with Step 2

export type DriverVerificationStatus = 
  | 'not_required'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'reverification_required';

export type IdentityDocumentType = 
  | 'nid'
  | 'birth_registration'
  | 'passport'
  | 'driving_license';

export interface VerificationDocumentFiles {
  frontUrl?: string;
  frontFileName?: string;
  frontFileType?: string;
  frontFileSize?: number;
  backUrl?: string;
  backFileName?: string;
  backFileType?: string;
  backFileSize?: number;
  docUrl?: string;
  docFileName?: string;
  docFileType?: string;
  docFileSize?: number;
}

export interface SubmittedIdentityInfo {
  fullName: string;
  dateOfBirth: string;
  documentNumber: string;
  issueDate?: string;
  expiryDate?: string;
  fatherOrSpouseName?: string;
  bloodGroup?: string;
  licenseType?: 'professional' | 'non_professional';
}

export type AdminRoleType = 
  | 'super_admin'
  | 'verification_admin'
  | 'moderator'
  | 'support_admin';

export interface VerificationRequest {
  id: string; // e.g. HLV-10025
  userId: string;
  userName: string;
  userPhone: string;
  userAvatar?: string;
  userAddress?: string;
  userCapabilities?: CapabilityType[];
  userProfessions?: string[];
  documentType: IdentityDocumentType;
  documentNumber: string; // Full document number (accessible only to authorized admin and owner)
  documentNumberMasked: string; // e.g. ******1234
  submittedInformation: SubmittedIdentityInfo;
  documentFiles: VerificationDocumentFiles;
  status: VerificationStatus;
  rejectionReason?: string;
  rejectionCategory?: string;
  adminFeedback?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: {
    adminId: string;
    adminName: string;
    role: AdminRoleType;
  };
  verificationVersion: number;
  policyAgreed: boolean;
  policyAgreedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type VerificationAuditAction = 
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'REVERIFICATION_REQUESTED';

export interface VerificationAuditLog {
  id: string;
  verificationRequestId: string;
  userId: string;
  action: VerificationAuditAction;
  performedBy: {
    uid: string;
    name: string;
    role: AdminRoleType | 'user';
  };
  reason?: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  titleBn: string;
  messageBn: string;
  type: 'verification' | 'system' | 'order' | 'general';
  verificationRequestId?: string;
  status?: VerificationStatus;
  isRead: boolean;
  createdAt: string;
}

export interface PresentAddress {
  division: string;      // বিভাগ (e.g., ঢাকা, বরিশাল)
  district: string;      // জেলা (e.g., ঢাকা, বরিশাল)
  upazila: string;       // উপজেলা / থানা (e.g., মিরপুর, বরিশাল সদর)
  unionWard?: string;    // ইউনিয়ন / ওয়ার্ড / পৌরসভা
  areaRoad?: string;     // এলাকা / গ্রাম / রোড / বাড়ি
  fullAddress?: string;  // সম্পূর্ণ বিস্তারিত ঠিকানা
}

export interface LiveLocation {
  latitude: number | null;
  longitude: number | null;
  accuracyMeters?: number;
  lastUpdated?: string | null;
  formattedAddress?: string;
  sharePermissionGranted: boolean;
}

export interface UserProfile {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  phoneNumber: string;
  email?: string;
  isOnline: boolean; // Online: "আমি এখন কাজের জন্য Available" | Offline: "আমি এখন কাজের জন্য Available নই"
  availabilityUpdatedAt?: string;
  lastActiveAt?: string;
  verificationStatus: VerificationStatus;
  driverVerificationStatus?: DriverVerificationStatus;
  isDriverVerified?: boolean;
  verifiedAt?: string;
  roles: CapabilityType[];
  capabilities?: CapabilityType[];
  professions: string[];
  mainProfession?: string;
  skills: string[];
  experiences?: ProfessionExperience[];
  workHistories?: WorkHistory[];
  serviceAreas?: string[];
  presentAddress: PresentAddress;
  currentLocation?: LiveLocation;
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  joinedDate: string;
  subscriptionPlan: 'free' | 'daily' | 'monthly' | 'yearly';
  subscriptionActive: boolean;
  profileCompletedPercentage?: number;
  isProfileSetupComplete?: boolean;
}

export interface AppSettings {
  subscriptionMode: 'free' | 'paid';
  dailyRate: number;      // ৳ per day
  monthlyRate: number;    // ৳ per month
  yearlyRate: number;     // ৳ per year
  paymentNumbers: {
    bkash: string;
    nagad: string;
    rocket: string;
  };
  hotlineNumber: string;
  supportEmail: string;
  supportWhatsApp?: string;
  emergencyNotice: string;
  searchRadiusKm: number;
  featureFlags: {
    hireModule: boolean;
    workModule: boolean;
    jobsModule: boolean;
    rideModule: boolean;
    deliveryModule: boolean;
    buySellModule: boolean;
  };
}

export type ModuleId = 'hire' | 'work' | 'jobs' | 'ride' | 'delivery' | 'buysell';

export interface ModuleInfo {
  id: ModuleId;
  titleBn: string;
  subtitleBn: string;
  icon: string;
  badgeBn?: string;
  descriptionBn: string;
  accentColor: string;
}

export interface CategoryItem {
  id: string;
  nameBn: string;
  nameEn: string;
  icon: string;
  moduleId: ModuleId;
}

export interface ManualPaymentSubmission {
  id?: string;
  userId: string;
  userPhone: string;
  userName: string;
  method: 'bKash' | 'Nagad' | 'Rocket';
  senderPhone: string;
  trxId: string;
  amount: number;
  packageType: 'daily' | 'monthly' | 'yearly';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  adminNote?: string;
}

export interface PolicyDocument {
  id: 'terms' | 'privacy' | 'safety' | 'guidelines' | 'prohibited';
  titleBn: string;
  summaryBn: string;
  sections: { headingBn: string; textBn: string }[];
}

// ----------------------------------------------------
// STEP 4: HIRE + WORK ARCHITECTURE MODELS
// ----------------------------------------------------

export type HireRequestStatus = 
  | 'REQUESTED'       // Customer sent request
  | 'QUOTED'          // Worker sent price estimate
  | 'ACCEPTED'        // Customer accepted quote / agreed price
  | 'ON_THE_WAY'      // Worker is traveling to client location
  | 'WORK_STARTED'    // Worker started work
  | 'WORK_COMPLETED'  // Worker completed work
  | 'CANCELLED'       // Cancelled prior to completion
  | 'REJECTED'        // Worker rejected request
  | 'DISPUTED';       // Dispute / complaint raised

export interface WorkerQuote {
  estimatedPrice: number;
  quoteNote?: string;
  quotedAt: string;
}

export interface HireRequest {
  id: string; // e.g. "HL-HR-10025"
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  
  workerId: string;
  workerName: string;
  workerPhone: string;
  workerAvatar?: string;
  workerProfession: string;

  workType: string;               // e.g., ফ্যান ফিটিং / এসি সার্ভিস
  description: string;            // সমস্যার বিস্তারিত
  workLocation: {
    division: string;
    district: string;
    upazila: string;
    areaRoad?: string;
    fullAddress: string;
  };
  preferredDate: string;          // পছন্দসই তারিখ
  preferredTime: string;          // পছন্দসই সময়
  photos?: string[];              // ছবির লিঙ্ক
  notes?: string;                 // বিশেষ নির্দেশনা
  budget?: number;                // কাস্টমারের প্রত্যাশিত বাজেট

  status: HireRequestStatus;
  quote?: WorkerQuote;
  agreedPrice?: number;

  conversationId?: string;

  createdAt: string;
  quotedAt?: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelledBy?: 'customer' | 'worker' | 'admin';
  cancellationReason?: string;
  rejectedAt?: string;
  rejectionReason?: string;

  ratingSubmitted?: boolean;
  ratingValue?: number;
  ratingComment?: string;
  complaintId?: string;
}

export interface ServiceReview {
  id: string;
  hireRequestId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  revieweeId: string; // Worker ID
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  hireRequestId?: string;
  participantIds: string[];
  participants: {
    [uid: string]: {
      name: string;
      avatar?: string;
      phone?: string;
      role?: 'customer' | 'worker';
    };
  };
  lastMessage?: string;
  lastMessageTimestamp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserComplaint {
  id: string;
  hireRequestId?: string;
  complainantId: string;
  complainantName: string;
  complainantPhone: string;
  accusedUserId?: string;
  accusedUserName?: string;
  reason: string;
  details: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface HireAdminSettings {
  minServiceBudget: number;
  maxServiceBudget: number;
  defaultSearchRadiusKm: number;
  requireVerificationForWork: boolean;
  requestExpirationHours: number;
  cancellationWindowHours: number;
}

