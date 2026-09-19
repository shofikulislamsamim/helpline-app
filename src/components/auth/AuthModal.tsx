import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, LogIn, UserPlus, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { isValidBdPhoneNumber } from '../../lib/profileHelpers';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, loginAsDemoUser } = useAuth();
  const { t, isBn } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const identifier = email || phone;
    if (!identifier.trim()) {
      setErrorMessage(isBn ? 'অনুগ্রহ করে মোবাইল নম্বর বা ইমেইল প্রবেশ করান' : 'Please enter mobile number or email');
      return;
    }
    if (!password) {
      setErrorMessage(isBn ? 'অনুগ্রহ করে পাসওয়ার্ড প্রবেশ করান' : 'Please enter password');
      return;
    }

    try {
      setLoading(true);
      await loginWithEmail(identifier, password);
      onClose();
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        setErrorMessage(t.auth.invalidCredentials);
      } else {
        setErrorMessage(t.auth.authFailed);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage(t.auth.nameRequired);
      return;
    }
    if (!phone.trim() || !isValidBdPhoneNumber(phone)) {
      setErrorMessage(t.auth.invalidPhone);
      return;
    }
    if (password.length < 6) {
      setErrorMessage(t.auth.passwordTooShort);
      return;
    }

    try {
      setLoading(true);
      await registerWithEmail(fullName.trim(), phone.trim(), email.trim(), password);
      onClose();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage(t.auth.emailInUse);
      } else {
        setErrorMessage(isBn ? 'নিবন্ধন সম্পন্ন করা যায়নি। অনুগ্রহ করে তথ্য পরীক্ষা করুন বা ডেমো মোড ব্যবহার করুন।' : 'Registration could not be completed. Please check your details or use demo mode.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    try {
      setLoading(true);
      await loginWithGoogle();
      onClose();
    } catch (err) {
      setErrorMessage(isBn ? 'গুগল সাইন-ইন সম্পন্ন হয়নি। অনুগ্রহ করে নিচের "ডেমো প্রবেশ" বাটন ব্যবহার করুন।' : 'Google sign-in failed. Please use the "Instant Demo" button below.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemoUser();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm text-white">
              H
            </span>
            <span className="font-bold text-base tracking-tight">
              {isBn ? 'HelpLine প্ল্যাটফর্মে স্বাগতম' : 'Welcome to HelpLine'}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {mode === 'login' ? t.auth.loginSubtitle : t.auth.registerSubtitle}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex mt-4 p-1 bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'login' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isBn ? 'লগইন' : 'Login'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'register' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isBn ? 'অ্যাকাউন্ট তৈরি' : 'Register'}</span>
            </button>
          </div>
        </div>

        {/* Content & Forms */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.auth.identifierLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.auth.identifierPlaceholder}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.auth.passwordLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.auth.passwordPlaceholder}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (isBn ? 'প্রবেশ করা হচ্ছে...' : 'Signing in...') : t.auth.loginBtn}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.auth.fullNameLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.auth.fullNamePlaceholder}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.auth.phoneLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.auth.phonePlaceholder}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {isBn ? 'ভবিষ্যতে OTP ভেরিফিকেশনের জন্য ব্যবহৃত হবে' : 'Used for OTP verification in the future'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.auth.emailLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.auth.emailPlaceholder}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.auth.passwordLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.auth.passwordPlaceholder}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                {isBn ? (
                  <>অ্যাকাউন্ট তৈরি করার পর আপনাকে <strong className="text-slate-800">প্রোফাইল সেটআপ</strong> ধাপে নিয়ে যাওয়া হবে।</>
                ) : (
                  <>After creating an account, you will be taken to the <strong className="text-slate-800">Profile Setup</strong> step.</>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (isBn ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'Creating account...') : t.auth.registerBtn}
              </button>
            </form>
          )}

          {/* Social / Fast Testing Dividers */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400 font-medium">
                {isBn ? 'অথবা বিকল্প পদ্ধতি' : 'or alternative options'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{t.auth.googleLoginBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.auth.demoLoginBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
