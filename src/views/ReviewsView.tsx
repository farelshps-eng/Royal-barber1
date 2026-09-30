import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Star, ShieldCheck, Plus, X, MessageSquare, ThumbsUp } from 'lucide-react';

export const ReviewsView: React.FC = () => {
  const { lang, t, reviews, addReview, services, showToast } = useSalon();
  const [modalOpen, setModalOpen] = useState(false);
  
  // Review form states
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [comment, setComment] = useState('');

  const approvedReviews = reviews.filter(r => r.status === 'approved');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      showToast(lang === 'ar' ? 'يرجى كتابة الاسم والتعليق' : 'Please provide your name and comment');
      return;
    }

    const srv = services.find(s => s.id === serviceId) || services[0];

    addReview({
      authorNameAr: name.trim(),
      authorNameEn: name.trim(),
      rating,
      commentAr: comment.trim(),
      commentEn: comment.trim(),
      verifiedBooking: true,
      serviceNameAr: srv ? srv.nameAr : 'قصة رويال',
      serviceNameEn: srv ? srv.nameEn : 'Royal Cut'
    });

    setName('');
    setComment('');
    setRating(5);
    setModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
          {lang === 'ar' ? 'آراء وتقييمات الزبائن' : 'Client Reviews'}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          {lang === 'ar' ? 'تجارب زبائننا الكرام في طرابلس' : 'Real Customer Experiences in Tripoli'}
        </h1>
        <p className="text-sm text-[#9ca3af]">
          {lang === 'ar'
            ? 'نعتز بثقة زبائننا الكرام ونسعى دائماً لتقديم أفضل تجربة حلاقة وعناية بدون انتظار وبأعلى درجات الإتقان والنظافة.'
            : 'Proud of our clients’ trust and committed to delivering the best grooming experience with zero wait time and spotless hygiene.'}
        </p>
      </div>

      {/* Rating Summary Scorecard & Add Review CTA */}
      <div className="p-8 rounded-2xl bg-[#111319] border border-[#21242e] flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-start">
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#171a22] border border-[#262936] min-w-[130px]">
            <span className="text-4xl font-bold text-white font-mono">
              {approvedReviews.length > 0
                ? (approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length).toFixed(1)
                : '5.0'}
            </span>
            <div className="flex items-center gap-1 text-amber-400 my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-[11px] text-[#8e95a5]">
              {approvedReviews.length > 0
                ? `${approvedReviews.length} ${lang === 'ar' ? 'تقييم موثق' : 'verified reviews'}`
                : (lang === 'ar' ? '0 تقييم (يوم الافتتاح)' : '0 reviews (Opening Day)')}
            </span>
          </div>

          <div className="space-y-1 text-xs text-[#9ca3af]">
            <p className="font-semibold text-white">
              {lang === 'ar' ? 'معايير الجودة ورضا الزبائن 100%' : '100% Client Satisfaction Standard'}
            </p>
            <p className="text-[#8e95a5]">
              {lang === 'ar'
                ? 'نحرص على الاستماع لكافة آراء رواد صالون رويال لتقديم تجربة حلاقة تليق بكم.'
                : 'We value your input to continuously provide top tier grooming.'}
            </p>
          </div>
        </div>

        {/* Add Review Button */}
        <div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 rounded-lg bg-gold-gradient text-[#0b0c10] font-bold text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#0b0c10]" />
            <span>{lang === 'ar' ? 'أضف تقييمك وتجربتك' : 'Share Your Experience'}</span>
          </button>
        </div>

      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {approvedReviews.length === 0 ? (
          <div className="col-span-1 md:col-span-2 text-center py-12 px-6 rounded-2xl bg-[#111319] border border-[#20232c] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#181b24] border border-[#d4af37]/40 flex items-center justify-center mx-auto text-[#d4af37]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {lang === 'ar' ? 'يوم الافتتاح — كن أول من يشارك تجربته في صالون رويال!' : 'Opening Day — Be the first to review Royal Barber!'}
              </h3>
              <p className="text-xs text-[#8e95a5] max-w-md mx-auto">
                {lang === 'ar'
                  ? 'يسعدنا استقبالكم في صالون رويال بطرابلس. بعد موعدك وحلاقتك، تفضل بمشاركتنا انطباعك ورأيك.'
                  : 'We are thrilled to welcome you. Leave your feedback after your visit!'}
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 rounded-lg bg-gold-gradient text-black font-bold text-xs hover:brightness-110"
            >
              {lang === 'ar' ? 'كتابة أول تقييم للصالون ✍️' : 'Write First Review ✍️'}
            </button>
          </div>
        ) : (
          approvedReviews.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-xl bg-[#111319] border border-[#20232c] hover:border-[#d4af37]/35 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-[#6e7789] font-mono">{review.date}</span>
                </div>

                <p className="text-sm text-[#d1d5db] leading-relaxed">
                  "{lang === 'ar' ? review.commentAr : review.commentEn}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#1b1e26] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {lang === 'ar' ? review.authorNameAr : review.authorNameEn}
                  </h4>
                  <p className="text-xs text-[#d4af37]">
                    {lang === 'ar' ? review.serviceNameAr : review.serviceNameEn}
                  </p>
                </div>

                {review.verifiedBooking && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.verifiedClient}</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#12141b] border border-[#2c303d] rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 relative shadow-2xl">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 end-4 p-1.5 text-[#8e95a5] hover:text-white rounded-lg hover:bg-[#1a1d26]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">
                {lang === 'ar' ? 'شاركنا انطباعك عن تجربتك الملكية' : 'Share Your Royal Experience'}
              </h3>
              <p className="text-xs text-[#8e95a5]">
                {lang === 'ar' ? 'رأيك يسهم في تطوير خدماتنا وتقدير جهود طاقمنا.' : 'Your feedback elevates our standard of service.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Rating Stars Picker */}
              <div>
                <label className="block text-xs font-semibold text-[#c5cbd6] mb-1.5">
                  {lang === 'ar' ? 'تقييمك الإجمالي:' : 'Your Rating:'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-400 fill-current'
                            : 'text-[#353947]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-[#d4af37] font-mono font-bold ms-2">
                    {rating} / 5
                  </span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-[#c5cbd6] mb-1.5">
                  {lang === 'ar' ? 'الاسم الكريم:' : 'Your Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: فيصل التميمي' : 'e.g. Faisal Al-Tamimi'}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0d12] border border-[#262a36] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Service */}
              <div>
                <label className="block text-xs font-semibold text-[#c5cbd6] mb-1.5">
                  {lang === 'ar' ? 'الخدمة التي تلقيتها:' : 'Service Experienced:'}
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0d12] border border-[#262a36] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {lang === 'ar' ? s.nameAr : s.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-semibold text-[#c5cbd6] mb-1.5">
                  {lang === 'ar' ? 'كلمتك وتعليقك:' : 'Your Review & Comments:'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={lang === 'ar' ? 'كيف كانت تجربتك مع دقة الحلاقة والضيافة؟' : 'Describe your satisfaction with our barbers and hospitality...'}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0d12] border border-[#262a36] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#9ca3af] hover:text-white"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-gold-gradient text-[#0b0c10] font-bold text-xs sm:text-sm shadow-md hover:brightness-110"
                >
                  {lang === 'ar' ? 'إرسال التقييم' : 'Submit Review'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
