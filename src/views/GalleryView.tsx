import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Heart, Calendar, Sparkles } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const { lang, t, gallery, setCurrentPage, setPreselectedServiceId, showToast } = useSalon();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'fade' | 'classic' | 'beard' | 'vip_groom'>('all');
  const [likes, setLikes] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    gallery.forEach(g => { map[g.id] = g.likes; });
    return map;
  });
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

  const filterOptions: { id: 'all' | 'fade' | 'classic' | 'beard' | 'vip_groom'; label: string }[] = [
    { id: 'all', label: t.all },
    { id: 'fade', label: lang === 'ar' ? 'تدرج وتلاشي عصري (Fade)' : 'Modern Fades' },
    { id: 'beard', label: lang === 'ar' ? 'نحت وتحديد اللحية' : 'Beard Sculpting' },
    { id: 'classic', label: lang === 'ar' ? 'قصات كلاسيكية بالمقص' : 'Classic Scissor' },
    { id: 'vip_groom', label: lang === 'ar' ? 'باقات العريس والمناسبات' : 'Groom & Occasions' }
  ];

  const handleLike = (id: string) => {
    if (likedItems[id]) {
      setLikedItems(prev => ({ ...prev, [id]: false }));
      setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) - 1 }));
    } else {
      setLikedItems(prev => ({ ...prev, [id]: true }));
      setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      showToast(lang === 'ar' ? 'تم حفظ الإعجاب بالإطلالة' : 'Look marked as favorite');
    }
  };

  const handleBookLook = (category: string) => {
    if (category === 'beard') {
      setPreselectedServiceId('srv-beard-sculpt');
    } else if (category === 'vip_groom') {
      setPreselectedServiceId('srv-groom-vip');
    } else {
      setPreselectedServiceId('srv-royal-cut');
    }
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredItems = selectedFilter === 'all' 
    ? gallery 
    : gallery.filter(item => item.category === selectedFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
          {lang === 'ar' ? 'معرض الأعمال والقصات' : 'Barbershop Portfolio'}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          {lang === 'ar' ? 'كتالوج الإطلالات ودقة التنفيذ' : 'Signature Cuts & Grooming Portfolio'}
        </h1>
        <p className="text-sm text-[#9ca3af]">
          {lang === 'ar'
            ? 'نماذج حقيقية من إبداعات حلاقينا لنحت الذقن والتدرج الدقيق. اختر الإطلالة المفضلة لديك وسنقوم بتنفيذها بما يلائم ملامحك.'
            : 'Real showcases crafted by our master barbers. Select your inspiration look and our stylists will tailor it to your facial geometry.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2 no-scrollbar">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedFilter(opt.id)}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
              selectedFilter === opt.id
                ? 'bg-gold-gradient text-[#0b0c10] font-bold shadow-md'
                : 'bg-[#13151b] text-[#9ca3af] hover:text-white border border-[#21242e]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isLiked = !!likedItems[item.id];
          const count = likes[item.id] || item.likes;

          return (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden bg-[#111319] border border-[#21242e] hover:border-[#d4af37]/40 transition-all group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                <img
                  src={item.imageUrl}
                  alt={lang === 'ar' ? item.titleAr : item.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                />
                
                {/* Like Button */}
                <button
                  onClick={() => handleLike(item.id)}
                  aria-label="Like"
                  className={`absolute top-3 end-3 p-2 rounded-full backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-mono font-bold ${
                    isLiked
                      ? 'bg-rose-500/90 text-white'
                      : 'bg-black/60 text-white/80 hover:text-rose-400 hover:bg-black/80'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-white' : ''}`} />
                  <span>{count}</span>
                </button>

                {/* Barber Credit */}
                {item.barberName && (
                  <span className="absolute bottom-3 start-3 px-2.5 py-1 rounded bg-black/80 text-white/90 text-[11px] font-medium backdrop-blur-sm border border-white/10">
                    {item.barberName}
                  </span>
                )}
              </div>

              <div className="p-5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors">
                    {lang === 'ar' ? item.titleAr : item.titleEn}
                  </h3>
                  <span className="text-[11px] text-[#8e95a5]">
                    {item.category === 'fade' && (lang === 'ar' ? 'تدرج تايبر دقيق' : 'Precision Taper Fade')}
                    {item.category === 'beard' && (lang === 'ar' ? 'نحت لحية ملكي' : 'Royal Beard Sculpt')}
                    {item.category === 'vip_groom' && (lang === 'ar' ? 'جناح العريس VIP' : 'VIP Groom Suite')}
                    {item.category === 'classic' && (lang === 'ar' ? 'قص كلاسيكي يدوي' : 'Hand-cut Classic')}
                  </span>
                </div>

                <button
                  onClick={() => handleBookLook(item.category)}
                  className="px-3 py-1.5 rounded-lg bg-[#181a22] hover:bg-gold-gradient hover:text-[#0b0c10] text-[#c5cbd6] text-xs font-semibold border border-[#2b2f3d] hover:border-transparent transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'احجز هذه الإطلالة' : 'Book Look'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
