import React from 'react';
import { useSalon } from '../context/SalonContext';
import { MessageCircle, Calendar } from 'lucide-react';

export const FloatingActions: React.FC = () => {
  const { lang, t, salonInfo, setCurrentPage, currentPage } = useSalon();

  // If already on booking page, hide the booking floating button or keep just WhatsApp
  const isBookingPage = currentPage === 'booking';

  const cleanPhone = salonInfo.whatsappNumber.replace(/[^0-9]/g, '');
  const greeting = lang === 'ar'
    ? 'مرحباً، أود الاستفسار عن حجز موعد حلاقة في صالون رويال طرابلس.'
    : 'Hello, I would like to inquire about booking an appointment at Royal Barber Tripoli.';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(greeting)}`;

  return (
    <div className="fixed bottom-5 end-5 z-40 flex flex-col items-end gap-3 pointer-events-none">
      
      {/* WhatsApp Concierge Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Concierge"
        className="pointer-events-auto group relative flex items-center justify-center w-13 h-13 rounded-full bg-[#1e222d] text-[#25D366] border border-[#25D366]/40 shadow-xl shadow-black/60 hover:scale-105 active:scale-95 transition-all duration-200 hover:bg-[#25D366] hover:text-black hover:border-transparent"
      >
        <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
        
        {/* Tooltip on hover */}
        <span className="absolute end-16 hidden sm:group-hover:inline-block whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#0f1117] text-white text-xs font-medium border border-[#262a36] shadow-lg">
          {t.whatsappConcierge}
        </span>
      </a>

      {/* Quick Booking Button (Pulsing Gold) */}
      {!isBookingPage && (
        <button
          onClick={() => {
            setCurrentPage('booking');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label={t.bookNow}
          className="pointer-events-auto group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gold-gradient text-[#0b0c10] font-bold text-sm shadow-xl shadow-[#d4af37]/25 hover:brightness-110 active:scale-95 transition-all duration-200 hover:shadow-2xl hover:shadow-[#d4af37]/40"
        >
          <Calendar className="w-5 h-5 text-[#0b0c10]" />
          <span className="hidden sm:inline-block">{t.bookNow}</span>
          <span className="sm:hidden">{t.quickBook}</span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 animate-ping opacity-75"></span>
        </button>
      )}

    </div>
  );
};
