import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { ServiceCategory } from '../types';
import { Clock, Check, Search, Calendar } from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { lang, t, services, setPreselectedServiceId, setCurrentPage } = useSalon();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: ServiceCategory | 'all'; label: string }[] = [
    { id: 'all', label: t.all },
    { id: 'hair', label: t.hair },
    { id: 'beard', label: t.beard },
    { id: 'packages', label: t.packages },
    { id: 'vip', label: t.vip },
    { id: 'treatments', label: t.treatments }
  ];

  const filteredServices = services.filter((srv) => {
    const matchesCategory = selectedCategory === 'all' || srv.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      srv.nameAr.toLowerCase().includes(q) || 
      srv.nameEn.toLowerCase().includes(q) ||
      srv.descriptionAr.toLowerCase().includes(q) ||
      srv.descriptionEn.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleBook = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
          {lang === 'ar' ? 'قائمة الأسعار والخدمات' : 'Services & Grooming Menu'}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          {lang === 'ar' ? 'خدمات وقصات صالون رويال' : 'Services & Grooming Menu'}
        </h1>
        <p className="text-sm text-[#9ca3af]">
          {lang === 'ar'
            ? 'تشمل كل خدمة غسيل شعر، تعقيم كامل للأدوات وشفرة جديدة، مع ضيافة قهوة إسبريسو أو شاهي باللوز.'
            : 'All services include wash, single-use sterilized blades, and complimentary espresso or Libyan almond tea.'}
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Category Segmented Control */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gold-gradient text-[#0b0c10] font-bold shadow-md'
                  : 'bg-[#13151b] text-[#9ca3af] hover:text-white border border-[#21242e]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-[#6e7687] absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث عن خدمة (قصة، لحية، قناع الذهب...)' : 'Search services (haircut, beard, facial...)'}
            className="w-full ps-10 pe-4 py-2.5 rounded-lg bg-[#111319] border border-[#22252e] text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors placeholder:text-[#525968]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-[#8e95a5] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-xl bg-[#111319] border border-[#20232c] space-y-3">
          <p className="text-base text-[#c5cbd6]">
            {lang === 'ar' ? 'لا توجد خدمات مطابقة لبحثك.' : 'No services found matching your criteria.'}
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="text-xs text-[#d4af37] underline"
          >
            {lang === 'ar' ? 'إعادة ضبط التصفية' : 'Reset filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="flex flex-col justify-between rounded-xl bg-[#111319] border border-[#21242e] hover:border-[#d4af37]/45 transition-all overflow-hidden group shadow-lg shadow-black/40"
            >
              <div>
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={service.image}
                    alt={lang === 'ar' ? service.nameAr : service.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111319] via-transparent to-black/30"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 end-3 flex items-center gap-2">
                    {service.isVipOnly && (
                      <span className="px-2 py-0.5 rounded bg-black/80 text-[#d4af37] text-[10px] font-bold border border-[#d4af37]/50 backdrop-blur-sm">
                        VIP SUITE
                      </span>
                    )}
                    {service.isPopular && !service.isVipOnly && (
                      <span className="px-2 py-0.5 rounded bg-[#d4af37] text-[#0b0c10] text-[10px] font-bold">
                        {lang === 'ar' ? 'الأكثر طلباً' : 'Popular'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-[#9ca3af] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{service.durationMinutes} {t.mins}</span>
                    </span>
                    <span className="text-lg font-bold text-[#d4af37] font-mono">
                      {service.price} {t.currency}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                    {lang === 'ar' ? service.nameAr : service.nameEn}
                  </h3>

                  <p className="text-xs text-[#9ca3af] leading-relaxed">
                    {lang === 'ar' ? service.descriptionAr : service.descriptionEn}
                  </p>

                  {/* Included list */}
                  <div className="pt-2 border-t border-[#1d2028] space-y-2">
                    <span className="text-[11px] font-semibold text-[#c5cbd6] block">
                      {lang === 'ar' ? 'تشمل الخدمة الملكية:' : 'Included treatments:'}
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#8e95a5]">
                      {(lang === 'ar' ? service.includesAr : service.includesEn).map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => handleBook(service.id)}
                  className="w-full py-2.5 rounded-lg bg-[#181b24] hover:bg-gold-gradient hover:text-[#0b0c10] text-white border border-[#2b2f3d] hover:border-transparent font-medium text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'حجز موعد لهذه الخدمة' : 'Book This Service'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIP Lounge Note */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-[#171a22] to-[#12141a] border border-[#d4af37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-start">
          <h4 className="text-sm font-bold text-white">
            {lang === 'ar' ? 'هل تخطط ليوم زفافك أو مناسبة خاصة؟' : 'Planning for your wedding day or VIP event?'}
          </h4>
          <p className="text-xs text-[#9ca3af]">
            {lang === 'ar'
              ? 'احجز جناح العريس VIP الخاص واستمتع بخصوصية تامة مع ضيافة مخصصة لك ولمرافقيك.'
              : 'Reserve our private Royal Suite for complete exclusivity and customized bridal hospitality.'}
          </p>
        </div>
        <button
          onClick={() => handleBook('srv-groom-vip')}
          className="px-5 py-2.5 rounded-lg bg-gold-gradient text-[#0b0c10] text-xs font-bold whitespace-nowrap shadow-md hover:brightness-110"
        >
          {lang === 'ar' ? 'حجز جناح العريس VIP' : 'Reserve VIP Suite'}
        </button>
      </div>

    </div>
  );
};
