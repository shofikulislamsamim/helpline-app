import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as fbUpdateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { 
  UserProfile, 
  CapabilityType, 
  CustomCategoryRequest, 
  UserRoleRecord,
  VerificationRequest,
  VerificationAuditLog,
  AdminRoleType,
  AppNotification,
  IdentityDocumentType,
  SubmittedIdentityInfo,
  VerificationDocumentFiles
} from '../types';
import { INITIAL_USER_PROFILE } from '../lib/defaultSettings';
import { calculateProfileCompletion } from '../lib/profileHelpers';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { 
  SAMPLE_SEED_VERIFICATION_REQUESTS, 
  maskDocumentNumber, 
  getDocumentTypeInfo 
} from '../lib/verificationHelpers';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  dispatchBrowserNotification, 
  PushNotificationStatus 
} from '../lib/pushNotifications';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile;
  loading: boolean;
  isAdmin: boolean;
  currentAdminRole: AdminRoleType;
  setCurrentAdminRole: (role: AdminRoleType) => void;
  isAuthModalOpen: boolean;
  isProfileSetupOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  openProfileSetup: () => void;
  closeProfileSetup: () => void;
  loginWithEmail: (emailOrPhone: string, password: string) => Promise<void>;
  registerWithEmail: (fullName: string, phone: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoUser: () => void;
  logout: () => Promise<void>;
  toggleOnlineStatus: () => Promise<void>;
  toggleRole: (role: CapabilityType) => Promise<void>;
  updateCapabilities: (capabilities: CapabilityType[]) => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  updateLiveLocation: (coords: { latitude: number; longitude: number; accuracy?: number }) => Promise<void>;
  submitCustomCategoryRequest: (nameBn: string, nameEn?: string, description?: string) => Promise<void>;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  // Verification System
  verificationRequests: VerificationRequest[];
  verificationHistory: VerificationRequest[];
  auditLogs: VerificationAuditLog[];
  submitVerificationRequest: (params: {
    documentType: IdentityDocumentType;
    documentNumber: string;
    submittedInformation: SubmittedIdentityInfo;
    documentFiles: VerificationDocumentFiles;
  }) => Promise<VerificationRequest>;
  adminApproveVerification: (requestId: string, adminNotes?: string) => Promise<void>;
  adminRejectVerification: (requestId: string, reason: string, feedback?: string) => Promise<void>;
  adminRequestReverification: (requestId: string, feedback: string) => Promise<void>;
  adminSetUnderReview: (requestId: string) => Promise<void>;
  // Notifications
  notifications: AppNotification[];
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  pushNotificationStatus: PushNotificationStatus;
  requestPushPermission: () => Promise<PushNotificationStatus>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('helpline_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { percentage } = calculateProfileCompletion(parsed);
        return { ...parsed, profileCompletedPercentage: percentage };
      } catch (e) {
        console.error(e);
      }
    }
    const { percentage } = calculateProfileCompletion(INITIAL_USER_PROFILE);
    return { ...INITIAL_USER_PROFILE, profileCompletedPercentage: percentage };
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('helpline_is_admin') === 'true';
  });

  const [currentAdminRole, setCurrentAdminRole] = useState<AdminRoleType>(() => {
    const saved = localStorage.getItem('helpline_admin_role') as AdminRoleType;
    return saved || 'super_admin';
  });

  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(() => {
    const saved = localStorage.getItem('helpline_verification_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_SEED_VERIFICATION_REQUESTS;
  });

  const [auditLogs, setAuditLogs] = useState<VerificationAuditLog[]>(() => {
    const saved = localStorage.getItem('helpline_audit_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'log-seed-1',
        verificationRequestId: 'HLV-10019',
        userId: 'user-05-nasir',
        action: 'APPROVED',
        performedBy: {
          uid: 'admin-02',
          name: 'Verification Admin',
          role: 'verification_admin'
        },
        reason: 'সকল তথ্য ও এনআইডি কপি সঠিক পাওয়া গেছে।',
        timestamp: new Date(Date.now() - 3600 * 1000 * 50).toISOString()
      },
      {
        id: 'log-seed-2',
        verificationRequestId: 'HLV-10020',
        userId: 'user-04-shahid',
        action: 'REJECTED',
        performedBy: {
          uid: 'admin-01',
          name: 'Super Admin',
          role: 'super_admin'
        },
        reason: 'ডকুমেন্টের ছবি পরিষ্কার নয়',
        timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString()
      },
      {
        id: 'log-seed-3',
        verificationRequestId: 'HLV-10022',
        userId: 'user-03-tareq',
        action: 'UNDER_REVIEW',
        performedBy: {
          uid: 'admin-01',
          name: 'Super Admin',
          role: 'super_admin'
        },
        timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
      }
    ];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('helpline_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'notif-1',
        recipientId: 'user-demo-01',
        titleBn: 'প্রোফাইল যাচাই করুন (Verify Profile)',
        messageBn: 'বিশ্বস্ত গ্রাহকদের কাছে পৌঁছাতে আপনার জাতীয় পরিচয়পত্র বা ড্রাইভিং লাইসেন্স জমা দিন।',
        type: 'verification',
        status: 'pending',
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('helpline_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('helpline_is_admin', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('helpline_admin_role', currentAdminRole);
  }, [currentAdminRole]);

  useEffect(() => {
    localStorage.setItem('helpline_verification_requests', JSON.stringify(verificationRequests));
  }, [verificationRequests]);

  useEffect(() => {
    localStorage.setItem('helpline_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('helpline_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        if (user.email === 'sk82716102@gmail.com') {
          setIsAdmin(true);
        }

        try {
          const profileRef = doc(db, 'userProfiles', user.uid);
          const snap = await getDoc(profileRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            const { percentage, isComplete } = calculateProfileCompletion(data);
            const enriched = { 
              ...data, 
              profileCompletedPercentage: percentage,
              isProfileSetupComplete: isComplete || data.isProfileSetupComplete 
            };
            setUserProfile(enriched);
          } else {
            const newProfile: UserProfile = {
              ...INITIAL_USER_PROFILE,
              userId: user.uid,
              fullName: user.displayName || 'সম্মানিত ব্যবহারকারী',
              email: user.email || undefined,
              avatarUrl: user.photoURL || undefined,
              phoneNumber: user.phoneNumber || '০১৭০০-০০০০০০',
              isOnline: true,
              availabilityUpdatedAt: new Date().toISOString(),
              lastActiveAt: new Date().toISOString(),
              verificationStatus: 'unverified',
              capabilities: ['worker', 'customer'],
              roles: ['worker', 'customer'],
              joinedDate: new Date().toLocaleDateString('bn-BD', { year: 'numeric' }),
              profileCompletedPercentage: 40,
              isProfileSetupComplete: false,
            };
            const { percentage } = calculateProfileCompletion(newProfile);
            newProfile.profileCompletedPercentage = percentage;

            setUserProfile(newProfile);
            await setDoc(profileRef, newProfile);

            // Also create user record in users/{uid}
            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              fullName: newProfile.fullName,
              phoneNumber: newProfile.phoneNumber,
              email: newProfile.email || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });

            // Also create initial userRoles in userRoles/{uid}
            await setDoc(doc(db, 'userRoles', user.uid), {
              userId: user.uid,
              capabilities: ['worker', 'customer'],
              activeCapabilities: ['worker', 'customer'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.warn('Firestore profile sync note:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (_mode?: 'login' | 'register') => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openProfileSetup = () => setIsProfileSetupOpen(true);
  const closeProfileSetup = () => setIsProfileSetupOpen(false);

  const registerWithEmail = async (fullName: string, phone: string, email: string, pass: string) => {
    try {
      // If no email provided, construct reliable account identifier
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const effectiveEmail = email.trim() || `user_${cleanPhone}@helplinebd.com`;

      const userCredential = await createUserWithEmailAndPassword(auth, effectiveEmail, pass);
      const user = userCredential.user;

      await fbUpdateProfile(user, { displayName: fullName });

      const newProfile: UserProfile = {
        ...INITIAL_USER_PROFILE,
        userId: user.uid,
        fullName,
        phoneNumber: phone,
        email: email.trim() || undefined,
        isOnline: true,
        availabilityUpdatedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        verificationStatus: 'unverified',
        capabilities: ['worker', 'customer'],
        roles: ['worker', 'customer'],
        professions: [],
        skills: [],
        experiences: [],
        workHistories: [],
        serviceAreas: [],
        presentAddress: {
          division: 'ঢাকা',
          district: 'ঢাকা',
          upazila: '',
          unionWard: '',
          areaRoad: '',
        },
        joinedDate: new Date().toLocaleDateString('bn-BD', { year: 'numeric' }),
        subscriptionPlan: 'free',
        subscriptionActive: true,
        profileCompletedPercentage: 35,
        isProfileSetupComplete: false,
      };

      const { percentage } = calculateProfileCompletion(newProfile);
      newProfile.profileCompletedPercentage = percentage;

      setUserProfile(newProfile);

      // Create in Firestore: users/{uid}
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        fullName,
        phoneNumber: phone,
        email: effectiveEmail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Create in Firestore: userProfiles/{uid}
      await setDoc(doc(db, 'userProfiles', user.uid), newProfile);

      // Create in Firestore: userRoles/{uid}
      const roleRecord: UserRoleRecord = {
        userId: user.uid,
        capabilities: ['worker', 'customer'],
        activeCapabilities: ['worker', 'customer'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'userRoles', user.uid), roleRecord);

      closeAuthModal();
      // Prompt user to complete their profile setup!
      setIsProfileSetupOpen(true);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'users');
    }
  };

  const loginWithEmail = async (emailOrPhone: string, pass: string) => {
    try {
      let targetEmail = emailOrPhone.trim();
      if (!targetEmail.includes('@')) {
        const cleanPhone = emailOrPhone.replace(/[^0-9]/g, '');
        targetEmail = `user_${cleanPhone}@helplinebd.com`;
      }
      await signInWithEmailAndPassword(auth, targetEmail, pass);
      closeAuthModal();
    } catch (err: any) {
      console.error('Email login error:', err);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email === 'sk82716102@gmail.com') {
        setIsAdmin(true);
      }
      closeAuthModal();
    } catch (error: any) {
      console.warn('Google sign-in popup warning:', error);
      if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/cancelled-popup-request') {
        loginAsDemoUser();
        closeAuthModal();
      } else {
        throw error;
      }
    }
  };

  const loginAsDemoUser = () => {
    const { percentage, isComplete } = calculateProfileCompletion(INITIAL_USER_PROFILE);
    setUserProfile({
      ...INITIAL_USER_PROFILE,
      profileCompletedPercentage: percentage,
      isProfileSetupComplete: isComplete,
    });
    setIsAdmin(true);
    closeAuthModal();
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.error('Logout error:', e);
    }
    setCurrentUser(null);
  };

  const toggleOnlineStatus = async () => {
    const nextStatus = !userProfile.isOnline;
    const now = new Date().toISOString();
    const updated = {
      isOnline: nextStatus,
      availabilityUpdatedAt: now,
      lastActiveAt: now,
    };
    setUserProfile((prev) => ({ ...prev, ...updated }));
    if (currentUser) {
      try {
        const profileRef = doc(db, 'userProfiles', currentUser.uid);
        await setDoc(profileRef, updated, { merge: true });
      } catch (err) {
        console.warn('Failed to update online status in DB:', err);
      }
    }
  };

  const toggleRole = async (role: CapabilityType) => {
    const caps = userProfile.capabilities || userProfile.roles || [];
    const exists = caps.includes(role);
    const updatedCaps = exists ? caps.filter((r) => r !== role) : [...caps, role];
    
    if (updatedCaps.length === 0) return;

    await updateCapabilities(updatedCaps);
  };

  const updateCapabilities = async (capabilities: CapabilityType[]) => {
    const updatedFields: Partial<UserProfile> = {
      capabilities,
      roles: capabilities,
    };
    await updateProfile(updatedFields);

    if (currentUser) {
      try {
        const roleRef = doc(db, 'userRoles', currentUser.uid);
        await setDoc(
          roleRef,
          {
            userId: currentUser.uid,
            capabilities,
            activeCapabilities: capabilities,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Role DB sync warning:', err);
      }
    }
  };

  const updateLiveLocation = async (coords: { latitude: number; longitude: number; accuracy?: number }) => {
    const locationData = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracyMeters: coords.accuracy || 10,
      lastUpdated: new Date().toISOString(),
      sharePermissionGranted: true,
    };
    await updateProfile({ currentLocation: locationData });
  };

  const submitCustomCategoryRequest = async (nameBn: string, nameEn?: string, description?: string) => {
    const customReq: Omit<CustomCategoryRequest, 'id'> = {
      userId: currentUser ? currentUser.uid : userProfile.userId,
      userName: userProfile.fullName,
      professionNameBn: nameBn,
      professionNameEn: nameEn,
      description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'customCategoryRequests'), customReq);
    } catch (err) {
      console.warn('Custom category request local save note:', err);
    }

    // Immediately enable this custom profession on user's own profile
    const existing = userProfile.professions || [];
    if (!existing.includes(nameBn)) {
      await updateProfile({
        professions: [...existing, nameBn],
      });
    }
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const merged = { ...prev, ...updated };
      const { percentage, isComplete } = calculateProfileCompletion(merged);
      return { 
        ...merged, 
        profileCompletedPercentage: percentage,
        isProfileSetupComplete: isComplete || merged.isProfileSetupComplete
      };
    });

    if (currentUser) {
      try {
        const profileRef = doc(db, 'userProfiles', currentUser.uid);
        await setDoc(profileRef, updated, { merge: true });

        // Synchronize auth user photoURL and displayName
        if (updated.avatarUrl !== undefined || updated.fullName) {
          await fbUpdateProfile(currentUser, {
            displayName: updated.fullName || currentUser.displayName,
            photoURL: updated.avatarUrl || null,
          }).catch((err) => {
            console.warn('Sync fbUpdateProfile non-critical warning:', err);
          });
        }
      } catch (err: any) {
        handleFirestoreError(err, OperationType.UPDATE, `userProfiles/${currentUser.uid}`);
      }
    }
  };

  // Verification History for current user
  const effectiveUserId = currentUser ? currentUser.uid : userProfile.userId;
  const verificationHistory = verificationRequests.filter(
    (r) => r.userId === effectiveUserId || r.userId === 'user-demo-01'
  );

  const submitVerificationRequest = async (params: {
    documentType: IdentityDocumentType;
    documentNumber: string;
    submittedInformation: SubmittedIdentityInfo;
    documentFiles: VerificationDocumentFiles;
  }): Promise<VerificationRequest> => {
    const now = new Date().toISOString();
    const generatedId = `HLV-${Math.floor(10000 + Math.random() * 90000)}`;
    const previousAttempts = verificationRequests.filter((r) => r.userId === effectiveUserId);
    const version = previousAttempts.length + 1;

    const newRequest: VerificationRequest = {
      id: generatedId,
      userId: effectiveUserId,
      userName: userProfile.fullName,
      userPhone: userProfile.phoneNumber,
      userAvatar: userProfile.avatarUrl,
      userAddress: userProfile.presentAddress.fullAddress || `${userProfile.presentAddress.district}, ${userProfile.presentAddress.division}`,
      userCapabilities: userProfile.capabilities || userProfile.roles || [],
      userProfessions: userProfile.professions || [],
      documentType: params.documentType,
      documentNumber: params.documentNumber,
      documentNumberMasked: maskDocumentNumber(params.documentNumber),
      submittedInformation: params.submittedInformation,
      documentFiles: params.documentFiles,
      status: 'pending',
      submittedAt: now,
      verificationVersion: version,
      policyAgreed: true,
      policyAgreedAt: now,
      createdAt: now,
      updatedAt: now
    };

    // Prepend to requests
    setVerificationRequests((prev) => [newRequest, ...prev]);

    // Create Audit Log
    const newAuditLog: VerificationAuditLog = {
      id: `log-${Date.now()}`,
      verificationRequestId: generatedId,
      userId: effectiveUserId,
      action: 'SUBMITTED',
      performedBy: {
        uid: effectiveUserId,
        name: userProfile.fullName,
        role: 'user'
      },
      reason: `${getDocumentTypeInfo(params.documentType).nameBn} ভেরিফিকেশনের জন্য দাখিল করা হয়েছে।`,
      timestamp: now
    };
    setAuditLogs((prev) => [newAuditLog, ...prev]);

    // Update user profile status
    const profileUpdates: Partial<UserProfile> = {
      verificationStatus: 'pending'
    };
    if (params.documentType === 'driving_license') {
      profileUpdates.driverVerificationStatus = 'pending';
    }
    await updateProfile(profileUpdates);

    // Create In-App Notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: effectiveUserId,
      titleBn: 'ভেরিফিকেশন আবেদন জমা হয়েছে',
      messageBn: `আপনার ${getDocumentTypeInfo(params.documentType).shortBn} যাচাই আবেদন সফলভাবে জমা হয়েছে (আইডি: #${generatedId})। HelpLine টিম এটি যাচাই করবে।`,
      type: 'verification',
      status: 'pending',
      verificationRequestId: generatedId,
      isRead: false,
      createdAt: now
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Save to Firestore if available
    try {
      await setDoc(doc(db, 'verificationRequests', generatedId), newRequest);
      await addDoc(collection(db, 'verificationAuditLogs'), newAuditLog);
    } catch (err) {
      console.warn('Firestore verification request sync note:', err);
    }

    return newRequest;
  };

  const adminApproveVerification = async (requestId: string, adminNotes?: string) => {
    const now = new Date().toISOString();
    const adminName = currentUser?.displayName || (currentAdminRole === 'super_admin' ? 'Super Admin' : 'Verification Admin');
    const adminId = currentUser?.uid || 'admin-01';

    const targetReq = verificationRequests.find((r) => r.id === requestId);
    const targetUserId = targetReq?.userId || effectiveUserId;
    const targetDocType = targetReq?.documentType || 'nid';

    setVerificationRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'approved',
            reviewedAt: now,
            reviewedBy: {
              adminId,
              adminName,
              role: currentAdminRole
            },
            adminFeedback: adminNotes,
            updatedAt: now
          };
        }
        return r;
      })
    );

    // Add Audit Log
    const audit: VerificationAuditLog = {
      id: `log-${Date.now()}`,
      verificationRequestId: requestId,
      userId: targetUserId || effectiveUserId,
      action: 'APPROVED',
      performedBy: {
        uid: adminId,
        name: adminName,
        role: currentAdminRole
      },
      reason: adminNotes || 'সকল দাখিলকৃত তথ্য ও নথি সঠিক ও নির্ভরযোগ্য হিসেবে যাচাই ও অনুমোদন করা হয়েছে।',
      timestamp: now
    };
    setAuditLogs((prev) => [audit, ...prev]);

    // Update User Profile
    const profileUpdates: Partial<UserProfile> = {
      verificationStatus: 'approved',
      verifiedAt: now
    };
    if (targetDocType === 'driving_license') {
      profileUpdates.driverVerificationStatus = 'approved';
      profileUpdates.isDriverVerified = true;
    }
    await updateProfile(profileUpdates);

    // Create In-App Notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: targetUserId || effectiveUserId,
      titleBn: '✓ প্রোফাইল যাচাই সম্পন্ন (Approved)',
      messageBn: `অভিনন্দন! আপনার প্রোফাইল ভেরিফিকেশন সফলভাবে অনুমোদিত হয়েছে। আপনার প্রোফাইলে ভেরিফাইড ব্যাজ সক্রিয় করা হয়েছে।`,
      type: 'verification',
      status: 'approved',
      verificationRequestId: requestId,
      isRead: false,
      createdAt: now
    };
    setNotifications((prev) => [notif, ...prev]);

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'verificationRequests', requestId), {
        status: 'approved',
        reviewedAt: now,
        reviewedBy: { adminId, adminName, role: currentAdminRole },
        adminFeedback: adminNotes || '',
        updatedAt: now
      }, { merge: true });
      await addDoc(collection(db, 'verificationAuditLogs'), audit);
    } catch (err) {
      console.warn('Firestore approval sync warning:', err);
    }
  };

  const adminRejectVerification = async (requestId: string, reason: string, feedback?: string) => {
    const now = new Date().toISOString();
    const adminName = currentUser?.displayName || (currentAdminRole === 'super_admin' ? 'Super Admin' : 'Verification Admin');
    const adminId = currentUser?.uid || 'admin-01';

    const targetReq = verificationRequests.find((r) => r.id === requestId);
    const targetUserId = targetReq?.userId || effectiveUserId;
    const targetDocType = targetReq?.documentType || 'nid';

    setVerificationRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'rejected',
            rejectionReason: reason,
            adminFeedback: feedback,
            reviewedAt: now,
            reviewedBy: {
              adminId,
              adminName,
              role: currentAdminRole
            },
            updatedAt: now
          };
        }
        return r;
      })
    );

    // Add Audit Log
    const audit: VerificationAuditLog = {
      id: `log-${Date.now()}`,
      verificationRequestId: requestId,
      userId: targetUserId || effectiveUserId,
      action: 'REJECTED',
      performedBy: {
        uid: adminId,
        name: adminName,
        role: currentAdminRole
      },
      reason: `কারণ: ${reason}${feedback ? ` (${feedback})` : ''}`,
      timestamp: now
    };
    setAuditLogs((prev) => [audit, ...prev]);

    // Update User Profile
    const profileUpdates: Partial<UserProfile> = {
      verificationStatus: 'rejected'
    };
    if (targetDocType === 'driving_license') {
      profileUpdates.driverVerificationStatus = 'rejected';
    }
    await updateProfile(profileUpdates);

    // Create Notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: targetUserId || effectiveUserId,
      titleBn: 'ভেরিফিকেশন আবেদন প্রত্যাখ্যাত',
      messageBn: `আপনার যাচাই আবেদনটি সাময়িক প্রত্যাখ্যাত হয়েছে। কারণ: "${reason}"। প্রোফাইল যাচাই পেজে গিয়ে পুনরায় জমা দিন।`,
      type: 'verification',
      status: 'rejected',
      verificationRequestId: requestId,
      isRead: false,
      createdAt: now
    };
    setNotifications((prev) => [notif, ...prev]);

    try {
      await setDoc(doc(db, 'verificationRequests', requestId), {
        status: 'rejected',
        rejectionReason: reason,
        adminFeedback: feedback || '',
        reviewedAt: now,
        reviewedBy: { adminId, adminName, role: currentAdminRole },
        updatedAt: now
      }, { merge: true });
      await addDoc(collection(db, 'verificationAuditLogs'), audit);
    } catch (err) {
      console.warn('Firestore rejection sync warning:', err);
    }
  };

  const adminRequestReverification = async (requestId: string, feedback: string) => {
    const now = new Date().toISOString();
    const adminName = currentUser?.displayName || (currentAdminRole === 'super_admin' ? 'Super Admin' : 'Verification Admin');
    const adminId = currentUser?.uid || 'admin-01';

    const targetReq = verificationRequests.find((r) => r.id === requestId);
    const targetUserId = targetReq?.userId || effectiveUserId;
    const targetDocType = targetReq?.documentType || 'nid';

    setVerificationRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'reverification_required',
            rejectionReason: 'তথ্য বা নথির ছবি স্পষ্ট নয়',
            adminFeedback: feedback,
            reviewedAt: now,
            reviewedBy: {
              adminId,
              adminName,
              role: currentAdminRole
            },
            updatedAt: now
          };
        }
        return r;
      })
    );

    // Add Audit Log
    const audit: VerificationAuditLog = {
      id: `log-${Date.now()}`,
      verificationRequestId: requestId,
      userId: targetUserId || effectiveUserId,
      action: 'REVERIFICATION_REQUESTED',
      performedBy: {
        uid: adminId,
        name: adminName,
        role: currentAdminRole
      },
      reason: feedback,
      timestamp: now
    };
    setAuditLogs((prev) => [audit, ...prev]);

    // Update User Profile
    const profileUpdates: Partial<UserProfile> = {
      verificationStatus: 'reverification_required'
    };
    if (targetDocType === 'driving_license') {
      profileUpdates.driverVerificationStatus = 'reverification_required';
    }
    await updateProfile(profileUpdates);

    // Create Notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: targetUserId || effectiveUserId,
      titleBn: 'পুনরায় যাচাই প্রয়োজন (Re-verify Required)',
      messageBn: `আপনার দাখিলকৃত তথ্যে কিছু অসঙ্গতি বা অস্পষ্টতা রয়েছে: "${feedback}"। অনুগ্রহ করে পুনরায় জমা দিন।`,
      type: 'verification',
      status: 'reverification_required',
      verificationRequestId: requestId,
      isRead: false,
      createdAt: now
    };
    setNotifications((prev) => [notif, ...prev]);

    try {
      await setDoc(doc(db, 'verificationRequests', requestId), {
        status: 'reverification_required',
        adminFeedback: feedback,
        reviewedAt: now,
        reviewedBy: { adminId, adminName, role: currentAdminRole },
        updatedAt: now
      }, { merge: true });
      await addDoc(collection(db, 'verificationAuditLogs'), audit);
    } catch (err) {
      console.warn('Firestore reverification sync warning:', err);
    }
  };

  const adminSetUnderReview = async (requestId: string) => {
    const now = new Date().toISOString();
    const adminName = currentUser?.displayName || (currentAdminRole === 'super_admin' ? 'Super Admin' : 'Verification Admin');
    const adminId = currentUser?.uid || 'admin-01';

    setVerificationRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'under_review',
            reviewedBy: {
              adminId,
              adminName,
              role: currentAdminRole
            },
            updatedAt: now
          };
        }
        return r;
      })
    );

    const audit: VerificationAuditLog = {
      id: `log-${Date.now()}`,
      verificationRequestId: requestId,
      userId: effectiveUserId,
      action: 'UNDER_REVIEW',
      performedBy: {
        uid: adminId,
        name: adminName,
        role: currentAdminRole
      },
      reason: 'টিম কর্তৃক নথিপত্র পর্যালোচনা শুরু হয়েছে।',
      timestamp: now
    };
    setAuditLogs((prev) => [audit, ...prev]);

    try {
      await setDoc(doc(db, 'verificationRequests', requestId), {
        status: 'under_review',
        reviewedBy: { adminId, adminName, role: currentAdminRole },
        updatedAt: now
      }, { merge: true });
      await addDoc(collection(db, 'verificationAuditLogs'), audit);
    } catch (err) {
      console.warn('Firestore under review sync warning:', err);
    }
  };

  const [pushNotificationStatus, setPushNotificationStatus] = useState<PushNotificationStatus>(() =>
    getNotificationPermission()
  );

  const requestPushPermission = async (): Promise<PushNotificationStatus> => {
    const status = await requestNotificationPermission();
    setPushNotificationStatus(status);
    return status;
  };

  const addNotification = async (notif: Omit<AppNotification, 'id' | 'createdAt'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Save to Firestore notifications collection if user is authenticated or demo mode
    try {
      await addDoc(collection(db, 'notifications'), newNotif);
    } catch (err) {
      console.debug('Firestore notification sync notice (persisted in local state):', err);
    }

    // Trigger native browser notification if granted
    dispatchBrowserNotification({
      title: newNotif.titleBn,
      body: newNotif.messageBn,
      tag: newNotif.type,
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAdmin,
        currentAdminRole,
        setCurrentAdminRole,
        isAuthModalOpen,
        isProfileSetupOpen,
        openAuthModal,
        closeAuthModal,
        openProfileSetup,
        closeProfileSetup,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginAsDemoUser,
        logout,
        toggleOnlineStatus,
        toggleRole,
        updateCapabilities,
        updateProfile,
        updateLiveLocation,
        submitCustomCategoryRequest,
        setIsAdmin,
        verificationRequests,
        verificationHistory,
        auditLogs,
        submitVerificationRequest,
        adminApproveVerification,
        adminRejectVerification,
        adminRequestReverification,
        adminSetUnderReview,
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        pushNotificationStatus,
        requestPushPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
