import React from 'react';
import { useSalon } from '../context/SalonContext';
import { Star, Award, Clock, Calendar, Check, Shield } from 'lucide-react';

export const BarbersView: React.FC = () => {
  const { lang, t, barbers, setPreselectedBarberId, setCurrentPage } = useSalon();

  const handleBookWithBarber = (barberId: string) => {
    setPreselectedBarberId(barberId);
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dayNamesAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
          {lang === 'ar' ? 'فريق الحلاقة المحترف' : 'Our Professional Barbers'}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          {lang === 'ar' ? 'أمهر الحلاقين وأصحاب الخبرة في خدمتك' : 'Experienced Barbers at Your Service'}
        </h1>
        <p className="text-sm text-[#9ca3af]">
          {lang === 'ar'
            ? 'فريق متمرس من الحلاقين المحترفين في أحدث القصات والتدريجات والعناية باللحية والبشرة، لضمان مظهرك المثالي وراحتك التامة.'
            : 'A dedicated team of experienced barbers skilled in the latest fades, classic cuts, beard sculpting, and facial grooming.'}
        </p>
      </div>

      {/* Barbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {barbers.map((barber) => (
          <div
            key={barber.id}
            className="rounded-2xl bg-[#111319] border border-[#21242e] hover:border-[#d4af37]/45 transition-all p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start group"
          >
            {/* Avatar & Experience Badge */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#d4af37]/50 group-hover:border-[#d4af37] shadow-xl shadow-black/60 transition-all">
                <img
                  src={barber.avatar}
                  alt={lang === 'ar' ? barber.nameAr : barber.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Years badge */}
              <div className="mt-3 px-3 py-1 rounded-full bg-[#171a22] border border-[#2a2e3b] text-[11px] text-[#d4af37] font-semibold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>{barber.experienceYears} {t.experienceYears}</span>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-4 flex-1 text-center sm:text-start">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold font-mono text-white text-sm">{barber.rating}</span>
                  </div>
                  <span className="text-xs text-[#8e95a5]">({barber.reviewCount} {lang === 'ar' ? 'تقييم' : 'reviews'})</span>
                  
                  {barber.isActive ? (
                    <span className="ms-auto text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {lang === 'ar' ? 'متاح للحجز' : 'Available'}
                    </span>
                  ) : (
                    <span className="ms-auto text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded">
                      {lang === 'ar' ? 'في إجازة' : 'On Leave'}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors">
                  {lang === 'ar' ? barber.nameAr : barber.nameEn}
                </h2>
                <p className="text-xs text-[#d4af37] font-medium mt-0.5">
                  {lang === 'ar' ? barber.titleAr : barber.titleEn}
                </p>
              </div>

              <p className="text-xs text-[#a5acba] leading-relaxed">
                {lang === 'ar' ? barber.bioAr : barber.bioEn}
              </p>

              {/* Specialties */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-[#8e95a5] block uppercase tracking-wider">
                  {lang === 'ar' ? 'أبرز التخصصات:' : 'Signature Specialties:'}
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {(lang === 'ar' ? barber.specialtiesAr : barber.specialtiesEn).map((spec, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded bg-[#171a22] text-[#c5cbd6] text-[11px] border border-[#232733]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-[#7e8799] pt-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{barber.workHours.start} - {barber.workHours.end}</span>
                </span>
              </div>

              {/* CTA button */}
              <div className="pt-2">
                <button
                  onClick={() => handleBookWithBarber(barber.id)}
                  disabled={!barber.isActive}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gold-gradient text-[#0b0c10] font-bold text-xs shadow-md shadow-[#d4af37]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#0b0c10]" />
                  <span>{lang === 'ar' ? `حجز موعد مع ${barber.nameAr.split(' ')[0]}` : `Book with ${barber.nameEn.split(' ')[0]}`}</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
