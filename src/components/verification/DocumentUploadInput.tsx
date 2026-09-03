import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import { compressImageFile } from '../../lib/verificationHelpers';

interface DocumentUploadInputProps {
  labelBn: string;
  subLabelBn?: string;
  required?: boolean;
  valueUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  onFileChange: (fileData: { url: string; name: string; type: string; size: number } | null) => void;
  idPrefix: string;
}

export const DocumentUploadInput: React.FC<DocumentUploadInputProps> = ({
  labelBn,
  subLabelBn,
  required = false,
  valueUrl,
  fileName,
  fileType,
  fileSize,
  onFileChange,
  idPrefix
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  const maxSizeBytes = 5 * 1024 * 1024; // 5MB

  const handleFileProcess = async (file: File) => {
    setError(null);

    // 1. Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError('ভুল ফাইল ফরম্যাট। শুধুমাত্র JPG, PNG, WEBP অথবা PDF ফাইল আপলোড করা যাবে।');
      return;
    }

    // 2. Validate file size
    if (file.size > maxSizeBytes) {
      setError('ফাইলের আকার সর্বোচ্চ ৫ মেগাবাইট (5 MB) হতে পারবে।');
      return;
    }

    setIsProcessing(true);
    setProgress(20);

    try {
      const progressTimer = setInterval(() => {
        setProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 80);

      const result = await compressImageFile(file);
      clearInterval(progressTimer);
      setProgress(100);

      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        onFileChange({
          url: result.dataUrl,
          name: result.fileName,
          type: result.fileType,
          size: result.sizeBytes
        });
      }, 150);
    } catch (err: any) {
      setIsProcessing(false);
      setProgress(0);
      setError(err?.message || 'ফাইল প্রসেসিং করতে ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
    onFileChange(null);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const isPdf = fileType === 'application/pdf' || (fileName && fileName.endsWith('.pdf'));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
          <span>{labelBn}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
        {subLabelBn && <span className="text-[11px] text-slate-500">{subLabelBn}</span>}
      </div>

      <input
        ref={fileInputRef}
        id={`${idPrefix}-file-input`}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* When File is Uploaded */}
      {valueUrl ? (
        <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 overflow-hidden">
            {isPdf ? (
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center shrink-0 border border-rose-200">
                <FileText className="w-6 h-6" />
              </div>
            ) : (
              <div 
                onClick={() => setShowPreviewModal(true)}
                className="w-12 h-12 rounded-lg overflow-hidden border border-slate-300 bg-white relative group cursor-pointer shrink-0"
                title="বড় করে দেখতে ক্লিক করুন"
              >
                <img src={valueUrl} alt={fileName || 'Document'} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            )}

            <div className="overflow-hidden">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-900 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{fileName || 'আপলোডকৃত নথি'}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                <span>{isPdf ? 'পিডিএফ (PDF)' : 'ইমেজ ফাইল'}</span>
                {fileSize && <span>• {formatFileSize(fileSize)}</span>}
                <span>• প্রস্তুত</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {!isPdf && (
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition border border-transparent hover:border-slate-200"
                title="প্রিভিউ দেখুন"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition border border-transparent hover:border-slate-200"
              title="পরিবর্তন করুন (Replace)"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition border border-transparent hover:border-slate-200"
              title="মুছে ফেলুন (Remove)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Upload Drag & Drop Area */
        <div
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-blue-500 bg-blue-50/70'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/20'
          } ${isProcessing ? 'pointer-events-none opacity-80' : ''}`}
        >
          {isProcessing ? (
            <div className="w-full max-w-xs space-y-2 py-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>ফাইল প্রসেসিং ও অপটিমাইজ হচ্ছে...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  ক্লিক করে ফাইল নির্বাচন করুন অথবা টেনে আনুন
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  JPG, JPEG, PNG, WebP অথবা PDF (সর্বোচ্চ ৫ MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Image Preview Modal */}
      {showPreviewModal && valueUrl && !isPdf && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowPreviewModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{labelBn} - প্রিভিউ</span>
                {fileName && <span className="text-[11px] text-slate-500">({fileName})</span>}
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-slate-900 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={valueUrl}
                alt="Document Preview"
                className="max-h-[65vh] w-auto object-contain rounded-lg border border-slate-700"
              />
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
