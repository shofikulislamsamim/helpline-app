import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  HireRequest, 
  HireRequestStatus, 
  WorkerQuote, 
  ServiceReview, 
  ChatMessage, 
  Conversation, 
  UserComplaint, 
  HireAdminSettings, 
  UserProfile,
  ServiceFeeBreakdown 
} from '../types';
import { 
  DEFAULT_HIRE_ADMIN_SETTINGS, 
  SAMPLE_SEED_WORKERS, 
  SAMPLE_SEED_HIRE_REQUESTS, 
  SAMPLE_SEED_REVIEWS 
} from '../lib/hireData';
import { calculateServiceFee } from '../lib/feeCalculator';
import { useAuth } from './AuthContext';
import { doc, setDoc, getDocs, collection, updateDoc, addDoc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CreateHireRequestParams {
  workerId: string;
  workType: string;
  description: string;
  workLocation: {
    division: string;
    district: string;
    upazila: string;
    areaRoad?: string;
    fullAddress: string;
  };
  preferredDate: string;
  preferredTime: string;
  budget?: number;
  notes?: string;
  photos?: string[];
}

interface WorkerPerformanceStats {
  completedJobs: number;
  averageRating: number;
  totalReviews: number;
  totalAccepted: number;
  completionRate: number; // percentage, e.g. 95
  hasEnoughData: boolean;
}

interface HireContextType {
  workers: UserProfile[];
  hireRequests: HireRequest[];
  reviews: ServiceReview[];
  conversations: Conversation[];
  messages: ChatMessage[];
  complaints: UserComplaint[];
  adminSettings: HireAdminSettings;
  updateAdminSettings: (newSettings: Partial<HireAdminSettings>) => void;
  // Hire Request Lifecycle
  createHireRequest: (params: CreateHireRequestParams) => Promise<HireRequest>;
  sendQuote: (requestId: string, estimatedPrice: number, quoteNote?: string) => Promise<void>;
  acceptQuote: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string, reason?: string) => Promise<void>;
  advanceJobStatus: (requestId: string, nextStatus: 'ON_THE_WAY' | 'WORK_STARTED' | 'WORK_COMPLETED') => Promise<void>;
  cancelRequest: (requestId: string, reason: string, by: 'customer' | 'worker') => Promise<void>;
  // Ratings & Complaints
  submitRating: (hireRequestId: string, rating: number, comment: string) => Promise<void>;
  submitComplaint: (hireRequestId: string, reason: string, details: string) => Promise<UserComplaint>;
  updateComplaintStatus: (complaintId: string, status: 'pending' | 'investigating' | 'resolved' | 'dismissed', adminNotes?: string) => Promise<void>;
  // Fees & Commission
  calculateFee: (agreedPrice: number) => ServiceFeeBreakdown;
  // Chat & Messages
  getConversationByRequestId: (requestId: string) => Conversation | undefined;
  getMessagesForConversation: (conversationId: string) => ChatMessage[];
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  // Helpers
  getWorkerById: (workerId: string) => UserProfile | undefined;
  getWorkerStats: (workerId: string) => WorkerPerformanceStats;
  getWorkerReviews: (workerId: string) => ServiceReview[];
  activeRequestIdForDetails: string | null;
  setActiveRequestIdForDetails: (id: string | null) => void;
}

const HireContext = createContext<HireContextType | undefined>(undefined);

