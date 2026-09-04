import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Calendar, Briefcase, ExternalLink, X, Check } from 'lucide-react';
import { PortfolioItem } from '../../types';

interface PortfolioSectionProps {
  portfolio: PortfolioItem[];
  userProfessions?: string[];
  onChange: (newPortfolio: PortfolioItem[]) => void;
  readOnly?: boolean;
}

const PRESET_SAMPLE_IMAGES = [
  {
    label: 'ইলেকট্রিক ওয়্যারিং',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'এসি মেরামত ও গ্যাস রিফিল',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'প্লাম্বিং ও পাইপ ফিটিং',
    url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'রং মিস্ত্রি ও পেইন্টিং',
    url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'কাঠমিস্ত্রি ও ফার্নিচার',
    url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'ডিপ ক্লিনিং ও পরিষ্কার',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'কম্পিউটার ও আইটি মেরামত',
    url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'টেইলারিং ও সেলাই',
    url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80',
  },
];

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  portfolio = [],
  userProfessions = [],
  onChange,
  readOnly = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [profession, setProfession] = useState(userProfessions[0] || '');
  const [completedAt, setCompletedAt] = useState('');
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<PortfolioItem | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalImage = imageUrl.trim() || PRESET_SAMPLE_IMAGES[0].url;

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      imageUrl: finalImage,
      profession: profession || userProfessions[0] || 'সাধারণ কাজ',
      completedAt: completedAt.trim() || '২০২৪',
    };

    onChange([...portfolio, newItem]);

    // Reset form
    setTitle('');
    setDescription('');
    setImageUrl('');
    setCompletedAt('');
    setIsAdding(false);
  };

  const handleRemove = (id: string) => {
    onChange(portfolio.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            <span>১২. পোর্টফোলিও ও সম্পন্ন কাজের নমুনা (Portfolio & Sample Works)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            পূর্বে সম্পন্ন কাজের ছবি ও বিবরণ যুক্ত করুন যাতে গ্রাহকরা আপনার কাজের মান দেখে আস্থা পান।
          </p>
        </div>

        {!readOnly && !isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>নমুনা কাজ যোগ করুন</span>
          </button>
        )}
      </div>

      {/* Adding Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-slate-50 p-4 rounded-2xl border border-purple-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-purple-600" />
              <span>নতুন কাজের নমুনা যুক্ত করুন</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                কাজের শিরোনাম / প্রোজেক্টের নাম *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="উদা: মিরপুর ডিওএইচএস ৪-রুম ওয়্যারিং"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                সংশ্লিষ্ট পেশা
              </label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                {userProfessions.length > 0 ? (
                  userProfessions.map((p, idx) => (
                    <option key={idx} value={p}>
                      {p}
                    </option>
                  ))
                ) : (
                  <option value="সাধারণ কাজ">সাধারণ কাজ</option>
                )}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                কাজের ছবির লিংক (Image URL) অথবা নিচে থেকে প্রি-সেট সিলেক্ট করুন
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/work-sample.jpg"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />

              {/* Presets */}
              <div className="mt-2">
                <span className="text-[11px] text-slate-500 block mb-1.5">দ্রুত স্যাম্পল ছবি নির্বাচন:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_SAMPLE_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-medium border cursor-pointer transition ${
                        imageUrl === preset.url
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                সম্পন্ন করার তারিখ / বছর
              </label>
              <input
                type="text"
                value={completedAt}
                onChange={(e) => setCompletedAt(e.target.value)}
                placeholder="উদা: ২০২৪ বা জানুয়ারি ২০২৪"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                কাজের সংক্ষিপ্ত বিবরণ
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="উদা: সম্পূর্ণ কনসিল্ড ওয়্যারিং ও ডিস্ট্রিবিউশন বোর্ড"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              পোর্টফোলিওতে সংরক্ষণ করুন
            </button>
          </div>
        </form>
      )}

      {/* Portfolio Grid */}
      {portfolio.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs transition flex flex-col justify-between relative"
            >
              <div 
                className="relative h-44 bg-slate-100 overflow-hidden cursor-pointer"
                onClick={() => setSelectedPreviewImage(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = PRESET_SAMPLE_IMAGES[0].url;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {item.profession && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-[10px] font-bold text-white">
                    {item.profession}
                  </span>
                )}
                <span className="absolute bottom-2 right-2 p-1 rounded-md bg-black/40 text-white text-[10px] flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  <span>বড় দেখুন</span>
                </span>
              </div>

              <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.completedAt || 'সম্পন্ন'}</span>
                  </span>

                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 cursor-pointer transition"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700">এখনও কোনো পোর্টফোলিও বা কাজের ছবি যুক্ত করা হয়নি</p>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
            আপনার আগের কাজের ছবি আপলোড করলে গ্রাহকরা আপনার কাজের দক্ষতার ওপর দ্রুত বিশ্বাস অর্জন করবে।
          </p>
          {!readOnly && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="mt-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-2xs"
            >
              + প্রথম নমুনা ছবি যোগ করুন
            </button>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPreviewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setSelectedPreviewImage(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPreviewImage(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="max-h-[65vh] overflow-hidden bg-slate-950 flex items-center justify-center">
              <img
                src={selectedPreviewImage.imageUrl}
                alt={selectedPreviewImage.title}
                className="w-full h-auto max-h-[65vh] object-contain"
              />
            </div>

            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                  {selectedPreviewImage.profession || 'কাজের নমুনা'}
                </span>
                <span className="text-xs text-slate-400">
                  {selectedPreviewImage.completedAt}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {selectedPreviewImage.title}
              </h3>
              {selectedPreviewImage.description && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedPreviewImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
