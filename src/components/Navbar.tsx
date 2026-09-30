import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { ViewPage } from '../types';
import { 
  Crown, 
  Menu, 
  X, 
  Globe, 
  Calendar, 
  PhoneCall, 
  ShieldCheck,
  Lock,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { lang, setLang, t, currentPage, setCurrentPage, salonInfo, bookings } = useSalon();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeBookingsCount = bookings.filter(b => b.status !== 'cancelled').length;

  // Primary customer navigation items (Admin moved to discrete staff lock)
  const navItems: { page: ViewPage; label: string; icon?: React.ReactNode }[] = [
    { page: 'home', label: t.navHome },
    { page: 'services', label: t.navServices },
    { page: 'gallery', label: t.navGallery },
    { page: 'barbers', label: t.navBarbers },
    { page: 'reviews', label: t.navReviews },
    { page: 'location', label: t.navLocation }
  ];

  const handleNav = (page: ViewPage) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0d0e12]/90 backdrop-blur-md border-b border-[#22252e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#2a2415] to-[#121316] border border-[#d4af37]/40 flex items-center justify-center shadow-lg shadow-[#d4af37]/5 group-hover:border-[#d4af37] transition-all">
              <Crown className="w-6 h-6 text-[#d4af37] transition-transform group-hover:scale-110" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display tracking-widest text-lg sm:text-xl font-bold text-silver-gradient">
                  ROYAL BARBER
                </span>
                <span className="text-[10px] tracking-widest uppercase px-1.5 py-0.5 rounded bg-[#d4af37]/15 text-[#d4af37] font-semibold border border-[#d4af37]/30">
                  VIP
                </span>
              </div>
              <p className="text-[11px] text-[#8e95a5] hidden sm:block tracking-wide">
                {lang === 'ar' ? 'صالون رويال للحلاقة الرجالية · طرابلس' : 'Modern Gentlemen Grooming · Tripoli'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNav(item.page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 relative ${
                    isActive
                      ? 'text-[#d4af37] bg-[#1a1c23] border border-[#d4af37]/30'
                      : 'text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#15171e]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Lang Switcher, Discrete Admin Lock & Book Now CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Language Switch Button */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#161820] text-[#c5cbd6] hover:text-white border border-[#2b2f3d] hover:border-[#d4af37]/50 transition-colors"
              title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Discrete Admin Lock Button */}
            <button
              onClick={() => handleNav('admin')}
              className={`p-2 rounded-md transition-all flex items-center gap-1.5 text-xs border ${
                currentPage === 'admin'
                  ? 'bg-[#1e2330] text-[#d4af37] border-[#d4af37]'
                  : 'bg-[#141720] hover:bg-[#1c202d] text-[#8e95a5] hover:text-[#d4af37] border-[#262a36]'
              }`}
              title={lang === 'ar' ? 'بوابة الإدارة (محمية برمز سرّي)' : 'Admin Portal (Passcode Protected)'}
            >
              <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden xl:inline text-[11px] text-[#9ca3af] font-medium">
                {lang === 'ar' ? 'الإدارة' : 'Admin'}
              </span>
              {activeBookingsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
              )}
            </button>

            {/* Book Now Button */}
            <button
              onClick={() => handleNav('booking')}
              className="relative group overflow-hidden px-4 py-2 text-sm font-semibold rounded-md bg-gold-gradient text-[#0d0e12] shadow-md shadow-[#d4af37]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#0d0e12]" />
              <span>{t.bookNow}</span>
              <Sparkles className="w-3 h-3 text-[#0d0e12]/70 group-hover:rotate-12 transition-transform" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => handleNav('admin')}
              className="p-2 rounded-md bg-[#161820] text-[#d4af37] border border-[#2b2f3d]"
              title={lang === 'ar' ? 'الإدارة' : 'Admin'}
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="p-2 rounded-md bg-[#161820] text-[#d4af37] border border-[#2b2f3d]"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md bg-[#161820] text-[#9ca3af] hover:text-white border border-[#2b2f3d]"
              aria-label="Open main menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#d4af37]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#22252e] bg-[#0d0e12]/98 px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNav(item.page)}
                  className={`w-full text-start px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                    isActive
                      ? 'bg-[#1b1e26] text-[#d4af37] border border-[#d4af37]/30'
                      : 'text-[#9ca3af] hover:bg-[#161820] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#1f222b] flex flex-col gap-2">
            <button
              onClick={() => handleNav('booking')}
              className="w-full py-2.5 rounded-lg bg-gold-gradient text-[#0d0e12] font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#d4af37]/20"
            >
              <Calendar className="w-4 h-4 text-[#0d0e12]" />
              <span>{t.bookNow}</span>
            </button>

            <a
              href={`https://wa.me/${salonInfo.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(lang === 'ar' ? 'مرحباً، أود الاستفسار عن حجز موعد حلاقة في صالون رويال.' : 'Hello, I would like to inquire about an appointment at Royal Barber.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 rounded-lg bg-[#161820] text-[#25D366] border border-[#2b2f3d] text-xs font-medium flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t.whatsappConcierge}: {salonInfo.phone}</span>
            </a>

            {/* Discreet Admin Lock Link in Mobile Menu */}
            <button
              onClick={() => handleNav('admin')}
              className="w-full mt-1 py-2 px-3 rounded-lg bg-[#12141c] hover:bg-[#181c26] text-[#788192] hover:text-[#d4af37] border border-[#222532] text-xs flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{lang === 'ar' ? 'بوابة المشرف والإدارة (محمية برمز)' : 'Staff & Admin Portal (PIN)'}</span>
              </span>
              {activeBookingsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#d4af37] text-black font-bold font-mono">
                  {activeBookingsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
