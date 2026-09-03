import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  AlertCircle, 
  FileCheck2, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  RefreshCw, 
  Car, 
  AlertTriangle,
  FileText,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  IdentityDocumentType, 
  VerificationStatus,
  SubmittedIdentityInfo,
  VerificationDocumentFiles
} from '../types';
import { 
  getVerificationStatusInfo, 
  getDocumentTypeInfo,
  validateNidNumber,
  validateBirthRegNumber,
  validatePassportNumber,
  validateDrivingLicenseNumber,
  maskDocumentNumber
} from '../lib/verificationHelpers';
import { DocumentUploadInput } from '../components/verification/DocumentUploadInput';

interface VerificationPageProps {
  onNavigate: (view: string) => void;
  initialDocumentType?: IdentityDocumentType;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({ 
  onNavigate,
  initialDocumentType = 'nid'
}) => {
  const { 
    currentUser, 
    userProfile, 
    verificationHistory, 
    submitVerificationRequest,
    openAuthModal 
  } = useAuth();

  const [documentType, setDocumentType] = useState<IdentityDocumentType>(initialDocumentType);
  
  // Form State
  const [fullName, setFullName] = useState(userProfile.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState('1992-05-15');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [fatherOrSpouseName, setFatherOrSpouseName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [licenseType, setLicenseType] = useState<'professional' | 'non_professional'>('professional');

  // Files State
  const [frontFile, setFrontFile] = useState<{ url: string; name: string; type: string; size: number } | null>(null);
  const [backFile, setBackFile] = useState<{ url: string; name: string; type: string; size: number } | null>(null);
  const [docFile, setDocFile] = useState<{ url: string; name: string; type: string; size: number } | null>(null);

  // Policy Agreement
  const [isPolicyAgreed, setIsPolicyAgreed] = useState(false);

  // Submitting / UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isReverifying, setIsReverifying] = useState(false);

  // Sync with user profile on mount
  useEffect(() => {
    if (userProfile.fullName && !fullName) {
      setFullName(userProfile.fullName);
    }
  }, [userProfile.fullName]);

  // If initialDocumentType prop changes
  useEffect(() => {
    if (initialDocumentType) {
      setDocumentType(initialDocumentType);
    }
  }, [initialDocumentType]);

  const latestRequest = verificationHistory.length > 0 ? verificationHistory[0] : null;
  const currentStatus: VerificationStatus = userProfile.verificationStatus || (latestRequest ? latestRequest.status : 'not_submitted');
  const statusInfo = getVerificationStatusInfo(currentStatus);
  const isDriver = (userProfile.capabilities || userProfile.roles || []).some(
    (c) => c === 'driver' || c === 'delivery_rider'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    // Validation
    if (!fullName.trim()) {
      setSubmitError('অনুগ্রহ করে আপনার পুরো নাম প্রদান করুন।');
      return;
    }

    if (!dateOfBirth) {
      setSubmitError('অনুগ্রহ করে জন্ম তারিখ প্রদান করুন।');
      return;
    }

    // Document Number Validation based on type
    if (documentType === 'nid') {
      const nidCheck = validateNidNumber(documentNumber);
      if (!nidCheck.isValid) {
        setSubmitError(nidCheck.errorBn || 'সঠিক এনআইডি নম্বর দিন।');
        return;
      }
      if (!frontFile) {
        setSubmitError('জাতীয় পরিচয়পত্রের সামনের অংশের ছবি আপলোড করা আবশ্যক।');
        return;
      }
      if (!backFile) {
        setSubmitError('জাতীয় পরিচয়পত্রের পেছনের অংশের ছবি আপলোড করা আবশ্যক।');
        return;
      }
    } else if (documentType === 'birth_registration') {
      const birthCheck = validateBirthRegNumber(documentNumber);
      if (!birthCheck.isValid) {
        setSubmitError(birthCheck.errorBn || 'সঠিক ১৭ ডিজিটের জন্ম নিবন্ধন নম্বর দিন।');
        return;
      }
      if (!docFile && !frontFile) {
        setSubmitError('ডিজিটাল জন্ম নিবন্ধন সনদের স্পষ্ট কপি বা ছবি আপলোড করুন।');
        return;
      }
    } else if (documentType === 'passport') {
      const passCheck = validatePassportNumber(documentNumber);
      if (!passCheck.isValid) {
        setSubmitError(passCheck.errorBn || 'সঠিক পাসপোর্ট নম্বর দিন।');
        return;
      }
      if (!frontFile && !docFile) {
        setSubmitError('পাসপোর্টের তথ্য পাতার স্পষ্ট ছবি আপলোড করুন।');
        return;
      }
    } else if (documentType === 'driving_license') {
      const dlCheck = validateDrivingLicenseNumber(documentNumber);
      if (!dlCheck.isValid) {
        setSubmitError(dlCheck.errorBn || 'সঠিক ড্রাইভিং লাইসেন্স নম্বর দিন।');
        return;
      }
      if (!frontFile) {
        setSubmitError('ড্রাইভিং লাইসেন্সের সামনের অংশের ছবি আপলোড করুন।');
        return;
      }
      if (!backFile) {
        setSubmitError('ড্রাইভিং লাইসেন্সের পেছনের অংশের ছবি আপলোড করুন।');
        return;
      }
    }

    if (!isPolicyAgreed) {
      setSubmitError('অনুগ্রহ করে নিশ্চিতকরণ চেকবক্সে সম্মতি দিন।');
      return;
    }

    setIsSubmitting(true);

    try {
      const submittedInfo: SubmittedIdentityInfo = {
        fullName: fullName.trim(),
        dateOfBirth,
        documentNumber: documentNumber.trim(),
        issueDate: issueDate || undefined,
        expiryDate: expiryDate || undefined,
        fatherOrSpouseName: fatherOrSpouseName.trim() || undefined,
        bloodGroup: bloodGroup || undefined,
        licenseType: documentType === 'driving_license' ? licenseType : undefined
      };

      const docFiles: VerificationDocumentFiles = {
        frontUrl: frontFile?.url,
        frontFileName: frontFile?.name,
        frontFileType: frontFile?.type,
        frontFileSize: frontFile?.size,
        backUrl: backFile?.url,
        backFileName: backFile?.name,
        backFileType: backFile?.type,
        backFileSize: backFile?.size,
        docUrl: docFile?.url,
        docFileName: docFile?.name,
        docFileType: docFile?.type,
        docFileSize: docFile?.size
      };

      await submitVerificationRequest({
        documentType,
        documentNumber: documentNumber.trim(),
        submittedInformation: submittedInfo,
        documentFiles: docFiles
      });

      setSubmitSuccess(true);
      setIsReverifying(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitError(err?.message || 'ভেরিফিকেশন রিকোয়েস্ট জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showForm = 
    currentStatus === 'not_submitted' || 
    currentStatus === 'unverified' || 
    currentStatus === 'rejected' || 
    currentStatus === 'reverification_required' || 
    isReverifying;

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>প্রোফাইলে ফিরে যান</span>
        </button>

        <span className="text-xs font-semibold text-slate-500">
          সুরক্ষা ও পরিচিতি যাচাই (Step 3)
        </span>
      </div>

      {/* Main Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900">
                  প্রোফাইল যাচাই ও পরিচয়পত্র নিশ্চিতকরণ
                </h1>
                <p className="text-xs text-slate-500">
                  Identity Verification & Driver Authentication Portal
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold border flex items-center gap-1.5 ${statusInfo.badgeBg}`}>
              <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
              <span>{statusInfo.labelBn}</span>
            </span>
          </div>
        </div>

        {/* 5-Step Process Indicator */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            অ্যাকাউন্ট ভেরিফিকেশন ধাপসমূহ:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>১. নিবন্ধন</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>২. প্রোফাইল সেটআপ</span>
            </div>
            <div className={`p-2 rounded-xl font-bold flex items-center justify-center gap-1 border ${
              currentStatus === 'not_submitted' || currentStatus === 'unverified'
                ? 'bg-blue-100 text-blue-900 border-blue-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              <span>৩. নথি দাখিল</span>
            </div>
            <div className={`p-2 rounded-xl font-bold flex items-center justify-center gap-1 border ${
              currentStatus === 'pending' || currentStatus === 'under_review'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : currentStatus === 'approved' || currentStatus === 'verified'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              <span>৪. টিম রিভিউ</span>
            </div>
            <div className={`p-2 rounded-xl font-bold flex items-center justify-center gap-1 border ${
              currentStatus === 'approved' || currentStatus === 'verified'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              <span>৫. প্রোফাইল সক্রিয়</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-emerald-900 shadow-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>ভেরিফিকেশন আবেদন সফলভাবে জমা হয়েছে!</span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            আপনার দাখিলকৃত তথ্য ও নথি HelpLine Verification Team-এর কাছে পৌঁছেছে। অ্যাডমিন টিম দ্রুত এটি যাচাই করে আপনার প্রোফাইল অনুমোদন করবে। ফলাফল আপনি নোটিফিকেশনে দেখতে পাবেন।
          </p>
        </div>
      )}

      {/* Status Box Details */}
      <div className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-4 ${
        currentStatus === 'approved' || currentStatus === 'verified'
          ? 'bg-emerald-50/50 border-emerald-200'
          : currentStatus === 'rejected'
          ? 'bg-rose-50/50 border-rose-200'
          : currentStatus === 'reverification_required'
          ? 'bg-purple-50/50 border-purple-200'
          : currentStatus === 'under_review'
          ? 'bg-blue-50/50 border-blue-200'
          : currentStatus === 'pending'
          ? 'bg-amber-50/50 border-amber-200'
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>বর্তমান যাচাই অবস্থা:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${statusInfo.badgeBg}`}>
                {statusInfo.labelBn}
              </span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              {statusInfo.descriptionBn}
            </p>
          </div>

          {/* Re-verify action button if rejected or approved */}
          {(currentStatus === 'rejected' || currentStatus === 'reverification_required') && !isReverifying && (
            <button
              onClick={() => {
                setIsReverifying(true);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-xs"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>আবার জমা দিন (Re-verify)</span>
            </button>
          )}
        </div>

        {/* Detailed Rejection Reason if Rejected or Reverification */}
        {(currentStatus === 'rejected' || currentStatus === 'reverification_required') && latestRequest?.rejectionReason && (
          <div className="p-4 bg-white rounded-xl border border-rose-200 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>প্রত্যাখ্যান বা পুনরায় যাচাইয়ের কারণ (Reason):</span>
            </div>
            <p className="text-xs text-slate-800 font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-100">
              {latestRequest.rejectionReason}
            </p>
            {latestRequest.adminFeedback && (
              <p className="text-xs text-slate-600 pl-1 leading-relaxed">
                <strong>টিমের দিকনির্দেশনা:</strong> {latestRequest.adminFeedback}
              </p>
            )}
          </div>
        )}

        {/* Approved Status Highlights */}
        {(currentStatus === 'approved' || currentStatus === 'verified') && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">✓ প্রোফাইল ভেরিফাইড (Identity Verified)</p>
                  <p className="text-[11px] text-slate-500">
                    দাখিলকৃত নথি: {latestRequest ? getDocumentTypeInfo(latestRequest.documentType).nameBn : 'জাতীয় পরিচয়পত্র'}
                  </p>
                </div>
              </div>

              {userProfile.driverVerificationStatus === 'approved' ? (
                <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">✓ ড্রাইভার ভেরিফাইড (Driver Approved)</p>
                    <p className="text-[11px] text-slate-500">রাইড ও ডেলিভারি সেবা প্রদানের অনুমোদন সক্রিয়</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">ড্রাইভার মোড (Ride / Delivery)</p>
                      <p className="text-[10px] text-slate-500">লাইসেন্স যাচাই না করা পর্যন্ত বন্ধ</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setDocumentType('driving_license');
                      setIsReverifying(true);
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                  >
                    লাইসেন্স যাচাই করুন
                  </button>
                </div>
              )}
            </div>

            {/* Legal Disclaimer Box */}
            <div className="p-3 bg-white/80 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>নিরাপত্তা ঘোষণা:</strong> ভেরিফিকেশন অর্থ HelpLine-এর যাচাই প্রক্রিয়ায় দাখিলকৃত তথ্য ও নথি সামঞ্জস্যপূর্ণ পাওয়া গেছে। এটি সেবা প্রদানকারীর ভবিষ্যৎ সততা বা ১০০% মানের গ্যারান্টি নয়। যেকোনো চুক্তিতে উভয় পক্ষকে পারস্পরিক সতর্কতা অবলম্বনের পরামর্শ দেওয়া হচ্ছে।
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Driver Verification Mandatory Notice */}
      {isDriver && userProfile.driverVerificationStatus !== 'approved' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-amber-900 shadow-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-bold">
              ড্রাইভিং লাইসেন্স যাচাই আবশ্যক (Driver Verification Required)
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              আপনি প্রোফাইলে "🚗 Ride" অথবা "🛵 Delivery" সক্ষমতা নির্বাচন করেছেন। যাত্রীদের নিরাপত্তা ও সরকারি ট্রাফিক বিধি অনুযায়ী বিআরটিএ অনুমোদিত ড্রাইভিং লাইসেন্স যাচাই না হওয়া পর্যন্ত ড্রাইভার মোড কার্যকর হবে না।
            </p>
            {documentType !== 'driving_license' && (
              <button
                onClick={() => {
                  setDocumentType('driving_license');
                  setIsReverifying(true);
                }}
                className="mt-2 text-xs font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
              >
                এখনই ড্রাইভিং লাইসেন্স ফরম নির্বাচন করুন →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Verification Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-600" />
              <span>পরিচয়পত্র দাখিল ফরম (Identity Submission Form)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              যেকোনো একটি সরকারি বৈধ নথি নির্বাচন করে সঠিক তথ্য ও স্পষ্ট ছবি জমা দিন।
            </p>
          </div>

          {/* Document Type Selector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              ১. পরিচয়পত্রের ধরন নির্বাচন করুন (Select Document Type) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['nid', 'birth_registration', 'passport', 'driving_license'] as IdentityDocumentType[]).map((type) => {
                const info = getDocumentTypeInfo(type);
                const isSelected = documentType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setDocumentType(type);
                      setDocumentNumber('');
                      setFrontFile(null);
                      setBackFile(null);
                      setDocFile(null);
                      setSubmitError(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-2xl mb-1.5">{info.icon}</div>
                    <div className="font-bold text-xs">{info.shortBn}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{info.example}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              নির্বাচিত: <strong>{getDocumentTypeInfo(documentType).nameBn}</strong> — {getDocumentTypeInfo(documentType).subtitleBn}
            </p>
          </div>

          {/* Step 2: Information Input Fields */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">
              ২. নথির তথ্যাদি পূরণ করুন (Personal Information)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>নথি অনুযায়ী পুরো নাম (Full Name as per Document)</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="যেমন: মোঃ আব্দুর রহমান"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>জন্ম তারিখ (Date of Birth)</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Document Number Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>{getDocumentTypeInfo(documentType).shortBn} নম্বর (Document Number)</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder={getDocumentTypeInfo(documentType).placeholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <span className="text-[11px] text-slate-500 block">
                {documentType === 'nid' && '১০ ডিজিটের স্মার্ট কার্ড অথবা ১৩/১৭ ডিজিটের জাতীয় পরিচয়পত্র নম্বর।'}
                {documentType === 'birth_registration' && '১৭ ডিজিটের অনলাইন ডিজিটাল জন্ম নিবন্ধন নম্বর।'}
                {documentType === 'passport' && 'পাসপোর্টের প্রথম পাতার ৮ বা ৯ অক্ষরের নম্বর।'}
                {documentType === 'driving_license' && 'বিআরটিএ ড্রাইভিং লাইসেন্স নম্বর (যেমন: DK1234567)।'}
              </span>
            </div>

            {/* Document-specific extra fields */}
            {documentType === 'driving_license' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-blue-50/50 rounded-xl border border-blue-200">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">লাইসেন্সের ধরন</label>
                  <select
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="professional">পেশাদার (Professional)</option>
                    <option value="non_professional">অপেশাদার (Non-Professional)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">রক্তের গ্রুপ</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">মেয়াদোত্তীর্ণের তারিখ</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {(documentType === 'nid' || documentType === 'birth_registration') && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  পিতা / স্বামীর নাম (Father's or Spouse's Name - ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={fatherOrSpouseName}
                  onChange={(e) => setFatherOrSpouseName(e.target.value)}
                  placeholder="যেমন: মোঃ মনসুর আলী"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            )}
          </div>

          {/* Step 3: Document File Uploads */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">
              ৩. নথির ছবি বা ফাইল সংযুক্ত করুন (Document Upload)
            </h3>

            {documentType === 'nid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DocumentUploadInput
                  idPrefix="nid-front"
                  labelBn="এনআইডি সামনের অংশের ছবি"
                  subLabelBn="নাম, ছবি ও নম্বর স্পষ্ট থাকতে হবে"
                  required
                  valueUrl={frontFile?.url}
                  fileName={frontFile?.name}
                  fileType={frontFile?.type}
                  fileSize={frontFile?.size}
                  onFileChange={setFrontFile}
                />
                <DocumentUploadInput
                  idPrefix="nid-back"
                  labelBn="এনআইডি পেছনের অংশের ছবি"
                  subLabelBn="ঠিকানা ও বারকোড দৃশ্যমান রাখুন"
                  required
                  valueUrl={backFile?.url}
                  fileName={backFile?.name}
                  fileType={backFile?.type}
                  fileSize={backFile?.size}
                  onFileChange={setBackFile}
                />
              </div>
            )}

            {documentType === 'birth_registration' && (
              <DocumentUploadInput
                idPrefix="birth-doc"
                labelBn="অনলাইন ডিজিটাল জন্ম নিবন্ধন সনদের স্পষ্ট ছবি বা পিডিএফ"
                subLabelBn="১৭ ডিজিট ও সরকারি কিউআর কোড যুক্ত মূল সনদ"
                required
                valueUrl={docFile?.url}
                fileName={docFile?.name}
                fileType={docFile?.type}
                fileSize={docFile?.size}
                onFileChange={setDocFile}
              />
            )}

            {documentType === 'passport' && (
              <DocumentUploadInput
                idPrefix="passport-doc"
                labelBn="পাসপোর্টের তথ্য পাতার স্পষ্ট ছবি"
                subLabelBn="ছবি, পাসপোর্ট নম্বর ও ব্যক্তিগত তথ্য পাতা"
                required
                valueUrl={frontFile?.url}
                fileName={frontFile?.name}
                fileType={frontFile?.type}
                fileSize={frontFile?.size}
                onFileChange={setFrontFile}
              />
            )}

            {documentType === 'driving_license' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DocumentUploadInput
                  idPrefix="license-front"
                  labelBn="লাইসেন্সের সামনের অংশের ছবি"
                  subLabelBn="লাইসেন্স নম্বর, ছবি ও ইস্যুকারী কর্তৃপক্ষ"
                  required
                  valueUrl={frontFile?.url}
                  fileName={frontFile?.name}
                  fileType={frontFile?.type}
                  fileSize={frontFile?.size}
                  onFileChange={setFrontFile}
                />
                <DocumentUploadInput
                  idPrefix="license-back"
                  labelBn="লাইসেন্সের পেছনের অংশের ছবি"
                  subLabelBn="যানবাহনের ক্যাটাগরি ও মেয়াদ"
                  required
                  valueUrl={backFile?.url}
                  fileName={backFile?.name}
                  fileType={backFile?.type}
                  fileSize={backFile?.size}
                  onFileChange={setBackFile}
                />
              </div>
            )}
          </div>

          {/* Privacy Notice & Security Assurance */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>নিরাপত্তা ও গোপনীয়তা সংক্রান্ত অঙ্গীকার (Privacy Protection)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              আপনার পরিচয় যাচাইয়ের জন্য দাখিলকৃত তথ্য ও ছবি HelpLine-এর অনুমোদিত Verification Team ব্যতীত সাধারণ ব্যবহারকারী বা পাবলিক প্রোফাইলে কখনো দৃশ্যমান হবে না। সংবেদনশীল নম্বরসমূহ এনক্রিপ্ট ও মাস্ক করে রাখা হয়।
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onNavigate('policies')}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline"
              >
                HelpLine ডেটা সুরক্ষা ও নিরাপত্তা নীতিমালা পড়ুন →
              </button>
            </div>
          </div>

          {/* Mandatory Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={isPolicyAgreed}
              onChange={(e) => setIsPolicyAgreed(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
            />
            <span className="text-xs text-slate-800 font-semibold leading-relaxed">
              আমি নিশ্চিত করছি যে আমি যে তথ্য ও ডকুমেন্ট জমা দিচ্ছি তা সম্পূর্ণ আমার এবং সঠিক। কোনো অসত্য বা ভুয়া তথ্য প্রদান করলে অ্যাকাউন্ট সাময়িক বা স্থায়ীভাবে বাতিল হতে পারে।
            </span>
          </label>

          {/* Submission Error Alert */}
          {submitError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
            {isReverifying && (
              <button
                type="button"
                onClick={() => setIsReverifying(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                বাতিল করুন
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>যাচাইয়ের জন্য পাঠানো হচ্ছে...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Verification Submit করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Verification History Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>যাচাইকরণের ইতিহাস (Verification Audit History)</span>
            </h2>
            <p className="text-xs text-slate-500">আপনার পূর্ববর্তী সকল যাচাই আবেদনের রেকর্ড ও ফলাফল</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
            মোট: {verificationHistory.length} টি
          </span>
        </div>

        {verificationHistory.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-1 text-slate-500 text-xs">
            <p>এখনও কোনো যাচাই আবেদন জমা দেওয়া হয়নি।</p>
            <p className="text-[11px] text-slate-400">উপরের ফরম থেকে আপনার জাতীয় পরিচয়পত্র জমা দিন।</p>
          </div>
        ) : (
          <div className="space-y-3">
            {verificationHistory.map((req) => {
              const reqStatusInfo = getVerificationStatusInfo(req.status);
              const docInfo = getDocumentTypeInfo(req.documentType);
              return (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{docInfo.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{docInfo.nameBn}</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-mono">
                            #{req.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          নম্বর: <span className="font-mono">{maskDocumentNumber(req.documentNumber)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${reqStatusInfo.badgeBg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${reqStatusInfo.dotColor}`} />
                        <span>{reqStatusInfo.labelBn}</span>
                      </span>
                    </div>
                  </div>

                  {req.rejectionReason && (
                    <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-xs text-rose-800 space-y-0.5">
                      <p className="font-bold">কারণ: {req.rejectionReason}</p>
                      {req.adminFeedback && <p className="text-[11px]">{req.adminFeedback}</p>}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    <span>
                      জমা: {new Date(req.submittedAt).toLocaleDateString('bn-BD')} {new Date(req.submittedAt).toLocaleTimeString('bn-BD')}
                    </span>
                    {req.reviewedAt && (
                      <span>
                        রিভিউ সম্পন্ন: {new Date(req.reviewedAt).toLocaleDateString('bn-BD')} ({req.reviewedBy?.adminName || 'এডমিন'})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
