import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  PhoneCall, 
  MessageSquare, 
  Clock, 
  CheckCheck, 
  ShieldCheck 
} from 'lucide-react';
import { HireRequest } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useHire } from '../../context/HireContext';
import { useLanguage } from '../../context/LanguageContext';

interface JobChatModalProps {
  request: HireRequest | null;
  onClose: () => void;
}

export const JobChatModal: React.FC<JobChatModalProps> = ({
  request,
  onClose,
}) => {
  const { t, isBn, formatNumber } = useLanguage();
  const { userProfile } = useAuth();
  const { getConversationByRequestId, getMessagesForConversation, sendMessage } = useHire();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!request) return null;

  const conv = getConversationByRequestId(request.id);
  const messages = conv ? getMessagesForConversation(conv.id) : [];

  const isCustomer = userProfile.userId === request.customerId;
  const otherPartyName = isCustomer ? request.workerName : request.customerName;
  const otherPartyPhone = isCustomer ? request.workerPhone : request.customerPhone;
  const otherPartyAvatar = isCustomer ? request.workerAvatar : request.customerAvatar;
  const otherPartyRole = isCustomer ? (isBn ? 'দক্ষ কর্মী' : 'Worker') : (isBn ? 'গ্রাহক' : 'Customer');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim() || !conv) return;
    sendMessage(conv.id, text.trim());
    if (!textToSend) setInputVal('');
  };

  const quickChips = isCustomer
    ? (isBn 
        ? ['ঠিকানাটি নিশ্চিত করুন', 'কখন পৌঁছাবেন?', 'কোনো পার্টস লাগবে কি?'] 
        : ['Please confirm address', 'When will you arrive?', 'Need any spare parts?'])
    : (isBn 
        ? ['আমি রওনা দিয়েছি', '১০ মিনিটে পৌঁছাচ্ছি ইনশাআল্লাহ', 'ঠিকানাটা খুঁজে পাচ্ছি না'] 
        : ['I am on the way', 'Arriving in 10 minutes', 'Cannot find the address']);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[80vh] max-h-[650px]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={
                  otherPartyAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    otherPartyName
                  )}&background=0284c7&color=fff`
                }
                alt={otherPartyName}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-white text-sm">{otherPartyName}</h4>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                  {otherPartyRole}
                </span>
              </div>
              <p className="text-[11px] text-blue-300">
                {isBn ? 'কাজ:' : 'Job:'} {request.workType} (#{request.id})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${otherPartyPhone}`}
              title={isBn ? 'কল করুন' : 'Call'}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notice */}
        <div className="py-1.5 px-4 bg-blue-50 border-b border-blue-100 text-[11px] text-blue-800 flex items-center justify-between">
          <span>{isBn ? 'চুক্তি পারিশ্রমিক:' : 'Agreed Amount:'} <strong>৳{request.agreedPrice ? formatNumber(request.agreedPrice) : (request.quote?.estimatedPrice ? formatNumber(request.quote.estimatedPrice) : (request.budget ? formatNumber(request.budget) : (isBn ? 'আলোচনা সাপেক্ষে' : 'Negotiable')))}</strong></span>
          <span className="font-semibold text-slate-600">{isBn ? 'স্ট্যাটাস:' : 'Status:'} {request.status}</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>{isBn ? 'এখনও কোনো মেসেজ আদান-প্রদান হয়নি।' : 'No messages yet.'}</p>
              <p className="text-[11px] mt-0.5">{isBn ? 'নিচের দ্রুত বাটন চাপুন বা লিখে শুরু করুন।' : 'Tap suggestions below or start typing.'}</p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.senderId === userProfile.userId;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-end gap-1.5 max-w-[85%]">
                    {!isMe && (
                      <img
                        src={
                          m.senderAvatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            m.senderName
                          )}&background=64748b&color=fff`
                        }
                        alt={m.senderName}
                        className="w-6 h-6 rounded-full object-cover shrink-0 mb-1"
                      />
                    )}
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                          isMe ? 'text-blue-200' : 'text-slate-400'
                        }`}
                      >
                        <span>
                          {new Date(m.timestamp).toLocaleTimeString(isBn ? 'bn-BD' : 'en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {isMe && <CheckCheck className="w-3 h-3 text-blue-200" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] whitespace-nowrap transition cursor-pointer shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={isBn ? 'মেসেজ লিখুন...' : 'Type a message...'}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white transition cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
