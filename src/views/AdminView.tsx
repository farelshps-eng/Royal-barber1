import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { BookingStatus, Service, Barber, ServiceCategory } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Users, 
  Calendar, 
  Scissors, 
  Clock, 
  DollarSign, 
  Star, 
  Settings, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Plus, 
  RotateCcw,
  Sparkles,
  Phone,
  MessageSquare,
  MessageCircle,
  Mail,
  ExternalLink,
  LogOut,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Shield,
  Check,
  Delete
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { 
    lang, 
    t, 
    bookings, 
    updateBookingStatus, 
    cancelBooking,
    services, 
    addService,
    updateService,
    barbers, 
    toggleBarberActive,
    clients, 
    reviews, 
    toggleReviewApproval,
    salonInfo,
    updateSalonInfo,
    resetToDefaults,
    setCurrentPage,
    showToast 
  } = useSalon();

  // Authentication Gate with PIN / Passcode
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('royal_admin_authed') === 'true';
  });
  const [pinCode, setPinCode] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [storedPin, setStoredPin] = useState<string>(() => {
    return localStorage.getItem('royal_barber_admin_pin') || '2026';
  });

  // Settings PIN Change Form
  const [currentPinAttempt, setCurrentPinAttempt] = useState('');
  const [newPinCandidate, setNewPinCandidate] = useState('');
  const [confirmPinCandidate, setConfirmPinCandidate] = useState('');
  const [pinChangeError, setPinChangeError] = useState<string | null>(null);
  const [pinChangeSuccess, setPinChangeSuccess] = useState<string | null>(null);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'appointments' | 'clients' | 'services' | 'barbers' | 'reviews' | 'settings'
  >('appointments');

  // Bookings Filter & Search
  const [bookingFilter, setBookingFilter] = useState<BookingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Service Modal
  const [newServiceModalOpen, setNewServiceModalOpen] = useState(false);
  const [newSrvNameAr, setNewSrvNameAr] = useState('');
  const [newSrvNameEn, setNewSrvNameEn] = useState('');
  const [newSrvPrice, setNewSrvPrice] = useState(35);
  const [newSrvDuration, setNewSrvDuration] = useState(45);
  const [newSrvCategory, setNewSrvCategory] = useState<ServiceCategory>('hair');

  const verifyPin = (candidate: string) => {
    const activeStored = localStorage.getItem('royal_barber_admin_pin') || storedPin || '2026';
    if (candidate === activeStored || candidate === '2026' || candidate === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('royal_admin_authed', 'true');
      setAuthError(null);
      setPinCode('');
      showToast(lang === 'ar' ? 'تم فتح لوحة الإدارة بنجاح 🔒' : 'Admin unlocked successfully');
    } else {
      setAuthError(lang === 'ar' ? 'الرمز غير صحيح، يرجى المحاولة مرة أخرى.' : 'Invalid passcode. Please try again.');
      setPinCode('');
    }
  };

  const handleKeypadPress = (val: string) => {
    setAuthError(null);
    if (val === 'clear') {
      setPinCode('');
    } else if (val === 'backspace') {
      setPinCode((prev) => prev.slice(0, -1));
    } else {
      if (pinCode.length >= 8) return;
      const next = pinCode + val;
      setPinCode(next);
      // Auto-submit if 4 digits matching
      if (next.length === 4) {
        verifyPin(next);
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode.trim()) return;
    verifyPin(pinCode.trim());
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('royal_admin_authed');
    setPinCode('');
    setAuthError(null);
    showToast(lang === 'ar' ? 'تم قفل لوحة الإدارة 🔒' : 'Admin locked');
  };

  const handleChangeAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError(null);
    setPinChangeSuccess(null);

    const activeStored = localStorage.getItem('royal_barber_admin_pin') || storedPin || '2026';
    if (currentPinAttempt !== activeStored && currentPinAttempt !== '2026' && currentPinAttempt !== '1234') {
      setPinChangeError(lang === 'ar' ? 'رمز المرور الحالي غير صحيح' : 'Current PIN is incorrect');
      return;
    }
    if (newPinCandidate.length < 4) {
      setPinChangeError(lang === 'ar' ? 'يجب أن يتكون الرمز الجديد من 4 أرقام على الأقل' : 'New PIN must be at least 4 digits');
      return;
    }
    if (newPinCandidate !== confirmPinCandidate) {
      setPinChangeError(lang === 'ar' ? 'تأكيد الرمز الجديد غير متطابق' : 'PIN confirmation does not match');
      return;
    }

    localStorage.setItem('royal_barber_admin_pin', newPinCandidate);
    setStoredPin(newPinCandidate);
    setCurrentPinAttempt('');
    setNewPinCandidate('');
    setConfirmPinCandidate('');
    setPinChangeSuccess(lang === 'ar' ? `تم تغيير رمز الدخول بنجاح! الرمز الجديد هو: ${newPinCandidate}` : 'Admin PIN updated successfully!');
    showToast(lang === 'ar' ? 'تم حفظ رمز دخول الإدارة الجديد' : 'Admin PIN updated');
  };

  // Metrics
  const totalBookingsCount = bookings.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookingsCount = bookings.filter(b => b.date === todayStr && b.status !== 'cancelled').length;
  const activeBarbersCount = barbers.filter(b => b.isActive).length;
  const projectedRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingFilter === 'all' || b.status === bookingFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesFilter;
    const nameMatch = (b.customerName || '').toLowerCase().includes(q);
    const phoneMatch = (b.customerPhone || '').includes(q);
    const refMatch = (b.referenceNumber || '').toLowerCase().includes(q);
    const serviceMatch = (b.serviceNameAr || '').toLowerCase().includes(q) || (b.serviceNameEn || '').toLowerCase().includes(q);
    const barberMatch = (b.barberNameAr || '').toLowerCase().includes(q) || (b.barberNameEn || '').toLowerCase().includes(q);
    return matchesFilter && (nameMatch || phoneMatch || refMatch || serviceMatch || barberMatch);
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrvNameAr.trim() || !newSrvNameEn.trim()) return;

    addService({
      nameAr: newSrvNameAr.trim(),
      nameEn: newSrvNameEn.trim(),
      descriptionAr: "خدمة ملكية جديدة مخصصة بأعلى درجات الفخامة.",
      descriptionEn: "New royal luxury service tailored for distinguished gentlemen.",
      category: newSrvCategory,
      price: Number(newSrvPrice),
      durationMinutes: Number(newSrvDuration),
      image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
      includesAr: ["استشارة مخصصة", "غسيل وتصفيف فاخر", "ضيافة ملكية"],
      includesEn: ["Bespoke consultation", "Luxury wash & style", "Royal hospitality"]
    });

    setNewSrvNameAr('');
    setNewSrvNameEn('');
    setNewServiceModalOpen(false);
  };

  // ==========================================
  // RENDER VAULT PIN LOGIN IF NOT AUTHENTICATED
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rounded-3xl bg-[#0f1117] border border-[#232734] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          
          {/* Decorative Gold Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Bar: Return to Home Button */}
          <div className="flex items-center justify-between pb-2 border-b border-[#1b1f2b]">
            <button
              onClick={() => {
                setCurrentPage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs text-[#8e95a5] hover:text-[#d4af37] flex items-center gap-1.5 transition-colors"
            >
              {lang === 'ar' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{lang === 'ar' ? 'العودة للصالون' : 'Back to Salon'}</span>
            </button>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20">
              STAFF ONLY
            </span>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2a2415] to-[#14161f] border-2 border-[#d4af37]/60 text-[#d4af37] mx-auto flex items-center justify-center shadow-lg shadow-[#d4af37]/15">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {lang === 'ar' ? 'بوابة إدارة صالون رويال' : 'Royal Barber Admin Vault'}
            </h2>
            <p className="text-xs text-[#8e95a5] leading-relaxed">
              {lang === 'ar' 
                ? 'أدخل رمز المرور السري (PIN) للدخول إلى لوحة التحكم' 
                : 'Enter your security passcode to access dashboard'}
            </p>
          </div>

          {/* PIN Indicators Display */}
          <div className="flex items-center justify-center gap-3 py-1">
            {[0, 1, 2, 3].map((idx) => {
              const hasDigit = pinCode.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 border ${
                    hasDigit
                      ? 'bg-[#d4af37] border-[#d4af37] shadow-lg shadow-[#d4af37]/50 scale-110'
                      : 'bg-[#181b24] border-[#2c3140]'
                  }`}
                />
              );
            })}
          </div>

          {/* Manual Input Field with Eye Toggle */}
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#6e7687] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={8}
                inputMode="numeric"
                value={pinCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setPinCode(val);
                  setAuthError(null);
                  if (val.length === 4) {
                    verifyPin(val);
                  }
                }}
                placeholder={lang === 'ar' ? '••••' : '••••'}
                className="w-full ps-10 pe-10 py-2.5 rounded-xl bg-[#0a0b10] border border-[#272b38] text-white text-center font-mono tracking-widest text-lg focus:outline-none focus:border-[#d4af37] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 text-[#6e7687] hover:text-[#d4af37] transition-colors"
                title={showPin ? 'إخفاء الرمز' : 'إظهار الرمز'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {authError && (
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center flex items-center justify-center gap-1.5 animate-in fade-in">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
          </form>

          {/* Interactive Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(digit)}
                className="h-12 rounded-xl bg-[#141722] hover:bg-[#1d2232] active:bg-[#d4af37] active:text-black border border-[#232736] text-white font-mono text-lg font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center"
              >
                {digit}
              </button>
            ))}
            
            {/* Clear Button */}
            <button
              type="button"
              onClick={() => handleKeypadPress('clear')}
              className="h-12 rounded-xl bg-[#181318] hover:bg-[#241a20] active:scale-95 border border-[#36212b] text-rose-400 text-xs font-semibold transition-all flex items-center justify-center"
            >
              {lang === 'ar' ? 'مسح' : 'Clear'}
            </button>

            {/* Zero */}
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="h-12 rounded-xl bg-[#141722] hover:bg-[#1d2232] active:bg-[#d4af37] active:text-black border border-[#232736] text-white font-mono text-lg font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center"
            >
              0
            </button>

            {/* Backspace Button */}
            <button
              type="button"
              onClick={() => handleKeypadPress('backspace')}
              className="h-12 rounded-xl bg-[#141722] hover:bg-[#1d2232] active:scale-95 border border-[#232736] text-[#8e95a5] hover:text-white transition-all flex items-center justify-center"
              title="حذف رقم"
            >
              ⌫
            </button>
          </div>

          {/* Quick Access & Demo Code Info */}
          <div className="space-y-2 pt-2 border-t border-[#1b1f2b]">
            <button
              type="button"
              onClick={() => verifyPin(storedPin || '2026')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#211d13] to-[#181a24] hover:from-[#2e2617] hover:to-[#222533] border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{lang === 'ar' ? `فتح سريع بالرمز الافتراضي (${storedPin || '2026'})` : `Quick Access (Default: ${storedPin || '2026'})`}</span>
            </button>
            <p className="text-[11px] text-[#636c7c] text-center">
              {lang === 'ar' 
                ? 'الرمز الافتراضي: 2026 أو 1234 (يمكنك تغييره من تبويب الإعدادات بالداخل)' 
                : 'Default PIN: 2026 or 1234 (customizable in Settings tab)'}
            </p>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Bar with Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1f222d]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#181c26] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>{t.adminTitle}</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                LIVE
              </span>
            </h1>
            <p className="text-xs text-[#8e95a5]">
              {lang === 'ar' ? 'إدارة المواعيد والعملاء والأسعار والجداول التشغيلية' : 'Manage bookings, clients CRM, pricing and master barber schedules'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-3 py-1.5 rounded-lg bg-[#141720] hover:bg-[#1a1e2a] text-[#8e95a5] hover:text-white border border-[#252834] text-xs font-medium flex items-center gap-1.5"
          >
            {lang === 'ar' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{lang === 'ar' ? 'عرض موقع الصالون' : 'Back to Salon'}</span>
          </button>

          <button
            onClick={resetToDefaults}
            className="px-3 py-1.5 rounded-lg bg-[#141720] hover:bg-[#1a1e2a] text-[#8e95a5] hover:text-white border border-[#252834] text-xs font-medium flex items-center gap-1.5"
            title={t.resetData}
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{t.resetData}</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-[#241a12] hover:bg-[#332215] text-[#d4af37] border border-[#d4af37]/40 text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            title="قفل لوحة الإدارة"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'قفل الإدارة' : 'Lock Vault'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-xl bg-[#111319] border border-[#21242e] space-y-2">
          <span className="text-xs text-[#8e95a5] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{t.statTotalBookings}</span>
          </span>
          <p className="text-2xl font-bold text-white font-mono">{totalBookingsCount}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-[#111319] border border-[#21242e] space-y-2">
          <span className="text-xs text-[#8e95a5] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{t.statTodayBookings}</span>
          </span>
          <p className="text-2xl font-bold text-emerald-400 font-mono">{todayBookingsCount}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-[#111319] border border-[#21242e] space-y-2">
          <span className="text-xs text-[#8e95a5] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{t.statActiveBarbers}</span>
          </span>
          <p className="text-2xl font-bold text-white font-mono">{activeBarbersCount} / {barbers.length}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-[#111319] border border-[#21242e] space-y-2">
          <span className="text-xs text-[#8e95a5] flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{t.statEstRevenue}</span>
          </span>
          <p className="text-2xl font-bold text-gold-gradient font-mono">
            {projectedRevenue.toLocaleString()} {t.currency}
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1f222d] no-scrollbar">
        {[
          { id: 'appointments', label: t.tabAppointments, icon: <Calendar className="w-4 h-4" /> },
          { id: 'clients', label: t.tabClients, icon: <Users className="w-4 h-4" /> },
          { id: 'services', label: t.tabServices, icon: <Scissors className="w-4 h-4" /> },
          { id: 'barbers', label: t.tabBarbers, icon: <Clock className="w-4 h-4" /> },
          { id: 'reviews', label: t.tabReviews, icon: <Star className="w-4 h-4" /> },
          { id: 'settings', label: t.tabSettings, icon: <Settings className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gold-gradient text-[#0b0c10] font-bold shadow-md'
                : 'text-[#8e95a5] hover:text-white hover:bg-[#141720]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================== */}
      {/* TAB 1: APPOINTMENTS / BOOKINGS */}
      {/* ========================================== */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          
          {/* Controls: Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', label: t.filterStatusAll },
                { id: 'confirmed', label: t.statusConfirmed },
                { id: 'completed', label: t.statusCompleted },
                { id: 'cancelled', label: t.statusCancelled }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setBookingFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    bookingFilter === f.id
                      ? 'bg-[#d4af37] text-black font-bold'
                      : 'bg-[#13151c] text-[#8e95a5] hover:text-white border border-[#222530]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 text-[#6e7687] absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full ps-9 pe-3 py-1.5 rounded-lg bg-[#0e1016] border border-[#222530] text-xs text-white placeholder:text-[#525968] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Bookings Table / List */}
          <div className="rounded-xl border border-[#21242e] bg-[#101218] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-[#141720] border-b border-[#21242e] text-[#8e95a5] uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4 text-start font-semibold">{t.bookingRef}</th>
                    <th className="py-3 px-4 text-start font-semibold">{lang === 'ar' ? 'العميل' : 'Client'}</th>
                    <th className="py-3 px-4 text-start font-semibold">{lang === 'ar' ? 'الخدمة' : 'Service'}</th>
                    <th className="py-3 px-4 text-start font-semibold">{lang === 'ar' ? 'الحلاق' : 'Barber'}</th>
                    <th className="py-3 px-4 text-start font-semibold">{lang === 'ar' ? 'الموعد' : 'Date & Time'}</th>
                    <th className="py-3 px-4 text-start font-semibold">{lang === 'ar' ? 'السعر' : 'Price'}</th>
                    <th className="py-3 px-4 text-start font-semibold">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                    <th className="py-3 px-4 text-center font-semibold">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b1e26]">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 px-4 text-center">
                        <div className="max-w-md mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-full bg-[#181c26] border border-[#d4af37]/40 flex items-center justify-center mx-auto text-[#d4af37]">
                            <Calendar className="w-6 h-6" />
                          </div>
                          <h4 className="text-white font-bold text-sm">
                            {bookings.length === 0
                              ? (lang === 'ar' ? '🎉 الصالون في يوم الافتتاح — صفر حجوزات حالياً' : '🎉 Opening Day — 0 Current Bookings')
                              : (lang === 'ar' ? 'لا توجد حجوزات مطابقة لخيارات البحث' : 'No appointments matching search')}
                          </h4>
                          <p className="text-xs text-[#8e95a5]">
                            {bookings.length === 0
                              ? (lang === 'ar'
                                  ? 'النظام مصفّر وجاهز. بمجرد قيام أي زبون بالحجز من الموقع، سيظهر موعده فوراً هنا في الجدول مع إمكانية مراسلته بالواتساب أو الإيميل بنقرة واحدة.'
                                  : 'System is clean and ready. Any booking made on the client side will show up here in real time.')
                              : (lang === 'ar' ? 'جرب تغيير كلمة البحث أو فلتر الحالة.' : 'Try changing search query or status filter.')}
                          </p>
                          {bookings.length === 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentPage('booking');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="mt-2 px-4 py-2 rounded-lg bg-gold-gradient text-black font-bold text-xs hover:brightness-110 shadow"
                            >
                              {lang === 'ar' ? 'تجربة حجز موعد الآن ✂️' : 'Test Booking Now ✂️'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => {
                      const isNew = Date.now() - new Date(b.createdAt).getTime() < 3600000;
                      const cleanPhone = b.customerPhone.replace(/[^0-9]/g, '');
                      const clientWaMsg = lang === 'ar'
                        ? `مرحباً ${b.customerName}، نتواصل معك من إدارة صالون رويال بخصوص موعدك رقم ${b.referenceNumber} بتاريخ ${b.date} الساعة ${b.timeSlot}. كرسيك مجهز في انتظارك.`
                        : `Hello ${b.customerName}, contacting you from ROYAL BARBER Tripoli regarding booking ${b.referenceNumber} on ${b.date} at ${b.timeSlot}.`;

                      return (
                        <tr key={b.id} className="hover:bg-[#141722] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#d4af37] whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span>{b.referenceNumber}</span>
                              {isNew && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 animate-pulse font-sans font-bold">
                                  {lang === 'ar' ? 'جديد' : 'NEW'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-white block">{b.customerName}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] text-[#8e95a5] font-mono dir-ltr">{b.customerPhone}</span>
                              {b.customerEmail && (
                                <span className="text-[10px] text-[#5e6677] truncate max-w-[110px]" title={b.customerEmail}>
                                  · {b.customerEmail}
                                </span>
                              )}
                            </div>
                            <div className="mt-1">
                              {b.confirmationMethod === 'whatsapp' && (
                                <span className="inline-block text-[9px] text-[#25D366] bg-[#25D366]/10 px-1.5 py-0.5 rounded border border-[#25D366]/20 font-medium">
                                  🟢 {lang === 'ar' ? 'تأكيد واتساب' : 'WhatsApp'}
                                </span>
                              )}
                              {b.confirmationMethod === 'email' && (
                                <span className="inline-block text-[9px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20 font-medium">
                                  ✉️ {lang === 'ar' ? 'تأكيد إيميل' : 'Email'}
                                </span>
                              )}
                              {b.confirmationMethod === 'both' && (
                                <span className="inline-block text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-medium">
                                  📲 {lang === 'ar' ? 'واتساب + إيميل' : 'Both'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 max-w-[180px]">
                            <span className="text-white block truncate">
                              {lang === 'ar' ? b.serviceNameAr : b.serviceNameEn}
                            </span>
                            {b.addOnDetails.length > 0 && (
                              <span className="text-[10px] text-[#d4af37]">
                                +{b.addOnDetails.length} {lang === 'ar' ? 'إضافات' : 'add-ons'}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-white whitespace-nowrap">
                            {lang === 'ar' ? b.barberNameAr : b.barberNameEn}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap font-mono text-[#a5acba]">
                            <div>{b.date}</div>
                            <div className="text-[11px] text-[#6d7585]">{b.timeSlot}</div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
                            {b.totalPrice} {t.currency}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {b.status === 'confirmed' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {t.statusConfirmed}
                              </span>
                            )}
                            {b.status === 'completed' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                {t.statusCompleted}
                              </span>
                            )}
                            {b.status === 'cancelled' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                {t.statusCancelled}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Direct WhatsApp Contact Button */}
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(clientWaMsg)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded bg-[#132018] hover:bg-[#1a2e23] border border-[#25D366]/40 text-[#25D366] transition-colors"
                                  title={lang === 'ar' ? 'مراسلة العميل بالواتساب' : 'WhatsApp Client'}
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              )}

                              {/* Direct Email Contact Button */}
                              {b.customerEmail && (
                                <a
                                  href={`mailto:${b.customerEmail}?subject=${encodeURIComponent(lang === 'ar' ? `بخصوص حجزك في صالون رويال (${b.referenceNumber})` : `Regarding your appointment ${b.referenceNumber}`)}`}
                                  className="p-1.5 rounded bg-[#101c27] hover:bg-[#162737] border border-sky-500/40 text-sky-400 transition-colors"
                                  title={lang === 'ar' ? 'مراسلة العميل بالإيميل' : 'Email Client'}
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </a>
                              )}

                              {b.status !== 'completed' && (
                                <button
                                  onClick={() => updateBookingStatus(b.id, 'completed')}
                                  className="p-1.5 rounded hover:bg-emerald-500/20 text-emerald-400"
                                  title={lang === 'ar' ? 'تعيين كمكتمل' : 'Mark Completed'}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}
                              {b.status !== 'cancelled' && (
                                <button
                                  onClick={() => cancelBooking(b.id)}
                                  className="p-1.5 rounded hover:bg-rose-500/20 text-rose-400"
                                  title={lang === 'ar' ? 'إلغاء الموعد' : 'Cancel Appointment'}
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: CLIENTS CRM */}
      {/* ========================================== */}
      {activeTab === 'clients' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              {lang === 'ar' ? 'سجل العملاء والولاء الملكي (VIP CRM)' : 'VIP Client Database'}
            </h3>
            <span className="text-xs text-[#8e95a5]">
              {clients.length} {lang === 'ar' ? 'عميل مسجل' : 'registered gentlemen'}
            </span>
          </div>

          {clients.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl bg-[#111319] border border-[#21242e] space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#181c26] border border-[#d4af37]/40 flex items-center justify-center mx-auto text-[#d4af37]">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-sm">
                {lang === 'ar' ? 'سجل العملاء مصفّر وجاهز (يوم الافتتاح)' : 'Client CRM is Ready (Opening Day)'}
              </h4>
              <p className="text-xs text-[#8e95a5] max-w-md mx-auto">
                {lang === 'ar'
                  ? 'سيتم إنشاء ملف لكل زبون وتحديث عدد زياراته وإجمالي إنفاقه تلقائياً بمجرد إتمام أي حجز في الصالون.'
                  : 'Client profiles will automatically be built here upon their first appointment.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clients.map((cli) => (
                <div
                  key={cli.id}
                  className="p-5 rounded-xl bg-[#111319] border border-[#21242e] space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{cli.name}</h4>
                      <span className="text-xs text-[#8e95a5] font-mono dir-ltr block text-start">{cli.phone}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      cli.vipTier === 'Royal Diamond'
                        ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40'
                        : 'bg-white/10 text-white'
                    }`}>
                      {cli.vipTier}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1d2028] text-xs">
                    <div>
                      <span className="text-[#6e7687] block text-[10px]">{lang === 'ar' ? 'الزيارات' : 'Visits'}</span>
                      <span className="font-bold text-white font-mono">{cli.totalBookings}</span>
                    </div>
                    <div>
                      <span className="text-[#6e7687] block text-[10px]">{lang === 'ar' ? 'الإنفاق' : 'Total Spend'}</span>
                      <span className="font-bold text-[#d4af37] font-mono">{cli.totalSpent} {t.currency}</span>
                    </div>
                    <div>
                      <span className="text-[#6e7687] block text-[10px]">{lang === 'ar' ? 'آخر زيارة' : 'Last Visit'}</span>
                      <span className="text-white font-mono text-[11px]">{cli.lastVisit}</span>
                    </div>
                  </div>

                  {cli.notes && (
                    <p className="text-[11px] text-[#9ca3af] bg-[#0c0d12] p-2.5 rounded-lg border border-[#1b1e27]">
                      <span className="text-[#d4af37] font-semibold">{lang === 'ar' ? 'ملاحظة VIP: ' : 'VIP Note: '}</span>
                      {cli.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: SERVICES MANAGEMENT */}
      {/* ========================================== */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              {lang === 'ar' ? 'إدارة الخدمات والأسعار' : 'Services & Pricing Management'}
            </h3>
            <button
              onClick={() => setNewServiceModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-gold-gradient text-[#0b0c10] font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5 text-[#0b0c10]" />
              <span>{lang === 'ar' ? 'إضافة خدمة جديدة' : 'Add New Service'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="p-4 rounded-xl bg-[#111319] border border-[#21242e] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                    <img src={srv.image} alt={srv.nameAr} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {lang === 'ar' ? srv.nameAr : srv.nameEn}
                    </h4>
                    <span className="text-xs text-[#8e95a5]">
                      {srv.durationMinutes} {t.mins} · {srv.category}
                    </span>
                  </div>
                </div>

                <div className="text-end">
                  <span className="text-sm font-mono font-bold text-[#d4af37] block mb-1">
                    {srv.price} {t.currency}
                  </span>
                  <button
                    onClick={() => {
                      const newP = prompt(lang === 'ar' ? 'أدخل السعر الجديد:' : 'Enter new price:', String(srv.price));
                      if (newP && !isNaN(Number(newP))) {
                        updateService(srv.id, { price: Number(newP) });
                        showToast(lang === 'ar' ? 'تم تحديث السعر' : 'Price updated');
                      }
                    }}
                    className="text-[11px] text-[#8e95a5] hover:text-white underline"
                  >
                    {lang === 'ar' ? 'تعديل السعر' : 'Edit Price'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* New Service Modal */}
          {newServiceModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#12141c] border border-[#292d3b] rounded-2xl w-full max-w-md p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">
                  {lang === 'ar' ? 'إضافة خدمة جديدة' : 'Add New Service'}
                </h3>
                <form onSubmit={handleCreateService} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#c5cbd6] mb-1">الاسم بالعربية:</label>
                    <input
                      type="text"
                      required
                      value={newSrvNameAr}
                      onChange={(e) => setNewSrvNameAr(e.target.value)}
                      placeholder="مثال: قصة شعر ملكية VIP"
                      className="w-full p-2 rounded bg-[#0c0d12] border border-[#252834] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#c5cbd6] mb-1">Name in English:</label>
                    <input
                      type="text"
                      required
                      value={newSrvNameEn}
                      onChange={(e) => setNewSrvNameEn(e.target.value)}
                      placeholder="e.g. VIP Royal Haircut"
                      className="w-full p-2 rounded bg-[#0c0d12] border border-[#252834] text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#c5cbd6] mb-1">{t.servicePrice}:</label>
                      <input
                        type="number"
                        required
                        value={newSrvPrice}
                        onChange={(e) => setNewSrvPrice(Number(e.target.value))}
                        className="w-full p-2 rounded bg-[#0c0d12] border border-[#252834] text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#c5cbd6] mb-1">{t.estDuration} ({t.mins}):</label>
                      <input
                        type="number"
                        required
                        value={newSrvDuration}
                        onChange={(e) => setNewSrvDuration(Number(e.target.value))}
                        className="w-full p-2 rounded bg-[#0c0d12] border border-[#252834] text-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setNewServiceModalOpen(false)}
                      className="px-3 py-1.5 rounded text-[#8e95a5]"
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-gold-gradient text-black font-bold"
                    >
                      {lang === 'ar' ? 'حفظ الخدمة' : 'Save Service'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 4: BARBERS & SCHEDULES */}
      {/* ========================================== */}
      {activeTab === 'barbers' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">
            {lang === 'ar' ? 'حالة توفر وجداول فريق الحلاقين' : 'Barbers Availability & Shifts'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {barbers.map((barber) => (
              <div
                key={barber.id}
                className="p-5 rounded-xl bg-[#111319] border border-[#21242e] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#d4af37]/40">
                    <img src={barber.avatar} alt={barber.nameAr} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {lang === 'ar' ? barber.nameAr : barber.nameEn}
                    </h4>
                    <span className="text-xs text-[#8e95a5] block">
                      {barber.workHours.start} - {barber.workHours.end}
                    </span>
                    <span className="text-[11px] text-amber-400 font-mono">
                      ★ {barber.rating} ({barber.reviewCount})
                    </span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => toggleBarberActive(barber.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      barber.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                    }`}
                  >
                    {barber.isActive ? (lang === 'ar' ? 'متاح للعمل' : 'Active') : (lang === 'ar' ? 'في إجازة' : 'Off-Duty')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 5: REVIEWS MODERATION */}
      {/* ========================================== */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">
            {lang === 'ar' ? 'اعتماد وإدارة تقييمات العملاء' : 'Review Moderation'}
          </h3>

          <div className="space-y-3">
            {reviews.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-xl bg-[#111319] border border-[#21242e] space-y-2">
                <p className="text-white font-bold text-sm">
                  {lang === 'ar' ? 'لا توجد تقييمات مسجلة بعد (يوم الافتتاح)' : 'No reviews submitted yet'}
                </p>
                <p className="text-xs text-[#8e95a5]">
                  {lang === 'ar' ? 'أي تقييم يكتبه الزبائن في صفحة التقييمات سيظهر هنا للاعتماد أو المراجعة.' : 'Customer reviews will appear here for moderation.'}
                </p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-[#111319] border border-[#21242e] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">
                        {lang === 'ar' ? rev.authorNameAr : rev.authorNameEn}
                      </span>
                      <span className="text-amber-400 text-xs font-mono">★ {rev.rating}</span>
                      <span className="text-[11px] text-[#6e7687] font-mono">{rev.date}</span>
                    </div>
                    <p className="text-xs text-[#a5acba] italic">
                      "{lang === 'ar' ? rev.commentAr : rev.commentEn}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleReviewApproval(rev.id)}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        rev.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {rev.status === 'approved' ? (lang === 'ar' ? 'معتمد ومنشور' : 'Approved') : (lang === 'ar' ? 'قيد المراجعة' : 'Pending')}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 6: SALON SETTINGS */}
      {/* ========================================== */}
      {activeTab === 'settings' && (
        <div className="max-w-xl space-y-6">
          {/* Admin Security PIN Management Card */}
          <div className="p-6 rounded-2xl bg-[#111319] border border-[#21242e] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c202a]">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#d4af37]" />
                <h3 className="text-base font-bold text-white">
                  {lang === 'ar' ? 'أمان الإدارة ورمز الدخول السري (PIN)' : 'Admin Security & PIN Code'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20">
                {lang === 'ar' ? `الرمز الحالي: ${storedPin}` : `Active PIN: ${storedPin}`}
              </span>
            </div>

            <form onSubmit={handleChangeAdminPin} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#c5cbd6] mb-1">
                  {lang === 'ar' ? 'رمز المرور الحالي:' : 'Current Passcode:'}
                </label>
                <input
                  type="password"
                  required
                  value={currentPinAttempt}
                  onChange={(e) => setCurrentPinAttempt(e.target.value)}
                  placeholder="••••"
                  className="w-full p-2.5 rounded-lg bg-[#0c0d12] border border-[#252834] text-white font-mono tracking-widest text-center"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#c5cbd6] mb-1">
                    {lang === 'ar' ? 'الرمز الجديد (4 أرقام على الأقل):' : 'New Passcode (4+ digits):'}
                  </label>
                  <input
                    type="password"
                    required
                    value={newPinCandidate}
                    onChange={(e) => setNewPinCandidate(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="••••"
                    className="w-full p-2.5 rounded-lg bg-[#0c0d12] border border-[#252834] text-white font-mono tracking-widest text-center"
                  />
                </div>
                <div>
                  <label className="block text-[#c5cbd6] mb-1">
                    {lang === 'ar' ? 'تأكيد الرمز الجديد:' : 'Confirm New Passcode:'}
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPinCandidate}
                    onChange={(e) => setConfirmPinCandidate(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="••••"
                    className="w-full p-2.5 rounded-lg bg-[#0c0d12] border border-[#252834] text-white font-mono tracking-widest text-center"
                  />
                </div>
              </div>

              {pinChangeError && (
                <p className="text-xs text-rose-400 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  {pinChangeError}
                </p>
              )}

              {pinChangeSuccess && (
                <p className="text-xs text-emerald-400 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  {pinChangeSuccess}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gold-gradient text-black font-bold hover:brightness-110 active:scale-95 transition-all"
                >
                  {lang === 'ar' ? 'تحديث وحفظ رمز الدخول' : 'Update Admin PIN'}
                </button>
              </div>
            </form>
          </div>

          <div className="p-6 rounded-2xl bg-[#111319] border border-[#21242e] space-y-4">
            <h3 className="text-base font-bold text-white">
              {lang === 'ar' ? 'بيانات ومعلومات الصالون' : 'Salon Operating Parameters'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#c5cbd6] mb-1">{lang === 'ar' ? 'هاتف الكونسيرج:' : 'Concierge Phone:'}</label>
                <input
                  type="text"
                  value={salonInfo.phone}
                  onChange={(e) => updateSalonInfo({ phone: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#0c0d12] border border-[#252834] text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[#c5cbd6] mb-1">{lang === 'ar' ? 'رقم الواتساب المباشر:' : 'WhatsApp Number:'}</label>
                <input
                  type="text"
                  value={salonInfo.whatsappNumber}
                  onChange={(e) => updateSalonInfo({ whatsappNumber: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#0c0d12] border border-[#252834] text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[#c5cbd6] mb-1">{lang === 'ar' ? 'العنوان بالعربية:' : 'Address in Arabic:'}</label>
                <input
                  type="text"
                  value={salonInfo.addressAr}
                  onChange={(e) => updateSalonInfo({ addressAr: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#0c0d12] border border-[#252834] text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => showToast(lang === 'ar' ? 'تم حفظ التعديلات بنجاح' : 'Settings saved')}
                  className="px-5 py-2 rounded-lg bg-gold-gradient text-black font-bold"
                >
                  {lang === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>

          {/* Development Seed Reset Box */}
          <div className="p-6 rounded-2xl bg-[#141012] border border-rose-500/20 space-y-3">
            <h4 className="text-sm font-bold text-rose-300">
              {lang === 'ar' ? 'إعادة تعيين بيانات التطوير الافتراضية' : 'Reset Development Seed Data'}
            </h4>
            <p className="text-xs text-[#8e95a5]">
              {lang === 'ar'
                ? 'استعادة كافة بيانات الخدمات والحلاقين والمواعيد والمراجعات إلى حالتها النموذجية الأولى.'
                : 'Reverts all services, master barbers, appointments, and reviews to pristine demo seed state.'}
            </p>
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold"
            >
              {t.resetData}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
