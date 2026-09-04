import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  PhoneCall, 
  Clock, 
  ShieldCheck, 
  CheckCheck, 
  User, 
  Briefcase, 
  Search 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHire } from '../context/HireContext';
import { Conversation } from '../types';

interface MessagesPageProps {
  onNavigate: (view: string) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ onNavigate }) => {
  const { userProfile } = useAuth();
  const { conversations, messages, sendMessage, hireRequests } = useHire();

  // Find user's conversations
  const userConversations = conversations.filter((c) =>
    c.participantIds.includes(userProfile.userId) || c.participantIds.includes('user-demo-01')
  );

  const [activeConvId, setActiveConvId] = useState<string>(
    userConversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || userConversations[0];
  const activeMessages = activeConv
    ? messages.filter((m) => m.conversationId === activeConv.id)
    : [];
  const linkedHireRequest = activeConv
    ? hireRequests.find((r) => r.id === activeConv.hireRequestId)
    : undefined;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeConv) return;
    sendMessage(activeConv.id, text.trim());
    if (!textToSend) setInputText('');
  };

  const getOtherParticipant = (conv: Conversation) => {
    const otherId = conv.participantIds.find((id) => id !== userProfile.userId) || conv.participantIds[1];
    return conv.participants[otherId] || {
      name: 'ব্যবহারকারী',
      phone: '০১৭০০-০০০০০০',
      role: 'worker',
    };
  };

  const quickChips = [
    'আসসালামু আলাইকুম',
    'কখন আসবেন?',
    'ঠিকানাটা কি বুঝতে পেরেছেন?',
    'আমি রওনা দিয়েছি',
    'কাজটি সম্পন্ন হয়েছে',
  ];

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">ইন-অ্যাপ মেসেজ ও যোগাযোগ</h1>
          <p className="text-xs text-slate-500">কাজের অগ্রগতি ও আলোচনার জন্য সুরক্ষিত চ্যাট</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          সরাসরি কথোপকথন
        </span>
      </div>

      {userConversations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">কোনো সক্রিয় চ্যাট নেই</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            কাজের অনুরোধ পাঠানো হলে স্বয়ংক্রিয়ভাবে কর্মী ও গ্রাহকের জন্য চ্যাট কনভারসেশন তৈরি হয়।
          </p>
          <button
            type="button"
            onClick={() => onNavigate('module_hire')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            কাজের মানুষ খুঁজুন
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px] max-h-[700px]">
          {/* Conversation List (Left) */}
          <div className="md:col-span-4 border-r border-slate-200 flex flex-col">
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/70">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="চ্যাট খুঁজুন..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {userConversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const isSelected = activeConv?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full p-3.5 text-left transition flex items-start gap-3 cursor-pointer ${
                      isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={
                          other.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            other.name
                          )}&background=0284c7&color=fff`
                        }
                        alt={other.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {other.name}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(conv.lastMessageTimestamp).toLocaleTimeString('bn-BD', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-blue-700 block">
                        #{conv.hireRequestId}
                      </span>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Window (Right) */}
          {activeConv ? (
            <div className="md:col-span-8 flex flex-col bg-slate-50/40">
              {/* Top Bar */}
              <div className="p-3.5 px-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  {(() => {
                    const other = getOtherParticipant(activeConv);
                    return (
                      <>
                        <img
                          src={
                            other.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              other.name
                            )}&background=0284c7&color=fff`
                          }
                          alt={other.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-slate-900 text-sm">{other.name}</h3>
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold">
                              {other.role === 'worker' ? 'কর্মী' : 'গ্রাহক'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            কাজের অনুরোধ #{activeConv.hireRequestId}
                            {linkedHireRequest && ` • ${linkedHireRequest.workType}`}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {(() => {
                  const other = getOtherParticipant(activeConv);
                  return (
                    <a
                      href={`tel:${other.phone}`}
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                      <span>কল</span>
                    </a>
                  );
                })()}
              </div>

              {/* Status Header Banner */}
              {linkedHireRequest && (
                <div className="py-1.5 px-5 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900">
                  <span>
                    চুক্তি মূল্য: <strong>৳{linkedHireRequest.agreedPrice || linkedHireRequest.quote?.estimatedPrice || linkedHireRequest.budget || '—'}</strong>
                  </span>
                  <span className="font-bold">
                    স্ট্যাটাস: {linkedHireRequest.status}
                  </span>
                </div>
              )}

              {/* Messages Stream */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3">
                {activeMessages.map((m) => {
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
                              {new Date(m.timestamp).toLocaleTimeString('bn-BD', {
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
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestion chips */}
              <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
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
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="মেসেজ লিখুন..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white transition cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="md:col-span-8 flex items-center justify-center p-12 text-slate-400 text-xs">
              বাম পাশের তালিকা থেকে একটি কথোপকথন নির্বাচন করুন।
            </div>
          )}
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-2.5 text-xs text-amber-900">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
        <p>
          <strong>নিরাপত্তা বার্তা:</strong> যেকোনো লেনদেন ও পারিশ্রমিক কাজ সম্পন্ন হওয়ার পর সরাসরি পরিশোধ করুন। কোনো অগ্রিম ডিজিটাল পেমেন্ট প্ল্যাটফর্মে অনুমোদিত নয়।
        </p>
      </div>
    </div>
  );
};
