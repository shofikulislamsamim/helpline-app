import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Trash2, RefreshCw, AlertCircle, CheckCircle, User, Loader2 } from 'lucide-react';
import { validateProfileImage, uploadProfilePhoto, deleteProfilePhotoFromStorage } from '../../lib/storageService';

interface ProfilePhotoUploaderProps {
  currentPhotoUrl?: string;
  userId: string;
  userName?: string;
  onPhotoUploaded: (url: string | undefined) => void;
  autoSaveToProfile?: (url: string | undefined) => Promise<boolean>;
  compact?: boolean;
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  currentPhotoUrl,
  userId,
  userName = 'ব্যবহারকারী',
  onPhotoUploaded,
  autoSaveToProfile,
  compact = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentPhotoUrl);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync preview with incoming prop when not actively uploading
  useEffect(() => {
    if (!isUploading) {
      setPreviewUrl(currentPhotoUrl);
    }
  }, [currentPhotoUrl, isUploading]);

  // Open device file picker
  const handleOpenPicker = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate file
    const validation = validateProfileImage(file);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessageBn || 'অবৈধ ফাইল ফরম্যাট বা সাইজ।');
      return;
    }

    // Instant local preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    // Upload to Firebase Storage
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const downloadUrl = await uploadProfilePhoto(userId, file, (progress) => {
        setUploadProgress(progress);
      });

      // Free local object URL memory
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(downloadUrl);
      onPhotoUploaded(downloadUrl);

      // Auto save if handler provided
      if (autoSaveToProfile) {
        await autoSaveToProfile(downloadUrl);
      }

      // Cleanup old storage photo in background if different
      if (currentPhotoUrl && currentPhotoUrl !== downloadUrl) {
        deleteProfilePhotoFromStorage(currentPhotoUrl);
      }

      setSuccessMessage('প্রোফাইল ছবি সফলভাবে আপলোড ও সংরক্ষণ করা হয়েছে।');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      // Revert preview to existing photo on error
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(currentPhotoUrl);
      setErrorMessage(err.message || 'ছবি আপলোড করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Remove photo
  const handleRemovePhoto = async () => {
    const confirmDelete = window.confirm('আপনি কি সত্যিই প্রোফাইল ছবি মুছে ফেলতে চান?');
    if (!confirmDelete) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsUploading(true);

    try {
      if (currentPhotoUrl) {
        await deleteProfilePhotoFromStorage(currentPhotoUrl);
      }
      setPreviewUrl(undefined);
      onPhotoUploaded(undefined);

      if (autoSaveToProfile) {
        await autoSaveToProfile(undefined);
      }

      setSuccessMessage('প্রোফাইল ছবি মুছে ফেলা হয়েছে।');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error removing photo:', err);
      setErrorMessage('ছবি মুছতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsUploading(false);
    }
  };

  const hasPhoto = Boolean(previewUrl);

  return (
    <div className="w-full space-y-3">
      {/* Hidden native file input accepting device cameras, gallery, desktop files */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      <div
        className={`flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 transition-all ${
          compact ? 'p-3' : 'p-4'
        }`}
      >
        {/* Avatar Display */}
        <div className="relative shrink-0">
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt={userName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md bg-slate-100"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center text-white p-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-400 mb-1" />
                  <span className="text-[11px] font-bold">{uploadProgress}%</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col items-center justify-center font-black text-2xl shadow-md border-2 border-white">
              {userName ? userName.charAt(0) : <User className="w-8 h-8 opacity-80" />}
            </div>
          )}

          {/* Quick upload icon badge on avatar */}
          <button
            type="button"
            onClick={handleOpenPicker}
            disabled={isUploading}
            title="ছবি নির্বাচন করুন"
            className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md border-2 border-white transition cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Controls & Bengali Instructions */}
        <div className="flex-1 space-y-2 text-center sm:text-left w-full">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 font-bold text-slate-800 text-xs sm:text-sm">
              <Camera className="w-4 h-4 text-blue-600" />
              <span>প্রোফাইল ছবি (Profile Photo)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              সরাসরি আপনার মোবাইল বা কম্পিউটার থেকে পরিষ্কার ছবি যুক্ত করুন (JPG, PNG, WebP — সর্বোচ্চ ৫ MB)।
            </p>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-1">
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 transition-all duration-200 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 flex items-center justify-between">
                <span>ফায়ারবেস স্টোরেজে আপলোড হচ্ছে...</span>
                <span className="font-bold text-blue-600">{uploadProgress}%</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            {!hasPhoto ? (
              <button
                type="button"
                onClick={handleOpenPicker}
                disabled={isUploading}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>ছবি আপলোড করুন</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleOpenPicker}
                  disabled={isUploading}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 text-xs font-bold border border-blue-200 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>ছবি পরিবর্তন করুন</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={isUploading}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 text-xs font-bold border border-rose-200 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ছবি মুছে ফেলুন</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bengali Error Message */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}
    </div>
  );
};
