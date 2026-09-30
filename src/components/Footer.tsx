import React from 'react';
import { useSalon } from '../context/SalonContext';
import { Crown, MapPin, Clock, Phone, Mail, Instagram, Shield, Award, Lock, MessageCircle } from 'lucide-react';
import { ViewPage } from '../types';

export const Footer: React.FC = () => {
  const { lang, t, salonInfo, setCurrentPage } = useSalon();

  const handleNav = (page: ViewPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanPhone = salonInfo.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#08090c] border-t border-[#1a1d24] text-[#8e95a5] pt-14 pb-20 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#181a21] border border-[#d4af37]/40 flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#d4af37]" />
              </div>
              <span className="font-display tracking-widest text-lg font-bold text-silver-gradient">
                ROYAL BARBER
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#9ca3af]">
              {lang === 'ar' ? salonInfo.taglineAr : salonInfo.taglineEn}
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-[#d4af37]">
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{lang === 'ar' ? 'أعلى معايير الإتقان والنظافة' : 'Premium Quality & Hygiene'}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تعقيم شامل للأدوات' : 'Sterilized Equipment'}</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
              <span>{lang === 'ar' ? 'الروابط السريعة' : 'Quick Navigation'}</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-[#d4af37] transition-colors">
                  {t.navServices}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-[#d4af37] transition-colors">
                  {t.navGallery}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('barbers')} className="hover:text-[#d4af37] transition-colors">
                  {t.navBarbers}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('reviews')} className="hover:text-[#d4af37] transition-colors">
                  {t.navReviews}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('location')} className="hover:text-[#d4af37] transition-colors">
                  {t.navLocation}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('admin')} 
                  className="text-xs text-[#6e7787] hover:text-[#d4af37] transition-colors flex items-center gap-1.5 pt-1 border-t border-[#1a1c22]"
                >
                  <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{lang === 'ar' ? 'بوابة الإدارة (محمية برمز)' : 'Admin Portal (PIN Protected)'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
              <span>{lang === 'ar' ? 'أوقات العمل' : 'Opening Hours'}</span>
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {lang === 'ar' ? salonInfo.workingHoursAr : salonInfo.workingHoursEn}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#111318] border border-[#20232c] text-xs text-[#c5cbd6]">
                <p className="font-medium text-[#d4af37] mb-1">
                  {lang === 'ar' ? 'حجوزات VIP الخاصة' : 'Private VIP Reservations'}
                </p>
                <p>{lang === 'ar' ? 'تتوفر جلسات العرسان الخاصة قبل وبعد ساعات العمل بالتنسيق المسبق.' : 'Custom hours available for wedding groom suites upon advance concierge request.'}</p>
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
              <span>{lang === 'ar' ? 'العنوان والتواصل' : 'Location & Concierge'}</span>
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <a 
                  href={salonInfo.googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#d4af37] transition-colors leading-relaxed"
                >
                  {lang === 'ar' ? salonInfo.addressAr : salonInfo.addressEn}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`tel:${salonInfo.phone}`} className="hover:text-white transition-colors dir-ltr font-mono text-xs">
                  {salonInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a 
                  href={`https://wa.me/${cleanPhone}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-emerald-400 hover:underline dir-ltr font-mono text-xs"
                >
                  {salonInfo.whatsappNumber}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`mailto:${salonInfo.email}`} className="hover:text-white transition-colors font-mono text-xs">
                  {salonInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <Instagram className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span className="font-mono text-xs text-[#9ca3af]">{salonInfo.instagram}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-[#171920] flex flex-col sm:flex-row items-center justify-between text-xs text-[#636b7b] gap-4">
          <p>© 2026 ROYAL BARBER. {lang === 'ar' ? 'جميع الحقوق محفوظة. تجربة الحلاقة الملكية الفاخرة.' : 'All rights reserved. Luxury Royal Barber Experience.'}</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#9ca3af] cursor-pointer" onClick={() => handleNav('location')}>
              {lang === 'ar' ? 'سياسة الخصوصية والحجوزات' : 'Privacy & VIP Terms'}
            </span>
            <span>·</span>
            <button 
              onClick={() => handleNav('admin')}
              className="hover:text-[#d4af37] flex items-center gap-1.5 transition-colors font-medium text-[#7d8697]"
            >
              <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{lang === 'ar' ? 'دخول المشرف (رمز الدخول)' : 'Staff Login (PIN)'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
