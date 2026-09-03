import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CustomProfessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded?: (professionName: string) => void;
}

export const CustomProfessionModal: React.FC<CustomProfessionModalProps> = ({
  isOpen,
  onClose,
  onAdded,
}) => {
  const { submitCustomCategoryRequest } = useAuth();
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim()) return;

    try {
      setLoading(true);
      await submitCustomCategoryRequest(nameBn.trim(), nameEn.trim() || undefined, description.trim() || undefined);
      setSuccess(true);
      if (onAdded) onAdded(nameBn.trim());
      setTimeout(() => {
        setSuccess(false);
        setNameBn('');
        setNameEn('');
        setDescription('');
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm sm:text-base">নতুন কাজের ধরন বা পেশা যোগ করুন</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">কাজের ধরন সফলভাবে যুক্ত হয়েছে!</h4>
            <p className="text-xs text-slate-500">
              এটি তাৎক্ষণিকভাবে আপনার প্রোফাইলে যোগ করা হয়েছে এবং অ্যাডমিন পর্যালোচনার জন্য জমা হয়েছে।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>বিশেষ সুবিধা:</strong> নতুন কাজের ধরনটি আপনি এখনই আপনার প্রোফাইলে ব্যবহার করতে পারবেন। অ্যাডমিন যাচাই শেষে এটি সর্বসাধারণের তালিকায় অন্তর্ভুক্ত হতে পারে।
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                কাজের ধরন / পেশার নাম (বাংলায়) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="যেমন: সোলার প্যানেল টেকনিশিয়ান"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Profession Name (ইংরেজিতে - ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Solar Panel Technician"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                কাজের সংক্ষিপ্ত বিবরণ বা ভূমিকা (Description)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="এই পেশার আওতায় আপনি কী কী সেবা বা কাজ প্রদান করেন..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={loading || !nameBn.trim()}
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {loading ? 'সংরক্ষণ হচ্ছে...' : 'যোগ করুন (Submit)'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
