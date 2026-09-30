import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Send, 
  Check, 
  Car, 
  Wifi, 
  Coffee, 
  ShieldCheck, 
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export const LocationView: React.FC = () => {
  const { lang, t, salonInfo, showToast } = useSalon();
  const [vipInquirySent, setVipInquirySent] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('wedding');
  const [notes, setNotes] = useState('');

  const handleVipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVipInquirySent(true);
    showToast(lang === 'ar' ? 'تم استلام طلب جناح VIP وسيتواصل معك الكونسيرج فوراً' : 'VIP suite inquiry received. Our concierge will contact you shortly.');
  };

  const amenities = [
    { icon: <Car className="w-4 h-4 text-[#d4af37]" />, titleAr: "مواقف سيارات واسعة أمام الصالون", titleEn: "Convenient Front Parking" },
    { icon: <Coffee className="w-4 h-4 text-[#d4af37]" />, titleAr: "ضيافة إسبريسو وشاهي ليبي باللوز", titleEn: "Espresso & Libyan Almond Tea" },
    { icon: <Wifi className="w-4 h-4 text-[#d4af37]" />, titleAr: "إنترنت واي فاي سريع مجاني", titleEn: "High-Speed Free Wi-Fi" },
    { icon: <ShieldCheck className="w-4 h-4 text-[#d4af37]" />, titleAr: "تعقيم طبي كامل للأدوات", titleEn: "Complete Medical Tool Sanitization" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
          {lang === 'ar' ? 'الموقع والصالون' : 'Salon Location & Hours'}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          {lang === 'ar' ? 'موقعنا في طرابلس - شارع أولاد ابن الحاج' : 'Our Location in Tripoli'}
        </h1>
        <p className="text-sm text-[#9ca3af]">
          {lang === 'ar'
            ? 'نرحب بكم في صالون رويال، شارع أولاد ابن الحاج – طرابلس، صالون مجهز بأحدث كراسي الحلاقة وأجواء هادئة ومكيفة.'
            : 'Welcome to Royal Barber on Awlad Ibn Al-Hajj Street, Tripoli. Modern chairs, serene atmosphere, and zero wait times.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Map Card & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Map Preview Card */}
          <div className="rounded-2xl bg-[#111319] border border-[#21242e] overflow-hidden shadow-xl">
            <div className="relative h-72 sm:h-96 w-full bg-[#181b24] overflow-hidden">
              {/* Simulated Map Visual */}
              <iframe
                title="Salon Location Map"
                src="https://maps.google.com/maps?q=Awlad+Ibn+Al-Hajj+Tripoli+Libya&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter invert contrast-125 opacity-75"
                loading="lazy"
              ></iframe>

              {/* Pin Overlay Card */}
              <div className="absolute bottom-4 start-4 end-4 sm:end-auto bg-[#0f1117]/95 border border-[#d4af37]/40 backdrop-blur-md p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>ROYAL BARBER LIBYA</span>
                  </h4>
                  <p className="text-xs text-[#9ca3af] mt-0.5">
                    {lang === 'ar' ? salonInfo.addressAr : salonInfo.addressEn}
                  </p>
                </div>
                <a
                  href={salonInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-gold-gradient text-[#0b0c10] text-xs font-bold whitespace-nowrap shadow flex items-center gap-1 hover:brightness-110"
                >
                  <span>{lang === 'ar' ? 'الاتجاهات' : 'Route'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Details Bar */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#1d2028] text-xs text-[#9ca3af]">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block mb-0.5">
                    {lang === 'ar' ? 'ساعات العمل' : 'Opening Hours'}
                  </span>
                  <p>{lang === 'ar' ? salonInfo.workingHoursAr : salonInfo.workingHoursEn}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block mb-0.5">
                    {lang === 'ar' ? 'هاتف الكونسيرج' : 'Concierge Line'}
                  </span>
                  <p className="font-mono text-white">{salonInfo.phone}</p>
                  <p className="text-[11px] text-[#6d7585]">
                    {lang === 'ar' ? 'متاح للرد طوال ساعات العمل' : 'Available during open hours'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {amenities.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#111319] border border-[#20232c] flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#181b24] border border-[#2b2f3d]">
                  {item.icon}
                </div>
                <span className="text-xs font-medium text-[#c5cbd6]">
                  {lang === 'ar' ? item.titleAr : item.titleEn}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: VIP Suite Inquiries Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#111319] border border-[#262a36] space-y-6">
            
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold">
                {lang === 'ar' ? 'حجز الأجنحة الملكية والخاصة' : 'Private VIP Suite Concierge'}
              </span>
              <h3 className="text-lg font-bold text-white">
                {lang === 'ar' ? 'استفسارات العرسان والمناسبات الخاصة' : 'Wedding & Corporate Inquiries'}
              </h3>
              <p className="text-xs text-[#8e95a5]">
                {lang === 'ar'
                  ? 'إذا كنت ترغب بحجز الجناح الملكي بالكامل ليوم زفافك أو لمجموعة عمل تنفيذية، اترك بياناتك وسيقوم مدير الصالون بالترتيب معك.'
                  : 'For full VIP suite buyouts, groomsmen parties or corporate bookings, leave your details.'}
              </p>
            </div>

            {vipInquirySent ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  {lang === 'ar' ? 'تم استلام طلبك الملكي' : 'Inquiry Received'}
                </h4>
                <p className="text-xs text-[#9ca3af]">
                  {lang === 'ar' 
                    ? 'سيتواصل معك مدير الضيافة عبر الهاتف أو الواتساب خلال أقل من ساعتين لتنسيق كافة التفاصيل والضيافة.'
                    : 'Our VIP hospitality director will reach out within two hours to coordinate all arrangements.'}
                </p>
                <button
                  onClick={() => setVipInquirySent(false)}
                  className="text-xs text-[#d4af37] underline pt-2"
                >
                  {lang === 'ar' ? 'إرسال استفسار آخر' : 'Submit another inquiry'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleVipSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c5cbd6] mb-1">
                    {lang === 'ar' ? 'الاسم الكريم:' : 'Full Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'ar' ? 'سعود بن عبدالعزيز' : 'Saud Al-Aziz'}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0d12] border border-[#262a36] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c5cbd6] mb-1">
                    {lang === 'ar' ? 'رقم الجوال:' : 'Mobile Phone:'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0d12] border border-[#262a36] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c5cbd6] mb-1">
                    {lang === 'ar' ? 'نوع المناسبة:' : 'Occasion Type:'}
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0d12] border border-[#262a36] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="wedding">{lang === 'ar' ? 'تجهيز عريس ويوم زفاف' : 'Groom Wedding Preparation'}</option>
                    <option value="corporate">{lang === 'ar' ? 'وفد كبار شخصيات أو رجال أعمال' : 'Executive / Corporate Group'}</option>
                    <option value="private">{lang === 'ar' ? 'حجز جناح خاص منفرد' : 'Private Suite Session'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c5cbd6] mb-1">
                    {lang === 'ar' ? 'تفاصيل إضافية أو موعد مفضل:' : 'Additional details or preferred date:'}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={lang === 'ar' ? 'تاريخ الحفل، عدد المرافقين، أي طلبات خاصة بالضيافة...' : 'Date, number of companions, specific requests...'}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0d12] border border-[#262a36] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-gold-gradient text-[#0b0c10] font-bold text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#0b0c10]" />
                  <span>{lang === 'ar' ? 'إرسال طلب كونسيرج VIP' : 'Request VIP Suite Concierge'}</span>
                </button>
              </form>
            )}

            {/* Direct WhatsApp Callout */}
            <div className="pt-4 border-t border-[#1d2028] text-center">
              <a
                href={`https://wa.me/${salonInfo.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(lang === 'ar' ? 'مرحباً، أود التنسيق المباشر مع مدير الصالون بخصوص باقة العريس.' : 'Hello, I would like to coordinate directly regarding the VIP Groom package.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#25D366] hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === 'ar' ? 'أو تواصل فوراً عبر واتساب كونسيرج' : 'Or chat instantly via WhatsApp'}</span>
              </a>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
