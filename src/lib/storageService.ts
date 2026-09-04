import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadProgressCallback {
  (progress: number): void;
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_PROFILE_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface FileValidationResult {
  isValid: boolean;
  errorMessageBn?: string;
}

/**
 * Validate image file format and file size
 */
export function validateProfileImage(file: File): FileValidationResult {
  if (!file) {
    return { isValid: false, errorMessageBn: 'কোনো ফাইল নির্বাচন করা হয়নি।' };
  }

  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return {
      isValid: false,
      errorMessageBn: 'শুধুমাত্র JPG, JPEG, PNG অথবা WebP ফরম্যাটের ছবি আপলোড করা যাবে।',
    };
  }

  // Check file size (max 5 MB)
  if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      errorMessageBn: `ছবির সাইজ (${sizeMb} MB) অনেক বড়। সর্বোচ্চ ৫ MB সাইজের ছবি নির্বাচন করুন।`,
    };
  }

  return { isValid: true };
}

/**
 * Upload profile photo to Firebase Storage securely
 * Path: profilePhotos/{userId}/avatar_{timestamp}.{ext}
 * Returns download URL string to save in Firestore user profile document.
 */
export async function uploadProfilePhoto(
  userId: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> {
  const validation = validateProfileImage(file);
  if (!validation.isValid) {
    throw new Error(validation.errorMessageBn);
  }

  // Determine file extension
  let extension = 'jpg';
  if (file.type === 'image/png') extension = 'png';
  else if (file.type === 'image/webp') extension = 'webp';
  else if (file.type === 'image/jpeg' || file.type === 'image/jpg') extension = 'jpg';

  const timestamp = Date.now();
  const filePath = `profilePhotos/${userId}/avatar_${timestamp}.${extension}`;
  const storageRef = ref(storage, filePath);

  const metadata = {
    contentType: file.type,
    customMetadata: {
      uploadedBy: userId,
      uploadedAt: new Date().toISOString(),
      purpose: 'user_profile_avatar',
    },
  };

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (snapshot.totalBytes > 0) {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress));
          }
        }
      },
      (error) => {
        console.error('Firebase Storage upload error:', error);
        let errorMsg = 'ছবি আপলোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।';
        if (error.code === 'storage/unauthorized') {
          errorMsg = 'ছবি আপলোডের অনুমতি নেই। অনুগ্রহ করে পুনরায় লগইন করুন।';
        } else if (error.code === 'storage/canceled') {
          errorMsg = 'ছবি আপলোড বাতিল করা হয়েছে।';
        } else if (error.code === 'storage/quota-exceeded') {
          errorMsg = 'স্টোরেজ কোটা পূর্ণ হয়ে গেছে। পরবর্তীতে চেষ্টা করুন।';
        }
        reject(new Error(errorMsg));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err) {
          reject(new Error('ছবির লিংক সংগ্রহ করতে ব্যর্থ হয়েছে।'));
        }
      }
    );
  });
}

/**
 * Delete previous profile photo from Firebase Storage if it belongs to Firebase Storage
 */
export async function deleteProfilePhotoFromStorage(photoUrl: string): Promise<void> {
  if (!photoUrl) return;
  try {
    if (photoUrl.includes('firebasestorage.googleapis.com') || photoUrl.includes('firebasestorage.app')) {
      const storageRef = ref(storage, photoUrl);
      await deleteObject(storageRef);
    }
  } catch (err) {
    // Non-fatal warning if previous file cleanup fails
    console.warn('Previous profile photo cleanup warning:', err);
  }
}
