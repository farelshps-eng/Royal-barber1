import React from 'react';
import { useSalon } from '../context/SalonContext';
import { 
  Crown, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Star, 
  Clock, 
  ShieldCheck, 
  Coffee, 
  Award,
  ChevronRight
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    lang, 
    t, 
    services, 
    barbers, 
    reviews, 
    setCurrentPage, 
    setPreselectedServiceId,
    setPreselectedBarberId,
    salonInfo 
  } = useSalon();

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const handleBookService = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookBarber = (barberId: string) => {
    setPreselectedBarberId(barberId);
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredServices = services.filter(s => s.isPopular || s.isVipOnly).slice(0, 4);

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-[#1f222b]">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=2000&q=85" 
            alt="Royal Barber Tripoli Interior"
            className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-luxury-pattern opacity-30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
          
          {/* Subtle Top Kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181a22]/80 border border-[#d4af37]/40 backdrop-blur-sm text-xs text-[#d4af37]">
            <Crown className="w-3.5 h-3.5" />
            <span className="font-medium tracking-wide">
              {lang === 'ar' ? 'صالون رويال للحلاقة الرجالية · طرابلس' : 'Modern Gentlemen Barber · Tripoli'}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {lang === 'ar' ? (
              <>
                حلاقة وتدريج عصري <span className="text-gold-gradient block sm:inline">بدون زحمة ولا انتظار</span>
              </>
            ) : (
              <>
                Precision Fades &amp; <span className="text-gold-gradient block sm:inline">Zero-Wait Booking</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#a1a8b8] leading-relaxed">
            {lang === 'ar' 
              ? 'أحدث قصات السكين فيد والتايبر، تنظيف بشرة وعناية متكاملة باللحية مع أمهر الحلاقين. احجز موعدك مسبقاً وتفضل لكرسيك مباشرة في الوقت.'
              : 'Master skin fades, razor beard detailing, and facial detox in Tripoli. Book your chair in advance and skip the line.'}
          </p>

          {/* Dual Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => {
                setPreselectedServiceId(null);
                setCurrentPage('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-3 rounded-lg bg-gold-gradient text-[#0b0c10] font-bold text-sm sm:text-base shadow-lg shadow-[#d4af37]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#0b0c10]" />
              <span>{t.bookNow}</span>
              <ArrowIcon className="w-4 h-4 text-[#0b0c10]" />
            </button>

            <button
              onClick={() => {
                setCurrentPage('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#141720] text-[#e5e7eb] hover:text-white border border-[#2b2f3d] hover:border-[#d4af37]/50 active:scale-95 transition-all text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>{lang === 'ar' ? 'قائمة الخدمات والأسعار بالدينار' : 'View Services & Pricing (LYD)'}</span>
            </button>
          </div>

          {/* Pillars */}
          <div className="pt-6 border-t border-[#1d2029] flex flex-wrap items-center justify-center gap-y-2 gap-x-4 sm:gap-x-6 text-xs text-[#8e95a5]">
            <span className="flex items-center gap-1.5 text-[#d4af37]">
              <Coffee className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'ضيافة قهوة وشاهي باللوز' : 'Espresso & Libyan Tea'}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5 text-[#d4af37]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'أدوات معقمة وشفرة جديدة لكل زبون' : 'Sterilized Single-use Blades'}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5 text-[#d4af37]">
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'التزام بالموعد بالدقيقة' : 'Punctual Seating'}</span>
            </span>
          </div>

        </div>
      </section>

      {/* Brand Highlights / The Royal Distinction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            {lang === 'ar' ? 'معايير رويال باربر' : 'The Royal Barber Standard'}
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white">
            {lang === 'ar' ? 'لماذا يختارنا نخبة الرجال؟' : 'Why Distinguished Gentlemen Choose Us'}
          </h2>
          <p className="text-sm text-[#9ca3af]">
            {lang === 'ar'
              ? 'ليست مجرد قصة شعر، بل ملاذ استرخاء متكامل يعيد إليك الطاقة والوسامة بأيدي نخبة من أمهر الحلاقين الدوليين.'
              : 'More than a haircut—an executive retreat revitalizing your style with supreme attention to detail.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-7 rounded-xl bg-[#101217] border border-[#20232c] hover:border-[#d4af37]/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-lg bg-[#181b24] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {lang === 'ar' ? 'أجنحة الحلاقة VIP المستقلة' : 'Private VIP Groom Suites'}
            </h3>
            <p className="text-sm text-[#8e95a5] leading-relaxed">
              {lang === 'ar'
                ? 'غرف حلاقة مغلقة ومستقلة تمنحك الخصوصية الكاملة، مجهزة بشاشات شخصية، مقاعد جلد إيطالية فاخرة ونظام صوتي هادئ.'
                : 'Fully secluded suites providing privacy, executive leather chairs, tailored acoustic comfort and personalized media.'}
            </p>
          </div>

          <div className="p-7 rounded-xl bg-[#101217] border border-[#20232c] hover:border-[#d4af37]/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-lg bg-[#181b24] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {lang === 'ar' ? 'طقوس المناشف وبخار الأوزون' : 'Herbal Steam & Hot Towel Ritual'}
            </h3>
            <p className="text-sm text-[#8e95a5] leading-relaxed">
              {lang === 'ar'
                ? 'تحضير مسام البشرة والشعر بزيوت الأرز واللافندر العضوية مع بخار الأوزون النقي لحلاقة ناعمة خالية من التهيج.'
                : 'Pore preparation with organic botanical oils, soothing ozone mist and layered hot towels preventing any razor burn.'}
            </p>
          </div>

          <div className="p-7 rounded-xl bg-[#101217] border border-[#20232c] hover:border-[#d4af37]/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-lg bg-[#181b24] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {lang === 'ar' ? 'حلاقون دوليون معتمدون' : 'Internationally Master Barbers'}
            </h3>
            <p className="text-sm text-[#8e95a5] leading-relaxed">
              {lang === 'ar'
                ? 'فريق من نخبة مصففي الشعر بخبرة تتجاوز 10 سنوات في لندن وإسطنبول، يقدمون استشارات دقيقة تناسب تقاسيم وجهك.'
                : 'Master craftsmen with over a decade of prestigious salon experience in London and Istanbul, analyzing every hairline.'}
            </p>
          </div>

        </div>
      </section>

      {/* Featured Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              {lang === 'ar' ? 'أبرز الخدمات المطلوبة' : 'Signature Menu'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              {lang === 'ar' ? 'الخدمات والباقات الملكية المختارة' : 'Featured Royal Services'}
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentPage('services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-sm font-semibold text-[#d4af37] hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>{lang === 'ar' ? 'عرض جميع الخدمات (8)' : 'View All Services (8)'}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <div 
              key={service.id}
              className="flex flex-col justify-between rounded-xl bg-[#111319] border border-[#21242e] hover:border-[#d4af37]/50 transition-all overflow-hidden group shadow-lg shadow-black/40"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={lang === 'ar' ? service.nameAr : service.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                  />
                  {service.isVipOnly && (
                    <span className="absolute top-3 end-3 px-2 py-0.5 rounded bg-black/80 text-[#d4af37] text-[11px] font-bold border border-[#d4af37]/40 backdrop-blur-sm">
                      VIP SUITE
                    </span>
                  )}
                  {service.isPopular && !service.isVipOnly && (
                    <span className="absolute top-3 end-3 px-2 py-0.5 rounded bg-[#d4af37] text-[#0b0c10] text-[11px] font-bold">
                      {lang === 'ar' ? 'الأكثر طلباً' : 'Popular'}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-[#9ca3af] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{service.durationMinutes} {t.mins}</span>
                    </span>
                    <span className="text-base font-bold text-[#d4af37] font-mono">
                      {service.price} {t.currency}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                    {lang === 'ar' ? service.nameAr : service.nameEn}
                  </h3>

                  <p className="text-xs text-[#8e95a5] line-clamp-2 leading-relaxed">
                    {lang === 'ar' ? service.descriptionAr : service.descriptionEn}
                  </p>

                  {/* Highlights */}
                  <ul className="pt-2 space-y-1 text-[11px] text-[#a5acba]">
                    {(lang === 'ar' ? service.includesAr : service.includesEn).slice(0, 2).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 truncate">
                        <Check className="w-3 h-3 text-[#d4af37] shrink-0" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => handleBookService(service.id)}
                  className="w-full py-2.5 rounded-lg bg-[#181b24] hover:bg-gold-gradient hover:text-[#0b0c10] text-white border border-[#2b2f3d] hover:border-transparent font-medium text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'حجز هذه الخدمة' : 'Book This Service'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Master Barbers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              {lang === 'ar' ? 'فريق الماستر باربر' : 'Artisans of the Blade'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              {lang === 'ar' ? 'نخبة الحلاقين المحترفين' : 'Meet Our Master Barbers'}
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentPage('barbers');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-sm font-semibold text-[#d4af37] hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>{lang === 'ar' ? 'عرض تفاصيل الفريق' : 'View Full Team'}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {barbers.map((barber) => (
            <div 
              key={barber.id}
              className="rounded-xl bg-[#111319] border border-[#21242e] hover:border-[#d4af37]/40 transition-all p-5 text-center flex flex-col justify-between group"
            >
              <div>
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#d4af37]/50 group-hover:border-[#d4af37] transition-all shadow-md shadow-black/50">
                  <img 
                    src={barber.avatar} 
                    alt={lang === 'ar' ? barber.nameAr : barber.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex items-center justify-center gap-1 text-amber-400 text-xs mb-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold font-mono">{barber.rating}</span>
                  <span className="text-[#6d7585]">({barber.reviewCount})</span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {lang === 'ar' ? barber.nameAr : barber.nameEn}
                </h3>
                <p className="text-xs text-[#d4af37] mt-0.5">
                  {lang === 'ar' ? barber.titleAr : barber.titleEn}
                </p>

                <p className="text-xs text-[#8e95a5] mt-3 line-clamp-2 leading-relaxed">
                  {lang === 'ar' ? barber.bioAr : barber.bioEn}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#1d2028]">
                <button
                  onClick={() => handleBookBarber(barber.id)}
                  className="w-full py-2 rounded-lg bg-[#181a22] hover:bg-[#d4af37] hover:text-[#0b0c10] text-[#c5cbd6] text-xs font-semibold border border-[#2a2e3b] hover:border-transparent transition-all"
                >
                  {lang === 'ar' ? 'حجز موعد مع الحلاق' : 'Book with Barber'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lookbook / Gallery Preview Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#141720] via-[#101218] to-[#141720] border border-[#262936] p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              {lang === 'ar' ? 'كتالوج الإطلالات الملكية' : 'Curated Lookbook'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white leading-snug">
              {lang === 'ar' ? 'اختر إطلالتك القادمة من واقع أعمالنا' : 'Discover Your Next Signature Look'}
            </h2>
            <p className="text-sm text-[#9ca3af] leading-relaxed">
              {lang === 'ar'
                ? 'استعرض أحدث قصات التدرج السكيني، نحت اللحى الملكية، وإطلالات العرسان التي أبدعها حلاقونا في صالون رويال باربر.'
                : 'Browse through our master barbers\' portfolio of high fades, crisp line-ups, and executive grooming.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setCurrentPage('gallery');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-lg bg-[#1b1e27] hover:bg-[#d4af37] hover:text-[#0b0c10] text-white border border-[#303545] hover:border-transparent text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>{lang === 'ar' ? 'استعراض معرض الأعمال الكامل' : 'Browse Full Lookbook'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            {lang === 'ar' ? 'شهادات نعتز بها' : 'Gentlemen Reviews'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {lang === 'ar' ? 'آراء نخبة عملائنا الكرام' : 'Endorsed by Gentlemen'}
          </h2>
          <div className="flex items-center justify-center gap-1.5 pt-1 text-[#d4af37]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
            <span className="text-sm font-bold text-white ms-2 font-mono">4.98 / 5.0</span>
            <span className="text-xs text-[#8e95a5]">({lang === 'ar' ? '+1,200 عميل موثق' : '+1,200 Verified Clients'})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review) => (
            <div 
              key={review.id}
              className="p-6 rounded-xl bg-[#111319] border border-[#20232c] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#6d7585] font-mono">{review.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#c5cbd6] leading-relaxed italic">
                  "{lang === 'ar' ? review.commentAr : review.commentEn}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#1b1e26] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {lang === 'ar' ? review.authorNameAr : review.authorNameEn}
                  </h4>
                  <p className="text-[10px] text-[#8e95a5]">
                    {lang === 'ar' ? review.serviceNameAr : review.serviceNameEn}
                  </p>
                </div>
                {review.verifiedBooking && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.verifiedClient}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Location & Quick CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#101217] border border-[#d4af37]/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-start">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {lang === 'ar' ? 'جاهز لتجربة حلاقة تليق بك؟' : 'Ready for the Royal Barber Experience?'}
            </h3>
            <p className="text-xs sm:text-sm text-[#9ca3af]">
              {lang === 'ar' 
                ? `زورنا في ${salonInfo.addressAr}. مواقف سيارات خاصة وخدمة صف السيارات متوفرة لضيوفنا.`
                : `Visit us at ${salonInfo.addressEn}. Valet parking and complimentary hospitality ready.`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                setPreselectedServiceId(null);
                setCurrentPage('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-3 rounded-lg bg-gold-gradient text-[#0b0c10] font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all text-center"
            >
              {t.bookNow}
            </button>
            <button
              onClick={() => {
                setCurrentPage('location');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#181a22] text-[#c5cbd6] hover:text-white border border-[#2b2f3d] text-xs font-semibold text-center"
            >
              {lang === 'ar' ? 'موقع الصالون والمواعيد' : 'Lounge & Directions'}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
