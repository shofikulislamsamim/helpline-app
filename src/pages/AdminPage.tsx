import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  FolderTree, 
  Wrench, 
  Briefcase, 
  CreditCard, 
  Receipt, 
  Star, 
  AlertOctagon, 
  Headphones, 
  Bell, 
  FileText, 
  Sliders, 
  BarChart3, 
  UserCog, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  ArrowLeft,
  PhoneCall
} from 'lucide-react';
import { useAppSettings } from '../context/AppSettingsContext';
import { useAuth } from '../context/AuthContext';
import { AppSettings } from '../types';
import { i18n } from '../lib/i18n';
import { AdminVerificationCenter } from '../components/admin/AdminVerificationCenter';
import { AdminHireManagement } from '../components/admin/AdminHireManagement';

interface AdminPageProps {
  onBackToApp: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToApp }) => {
  const { settings, updateSettings, resetToDefaults } = useAppSettings();
  const { 
    isAdmin, 
    setIsAdmin,
    verificationRequests = [],
    auditLogs = [],
    currentAdminRole,
    setCurrentAdminRole,
    adminApproveVerification,
    adminRejectVerification,
    adminRequestReverification,
    adminSetUnderReview
  } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const pendingVerificationCount = (verificationRequests || []).filter(
    (r) => r.status === 'pending'
  ).length;

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users (ব্যবহারকারী)', icon: Users },
    { id: 'verification', label: 'Verification (যাচাইকরণ)', icon: ShieldCheck },
    { id: 'categories', label: 'Categories (ক্যাটাগরি)', icon: FolderTree },
    { id: 'hireWork', label: 'Hire & Work', icon: Wrench },
    { id: 'jobs', label: 'Jobs (চাকরি)', icon: Briefcase },
    { id: 'subscription', label: 'Subscription (প্যাকেজ)', icon: CreditCard },
    { id: 'payments', label: 'Payments (ম্যানুয়াল পেমেন্ট)', icon: Receipt },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
    { id: 'complaints', label: 'Complaints (অভিযোগ)', icon: AlertOctagon },
    { id: 'liveSupport', label: 'Live Support (সহায়তা)', icon: Headphones },
    { id: 'notifications', label: 'Notifications (বিজ্ঞপ্তি)', icon: Bell },
    { id: 'policies', label: 'Policies (নীতিমালা)', icon: FileText },
    { id: 'content', label: 'Content Management', icon: FileText },
    { id: 'analytics', label: 'Analytics (পরিসংখ্যান)', icon: BarChart3 },
    { id: 'globalSettings', label: 'Global Settings', icon: Sliders },
    { id: 'adminRoles', label: 'Admin Roles (ভূমিকা)', icon: UserCog },
  ];

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateSettings(formData);
    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ইউজার অ্যাপে ফিরুন</span>
            </button>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="font-bold text-sm text-white">HelpLine Admin Panel</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                PROD-READY SHELL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">অ্যাডমিন হিসেবে সক্রিয়</span>
            <button
              onClick={() => setIsAdmin(true)}
              className="px-2.5 py-1 text-xs rounded bg-purple-600/30 text-purple-300 border border-purple-500/30 font-medium"
            >
              Super Admin Mode
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin layout: Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-6 p-4 md:p-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 h-fit">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            মডিউল ও সেটিংস
          </div>
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer text-left ${
                    isActive
                      ? 'bg-purple-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Admin Owner Philosophy Callout */}
          <div className="bg-purple-950/40 border border-purple-800/60 rounded-2xl p-4 text-xs text-purple-200">
            <strong className="text-white block mb-1">অ্যাডমিন কন্ট্রোল দর্শন (Admin-Controlled Philosophy):</strong>
            মালিককে স্বাভাবিক ব্যবসায়িক পরিবর্তনের (যেমন: রেট পরিবর্তন, হটলাইন পরিবর্তন, বিকাশ/নগদ নাম্বার আপডেট, ফ্রি বা পেইড মোড অন/অফ) জন্য কোনো সফটওয়্যার ডেভেলপারের মুখাপেক্ষী হতে হবে না। সবকিছু এই প্যানেল থেকেই নিয়ন্ত্রণযোগ্য।
          </div>

          {/* Tab 1: Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">ড্যাশবোর্ড সামারি (Overview)</h2>
                <p className="text-xs text-slate-400 mt-1">
                  প্ল্যাটফর্মের প্রধান মেট্রিক্স ও চলমান কার্যক্রমের একনজর চিত্র।
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>{i18n.admin.kpiUsers}</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white">১২,৪৫০+</div>
                  <div className="text-[11px] text-emerald-400 mt-1 font-medium">↑ ১২% নতুন এই সপ্তাহে</div>
                </div>

                <div 
                  onClick={() => setActiveTab('verification')}
                  className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-amber-500/50 transition"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>{i18n.admin.kpiPendingVerification}</span>
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400">{pendingVerificationCount} জন</div>
                  <div className="text-[11px] text-amber-300 mt-1 font-medium">পর্যালোচনা করতে ক্লিক করুন →</div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>{i18n.admin.kpiActiveServices}</span>
                    <Wrench className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400">৩৪০টি</div>
                  <div className="text-[11px] text-slate-400 mt-1">ঢাকা, চট্টগ্রাম ও রাজশাহী</div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>{i18n.admin.kpiManualPayments}</span>
                    <Receipt className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-black text-rose-400">০ (ফ্রি মোড)</div>
                  <div className="text-[11px] text-slate-400 mt-1">বর্তমানে সাবস্ক্রিপশন ফ্রি</div>
                </div>
              </div>

              {/* Quick Jump to Global Settings */}
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">গ্লোবাল সেটিংস ও বিজনেস রুলস</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    হটলাইন নাম্বার, বিকাশ/নগদ/রকেট একাউন্ট ও সাবস্ক্রিপশন রেট লাইভ পরিবর্তন করুন।
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('globalSettings')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
                >
                  গ্লোবাল সেটিংস এডিট করুন →
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Global Settings (Live Admin Controlled) */}
          {activeTab === 'globalSettings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Global Settings (সেন্ট্রালাইজড কনফিগ)</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    এই সেটিংসের মানসমূহ সরাসরি ডাটাবেজে সংরক্ষিত হয় এবং ইউজারদের অ্যাপে তাৎক্ষণিক প্রভাব ফেলে।
                  </p>
                </div>
                {savedSuccess && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-bold animate-pulse">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>সফলভাবে সেভ হয়েছে!</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5 bg-slate-950/70 border border-slate-800 p-5 sm:p-6 rounded-2xl">
                {/* 1. Subscription Configuration */}
                <div className="space-y-3 pb-4 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-purple-300">১. সাবস্ক্রিপশন মোড ও প্রাইসিং (Subscription)</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">সাবস্ক্রিপশন মোড</label>
                      <select
                        value={formData.subscriptionMode}
                        onChange={(e) => setFormData({ ...formData, subscriptionMode: e.target.value as 'free' | 'paid' })}
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                      >
                        <option value="free">সম্পূর্ণ ফ্রি (FREE - ৳০)</option>
                        <option value="paid">পেইড সাবস্ক্রিপশন (PAID)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">সার্চ রেডিয়াস (কিলোমিটার)</label>
                      <input
                        type="number"
                        value={formData.searchRadiusKm}
                        onChange={(e) => setFormData({ ...formData, searchRadiusKm: Number(e.target.value) })}
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">দৈনিক রেট (৳ / Day)</label>
                      <input
                        type="number"
                        value={formData.dailyRate}
                        onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })}
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">মাসিক রেট (৳ / Month)</label>
                      <input
                        type="number"
                        value={formData.monthlyRate}
                        onChange={(e) => setFormData({ ...formData, monthlyRate: Number(e.target.value) })}
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Manual Payment Numbers */}
                <div className="space-y-3 pb-4 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-purple-300">২. ম্যানুয়াল পেমেন্ট গ্রহণ নম্বর (bKash / Nagad / Rocket)</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">বিকাশ নম্বর (bKash)</label>
                      <input
                        type="text"
                        value={formData.paymentNumbers.bkash}
                        onChange={(e) => setFormData({
                          ...formData,
                          paymentNumbers: { ...formData.paymentNumbers, bkash: e.target.value }
                        })}
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">নগদ নম্বর (Nagad)</label>
                      <input
                        type="text"
                        value={formData.paymentNumbers.nagad}
                        onChange={(e) => setFormData({
                          ...formData,
                          paymentNumbers: { ...formData.paymentNumbers, nagad: e.target.value }
                        })}
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">রকেট নম্বর (Rocket)</label>
                      <input
                        type="text"
                        value={formData.paymentNumbers.rocket}
                        onChange={(e) => setFormData({
                          ...formData,
                          paymentNumbers: { ...formData.paymentNumbers, rocket: e.target.value }
                        })}
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Support & Emergency Notice */}
                <div className="space-y-3 pb-4">
                  <h3 className="text-sm font-bold text-purple-300">৩. হটলাইন ও নোটিশ (Hotline & Announcements)</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">হটলাইন নম্বর (Call Center)</label>
                      <input
                        type="text"
                        value={formData.hotlineNumber}
                        onChange={(e) => setFormData({ ...formData, hotlineNumber: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">সাপোর্ট ইমেইল</label>
                      <input
                        type="email"
                        value={formData.supportEmail}
                        onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">জরুরি প্ল্যাটফর্ম সতর্কতা নোটিশ</label>
                    <textarea
                      rows={2}
                      value={formData.emergencyNotice}
                      onChange={(e) => setFormData({ ...formData, emergencyNotice: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                    />
                  </div>
                </div>

                {/* Save actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetToDefaults}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ডিফল্ট রিসেট</span>
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>পরিবর্তন সংরক্ষণ করুন</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 3: Verification Center */}
          {activeTab === 'verification' && (
            <AdminVerificationCenter
              requests={verificationRequests}
              auditLogs={auditLogs}
              currentAdminRole={currentAdminRole}
              onRoleChange={setCurrentAdminRole}
              onApproveRequest={adminApproveVerification}
              onRejectRequest={adminRejectVerification}
              onRequestReverification={adminRequestReverification}
              onSetUnderReview={adminSetUnderReview}
            />
          )}

          {/* Tab 4: Hire & Work Management */}
          {activeTab === 'hireWork' && (
            <AdminHireManagement />
          )}

          {/* Placeholder for other admin modules */}
          {activeTab !== 'dashboard' && activeTab !== 'globalSettings' && activeTab !== 'verification' && activeTab !== 'hireWork' && (
            <div className="bg-slate-950/70 border border-slate-800 p-8 rounded-2xl text-center max-w-xl mx-auto space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-900/50 text-purple-300 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {adminNavItems.find((i) => i.id === activeTab)?.label}
              </h3>
              <p className="text-xs text-slate-400">
                এই অ্যাডমিন মডিউলটির আর্কিটেকচার এবং ডাটাবেজ মডেল তৈরি করা হয়েছে। 
                ফলো-আপ প্রম্পটে বিস্তারিত টেবিল ও অ্যাডমিন অ্যাকশন যুক্ত করা হবে।
              </p>
              <div className="text-xs text-purple-300 font-mono bg-purple-950/80 p-2.5 rounded-xl border border-purple-800/80 mt-2">
                “{i18n.common.placeholderRoadmapNote}”
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
