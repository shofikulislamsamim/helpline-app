import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  ShieldCheck, 
  AlertCircle, 
  Info, 
  MessageSquare, 
  Briefcase, 
  DollarSign, 
  BellRing,
  Clock
} from 'lucide-react';
import { AppNotification } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useHire } from '../../context/HireContext';
import { 
  requestBrowserPushPermission, 
  isPushNotificationSupported 
} from '../../lib/pushNotificationService';

interface NotificationDropdownProps {
  notifications?: AppNotification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onNavigate: (view: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications: propNotifications,
  onMarkAsRead: propMarkAsRead,
  onMarkAllAsRead: propMarkAllAsRead,
  onNavigate
}) => {
  const auth = useAuth();
  const { setActiveRequestIdForDetails } = useHire();
  const notifications = propNotifications ?? auth?.notifications ?? [];
  const onMarkAsRead = propMarkAsRead ?? auth?.markNotificationAsRead ?? (() => {});
  const onMarkAllAsRead = propMarkAllAsRead ?? auth?.markAllNotificationsAsRead ?? (() => {});

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pushStatus, setPushStatus] = useState<string>('default');

  const safeNotifications = notifications || [];
  const unreadCount = safeNotifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRequestPush = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const granted = await requestBrowserPushPermission();
    if (granted) {
      setPushStatus('granted');
    } else if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    }
  };

  const getNotificationIcon = (type: string, status?: string) => {
    if (type === 'verification') {
      if (status === 'approved') return <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />;
      if (status === 'rejected') return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      if (status === 'reverification_required') return <AlertCircle className="w-4 h-4 text-purple-600 shrink-0" />;
      return <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />;
    }
    if (type === 'chat' || type === 'message') {
      return <MessageSquare className="w-4 h-4 text-sky-600 shrink-0" />;
    }
    if (type === 'hire_request' || type === 'quote' || type === 'quote_received') {
      return <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />;
    }
    if (type === 'job_status' || type === 'job_completed') {
      return <Clock className="w-4 h-4 text-emerald-600 shrink-0" />;
    }
    if (type === 'commission' || type === 'payment' || type === 'service_fee') {
      return <DollarSign className="w-4 h-4 text-amber-600 shrink-0" />;
    }
    return <Info className="w-4 h-4 text-slate-500 shrink-0" />;
  };

  const handleNotificationClick = (notif: AppNotification) => {
    onMarkAsRead(notif.id);
    setIsOpen(false);
    if (notif.hireRequestId) {
      setActiveRequestIdForDetails(notif.hireRequestId);
    }
    if (notif.type === 'verification') {
      onNavigate('verification');
    } else if (notif.type === 'hire_request') {
      onNavigate('work_inbox');
    } else if (notif.type === 'chat') {
      onNavigate('activity');
    } else if (notif.type === 'quote' || notif.type === 'job_status' || notif.type === 'commission') {
      onNavigate('activity');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="btn-nav-notifications"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
        title="বিজ্ঞপ্তি ও অ্যালার্ট"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900">বিজ্ঞপ্তি (Notifications)</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                  {unreadCount} নতুন
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>সব পঠিত চিহ্নিত করুন</span>
              </button>
            )}
          </div>

          {/* Browser Push Permission Prompt */}
          {pushStatus !== 'granted' && (
            <div className="px-3.5 py-2.5 bg-blue-50/90 border-b border-blue-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <BellRing className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[11px] text-blue-900 font-medium leading-tight">
                  কাজের তাৎক্ষণিক আপডেট পেতে পুশ নোটিফিকেশন চালু করুন
                </span>
              </div>
              <button
                type="button"
                onClick={handleRequestPush}
                className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shrink-0 cursor-pointer shadow-2xs"
              >
                অনুমতি দিন
              </button>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {safeNotifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                কোনো নতুন বিজ্ঞপ্তি নেই।
              </div>
            ) : (
              safeNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 flex items-start gap-3 transition cursor-pointer hover:bg-slate-50 ${
                    !n.isRead ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs mt-0.5">
                    {getNotificationIcon(n.type, n.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-bold truncate ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                        {n.titleBn}
                      </p>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.messageBn}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(n.createdAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })} •{' '}
                      {new Date(n.createdAt).toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={() => {
                onNavigate('verification');
                setIsOpen(false);
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              প্রোফাইল যাচাই পেজে যান →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
