import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Save, 
  Sliders, 
  FileText, 
  ShieldAlert, 
  Check, 
  X, 
  DollarSign, 
  RotateCcw 
} from 'lucide-react';
import { useHire } from '../../context/HireContext';
import { HireRequest, UserComplaint } from '../../types';
import { DigitalJobRecordModal } from '../hire/DigitalJobRecordModal';

export const AdminHireManagement: React.FC = () => {
  const { 
    hireRequests, 
    complaints, 
    adminSettings, 
    updateAdminSettings 
  } = useHire();

  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'complaints' | 'settings'>('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequestForInspect, setSelectedRequestForInspect] = useState<HireRequest | null>(null);
  const [selectedRecordForView, setSelectedRecordForView] = useState<HireRequest | null>(null);

  // Settings local form
  const [settingsForm, setSettingsForm] = useState(adminSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // KPIs
  const totalRequests = hireRequests.length;
  const quotedCount = hireRequests.filter((r) => r.status === 'QUOTED').length;
  const activeCount = hireRequests.filter((r) => ['ACCEPTED', 'ON_THE_WAY', 'WORK_STARTED'].includes(r.status)).length;
  const completedCount = hireRequests.filter((r) => r.status === 'WORK_COMPLETED').length;
  const disputedCount = hireRequests.filter((r) => ['DISPUTED', 'CANCELLED'].includes(r.status)).length;

  const filteredRequests = hireRequests.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const idMatch = r.id.toLowerCase().includes(q);
      const custMatch = r.customerName.toLowerCase().includes(q);
      const workerMatch = r.workerName.toLowerCase().includes(q);
      const typeMatch = r.workType.toLowerCase().includes(q);
      if (!idMatch && !custMatch && !workerMatch && !typeMatch) return false;
    }
    return true;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <span>হায়ার ও কারিগর প্রশাসন (Hire & Work Management)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            সার্ভিস অনুরোধসমূহ পর্যবেক্ষণ, বিরোধ নিষ্পত্তি ও মার্কেটপ্লেস সেটিংস
          </p>
        </div>

        {/* Sub tabs */}
        <div className="flex gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('requests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'requests'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            কাজের অনুরোধ ({hireRequests.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('complaints')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'complaints'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            অভিযোগসমূহ ({complaints.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'settings'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            হায়ার সেটিংস
          </button>
        </div>
      </div>

      {/* Live KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[11px] text-slate-400 font-bold block">মোট অনুরোধ</span>
          <span className="text-2xl font-black text-white mt-1 block">{totalRequests}</span>
        </div>
        <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[11px] text-blue-400 font-bold block">কোটেশন প্রদানকৃত</span>
          <span className="text-2xl font-black text-blue-400 mt-1 block">{quotedCount}</span>
        </div>
        <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[11px] text-purple-400 font-bold block">গৃহীত ও চলমান</span>
          <span className="text-2xl font-black text-purple-400 mt-1 block">{activeCount}</span>
        </div>
        <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[11px] text-emerald-400 font-bold block">সফলভাবে সম্পন্ন</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">{completedCount}</span>
        </div>
        <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[11px] text-rose-400 font-bold block">বাতিল / বিরোধ</span>
          <span className="text-2xl font-black text-rose-400 mt-1 block">{disputedCount}</span>
        </div>
      </div>

      {/* Sub-tab 1: Requests Table */}
      {activeSubTab === 'requests' && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          {/* Search & Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="রিকোয়েস্ট আইডি, গ্রাহক বা কর্মীর নাম খুঁজুন..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
              >
                <option value="all">সকল স্ট্যাটাস</option>
                <option value="REQUESTED">REQUESTED</option>
                <option value="QUOTED">QUOTED</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="ON_THE_WAY">ON_THE_WAY</option>
                <option value="WORK_STARTED">WORK_STARTED</option>
                <option value="WORK_COMPLETED">WORK_COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="DISPUTED">DISPUTED</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">আইডি</th>
                  <th className="p-3">কাজের ধরন</th>
                  <th className="p-3">গ্রাহক</th>
                  <th className="p-3">কর্মী</th>
                  <th className="p-3">মূল্য (৳)</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500">
                      কোনো রিকোয়েস্ট পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-900/50 transition">
                      <td className="p-3 font-mono font-bold text-blue-400">{req.id}</td>
                      <td className="p-3 font-medium text-white max-w-[150px] truncate">
                        {req.workType}
                      </td>
                      <td className="p-3 text-slate-300">
                        <span className="font-semibold">{req.customerName}</span>
                        <span className="block text-[10px] text-slate-500 font-mono">{req.customerPhone}</span>
                      </td>
                      <td className="p-3 text-slate-300">
                        <span className="font-semibold">{req.workerName}</span>
                        <span className="block text-[10px] text-blue-400">{req.workerProfession}</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        ৳{req.agreedPrice || req.quote?.estimatedPrice || req.budget || '—'}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedRecordForView(req)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                            title="ডিজিটাল রেকর্ড দেখুন"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedRequestForInspect(req)}
                            className="p-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white transition cursor-pointer"
                            title="বিস্তারিত দেখুন"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Complaints Table */}
      {activeSubTab === 'complaints' && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>দাখিলকৃত অভিযোগসমূহ ({complaints.length})</span>
            </h3>
          </div>

          {complaints.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
              এখনও কোনো বিরোধ বা অভিযোগ দাখিল হয়নি।
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-red-900/40 bg-red-950/10 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-red-400">{c.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-900/40 text-red-300 border border-red-800/40 font-bold uppercase">
                      {c.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-500">অভিযোগকারী:</span>
                      <p className="font-semibold">{c.complainantName} ({c.complainantPhone})</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500">অভিযুক্ত পক্ষ:</span>
                      <p className="font-semibold">{c.accusedUserName || '—'}</p>
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-lg text-slate-200">
                    <strong className="text-red-400 block mb-0.5">অভিযোগের কারণ: {c.reason}</strong>
                    <p className="text-slate-400">{c.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-tab 3: Hire Settings */}
      {activeSubTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">হায়ার মডিউল পলিসি ও কনফিগারেশন</h3>
              <p className="text-xs text-slate-400 mt-0.5">মার্কেটপ্লেসের সুরক্ষা ও কার্যপদ্ধতি নিয়ন্ত্রণ করুন</p>
            </div>
            {settingsSaved && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>সংরক্ষণ সফল হয়েছে</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Verification rule toggle */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-white block">যাচাইকৃত কর্মী বাধ্যতামূলক (Require Verification)</span>
                  <span className="text-slate-400 text-[11px]">
                    শুধুমাত্র এনআইডি ও পরিচয়পত্র যাচাইকৃত কর্মীদের সক্রিয় কাজের অনুরোধ পাঠানো যাবে
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.requireVerificationForWork}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, requireVerificationForWork: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>

            {/* Minimum price */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <label className="font-bold text-white block">ন্যূনতম কাজের পারিশ্রমিক (৳)</label>
              <input
                type="number"
                value={settingsForm.minimumJobPrice}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, minimumJobPrice: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
              />
            </div>

            {/* Max search radius */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <label className="font-bold text-white block">সর্বোচ্চ সার্চ ব্যাসার্ধ (Search Radius Km)</label>
              <input
                type="number"
                value={settingsForm.maxSearchRadiusKm}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, maxSearchRadiusKm: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
              />
            </div>

            {/* Cancellation grace */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <label className="font-bold text-white block">বাতিল করার গ্রেস পিরিয়ড (মিনিট)</label>
              <input
                type="number"
                value={settingsForm.cancellationGraceMinutes}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, cancellationGraceMinutes: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-800">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>সেটিংস সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      )}

      {/* Inspector Modal */}
      {selectedRequestForInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 text-slate-200 w-full max-w-xl rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  অনুরোধ বিবরণী (#{selectedRequestForInspect.id})
                </h3>
                <span className="text-xs text-blue-400 font-semibold">{selectedRequestForInspect.workType}</span>
              </div>
              <button
                onClick={() => setSelectedRequestForInspect(null)}
                className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <p><strong>গ্রাহক:</strong> {selectedRequestForInspect.customerName} ({selectedRequestForInspect.customerPhone})</p>
              <p><strong>কর্মী:</strong> {selectedRequestForInspect.workerName} ({selectedRequestForInspect.workerPhone})</p>
              <p><strong>কাজের স্থান:</strong> {selectedRequestForInspect.workLocation.fullAddress}</p>
              <p><strong>বর্ণনা:</strong> {selectedRequestForInspect.description}</p>
              <p><strong>চূড়ান্ত মূল্য:</strong> ৳{selectedRequestForInspect.agreedPrice || selectedRequestForInspect.quote?.estimatedPrice || selectedRequestForInspect.budget || '—'}</p>
              <p><strong>স্ট্যাটাস:</strong> {selectedRequestForInspect.status}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedRequestForInspect(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Job Record Modal */}
      {selectedRecordForView && (
        <DigitalJobRecordModal
          request={selectedRecordForView}
          onClose={() => setSelectedRecordForView(null)}
        />
      )}
    </div>
  );
};