export const HireProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, currentUser, addNotification } = useAuth();
  const [activeRequestIdForDetails, setActiveRequestIdForDetails] = useState<string | null>(null);

  // Admin Settings
  const [adminSettings, setAdminSettings] = useState<HireAdminSettings>(() => {
    const saved = localStorage.getItem('helpline_hire_admin_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_HIRE_ADMIN_SETTINGS;
  });

  // Workers List (Sample seed + dynamically registered workers)
  const [workers, setWorkers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('helpline_registered_workers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map<string, UserProfile>();
          SAMPLE_SEED_WORKERS.forEach((w) => map.set(w.userId, w));
          parsed.forEach((w: UserProfile) => {
            const existing = map.get(w.userId);
            map.set(w.userId, existing ? { ...existing, ...w } : w);
          });
          return Array.from(map.values());
        }
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_SEED_WORKERS;
  });

  // Hire Requests
  const [hireRequests, setHireRequests] = useState<HireRequest[]>(() => {
    const saved = localStorage.getItem('helpline_hire_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_SEED_HIRE_REQUESTS;
  });

  // Service Reviews
  const [reviews, setReviews] = useState<ServiceReview[]>(() => {
    const saved = localStorage.getItem('helpline_service_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_SEED_REVIEWS;
  });

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('helpline_conversations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'conv-hl-hr-10021',
        hireRequestId: 'HL-HR-10021',
        participantIds: ['user-demo-01', 'worker-01-shafiq'],
        participants: {
          'user-demo-01': { name: 'মো: রফিকুল ইসলাম', phone: '০১৭০০-১২৩৪৫৬', role: 'customer' },
          'worker-01-shafiq': { name: 'মো: শফিকুল ইসলাম', phone: '০১৭০১-১২২৩৩৩', role: 'worker' },
        },
        lastMessage: 'ফ্যান ফিটিং ও সার্কিট ব্রেকার চেঞ্জ করতে আনুমানিক ১ থেকে ১.৫ ঘণ্টা সময় লাগবে। পার্টসের খরচ আলাদা হবে।',
        lastMessageTimestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
        createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      },
    ];
  });

  // Messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('helpline_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'msg-1',
        conversationId: 'conv-hl-hr-10021',
        senderId: 'user-demo-01',
        senderName: 'মো: রফিকুল ইসলাম',
        text: 'আসসালামু আলাইকুম শফিকুল ভাই, আমার ড্রয়িং রুমের ফ্যান আর মেইন সুইচের ব্রেকারটা একটু দেখতে হবে। আজ কি আসতে পারবেন?',
        timestamp: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
      },
      {
        id: 'msg-2',
        conversationId: 'conv-hl-hr-10021',
        senderId: 'worker-01-shafiq',
        senderName: 'মো: শফিকুল ইসলাম',
        text: 'ওয়ালাইকুম আসসালাম। জ্বি ভাইয়া, আমি কোটেশন পাঠিয়ে দিয়েছি (৳৭৫০)। বিকাল ৪টায় মিরপুর ১০ নম্বরে আপনার বাসায় পৌঁছে যাব ইনশাআল্লাহ।',
        timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      },
    ];
  });

  // Complaints
  const [complaints, setComplaints] = useState<UserComplaint[]>(() => {
    const saved = localStorage.getItem('helpline_complaints');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('helpline_hire_admin_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  useEffect(() => {
    localStorage.setItem('helpline_registered_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('helpline_hire_requests', JSON.stringify(hireRequests));
  }, [hireRequests]);

  useEffect(() => {
    localStorage.setItem('helpline_service_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('helpline_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('helpline_chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('helpline_complaints', JSON.stringify(complaints));
  }, [complaints]);

  // Keep logged in user worker status in workers list if they have 'worker' capability
  useEffect(() => {
    const isWorker = userProfile?.capabilities?.includes('worker') || userProfile?.roles?.includes('worker');
    if (userProfile && isWorker && userProfile.professions && userProfile.professions.length > 0) {
      setWorkers((prev) => {
        const index = prev.findIndex((w) => w.userId === userProfile.userId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...updated[index], ...userProfile };
          return updated;
        } else {
          return [userProfile, ...prev];
        }
      });
    }
  }, [userProfile]);

  // Read serviceRequests from Firestore if available
  useEffect(() => {
    const fetchFirestoreRequests = async () => {
      try {
        if (!userProfile?.userId) return;

        // Service requests contain private contact/location details.
        // Only fetch requests where the signed-in user is a participant.
        const [customerSnap, workerSnap] = await Promise.all([
          getDocs(query(
            collection(db, 'serviceRequests'),
            where('customerId', '==', userProfile.userId)
          )),
          getDocs(query(
            collection(db, 'serviceRequests'),
            where('workerId', '==', userProfile.userId)
          )),
        ]);

        const list: HireRequest[] = [];
        const seen = new Set<string>();
        [...customerSnap.docs, ...workerSnap.docs].forEach((docSnap) => {
          if (seen.has(docSnap.id)) return;
          seen.add(docSnap.id);
          list.push({ ...(docSnap.data() as HireRequest), id: docSnap.id });
        });

        if (list.length > 0) {
          // Merge with existing requests without losing state
          setHireRequests((prev) => {
            const map = new Map<string, HireRequest>();
            prev.forEach((r) => map.set(r.id, r));
            list.forEach((r) => map.set(r.id, r));
            return Array.from(map.values());
          });
        }
      } catch (err) {
        // Fallback gracefully to local mock state
        console.warn('Firestore serviceRequests fetch notice (fallback active):', err);
      }
    };
    fetchFirestoreRequests();
  }, [userProfile?.userId]);

  const updateAdminSettings = (newSettings: Partial<HireAdminSettings>) => {
    setAdminSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const getWorkerById = (workerId: string): UserProfile | undefined => {
    if (userProfile.userId === workerId) return userProfile;
    return workers.find((w) => w.userId === workerId);
  };

  const getWorkerReviews = (workerId: string): ServiceReview[] => {
    return reviews.filter((r) => r.revieweeId === workerId);
  };

  const getWorkerStats = (workerId: string): WorkerPerformanceStats => {
    const worker = getWorkerById(workerId);
    const workerReviews = getWorkerReviews(workerId);
    const workerJobs = hireRequests.filter((r) => r.workerId === workerId);

    const completed = workerJobs.filter((r) => r.status === 'WORK_COMPLETED').length + (worker?.completedJobsCount || 0);
    const accepted = workerJobs.filter((r) => ['ACCEPTED', 'ON_THE_WAY', 'WORK_STARTED', 'WORK_COMPLETED'].includes(r.status)).length;
    const cancelledOrRejected = workerJobs.filter((r) => ['CANCELLED', 'REJECTED'].includes(r.status)).length;
    const totalRequests = workerJobs.length;

    let averageRating = worker?.rating || 5.0;
    if (workerReviews.length > 0) {
      const sum = workerReviews.reduce((acc, r) => acc + r.rating, 0);
      averageRating = Number((sum / workerReviews.length).toFixed(1));
    }

    const totalReviews = workerReviews.length + (worker?.reviewCount || 0);

    // Calculate completion rate
    let completionRate = 100;
    if (accepted > 0) {
      completionRate = Math.min(100, Math.round((completed / (completed + (cancelledOrRejected > 0 ? 1 : 0))) * 100));
    }

    const hasEnoughData = (completed + totalReviews) >= 1;

    return {
      completedJobs: completed,
      averageRating,
      totalReviews,
      totalAccepted: accepted,
      completionRate,
      hasEnoughData,
    };
  };

  // 1. Create Hire Request
  const createHireRequest = async (params: CreateHireRequestParams): Promise<HireRequest> => {
    const worker = getWorkerById(params.workerId);
    if (!worker) {
      throw new Error('কর্মী খুঁজে পাওয়া যায়নি।');
    }

    const isWorker = worker.capabilities?.includes('worker') || worker.roles?.includes('worker');
    if (!isWorker) {
      throw new Error('এই ব্যবহারকারীর "কাজ করতে চাই" সক্ষমতা নেই।');
    }

    if (adminSettings.requireVerificationForWork && worker.verificationStatus !== 'verified' && worker.verificationStatus !== 'approved') {
      throw new Error('এই কর্মী এখনও ভেরিফাইড নন। প্ল্যাটফর্ম সুরক্ষার জন্য শুধুমাত্র ভেরিফাইড কর্মীকে কাজের অনুরোধ পাঠানো যায়।');
    }

    if (currentUser && currentUser.uid === worker.userId) {
      throw new Error('আপনি নিজেকে কাজের অনুরোধ পাঠাতে পারবেন না।');
    }

    const reqId = `HL-HR-${Math.floor(10000 + Math.random() * 90000)}`;
    const convId = `conv-${reqId.toLowerCase()}`;
    const now = new Date().toISOString();

    const newRequest: HireRequest = {
      id: reqId,
      customerId: userProfile.userId,
      customerName: userProfile.fullName,
      customerPhone: userProfile.phoneNumber,
      customerAvatar: userProfile.avatarUrl,
      workerId: worker.userId,
      workerName: worker.fullName,
      workerPhone: worker.phoneNumber,
      workerAvatar: worker.avatarUrl,
      workerProfession: worker.mainProfession || worker.professions?.[0] || 'টেকনিশিয়ান',
      workType: params.workType,
      description: params.description,
      workLocation: params.workLocation,
      preferredDate: params.preferredDate,
      preferredTime: params.preferredTime,
      budget: params.budget,
      notes: params.notes,
      photos: params.photos,
      status: 'REQUESTED',
      conversationId: convId,
      createdAt: now,
    };

    // Create linked conversation
    const newConv: Conversation = {
      id: convId,
      hireRequestId: reqId,
      participantIds: [userProfile.userId, worker.userId],
      participants: {
        [userProfile.userId]: {
          name: userProfile.fullName,
          phone: userProfile.phoneNumber,
          avatar: userProfile.avatarUrl,
          role: 'customer',
        },
        [worker.userId]: {
          name: worker.fullName,
          phone: worker.phoneNumber,
          avatar: worker.avatarUrl,
          role: 'worker',
        },
      },
      lastMessage: `নতুন কাজের অনুরোধ: ${params.workType}`,
      lastMessageTimestamp: now,
      createdAt: now,
      updatedAt: now,
    };

    // Initial message
    const initialMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      senderId: userProfile.userId,
      senderName: userProfile.fullName,
      senderAvatar: userProfile.avatarUrl,
      text: `[কাজের অনুরোধ: ${params.workType}]\n${params.description}\nঠিকানা: ${params.workLocation.fullAddress}\nতারিখ: ${params.preferredDate}, সময়: ${params.preferredTime}${params.budget ? `\nবাজেট: ৳${params.budget}` : ''}`,
      timestamp: now,
    };

    // Update local state
    setHireRequests((prev) => [newRequest, ...prev]);
    setConversations((prev) => [newConv, ...prev]);
    setMessages((prev) => [initialMsg, ...prev]);

    // Send in-app notification to customer
    addNotification({
      recipientId: userProfile.userId,
      hireRequestId: reqId,
      titleBn: 'কাজের অনুরোধ পাঠানো হয়েছে',
      messageBn: `আপনার অনুরোধ #${reqId} সফলভাবে ${worker.fullName}-এর কাছে পাঠানো হয়েছে। কর্মী খুব শীঘ্রই সাড়া দেবেন।`,
      type: 'hire_request',
      hireRequestId: reqId,
      status: 'pending',
      isRead: false,
    });

    // Send in-app notification to worker
    addNotification({
      recipientId: worker.userId,
      hireRequestId: reqId,
      titleBn: 'নতুন কাজের অনুরোধ এসেছে! (New Hire Request)',
      messageBn: `${userProfile.fullName} আপনার জন্য একটি নতুন কাজের অনুরোধ #${reqId} (${params.workType}) পাঠিয়েছেন। এখনই কোটেশন দিন।`,
      type: 'hire_request',
      hireRequestId: reqId,
      status: 'pending',
      isRead: false,
    });

    // Persist to Firestore
    try {
      await setDoc(doc(db, 'serviceRequests', reqId), newRequest);
      await setDoc(doc(db, 'conversations', convId), newConv);
      await addDoc(collection(db, 'messages'), initialMsg);
    } catch (err) {
      console.warn('Firestore serviceRequests sync notice (saved locally):', err);
    }

    return newRequest;
  };

  // 2. Worker sends quote
  const sendQuote = async (requestId: string, estimatedPrice: number, quoteNote?: string) => {
    const target = hireRequests.find((r) => r.id === requestId);
    if (!target) throw new Error('অনুরোধ পাওয়া যায়নি।');
    if (target.status !== 'REQUESTED') {
      throw new Error('এই অনুরোধটিতে আর কোটেশন পাঠানো যাবে না।');
    }

    const now = new Date().toISOString();
    const quote: WorkerQuote = {
      estimatedPrice,
      quoteNote,
      quotedAt: now,
    };

    setHireRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'QUOTED', quote, quotedAt: now } : r))
    );

    // Notify customer
    addNotification({
      recipientId: target.customerId,
      hireRequestId: requestId,
      titleBn: `কোটেশন প্রাপ্তি: #${requestId}`,
      messageBn: `${target.workerName} আপনার অনুরোধে ৳${estimatedPrice} আনুমানিক কোটেশন প্রদান করেছেন। গ্রহণ বা বাতিল করতে ক্লিক করুন।`,
      type: 'quote',
      hireRequestId: requestId,
      status: 'pending',
      isRead: false,
    });

    // Post message to chat
    if (target.conversationId) {
      const quoteMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId: target.conversationId,
        senderId: target.workerId,
        senderName: target.workerName,
        senderAvatar: target.workerAvatar,
        text: `[কোটেশন পাঠানো হয়েছে: ৳${estimatedPrice}]\n${quoteNote || 'কাজের প্রয়োজনীয় সরঞ্জাম ও আনুমানিক পারিশ্রমিক অন্তর্ভুক্ত।'}\nগ্রাহক অনুগ্রহ করে গ্রহণ করুন।`,
        timestamp: now,
      };
      setMessages((prev) => [...prev, quoteMsg]);
      try {
        await addDoc(collection(db, 'messages'), quoteMsg);
      } catch (e) {
        console.warn('Quote message sync warning:', e);
      }
    }

    try {
      await updateDoc(doc(db, 'serviceRequests', requestId), {
        status: 'QUOTED',
        quote,
        quotedAt: now,
      });
    } catch (err) {
      console.warn('Firestore quote update notice:', err);
    }
  };

  // 3. Customer accepts quote / agreement reached
  const acceptQuote = async (requestId: string) => {
    const target = hireRequests.find((r) => r.id === requestId);
    if (!target) throw new Error('অনুরোধ পাওয়া যায়নি।');
    if (target.status !== 'QUOTED' && target.status !== 'REQUESTED') {
      throw new Error('অনুরোধটি গ্রহণের উপযুক্ত অবস্থায় নেই।');
    }

    const now = new Date().toISOString();
    const agreedPrice = target.quote?.estimatedPrice || target.budget || 500;
    const feeBreakdown = calculateServiceFee(agreedPrice, adminSettings);

    setHireRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'ACCEPTED',
              agreedPrice,
              serviceFeeBreakdown: feeBreakdown,
              acceptedAt: now,
            }
          : r
      )
    );

    // Notify worker
    addNotification({
      recipientId: target.workerId,
      hireRequestId: requestId,
      titleBn: `কোটেশন গৃহীত হয়েছে! #${requestId}`,
      messageBn: `অভিনন্দন! ${target.customerName} আপনার কোটেশন (৳${agreedPrice}) গ্রহণ করেছেন। প্ল্যাটফর্ম ফি বাদে আনুমানিক প্রাপ্য ৳${feeBreakdown.workerReceivable}। নির্ধারিত সময়ে কাজে রওনা দিন।`,
      type: 'general',
      status: 'pending',
      isRead: false,
    });

    // Notify customer
    addNotification({
      recipientId: target.customerId,
      hireRequestId: requestId,
      titleBn: `কাজের চুক্তি সম্পন্ন হয়েছে! #${requestId}`,
      messageBn: `${target.workerName}-এর সাথে ৳${agreedPrice} মূল্যে চুক্তি সম্পন্ন হয়েছে। কর্মী কিছুক্ষণের মধ্যে রওনা দেবেন।`,
      type: 'general',
      status: 'pending',
      isRead: false,
    });

    // Chat message
    if (target.conversationId) {
      const acceptMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId: target.conversationId,
        senderId: target.customerId,
        senderName: target.customerName,
        text: `[কোটেশন গৃহীত হয়েছে]\nচুক্তি সম্পন্ন হয়েছে। চূড়ান্ত পারিশ্রমিক ৳${agreedPrice}। আশা করছি নির্ধারিত সময়ে চলে আসবেন। ধন্যবাদ!`,
        timestamp: now,
      };
      setMessages((prev) => [...prev, acceptMsg]);
      try {
        await addDoc(collection(db, 'messages'), acceptMsg);
      } catch (e) {
        console.warn('Chat accept msg sync error:', e);
      }
    }

    try {
      await updateDoc(doc(db, 'serviceRequests', requestId), {
        status: 'ACCEPTED',
        agreedPrice,
        acceptedAt: now,
      });
    } catch (err) {
      console.warn('Firestore accept update notice:', err);
    }
  };

  // 4. Worker rejects request
  const rejectRequest = async (requestId: string, reason?: string) => {
    const target = hireRequests.find((r) => r.id === requestId);
    if (!target) throw new Error('অনুরোধ পাওয়া যায়নি।');

    const now = new Date().toISOString();
    setHireRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'REJECTED',
              rejectionReason: reason || 'কর্মী বর্তমানে ব্যস্ত আছেন বা সময় মেলাতে পারছেন না',
              rejectedAt: now,
            }
          : r
      )
    );

    addNotification({
      recipientId: target.customerId,
      hireRequestId: requestId,
      titleBn: `অনুরোধ গৃহীত হয়নি: #${requestId}`,
      messageBn: `দুঃখিত, ${target.workerName} এই মুহূর্তে কাজটি গ্রহণ করতে পারছেন না। আপনি অন্যান্য সক্রিয় কর্মীদের সাথে যোগাযোগ করতে পারেন।`,
      type: 'general',
      status: 'pending',
      isRead: false,
    });

    try {
      await updateDoc(doc(db, 'serviceRequests', requestId), {
        status: 'REJECTED',
        rejectionReason: reason || 'কর্মী ব্যস্ত আছেন',
        rejectedAt: now,
      });
    } catch (err) {
      console.warn('Firestore reject update notice:', err);
    }
  };

  // 5. Worker advances status: ACCEPTED -> ON_THE_WAY -> WORK_STARTED -> WORK_COMPLETED
  const advanceJobStatus = async (
    requestId: string,
    nextStatus: 'ON_THE_WAY' | 'WORK_STARTED' | 'WORK_COMPLETED'
  ) => {
    const target = hireRequests.find((r) => r.id === requestId);
    if (!target) throw new Error('অনুরোধ পাওয়া যায়নি।');

    // State machine check
    if (nextStatus === 'ON_THE_WAY' && target.status !== 'ACCEPTED') {
      throw new Error('কাজটি গ্রহণযোগ্য অবস্থায় নেই।');
    }
    if (nextStatus === 'WORK_STARTED' && target.status !== 'ON_THE_WAY' && target.status !== 'ACCEPTED') {
      throw new Error('কাজের পূর্ববর্তী ধাপ সম্পন্ন হয়নি।');
    }
    if (nextStatus === 'WORK_COMPLETED' && target.status !== 'WORK_STARTED') {
      throw new Error('কাজ শুরু না করে সম্পন্ন করা সম্ভব নয়।');
    }

    const now = new Date().toISOString();
    const patch: Partial<HireRequest> = { status: nextStatus };

    if (nextStatus === 'WORK_STARTED') {
      patch.startedAt = now;
    } else if (nextStatus === 'WORK_COMPLETED') {
      patch.completedAt = now;
      const finalPrice = target.agreedPrice || target.quote?.estimatedPrice || target.budget || 500;
      patch.serviceFeeBreakdown = target.serviceFeeBreakdown || calculateServiceFee(finalPrice, adminSettings);

      // Increment worker's completedJobsCount in worker state
      setWorkers((prev) =>
        prev.map((w) =>
          w.userId === target.workerId
            ? { ...w, completedJobsCount: (w.completedJobsCount || 0) + 1 }
            : w
        )
      );

      // Worker notification for completion & fee summary
      addNotification({
        recipientId: target.workerId,
      hireRequestId: requestId,
        titleBn: `কাজ সম্পন্ন হিসেবে চিহ্নিত: #${requestId}`,
        messageBn: `কাজটি সফলভাবে সম্পন্ন হয়েছে। মোট পারিশ্রমিক ৳${finalPrice} (প্ল্যাটফর্ম ফি বাদে প্রাপ্য ৳${patch.serviceFeeBreakdown.workerReceivable})।`,
        type: 'general',
        status: 'pending',
        isRead: false,
      });
    }

    setHireRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, ...patch } : r))
    );

    // Notifications and Chat Updates
    let notifTitle = '';
    let notifMsg = '';
    let chatText = '';

    if (nextStatus === 'ON_THE_WAY') {
      notifTitle = `কর্মী রওনা দিয়েছেন! #${requestId}`;
      notifMsg = `${target.workerName} আপনার ঠিকানায় রওনা দিয়েছেন। অনুগ্রহ করে অবস্থান নিশ্চিত রাখুন।`;
      chatText = `[আপডেট: কর্মী রওনা দিয়েছেন]\nআমি আপনার লোকেশনের উদ্দেশ্যে রওনা দিয়েছি। কিছুক্ষণের মধ্যেই পৌঁছাব।`;
    } else if (nextStatus === 'WORK_STARTED') {
      notifTitle = `কাজ শুরু হয়েছে! #${requestId}`;
      notifMsg = `${target.workerName} কাজ শুরু করেছেন। কাজ চলাকালীন পর্যবেক্ষণ করতে পারেন।`;
      chatText = `[আপডেট: কাজ শুরু হয়েছে]\nআমি কাজের স্থানে উপস্থিত হয়েছি এবং কাজটি শুরু করেছি।`;
    } else if (nextStatus === 'WORK_COMPLETED') {
      notifTitle = `কাজ সফলভাবে সম্পন্ন হয়েছে! #${requestId}`;
      notifMsg = `${target.workerName} কাজটি সম্পন্ন করেছেন। অনুগ্রহ করে কাজ বুঝে নিন এবং কর্মীকে রেটিং দিন।`;
      chatText = `[আপডেট: কাজ সম্পন্ন হয়েছে]\nআলহামদুলিল্লাহ কাজটি সফলভাবে সম্পন্ন হয়েছে। অনুগ্রহ করে কাজ পরীক্ষা করে কর্মীকে রেটিং ও রিভিউ দিন।`;
    }

    addNotification({
      recipientId: target.customerId,
      hireRequestId: requestId,
      titleBn: notifTitle,
      messageBn: notifMsg,
      type: 'general',
      status: 'pending',
      isRead: false,
    });

    if (target.conversationId) {
      const statusMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId: target.conversationId,
        senderId: target.workerId,
        senderName: target.workerName,
        senderAvatar: target.workerAvatar,
        text: chatText,
        timestamp: now,
      };
      setMessages((prev) => [...prev, statusMsg]);
      try {
        await addDoc(collection(db, 'messages'), statusMsg);
      } catch (e) {
        console.warn('Status msg chat sync error:', e);
      }
    }

    try {
      await updateDoc(doc(db, 'serviceRequests', requestId), patch);
    } catch (err) {
      console.warn('Firestore job status update notice:', err);
    }
  };

  // 6. Cancel request
  const cancelRequest = async (requestId: string, reason: string, by: 'customer' | 'worker') => {
    const target = hireRequests.find((r) => r.id === requestId);
    if (!target) throw new Error('অনুরোধ পাওয়া যায়নি।');
    if (['WORK_STARTED', 'WORK_COMPLETED'].includes(target.status)) {
      throw new Error('কাজ শুরু বা সম্পন্ন হওয়ার পর বাতিল করা সম্ভব নয়। প্রয়োজনে অভিযোগ (Complaint) করুন।');
    }

    const now = new Date().toISOString();
    setHireRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'CANCELLED',
              cancelledBy: by,
              cancellationReason: reason,
              cancelledAt: now,
            }
          : r
      )
    );

    const recipientId = by === 'customer' ? target.workerId : target.customerId;
    const actorName = by === 'customer' ? target.customerName : target.workerName;

    addNotification({
      recipientId,
      hireRequestId: requestId,
      titleBn: `কাজের অনুরোধ বাতিল হয়েছে: #${requestId}`,
      messageBn: `${actorName} অনুরোধটি বাতিল করেছেন। কারণ: ${reason}`,
      type: 'general',
      status: 'pending',
      isRead: false,
    });

    if (target.conversationId) {
      const cancelMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId: target.conversationId,
        senderId: by === 'customer' ? target.customerId : target.workerId,
        senderName: actorName,
        text: `[অনুরোধটি বাতিল করা হয়েছে]\nবাতিলকারী: ${by === 'customer' ? 'কাস্টমার' : 'কর্মী'}\nকারণ: ${reason}`,
        timestamp: now,
      };
      setMessages((prev) => [...prev, cancelMsg]);
      try {
        await addDoc(collection(db, 'messages'), cancelMsg);
      } catch (e) {
        console.warn('Chat cancel msg sync error:', e);
      }
    }

    try {
      await updateDoc(doc(db, 'serviceRequests', requestId), {
        status: 'CANCELLED',
        cancelledBy: by,
        cancellationReason: reason,
        cancelledAt: now,
      });
    } catch (err) {
      console.warn('Firestore cancel sync notice:', err);
    }
  };

  // 7. Submit rating & review
  const submitRating = async (hireRequestId: string, rating: number, comment: string) => {
    const target = hireRequests.find((r) => r.id === hireRequestId);
    if (!target) throw new Error('অনুরোধ পাওয়া যায়নি।');
    if (target.status !== 'WORK_COMPLETED') {
      throw new Error('শুধুমাত্র সম্পন্ন কাজের জন্যই রেটিং দেওয়া যাবে।');
    }
    if (target.ratingSubmitted) {
      throw new Error('এই কাজের জন্য ইতিমধ্যেই রেটিং জমা দেওয়া হয়েছে।');
    }

    const now = new Date().toISOString();
    const newReview: ServiceReview = {
      id: `rev-${Date.now()}`,
      hireRequestId,
      reviewerId: userProfile.userId,
      reviewerName: userProfile.fullName,
      reviewerAvatar: userProfile.avatarUrl,
      revieweeId: target.workerId,
      rating,
      comment,
      createdAt: now,
    };

    // Update reviews state
    setReviews((prev) => [newReview, ...prev]);

    // Update hireRequest state
    setHireRequests((prev) =>
      prev.map((r) =>
        r.id === hireRequestId
          ? {
              ...r,
              ratingSubmitted: true,
              ratingValue: rating,
              ratingComment: comment,
            }
          : r
      )
    );

    // Update worker's rating and review count
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.userId === target.workerId) {
          const currentReviews = reviews.filter((r) => r.revieweeId === target.workerId);
          const newReviewsList = [newReview, ...currentReviews];
          const totalRating = newReviewsList.reduce((acc, r) => acc + r.rating, 0);
          const newAvg = Number((totalRating / newReviewsList.length).toFixed(1));
          return {
            ...w,
            rating: newAvg,
            reviewCount: newReviewsList.length,
          };
        }
        return w;
      })
    );

    // Send in-app notification to worker
    addNotification({
      recipientId: target.workerId,
      hireRequestId,
      titleBn: `নতুন রেটিং পেয়েছেন! ⭐ ${rating}`,
      messageBn: `${userProfile.fullName} আপনার কাজের প্রশংসা করেছেন: "${comment.slice(0, 50)}..."`,
      type: 'general',
      status: 'pending',
      isRead: false,
    });

    try {
      await setDoc(doc(db, 'reviews', newReview.id), newReview);
      await updateDoc(doc(db, 'serviceRequests', hireRequestId), {
        ratingSubmitted: true,
        ratingValue: rating,
        ratingComment: comment,
      });
    } catch (err) {
      console.warn('Firestore review sync notice:', err);
    }
  };

  // 8. Submit complaint
  const submitComplaint = async (hireRequestId: string, reason: string, details: string): Promise<UserComplaint> => {
    const target = hireRequests.find((r) => r.id === hireRequestId);
    const complaintId = `HL-CMP-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const newComplaint: UserComplaint = {
      id: complaintId,
      hireRequestId,
      complainantId: userProfile.userId,
      complainantName: userProfile.fullName,
      complainantPhone: userProfile.phoneNumber,
      accusedUserId: target ? (target.customerId === userProfile.userId ? target.workerId : target.customerId) : undefined,
      accusedUserName: target ? (target.customerId === userProfile.userId ? target.workerName : target.customerName) : undefined,
      reason,
      details,
      status: 'pending',
      createdAt: now,
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    if (target) {
      setHireRequests((prev) =>
        prev.map((r) => (r.id === hireRequestId ? { ...r, status: 'DISPUTED', complaintId } : r))
      );
    }

    addNotification({
      recipientId: userProfile.userId,
      hireRequestId,
      titleBn: `অভিযোগ গ্রহণ করা হয়েছে: #${complaintId}`,
      messageBn: `আপনার অভিযোগটি HelpLine অ্যাডমিন টিমের কাছে পৌঁছেছে। ২৪ ঘণ্টার মধ্যে পর্যালোচনা করে ব্যবস্থা নেওয়া হবে।`,
      type: 'general',
      status: 'pending',
      isRead: false,
    });

    if (newComplaint.accusedUserId) {
      addNotification({
        recipientId: newComplaint.accusedUserId,
        hireRequestId,
        titleBn: `অভিযোগ পর্যালোচনা শুরু হয়েছে: #${complaintId}`,
        messageBn: `অনুরোধ #${hireRequestId}-এ একটি অভিযোগ পর্যালোচনাধীন রয়েছে। হেল্পলাইন টিম এ বিষয়ে যোগাযোগ করতে পারে।`,
        type: 'general',
        status: 'pending',
        isRead: false,
      });
    }

    try {
      await setDoc(doc(db, 'complaints', complaintId), newComplaint);
      if (target) {
        await updateDoc(doc(db, 'serviceRequests', hireRequestId), {
          status: 'DISPUTED',
          complaintId,
        });
      }
    } catch (err) {
      console.warn('Firestore complaint sync notice:', err);
    }

    return newComplaint;
  };

  const updateComplaintStatus = async (
    complaintId: string,
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed',
    adminNotes?: string
  ) => {
    const target = complaints.find((c) => c.id === complaintId);
    if (!target) return;

    const now = new Date().toISOString();
    const patch = {
      status,
      adminNotes: adminNotes || target.adminNotes,
      resolvedAt: status === 'resolved' || status === 'dismissed' ? now : undefined,
    };

    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, ...patch } : c))
    );

    const statusLabels: Record<string, string> = {
      pending: 'অপেক্ষমাণ',
      investigating: 'তদন্তাধীন',
      resolved: 'মীমাংসিত / নিষ্পত্তি হয়েছে',
      dismissed: 'বাতিল করা হয়েছে',
    };

    addNotification({
      recipientId: target.complainantId,
      hireRequestId: target.hireRequestId,
      titleBn: `অভিযোগ আপডেট: #${complaintId}`,
      messageBn: `আপনার অভিযোগের স্ট্যাটাস পরিবর্তিত হয়ে '${statusLabels[status] || status}' হয়েছে। ${adminNotes ? `মন্তব্য: ${adminNotes}` : ''}`,
      type: 'general',
      status: 'pending',
      isRead: false,
    });

    try {
      await updateDoc(doc(db, 'complaints', complaintId), patch);
    } catch (err) {
      console.warn('Firestore complaint status sync notice:', err);
    }
  };

  const calculateFee = (agreedPrice: number): ServiceFeeBreakdown => {
    return calculateServiceFee(agreedPrice, adminSettings);
  };

  // 9. Chat & Messages
  const getConversationByRequestId = (requestId: string): Conversation | undefined => {
    const existing = conversations.find((c) => c.hireRequestId === requestId);
    if (existing) return existing;

    // Find request to initialize conversation dynamically
    const req = hireRequests.find((r) => r.id === requestId);
    if (req) {
      const convId = req.conversationId || `conv-${req.id.toLowerCase()}`;
      const now = new Date().toISOString();
      const newConv: Conversation = {
        id: convId,
        hireRequestId: req.id,
        participantIds: [req.customerId, req.workerId],
        participants: {
          [req.customerId]: {
            name: req.customerName,
            phone: req.customerPhone,
            avatar: req.customerAvatar,
            role: 'customer',
          },
          [req.workerId]: {
            name: req.workerName,
            phone: req.workerPhone,
            avatar: req.workerAvatar,
            role: 'worker',
          },
        },
        lastMessage: `কাজের অনুরোধ: ${req.workType}`,
        lastMessageTimestamp: req.createdAt,
        createdAt: req.createdAt,
        updatedAt: now,
      };
      setConversations((prev) => [newConv, ...prev]);
      return newConv;
    }
    return undefined;
  };

  const getMessagesForConversation = (conversationId: string): ChatMessage[] => {
    return messages.filter((m) => m.conversationId === conversationId);
  };

  const sendMessage = async (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const now = new Date().toISOString();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      conversationId,
      senderId: userProfile.userId,
      senderName: userProfile.fullName,
      senderAvatar: userProfile.avatarUrl,
      text: text.trim(),
      timestamp: now,
    };

    setMessages((prev) => [...prev, newMsg]);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text.trim(),
              lastMessageTimestamp: now,
              updatedAt: now,
            }
          : c
      )
    );

    // Send in-app & push notification to the other participant
    const targetConv = conversations.find((c) => c.id === conversationId);
    if (targetConv && targetConv.participantIds) {
      const otherId = targetConv.participantIds.find((id) => id !== userProfile.userId);
      if (otherId) {
        addNotification({
          recipientId: otherId,
          hireRequestId: targetConv.hireRequestId,
          titleBn: `নতুন বার্তা: ${userProfile.fullName}`,
          messageBn: text.trim().slice(0, 50) + (text.trim().length > 50 ? '...' : ''),
          type: 'general',
          status: 'pending',
          isRead: false,
        });
      }
    }

    try {
      await addDoc(collection(db, 'messages'), newMsg);
      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: text.trim(),
        lastMessageTimestamp: now,
        updatedAt: now,
      });
    } catch (err) {
      console.warn('Firestore chat sync notice:', err);
    }
  };

  return (
    <HireContext.Provider
      value={{
        workers,
        hireRequests,
        reviews,
        conversations,
        messages,
        complaints,
        adminSettings,
        updateAdminSettings,
        createHireRequest,
        sendQuote,
        acceptQuote,
        rejectRequest,
        advanceJobStatus,
        cancelRequest,
        submitRating,
        submitComplaint,
        updateComplaintStatus,
        calculateFee,
        getConversationByRequestId,
        getMessagesForConversation,
        sendMessage,
        getWorkerById,
        getWorkerStats,
        getWorkerReviews,
        activeRequestIdForDetails,
        setActiveRequestIdForDetails,
      }}
    >
      {children}
    </HireContext.Provider>
  );
};

export const useHire = () => {
  const context = useContext(HireContext);
  if (!context) {
    throw new Error('useHire must be used within a HireProvider');
  }
  return context;
};
